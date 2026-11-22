import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../features/prayer_times/timetable.dart';
import 'method_choice.dart';
import 'method_help_popover.dart';
import 'vaktija_palette.dart';

Duration _headerMotion(BuildContext context) =>
    MediaQuery.disableAnimationsOf(context)
    ? Duration.zero
    : const Duration(milliseconds: 300);

enum MobileSection {
  prayerTimes(''),
  duas('duasTitle'),
  dhikr('dhikrTitle'),
  qibla('qiblaNavTitle');

  const MobileSection(this.label);
  final String label;
}

class MobileHeader extends StatelessWidget {
  const MobileHeader({
    super.key,
    required this.labels,
    required this.city,
    required this.menuOpen,
    required this.citiesOpen,
    required this.cityPopup,
    required this.cityInsets,
    required this.cityChoices,
    required this.onHome,
    required this.onMenu,
    required this.onCities,
    required this.onTheme,
    required this.onLanguage,
    this.logoKey,
    this.showLogo = true,
  });

  final PrayerLabels labels;
  final PrayerCity city;
  final bool menuOpen, citiesOpen;
  final OverlayPortalController cityPopup;
  final EdgeInsets cityInsets;
  final Widget Function(double maxHeight) cityChoices;
  final VoidCallback onHome, onMenu, onCities;
  final ValueChanged<bool> onTheme, onLanguage;
  final GlobalKey? logoKey;
  final bool showLogo;

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    final controlScale = ((MediaQuery.sizeOf(context).width - 124) / 196).clamp(
      .65,
      1.0,
    );
    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: colors.border)),
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 26, 16, 16),
        child: Column(
          children: [
            Row(
              children: [
                Semantics(
                  button: true,
                  label: 'Vaktija',
                  child: InkWell(
                    onTap: onHome,
                    borderRadius: BorderRadius.circular(8),
                    child: SizedBox(
                      width: 32,
                      height: 44,
                      child: OverflowBox(
                        maxWidth: 62,
                        maxHeight: 49,
                        child: Opacity(
                          opacity: showLogo ? 1 : 0,
                          child: Image.asset(
                            'assets/branding/logo.png',
                            key: logoKey,
                            width: 62,
                            height: 49,
                            color: colors.dark ? colors.text : null,
                            filterQuality: FilterQuality.low,
                            excludeFromSemantics: true,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                const Spacer(),
                _ToggleGroup(
                  width: 87 * controlScale,
                  trailingSelected: colors.dark,
                  children: [
                    _ToggleOption(
                      label: labels['themeDay'],
                      asset: 'day.png',
                      selected: !colors.dark,
                      onTap: () => onTheme(false),
                    ),
                    _ToggleOption(
                      label: labels['themeNight'],
                      asset: 'night.png',
                      selected: colors.dark,
                      onTap: () => onTheme(true),
                    ),
                  ],
                ),
                const SizedBox(width: 8),
                _ToggleGroup(
                  width: 109 * controlScale,
                  trailingSelected: !labels.bosnian,
                  children: [
                    _ToggleOption(
                      label: 'Bosanski',
                      code: 'BS',
                      asset: 'bih.png',
                      selected: labels.bosnian,
                      onTap: () => onLanguage(true),
                    ),
                    _ToggleOption(
                      label: 'English',
                      code: 'EN',
                      asset: 'uk.png',
                      selected: !labels.bosnian,
                      onTap: () => onLanguage(false),
                    ),
                  ],
                ),
                const SizedBox(width: 8),
                _ControlFrame(
                  color: colors.surface,
                  border: menuOpen
                      ? colors.accent
                      : (colors.dark ? colors.secondary : colors.border),
                  child: Tooltip(
                    message: labels.bosnian ? 'Meni' : 'Menu',
                    child: Semantics(
                      expanded: menuOpen,
                      child: InkWell(
                        onTap: onMenu,
                        child: SizedBox(
                          width: 42,
                          height: 42,
                          child: TweenAnimationBuilder<double>(
                            tween: Tween(end: menuOpen ? 1 : 0),
                            duration: _headerMotion(context),
                            curve: Curves.fastOutSlowIn,
                            builder: (context, progress, child) => CustomPaint(
                              painter: _MenuGlyph(progress, colors.text),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            OverlayPortal.overlayChildLayoutBuilder(
              key: const ValueKey('city-trigger'),
              controller: cityPopup,
              overlayChildBuilder: (context, info) {
                final anchor = MatrixUtils.transformRect(
                  info.childPaintTransform,
                  Offset.zero & info.childSize,
                );
                const gap = 6.0;
                const minAnchoredHeight = 124.0;
                final visibleBottom =
                    info.overlaySize.height - cityInsets.bottom;
                final below = visibleBottom - anchor.bottom - gap;
                final above = anchor.top - gap - cityInsets.top;
                final fitsBelow = below >= minAnchoredHeight;
                final fitsAbove = above >= minAnchoredHeight;
                // Use the visible viewport when neither side can fit useful results.
                final available = fitsBelow
                    ? below
                    : fitsAbove
                    ? above
                    : visibleBottom - cityInsets.top;
                final maxHeight = available.clamp(0.0, 303.0);
                if (maxHeight < 60) return const SizedBox.shrink();
                final top = fitsBelow
                    ? anchor.bottom + gap
                    : fitsAbove
                    ? anchor.top - gap - maxHeight
                    : cityInsets.top;
                return Stack(
                  children: [
                    Positioned(
                      left: anchor.left,
                      top: top,
                      width: anchor.width,
                      child: cityChoices(maxHeight),
                    ),
                  ],
                );
              },
              child: _ControlFrame(
                color: colors.panel,
                border: colors.border,
                child: Semantics(
                  button: true,
                  expanded: citiesOpen,
                  child: InkWell(
                    onTap: onCities,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: ConstrainedBox(
                        constraints: const BoxConstraints(minHeight: 46),
                        child: Row(
                          children: [
                            Icon(
                              Icons.location_on_outlined,
                              color: colors.accent,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                city.name,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                            Icon(
                              citiesOpen
                                  ? Icons.keyboard_arrow_up
                                  : Icons.keyboard_arrow_down,
                              size: 19,
                              color: colors.secondary,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ToggleGroup extends StatelessWidget {
  const _ToggleGroup({
    required this.width,
    required this.trailingSelected,
    required this.children,
  });
  final double width;
  final bool trailingSelected;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    return _ControlFrame(
      color: colors.panel,
      border: colors.border,
      child: SizedBox(
        width: width - 2,
        height: 42,
        child: Padding(
          padding: const EdgeInsets.all(3),
          child: Stack(
            fit: StackFit.expand,
            children: [
              AnimatedAlign(
                duration: _headerMotion(context),
                curve: Curves.fastOutSlowIn,
                alignment: trailingSelected
                    ? Alignment.centerRight
                    : Alignment.centerLeft,
                child: FractionallySizedBox(
                  widthFactor: .5,
                  heightFactor: 1,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      color: colors.selected,
                      border: Border.all(color: colors.border),
                      borderRadius: BorderRadius.circular(7),
                    ),
                  ),
                ),
              ),
              Row(
                children: [
                  for (final child in children) Expanded(child: child),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ToggleOption extends StatelessWidget {
  const _ToggleOption({
    required this.label,
    this.code,
    required this.asset,
    required this.selected,
    required this.onTap,
  });
  final String label, asset;
  final String? code;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    return Semantics(
      button: true,
      selected: selected,
      label: label,
      excludeSemantics: true,
      onTap: onTap,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(7),
        child: Center(
          child: FittedBox(
            fit: BoxFit.scaleDown,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (code == null)
                  Image.asset('$prayerAssets/$asset', width: 19, height: 19)
                else
                  ClipOval(
                    child: Image.asset(
                      '$prayerAssets/$asset',
                      width: 16,
                      height: 16,
                      fit: BoxFit.cover,
                    ),
                  ),
                if (code != null) ...[
                  const SizedBox(width: 5),
                  Text(
                    code!,
                    style: TextStyle(
                      fontSize: 10,
                      letterSpacing: .3,
                      color: selected ? colors.accent : colors.secondary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class VaktijaMenu extends StatefulWidget {
  const VaktijaMenu({
    super.key,
    required this.open,
    required this.labels,
    required this.section,
    required this.method,
    required this.onSection,
    required this.onMethod,
  });

  final bool open;
  final PrayerLabels labels;
  final MobileSection section;
  final PrayerMethod? method;
  final ValueChanged<MobileSection> onSection;
  final ValueChanged<PrayerMethod> onMethod;

  @override
  State<VaktijaMenu> createState() => _VaktijaMenuState();
}

class _VaktijaMenuState extends State<VaktijaMenu> {
  final _helpPortal = OverlayPortalController();
  PrayerMethod? _help;

  @override
  void didUpdateWidget(VaktijaMenu oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!widget.open && _help != null) {
      _help = null;
      // The menu's closing animation can keep the portal mounted briefly.
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted && _help == null && _helpPortal.isShowing) {
          _helpPortal.hide();
        }
      });
    }
  }

  void _setHelp(PrayerMethod? method) {
    if (_help == method) return;
    setState(() => _help = method);
    if (method == null) {
      _helpPortal.hide();
    } else {
      _helpPortal.show();
    }
  }

  Widget _buildHelp(BuildContext context, OverlayChildLayoutInfo layout) {
    final method = _help;
    if (method == null) return const SizedBox.shrink();

    final anchor = MatrixUtils.transformRect(
      layout.childPaintTransform,
      Offset.zero & layout.childSize,
    );
    final safe = MediaQuery.viewPaddingOf(context);
    final bottomInset = math.max(
      safe.bottom,
      MediaQuery.viewInsetsOf(context).bottom,
    );
    const gap = 12.0;
    final above = anchor.top - safe.top - gap * 2;
    final below =
        layout.overlaySize.height - bottomInset - anchor.bottom - gap * 2;
    final opensBelow = below >= math.min(above, 160);
    final height = opensBelow ? below : above;
    if (height <= 0) return const SizedBox.shrink();

    final width = math.min(anchor.width, 420.0);
    return Stack(
      clipBehavior: Clip.none,
      children: [
        Positioned(
          left: anchor.center.dx - width / 2,
          width: width,
          top: opensBelow ? anchor.bottom + gap : null,
          bottom: opensBelow
              ? null
              : layout.overlaySize.height - anchor.top + gap,
          child: TapRegion(
            groupId: _helpPortal,
            child: ConstrainedBox(
              constraints: BoxConstraints(maxHeight: height),
              child: MethodHelpPopover(
                key: ValueKey(method),
                explanation:
                    widget.labels[method == PrayerMethod.angle
                        ? 'method146Tooltip'
                        : 'methodIzTooltip'],
                opensBelow: opensBelow,
              ),
            ),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    final labels = widget.labels;
    final open = widget.open;
    final panel = Material(
      color: colors.panel,
      elevation: 10,
      shadowColor: colors.dark ? Colors.black54 : Colors.black26,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                for (final destination in MobileSection.values.skip(1)) ...[
                  if (destination != MobileSection.duas)
                    const SizedBox(width: 8),
                  Expanded(
                    child: _ControlFrame(
                      color: widget.section == destination
                          ? colors.selected
                          : colors.panel,
                      border: colors.border,
                      child: InkWell(
                        onTap: () => widget.onSection(destination),
                        child: SizedBox(
                          height: 42,
                          child: Center(
                            child: FittedBox(
                              fit: BoxFit.scaleDown,
                              child: Padding(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 7,
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Image.asset(
                                      '$prayerAssets/menu-${destination.name}.png',
                                      width: 18,
                                      color: colors.text,
                                      filterQuality: FilterQuality.low,
                                      excludeFromSemantics: true,
                                    ),
                                    const SizedBox(width: 6),
                                    Text(
                                      labels[destination.label].toUpperCase(),
                                      style: const TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w600,
                                        letterSpacing: .6,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ],
            ),
            const SizedBox(height: 12),
            OverlayPortal.overlayChildLayoutBuilder(
              key: const ValueKey('method-switcher'),
              controller: _helpPortal,
              overlayChildBuilder: _buildHelp,
              child: TapRegion(
                groupId: _helpPortal,
                onTapOutside: _help == null ? null : (_) => _setHelp(null),
                child: CallbackShortcuts(
                  bindings: {
                    if (_help != null)
                      const SingleActivator(LogicalKeyboardKey.escape): () =>
                          _setHelp(null),
                  },
                  child: _ControlFrame(
                    color: colors.panel,
                    border: colors.border,
                    child: Padding(
                      padding: const EdgeInsets.all(3),
                      child: Row(
                        children: [
                          for (final option in PrayerMethod.values)
                            Expanded(
                              child: _MethodToggle(
                                labels: labels,
                                method: option,
                                selected: option == widget.method,
                                helpOpen: option == _help,
                                onTap: () {
                                  _setHelp(null);
                                  widget.onMethod(option);
                                },
                                onHelp: () =>
                                    _setHelp(option == _help ? null : option),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: open ? 1 : 0),
      duration: _headerMotion(context),
      curve: Curves.fastOutSlowIn,
      child: panel,
      builder: (context, value, child) {
        if (value == 0) return const SizedBox.shrink();
        return IgnorePointer(
          ignoring: !open,
          child: ExcludeSemantics(
            excluding: !open,
            child: ClipRect(
              child: Align(
                alignment: Alignment.bottomCenter,
                heightFactor: value,
                child: Opacity(opacity: value, child: child),
              ),
            ),
          ),
        );
      },
    );
  }
}

class _MethodToggle extends StatelessWidget {
  const _MethodToggle({
    required this.labels,
    required this.method,
    required this.selected,
    required this.helpOpen,
    required this.onTap,
    required this.onHelp,
  });
  final PrayerLabels labels;
  final PrayerMethod method;
  final bool selected;
  final bool helpOpen;
  final VoidCallback onTap, onHelp;

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    final angle = method == PrayerMethod.angle;
    final color = selected ? colors.accent : colors.secondary;
    return Ink(
      decoration: BoxDecoration(
        color: selected ? colors.selected : null,
        borderRadius: BorderRadius.circular(7),
        border: selected ? Border.all(color: colors.border) : null,
      ),
      child: Row(
        children: [
          Expanded(
            child: Semantics(
              selected: selected,
              button: true,
              label: methodTitle(labels, method),
              child: InkWell(
                onTap: onTap,
                borderRadius: BorderRadius.circular(7),
                child: SizedBox(
                  height: 44,
                  child: Center(
                    child: FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          MethodIcon(method: method, color: color, size: 20),
                          const SizedBox(width: 6),
                          Text(
                            angle ? '14.6°' : 'IZ',
                            style: TextStyle(
                              color: color,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              letterSpacing: .7,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
          Semantics(
            button: true,
            expanded: helpOpen,
            child: Tooltip(
              message: labels[angle ? 'method146HelpAria' : 'methodIzHelpAria'],
              triggerMode: TooltipTriggerMode.manual,
              child: InkResponse(
                radius: 20,
                onTap: onHelp,
                child: SizedBox.square(
                  dimension: 44,
                  child: Icon(Icons.info, color: color, size: 14),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class CityChoices extends StatefulWidget {
  const CityChoices({
    super.key,
    required this.labels,
    required this.city,
    required this.cities,
    required this.maxHeight,
    required this.onCity,
  });
  final PrayerLabels labels;
  final PrayerCity city;
  final List<PrayerCity> cities;
  final double maxHeight;
  final ValueChanged<PrayerCity> onCity;

  @override
  State<CityChoices> createState() => _CityChoicesState();
}

class _CityChoicesState extends State<CityChoices> {
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final colors = VaktijaPalette.of(context);
    final filtered = widget.cities
        .where((city) => city.name.toLowerCase().contains(_query))
        .toList();
    return Material(
      shape: RoundedRectangleBorder(
        side: BorderSide(color: colors.border),
        borderRadius: BorderRadius.circular(10),
      ),
      color: colors.panel,
      elevation: 8,
      clipBehavior: Clip.antiAlias,
      child: ConstrainedBox(
        constraints: BoxConstraints(maxHeight: widget.maxHeight),
        child: Padding(
          padding: const EdgeInsets.all(1),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Padding(
                padding: const EdgeInsets.all(8),
                child: TextField(
                  style: TextStyle(fontSize: 16, color: colors.text),
                  textInputAction: TextInputAction.search,
                  onChanged: (text) =>
                      setState(() => _query = text.trim().toLowerCase()),
                  onSubmitted: (_) {
                    if (filtered.isNotEmpty) widget.onCity(filtered.first);
                  },
                  decoration: InputDecoration(
                    isDense: true,
                    hintText: widget.labels['searchCity'],
                    hintStyle: TextStyle(color: colors.muted),
                    filled: true,
                    fillColor: colors.surface,
                    constraints: const BoxConstraints(minHeight: 44),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide(color: colors.border),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide(color: colors.accent),
                    ),
                  ),
                ),
              ),
              Divider(height: 1, thickness: 1, color: colors.border),
              Flexible(
                child: filtered.isEmpty
                    ? Padding(
                        padding: const EdgeInsets.all(12),
                        child: Text(widget.labels['noCities']),
                      )
                    : ListView.builder(
                        shrinkWrap: true,
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        itemCount: filtered.length,
                        itemBuilder: (context, index) {
                          final city = filtered[index];
                          final selected = city.id == widget.city.id;
                          return InkWell(
                            onTap: () => widget.onCity(city),
                            child: Ink(
                              color: selected ? colors.selected : null,
                              child: ConstrainedBox(
                                constraints: const BoxConstraints(
                                  minHeight: 44,
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 9,
                                  ),
                                  child: Text(
                                    city.name,
                                    style: TextStyle(
                                      color: selected
                                          ? colors.accent
                                          : colors.text,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ControlFrame extends StatelessWidget {
  const _ControlFrame({
    required this.color,
    required this.border,
    required this.child,
  });
  final Color color, border;
  final Widget child;

  @override
  Widget build(BuildContext context) => Material(
    color: color,
    shape: RoundedRectangleBorder(
      side: BorderSide(color: border),
      borderRadius: BorderRadius.circular(10),
    ),
    clipBehavior: Clip.antiAlias,
    child: Padding(padding: const EdgeInsets.all(1), child: child),
  );
}

class _MenuGlyph extends CustomPainter {
  const _MenuGlyph(this.progress, this.color);

  final double progress;
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    final stroke = Paint()
      ..color = color
      ..strokeWidth = 1.85
      ..strokeCap = StrokeCap.round;
    const halfWidth = 12.5;
    final angle = progress * math.pi / 4;
    final x = halfWidth * math.cos(angle);
    final y = halfWidth * math.sin(angle);
    final distance = 7 * (1 - progress);
    for (final direction in const [-1, 1]) {
      final bar = center + Offset(0, direction * distance);
      final tip = Offset(x, -direction * y);
      canvas.drawLine(bar - tip, bar + tip, stroke);
    }
    if (progress < 1) {
      final extent = Offset(halfWidth * (1 - progress), 0);
      stroke.color = color.withValues(alpha: 1 - progress);
      canvas.drawLine(center - extent, center + extent, stroke);
    }
  }

  @override
  bool shouldRepaint(_MenuGlyph oldDelegate) =>
      oldDelegate.progress != progress || oldDelegate.color != color;
}

import 'package:flutter/material.dart';

enum _Destination {
  prayerTimes('Prayer Times', Icons.schedule_outlined),
  duas('Duas', Icons.menu_book_outlined),
  dhikr('Dhikr', Icons.repeat_rounded),
  qibla('Qibla', Icons.explore_outlined);

  const _Destination(this.label, this.icon);

  final String label;
  final IconData icon;
}

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  _Destination _selected = _Destination.prayerTimes;

  @override
  Widget build(BuildContext context) {
    return PopScope<Object?>(
      canPop: _selected == _Destination.prayerTimes,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop && _selected != _Destination.prayerTimes) {
          setState(() => _selected = _Destination.prayerTimes);
        }
      },
      child: Scaffold(
        body: SafeArea(
          bottom: false,
          child: IndexedStack(
            index: _selected.index,
            sizing: StackFit.expand,
            children: [
              for (final destination in _Destination.values)
                _SectionPlaceholder(destination),
            ],
          ),
        ),
        bottomNavigationBar: NavigationBar(
          selectedIndex: _selected.index,
          onDestinationSelected: (index) {
            setState(() => _selected = _Destination.values[index]);
          },
          destinations: [
            for (final destination in _Destination.values)
              NavigationDestination(
                icon: Icon(destination.icon),
                label: destination.label,
              ),
          ],
        ),
      ),
    );
  }
}

class _SectionPlaceholder extends StatelessWidget {
  const _SectionPlaceholder(this.destination);

  final _Destination destination;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isHome = destination == _Destination.prayerTimes;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (isHome) ...[
              Image.asset(
                'assets/branding/logo.png',
                width: 112,
                height: 96,
                color: theme.colorScheme.onSurface,
                excludeFromSemantics: true,
              ),
              const SizedBox(height: 12),
            ],
            Semantics(
              header: true,
              child: Text(
                isHome ? 'Vaktija' : destination.label,
                textAlign: TextAlign.center,
                style: theme.textTheme.headlineLarge,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

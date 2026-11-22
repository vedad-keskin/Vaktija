import 'package:code_assets/code_assets.dart';
import 'package:hooks/hooks.dart';
import 'package:native_toolchain_c/native_toolchain_c.dart';

void main(List<String> args) => build(args, (input, output) async {
  if (!input.config.buildCodeAssets) return;
  final target = input.config.code.targetOS;
  await CLibrary(
    name: 'vaktija_geodesic',
    assetName: 'features/qibla/qibla_direction.dart',
    sources: ['native/geographiclib/geodesic.c', 'native/qibla_geodesic.c'],
    includes: ['native/geographiclib'],
    libraries: [if (target == OS.android || target == OS.linux) 'm'],
  ).build(
    input: input,
    output: output,
    routing: const [ToAppBundle()],
    linkModePreference: LinkModePreference.dynamic,
  );
});

import 'package:flutter/material.dart';

class VaktijaPalette {
  const VaktijaPalette(this.dark);

  static VaktijaPalette of(BuildContext context) =>
      VaktijaPalette(Theme.of(context).brightness == Brightness.dark);

  final bool dark;

  Color get surface => dark ? const Color(0xff041e1b) : const Color(0xfff7f5ee);
  Color get panel => dark ? const Color(0xff0c2d28) : const Color(0xfffdfcf8);
  Color get border => dark ? const Color(0xff2c4840) : const Color(0xffd9ddcf);
  Color get text => dark ? const Color(0xfff1f2e9) : const Color(0xff153a30);
  Color get secondary =>
      dark ? const Color(0xffb5c8bf) : const Color(0xff52655c);
  Color get muted => dark ? const Color(0xffa0baac) : const Color(0xff5d695e);
  Color get accent => dark ? const Color(0xffa6d3bc) : const Color(0xff256047);
  Color get selected =>
      dark ? const Color(0xff1c3e33) : const Color(0xffe8efdf);
  Color get next => dark ? const Color(0xff204737) : const Color(0xffe6eedc);
  Color get gold => dark ? const Color(0xffe2c783) : const Color(0xff7c5e23);
  Color get sky => dark ? const Color(0xff032c28) : const Color(0xfffaf7ed);
  Color get heroBorder =>
      dark ? const Color(0xff7b713f) : const Color(0xffd4d8c4);
  Color get heroText =>
      dark ? const Color(0xfffff8e7) : const Color(0xff123d33);
  Color get heroMuted =>
      dark ? const Color(0xffc3d7c8) : const Color(0xff426858);
  Color get heroGold =>
      dark ? const Color(0xfff4d38c) : const Color(0xff856020);
  Color get track => dark ? const Color(0xff9bbfa9) : const Color(0xff426853);
  Color get trailGold =>
      dark ? const Color(0xffd2b777) : const Color(0xff996c23);
  Color get marker => dark ? const Color(0xfffff3cf) : const Color(0xfffff7db);
}

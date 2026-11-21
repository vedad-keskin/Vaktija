import 'package:flutter/material.dart';

import 'app/vaktija_app.dart';

void main() {
  final binding = WidgetsFlutterBinding.ensureInitialized();
  runApp(VaktijaApp(firstFrame: binding.waitUntilFirstFrameRasterized));
}

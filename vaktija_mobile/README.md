# Vaktija mobile

Flutter app for Android and iOS. Both platforms use `com.vaktija.app`.

From the repository root, with an emulator or phone connected:

```sh
cd vaktija_mobile
flutter pub get
flutter run
```

Run `flutter analyze` and `flutter test` from this directory to check the app.

`lib/main.dart` starts the app, and `lib/app/` holds the app widget and theme.
Add screens and their supporting code together under `lib/features/` as each
feature is built. The bundled mark comes from `public/assets/icons/logo.png`
in the web app.

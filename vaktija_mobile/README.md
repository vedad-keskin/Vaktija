# Vaktija mobile

Flutter app for Android and iOS. Android is `app.vaktija`. iOS is `com.vaktija.app`.

From the repository root, with an emulator or phone connected:

```sh
cd vaktija_mobile
flutter pub get
flutter run
```

Run `flutter analyze` and `flutter test` from this directory to check the app.

`lib/app/` contains the app shell, header, and theme. `lib/features/prayer_times/`
contains the timetable view, calculation, and data loading. The Android and iOS
apps bundle the IZ timetable for offline use and cache daily 14.6° results.

Run `node scripts/sync-mobile-assets.mjs` from the repo root after changes to
the web timetable, cities, prayer labels, or artwork. Commit the regenerated
mobile assets with their source changes.

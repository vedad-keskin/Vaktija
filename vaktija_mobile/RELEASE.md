# Vaktija Android release

Use this workflow when asked to prepare a bundle, cut an Android release, or bump the mobile version for a release. For example, “Prepare a bundle. What’s new: the Qibla compass is easier to calibrate.” Complete the version bump, signed build, and release notes in the same task.

## What changed

Use the changes supplied with the request. If the request has no summary, review the history and working tree for mobile changes since the last release. Use the last released version change in `pubspec.yaml` as the baseline when no release tag or other baseline is given.

## Choose the version

Update `vaktija_mobile/pubspec.yaml` using `version: X.Y.Z+N`. Flutter uses `X.Y.Z` for Android’s version name and `N` for its version code.

- **Patch** for fixes, copy, or small usability changes. Example bump from `1.1.2` to `1.1.3`.
- **Minor** for a new user-facing feature. Reset the patch number to zero.
- **Major** for a breaking change. Reset the minor and patch numbers to zero.

Use any requested version name or version code. When no code is specified, add one to the highest known Android version code, including the current `pubspec.yaml` value and any higher code already used in Play Console. Reuse an assigned version when retrying the same unfinished release.

## Build the bundle

Run the release build from `vaktija_mobile`.

```sh
flutter build appbundle --release
```

Confirm that the successful build produced a fresh, nonempty `build/app/outputs/bundle/release/app-release.aab`. Verify the signature with `jarsigner -verify` and check that it reports `jar verified`. Save a copy as `vaktija-X.Y.Z-N.aab` in the same directory.

## Write the release notes

Give the release a one- or two-word name based on the main change. Use `Fixes` for a fixes-only release. Describe user-visible changes, with the main change first and one bullet per change.

Use the tags and order from the supplied Play Console template. Use English for `en-US` and repeat the same Bosnian wording in `hr`, `sr`, and `bs` whenever those tags appear. Default to the three tags below.

```text
<en-US>
- Main change in English.
</en-US>
<hr>
- Glavna promjena na bosanskom.
</hr>
<sr>
- Glavna promjena na bosanskom.
</sr>
```

Save the tagged text as `release-notes-X.Y.Z-N.txt` beside the versioned bundle. In the reply, give the release name, version name and code, and links to the bundle and notes file. Put the tagged text in one plain-text code block for pasting into Play Console. If the build is blocked, report the exact blocker and which deliverables are ready.

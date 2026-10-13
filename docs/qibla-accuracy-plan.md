# Qibla accuracy investigation and implementation plan

Audited on 13 October 2026, commit `b497224`. Reference device: Samsung Galaxy S24 Ultra. Reference website: [qiblafinder.io](https://qiblafinder.io/). The phone's browser and raw sensor readings have not been supplied; physical accuracy on that phone has not been measured.

## Recommendation

Keep GeographicLib and the existing WMM2025 correction. Repair the heading geometry, replace the current spike damping with a small adaptive angular filter, and gate alignment on fresh, usable readings. Use one active sensor source at a time. No new production dependency is needed.

## Findings and evidence

### 1. The geographic bearing is sound

At the app's Sarajevo coordinates, GeographicLib returns **134.5331097433° from true north** and **3,180.235737 km** to the Kaaba. The independent GeographicLib GeodSolve web utility returned the same values to its displayed precision. Jablanica's stored coordinates produce **133.3281206450°**.

The installed `geomagnetism@0.2.0` contains **WMM2025**, so this is not an obsolete WMM2020 installation. On 13 October 2026, its declination is **5.187562° east in Sarajevo**, making the magnetic Qibla bearing **129.345548°**. Subtracting eastward declination from the true bearing is the correct conversion. Three official NOAA WMM2025 epoch test points matched within **0.005°**, the rounding precision of those published values.

A spherical great-circle calculation differs from our ellipsoidal bearing by about **0.13°** in Sarajevo and Jablanica. A 100 m position displacement in the four cardinal directions changed the Sarajevo bearing by at most **0.0021°**. These numerical differences are much smaller than the heading defects below. A wrongly selected city can still cause a meaningful error; comparisons must use the same actual location.

The current numeric azimuth is rounded to a whole degree, which can also make a comparison with another site's decimal display look larger than the underlying difference.

Sources: [GeographicLib calculator](https://geographiclib.sourceforge.io/cgi-bin/GeodSolve), [NOAA WMM2025](https://www.ncei.noaa.gov/products/world-magnetic-model), [NOAA test vectors](https://www.ncei.noaa.gov/sites/default/files/2025-02/WMM2025_TEST_VALUES.txt).

### 2. Sideways tilt can create a large false turn

Both Android math paths blend the projected top edge with the projected screen normal. Those vectors represent different directions. The W3C screen-normal example is intended for a device held approximately upright, such as an augmented reality view.

Replaying the current functions with `alpha=0`, `beta=0` and a sideways roll gives:

- At `gamma=20°`, the phone's top edge still points north, but both blend functions report **328.32°**, a **31.68°** error.
- At `gamma=35°`, they report **270°**, a **90°** error.
- The existing top-axis quaternion projection correctly returns **0°** for these inputs.
- For exactly flat absolute events, the vertical formula evaluates `0/0`. Even a zero blend weight propagates `NaN`, and the page discards the reading.

Responsible code: `compass-heading.ts:107–121` and `orientation-quaternion-heading.ts:130–162`. The existing tests mostly check normalization or compare two versions of the same screen-normal formula; they do not verify top-edge invariance under roll.

Source: [W3C Device Orientation, compass examples](https://www.w3.org/TR/orientation-event/#worked-example).

### 3. Spike rejection repeatedly suppresses real turns

`ingestHeadingSample` compares each raw heading with the lagging filtered heading. If their difference exceeds 42° at intervals below 90 ms, it keeps damping the new value to 12% of that difference. A sustained genuine turn is repeatedly treated as a spike.

Replaying the actual method body at 50 Hz produced:

- A 90° step takes **3.88 seconds** to reach and remain within 1° of the new heading.
- After a 90° turn over 500 ms, the displayed heading is still **65.51° behind** when the turn ends, and needs another **2.88 seconds** to settle within 1°.

A temporary candidate using a three-sample median and an angular 1€ filter reduced that second settling time to **100 ms**, with **8.86°** lag at the end of the turn. In one seeded stationary simulation with uniform ±3° input noise, its RMS error was **0.214°**, essentially equal to the current filter's **0.215°**. This establishes a useful candidate, not an accuracy guarantee for real hardware.

Candidate tuning used degrees, a 0.1 Hz minimum cutoff, beta 0.04, and a 0.5 Hz derivative cutoff. These are starting values for device tuning. The filter's angular inputs must be unwrapped before applying its scalar equations.

Source: [1€ filter authors' algorithm and tuning guide](https://gery.casiez.net/1euro/).

### 4. Alignment can flicker or remain falsely reassuring

The current alignment condition is a single 5° threshold. Readings at 4.8°, 5.2°, 4.9° and 5.1° error alternate its state every time. There is no separate entry/exit threshold or dwell time.

The timeout only detects absence of the first reading. A sensor that later stops can leave its last reading and alignment visible indefinitely. iOS `webkitCompassAccuracy` is ignored; Apple documents negative accuracy as unusable. Android orientation APIs do not provide the same accuracy field, so low jitter must not be presented as proof of absolute accuracy.

The English FAQ currently claims ±0.5° physical compass accuracy without supporting measurements. Both languages should describe the device and environment limits accurately.

Source: [Apple compass accuracy](https://developer.apple.com/documentation/webkitjs/deviceorientationevent/1804769-webkitcompassaccuracy).

### 5. What the reference site does

Its publicly served Android code uses `deviceorientationabsolute`, a flat-phone heading, shortest-angle smoothing, accumulated rotation angles, and a **300 ms CSS transition**. This is a credible explanation for the smooth feel you observed. Its instructions ask users to hold the phone flat.

The inspected code uses a spherical bearing and contains no magnetic declination correction. Its apparent stability therefore does not independently validate its absolute accuracy. We should adopt the consistent geometry and smooth motion while retaining our verified magnetic correction.

Source: [QiblaFinder's publicly served page and inline implementation](https://qiblafinder.io/).

## Implementation order

### 1. Fix the heading geometry and north reference

- Add regressions for the roll examples and exactly flat events first.
- Replace both blend paths with the horizontal projection of the **display's top edge**. Remap the screen axes before projection; test portrait, both landscape rotations and upside-down portrait.
- Keep the top-edge definition consistent. When its horizontal projection is unreliable, pause alignment and show “Hold your phone flatter”; do not silently switch to the back-of-screen vector.
- Guide users to hold the screen approximately horizontal. Start with a supported face-up tilt range of about 50°, then validate that limit on the phone.
- Normalize known magnetic headings to true north once, using `trueHeading = magneticHeading + declination`. Use the true Qibla bearing for the dial and numeric bearing. This keeps their north references consistent; relative Qibla direction remains mathematically equivalent to the current correction.
- Show the numeric bearing to one decimal place and identify its true-north reference. Display resolution is separate from physical compass accuracy.
- Retain GeographicLib, validate finite coordinates, and explicitly handle unavailable/degenerate bearings and magnetic-model expiry.

### 2. Make sensor selection and lifecycle reliable

- Start with the absolute orientation event path on the S24 Ultra, matching the reference site's demonstrated path. Use a working `AbsoluteOrientationSensor` as a capability-based fallback when valid absolute events do not arrive. Verify this order with device traces.
- Preserve the iOS `webkitCompassHeading` path and user-gesture permission request. Request absolute orientation permission where the browser implements it.
- Treat a first valid reading as proof of availability. Generic Sensor `start()` returns immediately; errors and readings arrive through events.
- Allow only one source to feed the filter. Reset on source/screen changes and guard callbacks from stopped sessions.
- Track sample age. After about 1.5 seconds without a usable reading, clear alignment and show a waiting/stale state. Reset appropriately when the page is hidden or resumed.

Sources: [W3C Orientation Sensor](https://www.w3.org/TR/orientation-sensor/), [Chrome sensor lifecycle](https://developer.chrome.com/docs/capabilities/web-apis/generic-sensor).

### 3. Stabilize movement and alignment

- Replace the repeated 42° damping with short, circular outlier rejection followed by the adaptive angular 1€ filter. Reuse the existing animation-frame batching.
- Keep continuous rotation angles across 359°/0°. Avoid stacking a long CSS transition on top of filtering.
- Suppress tiny stationary display changes with a small tunable deadband, initially around 0.3°.
- Initially require error ≤4° for 300 ms to enter alignment; leave at ≥7°. Immediately leave alignment when data becomes stale or unusable. These are UI tolerances, not claimed measurement accuracy.
- Use iOS accuracy when supplied. On Android, label observed stability without inventing an accuracy estimate.
- Update the existing calibration guidance and FAQ in both languages.

### 4. Verify before release

Automated checks:

- Geographic bearing golden values and dated NOAA WMM2025 vectors.
- Fixed top-edge bearing under supported pitch/roll and all four screen orientations; no `NaN` for flat readings.
- Angular seams, isolated spikes, real fast turns, variable sample intervals and gaps.
- Alignment threshold crossings, invalid/uncalibrated data, stale readings and source cancellation.
- Reuse the existing Vitest tests and build gate.

Device check on the S24 Ultra:

- Use the same GPS location and holding position for our page and the reference site.
- Check stationary behaviour, slow turns, a 90° fast turn, sideways tilt, screen rotation and tab resume.
- Compare against a known physical direction or north-up map reference; another compass website alone is not ground truth. Check whether any native compass reference uses true or magnetic north.
- Record source, timestamps, tilt and raw/filtered headings locally for tuning. Aim for stationary jitter no worse than the current filter, no false yaw from supported roll, and settling within 1° of a sustained synthetic heading within 500 ms after the turn ends. Physical bearing accuracy must be assessed separately.
- Test the phone's actual browser, plus Chrome/Samsung Internet where available. Check the iOS fallback on an iPhone if one is available.

The implementation can remain within the existing math helpers, Qibla page, translations and tests. The current visual design can be retained.

## Implementation completed — 13 October 2026

- Both orientation paths now project the display's top edge, including screen-axis remapping. Exactly flat readings are finite. Face-down readings and face-up tilt above 50° pause the compass; negative Safari compass accuracy is rejected.
- Magnetic headings are converted to true north once. The dial and the bearing label use that reference, with a localized decimal bearing. Invalid coordinates, a degenerate direction at the Kaaba/antipode, and expired WMM data return an unavailable result.
- The old repeated spike damping and fixed 380 ms filter have been replaced with a three-sample circular median and continuous angular 1€ filter. Isolated spikes, including exactly opposite-direction readings, do not unwrap into a false full turn. Starting tuning is 0.1 Hz minimum cutoff, beta 0.04, and 0.5 Hz derivative cutoff; a 0.3° display deadband suppresses tiny changes.
- Alignment requires error ≤4° for 300 ms, exits at ≥7°, and clears on unusable data, a 1.5 s sample gap, screen rotation, location-source changes, and tab hiding. GPS updates within the same source retain the filter so ordinary small location updates do not repeatedly reset the compass.
- Absolute orientation events are tried first. A silent event source falls back to the quaternion API after 2 s; a silent/erroring quaternion source returns to events. Only one source is active. Retired source callbacks and late permission responses are ignored.
- Both languages now describe holding the phone flat and the limits of sensor accuracy. Unsupported accuracy promises have been removed.

Verification commands:

```sh
npm test -- --watch=false
npm run build
```

The checks cover independent GeographicLib values, dated NOAA WMM2025 vectors, supported roll/pitch and all four screen rotations, quaternion input validation, angular seams, spikes versus sustained turns at 25/50/100 Hz, stationary seeded noise, alignment dwell/hysteresis, stale data, tilt/accuracy rejection, visibility/rotation resets, silent/erroring source fallback, and callback cancellation. The sustained 90°/500 ms turn settles within 1° within the 500 ms acceptance window; stationary noise is no worse than the former filter in the seeded simulation.

Real S24 Ultra and iPhone measurements remain pending. No browser was connected for a visual preview during this implementation. Existing build warnings concern the Qibla CSS size and CommonJS math dependencies. No dependency was added.

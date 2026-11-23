// Bosnian and English copy for the Flutter Qibla screen.
const qiblaCopy = {
  'bs': (
    labels: {
      'qiblaTileSubtitle': 'Smjer prema Kabi u Mekki',
      'qiblaBackToTimes': 'Natrag na vremena namaza',
      'qiblaSectionTitle': 'Smjer kible',
      'qiblaLocationGps': 'Moja lokacija',
      'qiblaLocationLabel': 'Lokacija za proračun',
      'qiblaUseCity': 'Koristi odabrani grad',
      'qiblaCompassIdle': 'Pokrenite i kalibrišite kompas',
      'qiblaStartHint':
          'Držite telefon vodoravno s blagim nagibom i okrenite se prema oznaci Kabe.',
      'qiblaCompassWaiting': 'Čekamo signal kompasa',
      'qiblaWaitingHint':
          'Držite telefon mirno, gotovo vodoravno, s ekranom prema gore.',
      'qiblaHoldFlat': 'Neispravna pozicija',
      'qiblaHoldFlatHint':
          'Držite telefon gotovo vodoravno, s malim nagibom prema gore.',
      'qiblaTurnLeft': 'Okrenite se ulijevo',
      'qiblaTurnRight': 'Okrenite se udesno',
      'qiblaUncalibrated':
          'Odmaknite se od metala i magneta pa telefonom napravite osmicu.',
      'qiblaDirectionUnavailable': 'Smjer kible nije dostupan',
      'qiblaDirectionUnavailableHint':
          'Za ovu lokaciju nije moguće odrediti jedinstven smjer kible.',
      'qiblaAlignedLabel': 'Okrenuti ste prema kibli',
      'qiblaAlignedHint':
          'Za namaz slijedite smjer koji pokazuje vrh telefona.',
      'qiblaRecalibrate': 'Kalibrišite ponovo',
      'qiblaGpsPending': 'Određujem lokaciju…',
      'qiblaGpsDisabled':
          'Lokacija je isključena na telefonu. Uključite je u postavkama pa se vratite u aplikaciju.',
      'qiblaGpsDisabledIos':
          'Lokacijske usluge su isključene. Uključite ih u Postavke > Privatnost i sigurnost > Lokacijske usluge.',
      'qiblaOpenLocationSettings': 'Otvori postavke lokacije',
      'qiblaOpenAppSettings': 'Otvori postavke aplikacije',
      'qiblaGpsError': 'Nije moguće dobiti lokaciju. Provjerite dozvole i GPS.',
      'qiblaGpsDenied':
          'Lokacija je odbijena. Uključite je u postavkama aplikacije.',
      'qiblaEnableCompass': 'Pokreni kompas',
      'qiblaUnsupported': 'Kompas nije dostupan',
      'qiblaNoReading': 'Nema signala kompasa',
      'qiblaNoEventsHint':
          'Držite telefon gotovo vodoravno ili dodirnite kalibrišite ponovo.',
      'qiblaUseBearing':
          'Smjer odredite pomoću prikazanog ugla od pravog sjevera.',
      'qiblaBearingLabel': 'Pravi sjever',
      'qiblaDistanceLabel': 'Udaljenost',
      'qiblaFaceKaabaHint':
          'Pratite oznaku Kabe dok se ne poravna s vrhom kompasa.',
      'qiblaCalibrateTitle': 'Kalibrišite kompas',
      'qiblaCalibrateBody':
          'Odmaknite se od metala i magneta. Lagano pomičite telefon u obliku osmice, zatim ga držite ravno, s ekranom prema gore.',
      'qiblaCalibrateSkip': 'Preskoči',
      'qiblaCalibrateDone': 'Gotovo',
      'qiblaFaqTitle': 'Pomoć za kiblu',
    },
    faq: [
      (
        question: 'Moram li uključiti lokaciju?',
        answer:
            'Za odabrani grad smjer se prikazuje bez interneta i bez dozvole za lokaciju. Ako ste izvan tog grada, dodirnite „Moja lokacija“ da dobijete smjer od mjesta na kojem se nalazite. Aplikacija koristi jedno očitanje lokacije i računa smjer na uređaju bez pohrane lokacije.',
      ),
      (
        question: 'Šta ako je kompas nestabilan ili se oznaka ne poravnava?',
        answer:
            'Odmaknite se od metala i magneta pa držite telefon ravno, s ekranom prema gore. Ako je očitanje i dalje nestabilno, dodirnite „Kalibrišite ponovo“ i pratite upute.',
      ),
      (
        question: 'Šta znače zelena oznaka i vibracija?',
        answer:
            'Kad je razlika između smjera telefona i izračunatog smjera kible manja od nekoliko stepeni, oznaka postane zelena i telefon može kratko zavibrirati. Tačnost očitanja zavisi od senzora telefona i okruženja.',
      ),
      (
        question: 'Šta ako klanjam sa malim odstupanjem od smjera kible?',
        answer:
            'Islamski učenjaci razlikuju osobu koja ulaže iskren trud da odredi smjer kible od osobe koja je nemarna. Ako uložite iskren trud, vaš namaz je ispravan čak i uz mali stepen greške. Obaveza je uložiti razuman trud.',
      ),
    ],
  ),
  'en': (
    labels: {
      'qiblaTileSubtitle': 'Direction to the Kaaba in Makkah',
      'qiblaBackToTimes': 'Back to prayer times',
      'qiblaSectionTitle': 'Qibla direction',
      'qiblaLocationGps': 'My location',
      'qiblaLocationLabel': 'Location for calculation',
      'qiblaUseCity': 'Use selected city',
      'qiblaCompassIdle': 'Start and calibrate the compass',
      'qiblaStartHint':
          'Hold your phone nearly flat with a slight tilt, then turn toward the Kaaba marker.',
      'qiblaCompassWaiting': 'Waiting for a compass reading',
      'qiblaWaitingHint':
          'Keep your phone still and nearly flat, with the screen facing up.',
      'qiblaHoldFlat': 'Incorrect phone position',
      'qiblaHoldFlatHint':
          'Hold your phone nearly flat with a slight upward tilt.',
      'qiblaTurnLeft': 'Turn left',
      'qiblaTurnRight': 'Turn right',
      'qiblaUncalibrated':
          'Step away from metal and magnets, then trace a figure eight.',
      'qiblaDirectionUnavailable': 'Qibla direction unavailable',
      'qiblaDirectionUnavailableHint':
          'A unique Qibla direction can’t be determined at this location.',
      'qiblaAlignedLabel': 'You are facing the Qibla',
      'qiblaAlignedHint':
          'For prayer, face the direction the top of your phone points.',
      'qiblaRecalibrate': 'Calibrate again',
      'qiblaGpsPending': 'Getting your location…',
      'qiblaGpsDisabled':
          'Location is switched off on your phone. Enable it in settings, then return to the app.',
      'qiblaGpsDisabledIos':
          'Location Services are switched off. Enable them in Settings > Privacy & Security > Location Services.',
      'qiblaOpenLocationSettings': 'Open location settings',
      'qiblaOpenAppSettings': 'Open app settings',
      'qiblaGpsError': 'Could not get location. Check permissions and GPS.',
      'qiblaGpsDenied': 'Location was denied. Enable it in the app settings.',
      'qiblaEnableCompass': 'Start compass',
      'qiblaUnsupported': 'Compass unavailable',
      'qiblaNoReading': 'No compass signal',
      'qiblaNoEventsHint':
          'Hold your phone nearly flat or tap “Calibrate again”.',
      'qiblaUseBearing':
          'Use the displayed angle from true north to find the direction.',
      'qiblaBearingLabel': 'True north',
      'qiblaDistanceLabel': 'Distance',
      'qiblaFaceKaabaHint': 'Bring the Kaaba marker to the top of the dial.',
      'qiblaCalibrateTitle': 'Calibrate Your Compass',
      'qiblaCalibrateBody':
          'Move away from metal and magnets. Gently move your phone in a figure-eight, then hold it flat with the screen facing up.',
      'qiblaCalibrateSkip': 'Skip',
      'qiblaCalibrateDone': 'Done',
      'qiblaFaqTitle': 'Qibla help',
    },
    faq: [
      (
        question: 'Do I need to enable location?',
        answer:
            'Your selected city works offline without location permission. If you’re away from that city, tap My location to get the direction from where you are. The app uses one location reading to calculate the direction on your device without saving your location.',
      ),
      (
        question: 'What if the compass jumps or won’t align?',
        answer:
            'Move away from metal or magnets and hold your phone flat with the screen facing up. If the reading is still unstable, tap Calibrate again and follow the guide.',
      ),
      (
        question: 'What do the green indicator and vibration mean?',
        answer:
            'The indicator turns green and your phone can give a short vibration when you’re within a few degrees of the calculated direction. The reading depends on your phone’s sensors and surroundings.',
      ),
      (
        question: 'What if I pray slightly off the Qibla direction?',
        answer:
            'The classical scholars distinguish between someone who makes a genuine effort to determine the Qibla and someone who is careless. If you make a sincere effort, your prayer is valid even if there is a small degree of error. The obligation is to make a reasonable effort.',
      ),
    ],
  ),
};

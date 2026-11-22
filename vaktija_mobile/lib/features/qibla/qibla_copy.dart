// Qibla copy from the Vaktija web app, with native permission wording.
const qiblaCopy = {
  'bs': (
    labels: {
      'qiblaTileTitle': 'Kibla kompas',
      'qiblaTileSubtitle': 'Smjer prema Kabi u Mekki',
      'qiblaBackToTimes': 'Natrag na vremena namaza',
      'qiblaSectionTitle': 'Smjer kible',
      'qiblaLocationGps': 'Moja lokacija',
      'qiblaLocationLabel': 'Lokacija za proračun',
      'qiblaUseCity': 'Koristi odabrani grad',
      'qiblaCompassIdle': 'Pregled smjera · kompas nije uključen',
      'qiblaCompassWaiting': 'Čekam signal kompasa…',
      'qiblaHoldFlat': 'Držite telefon ravnije, s ekranom prema gore.',
      'qiblaUncalibrated':
          'Kompas nije kalibriran. Odmaknite se od magneta i lagano nacrtajte osmicu.',
      'qiblaNorthUnavailable':
          'Korekcija sjevera nije dostupna. Kompas trenutno ne može potvrditi smjer.',
      'qiblaDirectionUnavailable':
          'Na ovoj lokaciji nije moguće odrediti jedinstven smjer kible.',
      'qiblaAlignedLabel': 'Okrenuti ste prema kibli',
      'qiblaRecalibrate': 'Kalibriši ponovo',
      'qiblaGpsPending': 'Određujem lokaciju…',
      'qiblaGpsError': 'Nije moguće dobiti lokaciju. Provjerite dozvole i GPS.',
      'qiblaGpsDenied':
          'Lokacija je odbijena. Uključite je u postavkama aplikacije.',
      'qiblaEnableCompass': 'Pokreni kompas',
      'qiblaCompassListening': 'Kompas aktivan',
      'qiblaUnsupported': 'Ovaj uređaj nema dostupan digitalni kompas.',
      'qiblaNoEventsHint':
          'Signal kompasa nije dostupan. Držite telefon ravno i pokušajte ponovo.',
      'qiblaCalibrationHint': 'Držite telefon podalje od metala i magneta.',
      'qiblaBearingLabel': 'Azimut · pravi sjever',
      'qiblaDistanceLabel': 'Udaljenost',
      'qiblaFaceKaabaHint':
          'Držite telefon ravno, s ekranom prema gore. Okrećite se dok se oznaka Kabe ne poravna s vrhom ekrana.',
      'qiblaCalibrateTitle': 'Kalibrišite kompas',
      'qiblaCalibrateBody':
          'Odmaknite se od metala i magneta. Lagano pomičite telefon u obliku osmice, zatim ga držite ravno, s ekranom prema gore.',
      'qiblaCalibrateSkip': 'Preskoči',
      'qiblaCalibrateDone': 'Gotovo',
      'qiblaFaqTitle': 'Često postavljana pitanja',
    },
    faq: [
      (
        question: 'Zašto je potrebna kalibracija kompasa?',
        answer:
            'Digitalni kompas koristi magnetometar ugrađen u vaš uređaj, koji je veoma osjetljiv na magnetne smetnje. Kalibracijom osvježavate kompas kako bi pokazivao ispravan smjer.',
      ),
      (
        question: 'Kako držati telefon pri očitavanju kompasa?',
        answer:
            'Držite telefon približno vodoravno, s ekranom prema gore, kao klasični kompas. Poravnajte oznaku Kabe s vrhom ekrana. Blagi nagib je u redu; kada je telefon previše uspravan ili okrenut ekranom prema dolje, potvrda smjera se zaustavlja. Izbjegavajte metalne površine, punjače i maske s magnetima.',
      ),
      (
        question: 'Zašto je potrebna lokacija za pronalaženje kible?',
        answer:
            'Smjer kible zavisi od vaše tačne fizičke lokacije. Alat privremeno pristupa GPS-u samo kako bi izračunao precizan matematički ugao između vaših koordinata i Kabe. Podaci o lokaciji obrađuju se lokalno u uređaju i nigdje se ne pohranjuju niti prate.',
      ),
      (
        question: 'Koliko je tačan ovaj kiblemetar?',
        answer:
            'Azimut i udaljenost računamo geodetskom metodom Karney na WGS84 elipsoidu, uz WMM korekciju magnetne deklinacije za kompas. Tačnost prikazanog smjera zavisi i od odabrane lokacije, senzora telefona i magnetnih smetnji.',
      ),
      (
        question: 'Koliko je tačan digitalni kompas?',
        answer:
            'Ne garantujemo fiksnu tačnost kompasa. Ona zavisi od senzora, kalibracije i okruženja. Mirna oznaka ne dokazuje tačnost. Korekcija deklinacije pretvara magnetni u pravi sjever; zeleno poravnanje označava toleranciju prikaza, a ne izmjerenu preciznost senzora.',
      ),
      (
        question:
            'Koji je najtačniji način za pronalaženje kible putem interneta?',
        answer:
            'Za proračun koristite svoju stvarnu lokaciju. Kalibrirajte telefon i udaljite ga od magneta. Kada je moguće, provjerite smjer prema poznatom pravcu ili karti orijentisanoj prema pravom sjeveru; poređenje s drugim kompasom samo po sebi ne potvrđuje tačnost.',
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
      'qiblaTileTitle': 'Qibla compass',
      'qiblaTileSubtitle': 'Direction to the Kaaba in Makkah',
      'qiblaBackToTimes': 'Back to prayer times',
      'qiblaSectionTitle': 'Qibla direction',
      'qiblaLocationGps': 'My location',
      'qiblaLocationLabel': 'Location for calculation',
      'qiblaUseCity': 'Use selected city',
      'qiblaCompassIdle': 'Direction preview · compass is off',
      'qiblaCompassWaiting': 'Waiting for a compass reading…',
      'qiblaHoldFlat': 'Hold your phone flatter, with the screen facing up.',
      'qiblaUncalibrated':
          'Compass is uncalibrated. Move away from magnets and make a gentle figure-eight.',
      'qiblaNorthUnavailable':
          'North correction is unavailable. The compass cannot confirm direction right now.',
      'qiblaDirectionUnavailable':
          'A unique Qibla direction cannot be determined at this location.',
      'qiblaAlignedLabel': 'You are facing the Qibla',
      'qiblaRecalibrate': 'Calibrate again',
      'qiblaGpsPending': 'Getting your location…',
      'qiblaGpsError': 'Could not get location. Check permissions and GPS.',
      'qiblaGpsDenied': 'Location was denied. Enable it in the app settings.',
      'qiblaEnableCompass': 'Start compass',
      'qiblaCompassListening': 'Compass active',
      'qiblaUnsupported': 'A digital compass is unavailable on this device.',
      'qiblaNoEventsHint':
          'Compass signal unavailable. Hold your phone flat and try again.',
      'qiblaCalibrationHint':
          'Keep away from metal or magnets for a steadier reading.',
      'qiblaBearingLabel': 'Bearing · true north',
      'qiblaDistanceLabel': 'Distance',
      'qiblaFaceKaabaHint':
          'Hold your phone flat, screen facing up. Turn until the Kaaba marker aligns with the top of the screen.',
      'qiblaCalibrateTitle': 'Calibrate Your Compass',
      'qiblaCalibrateBody':
          'Move away from metal and magnets. Gently move your phone in a figure-eight, then hold it flat with the screen facing up.',
      'qiblaCalibrateSkip': 'Skip',
      'qiblaCalibrateDone': 'Done',
      'qiblaFaqTitle': 'Frequently Asked Questions',
    },
    faq: [
      (
        question: 'Why does my compass need calibration?',
        answer:
            'Digital compasses rely on your device\'s built-in magnetometer, which is highly sensitive to magnetic interference. Device calibration is used for refreshing the device compass to show correct directions.',
      ),
      (
        question: 'How should I hold my phone to read the compass?',
        answer:
            'Hold your phone approximately horizontal, screen facing up, like a classic compass. Align the Kaaba marker with the top of the screen. A slight tilt is fine; alignment pauses when the phone is too upright or face down. Avoid metal surfaces, chargers, and magnetic cases.',
      ),
      (
        question: 'Why does the Qibla finder require my location?',
        answer:
            'The Qibla bearing is uniquely tied to your exact physical location. The tool requires temporary access to your device\'s GPS solely to calculate the precise mathematical angle between your current coordinates and the Kaaba. This location data is processed locally on your device and is not stored or tracked.',
      ),
      (
        question: 'How accurate is this Qibla Finder?',
        answer:
            'We calculate bearing and distance using Karney’s geodesic method on the WGS84 ellipsoid, with WMM magnetic declination correction for the compass. The displayed direction also depends on the selected location, phone sensors, and magnetic interference.',
      ),
      (
        question: 'How accurate is this digital compass?',
        answer:
            'We do not guarantee a fixed compass accuracy. It depends on the sensors, calibration, and surroundings. A steady marker does not prove accuracy. Declination correction converts magnetic to true north; green alignment indicates a display tolerance, not measured sensor precision.',
      ),
      (
        question:
            'What is the most accurate way to find the Qibla direction online?',
        answer:
            'Use your actual location for the calculation. Calibrate the phone and move away from magnets. When possible, check against a known direction or a map oriented to true north; comparing with another compass alone does not establish accuracy.',
      ),
      (
        question: 'What if I pray slightly off the Qibla direction?',
        answer:
            'The classical scholars distinguish between someone who makes a genuine effort to determine the Qibla and someone who is careless. If you make a sincere effort, your prayer is valid even if there is a small degree of error. The obligation is to make a reasonable effort.',
      ),
    ],
  ),
};

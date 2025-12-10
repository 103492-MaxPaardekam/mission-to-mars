const programData = {
  combat: {
    title: "GEVECHTS TRAINING",
    code: "PROG-CT-001",
    category: "Training",
    duration: "45 minuten",
    difficulty: "Hoog",
    participants: "1-4 spelers",
    description:
      "Een complete gevechts training simulator ontworpen om je reflexen, tactische vaardigheden en fysieke conditie te verbeteren. De holodeck projecteert realistische tegenstanders en omgevingen waarin je verschillende gevechtstechnieken kunt oefenen, van hand-tot-hand combat tot tactische team manoeuvres. Alle acties zijn volledig veilig dankzij de holografische projectie en veiligheidprotocollen.",
    features: [
      "Meerdere moeilijkheidsgraden: Beginner tot Expert",
      "20+ verschillende gevechtsscenario's en omgevingen",
      "Realtime performance tracking en feedback",
      "Multiplayer modus voor team training",
      "Aanpasbare AI tegenstanders",
      "Volledige veiligheidsprotocollen actief",
    ],
    warning:
      "Dit programma vereist fysieke activiteit. Consulteer de scheepsarts bij twijfel over je conditie.",
  },
  beach: {
    title: "TROPISCH STRAND",
    code: "PROG-RE-003",
    category: "Relaxatie",
    duration: "Onbeperkt",
    difficulty: "Laag",
    participants: "1-8 spelers",
    description:
      "Ontsnap naar een paradijselijk tropisch strand met kristalhelder water, zacht zand en een perfecte zonsondergang. Dit programma is ontworpen voor volledige ontspanning en biedt een multisensorische ervaring met realistische geluiden van golven, het gevoel van wind en zon, en zelfs de geur van zout water. Perfect om even weg te zijn van de realiteit van de ruimtevlucht.",
    features: [
      "Fotorealistische 360° strand omgeving",
      "Aanpasbare weersomstandigheden en tijd van de dag",
      "Authentieke geluiden van golven, zeemeeuwen en wind",
      "Klimaatcontrole: voel de zon en de zeebries",
      "Interactieve elementen: zwemmen, bouwen, verkennen",
      "Meditatie en yoga modus beschikbaar",
    ],
    warning: null,
  },
  rome: {
    title: "ANCIENT ROME",
    code: "PROG-HI-012",
    category: "Historisch",
    duration: "60-90 minuten",
    difficulty: "Laag",
    participants: "1-6 spelers",
    description:
      "Stap terug in de tijd naar het antieke Rome op het hoogtepunt van zijn macht (circa 100 AD). Wandel door het indrukwekkende Colosseum, verken het Forum Romanum, en ervaar het dagelijks leven in de grootste stad van de antieke wereld. Dit educatieve programma is gebaseerd op historisch onderzoek en archeologische data, compleet met holografische Romeinen die hun dagelijkse activiteiten uitvoeren.",
    features: [
      "Historisch accurate reconstructie van antiek Rome",
      "Bezoek iconische locaties: Colosseum, Forum, Pantheon",
      "Interactieve holografische gidsen en Romeinse burgers",
      "Keuze tussen verschillende tijdsperioden",
      "Educatieve overlays met historische informatie",
      "Gesproken taal: Latijn met real-time vertaling",
    ],
    warning: null,
  },
  mars: {
    title: "MARS LANDING SIMULATOR",
    code: "PROG-TR-008",
    category: "Training",
    duration: "30-60 minuten",
    difficulty: "Gemiddeld",
    participants: "1-2 spelers",
    description:
      "Bereid je voor op de daadwerkelijke Mars landing met deze realistische training simulator. Oefen alle procedures van de landing sequentie, van het betreden van de atmosfeer tot de finale touchdown op het Mars oppervlak. Deze simulator gebruikt echte NASA data en procedures om een authentieke training ervaring te bieden. Maak je eerste stappen op Mars voordat je echt aankomt!",
    features: [
      "Volledige landing sequentie van begin tot eind",
      "Realistische Mars atmosfeer en terrein",
      "Authentieke controle interfaces en procedures",
      "Noodsituaties en probleem-oplossing scenarios",
      "Voice commands en crew communicatie",
      "Performance evaluatie en certificering",
    ],
    warning:
      "Training programma. Resultaten worden geregistreerd in je crew profiel.",
  },
  cafe: {
    title: "PARIJS CAFÉ",
    code: "PROG-SO-005",
    category: "Sociaal",
    duration: "Onbeperkt",
    difficulty: "Laag",
    participants: "1-12 spelers",
    description:
      "Geniet van de sfeer van een authentiek Parijse café in het hartje van Montmartre. Dit sociale programma biedt een ontspannen omgeving om andere crew leden te ontmoeten, een kop holografische koffie te drinken (met echte geur!), en te genieten van de Franse sfeer. Holografische Parijzenaren zorgen voor een levendige achtergrond, en je kunt zelfs Frans oefenen met de AI-gestuurde karakters.",
    features: [
      "Authentieke Parijse café sfeer en architectuur",
      "Holografische barista en bezoekers",
      "Franse achtergrondmuziek en straatgeluiden",
      "Interactieve menu met virtuele drankjes en snacks",
      "Multiplayer: nodig andere crew leden uit",
      "Taalles modus: oefen je Frans",
    ],
    warning: null,
  },
  space: {
    title: "DEEP SPACE EVA",
    code: "PROG-TR-015",
    category: "Training",
    duration: "45 minuten",
    difficulty: "Hoog",
    participants: "1-3 spelers",
    description:
      "Extra Vehicular Activity (EVA) training in een gesimuleerde ruimteomgeving. Leer alle procedures voor een spacewalk, van het aantrekken van je ruimtepak tot complexe reparaties aan de buitenkant van een ruimteschip. Deze geavanceerde training simulator bereidt je voor op echte noodsituaties en geeft je het vertrouwen om te werken in de gevaarlijke omgeving van de ruimte.",
    features: [
      "Volledige EVA procedure training",
      "Realistische zero-gravity physics",
      "Ruimtepak simulatie met HUD en life support",
      "Verschillende missie scenarios en noodsituaties",
      "Tool gebruik en reparatie training",
      "Crew coördinatie oefeningen",
    ],
    warning:
      "Gevorderd training programma. Verplicht voor crew die EVA certificering willen behalen.",
  },
  forest: {
    title: "SEQUOIA FOREST",
    code: "PROG-RE-007",
    category: "Natuur",
    duration: "Onbeperkt",
    difficulty: "Laag",
    participants: "1-6 spelers",
    description:
      "Wandel tussen de majestueuze reuzenbomen van California's Sequoia National Park. Ervaar de stilte en grootsheid van één van 's werelds meest indrukwekkende bossen. Dit programma is perfect voor natuurliefhebbers en biedt een vredige ontsnapping met authentieke geluiden van vogels, een beek in de verte, en het kraken van takken onder je voeten. De bomen kunnen meer dan 2000 jaar oud zijn en tot 85 meter hoog!",
    features: [
      "Fotorealistische oude groei sequoia bomen",
      "Meerdere wandelpaden en verkenningsroutes",
      "Wildlife: herten, eekhoorns, vogels",
      "Dag/nacht cyclus met sterrenhemel",
      "Educatieve informatie over bomen en ecosysteem",
      "Rustige achtergrond ambient geluiden",
    ],
    warning: null,
  },
  sports: {
    title: "SPORT ARENA",
    code: "PROG-SP-004",
    category: "Sport",
    duration: "30-90 minuten",
    difficulty: "Gemiddeld",
    participants: "2-10 spelers",
    description:
      "Een multifunctionele sportarena waar je verschillende sporten kunt beoefenen met aangepaste zwaartekracht instellingen. Speel basketball, tennis, voetbal of andere sporten in normale zwaartekracht, of probeer het in 1/6 Maan-zwaartekracht of zelfs zero-G voor een unieke ervaring! Perfect om fit te blijven tijdens de lange reis en om te socializen met andere crew leden.",
    features: [
      "10+ verschillende sporten beschikbaar",
      "Aanpasbare zwaartekracht: 0G tot 2G",
      "AI tegenstanders of multiplayer modus",
      "Automatische score tracking",
      "Verschillende arena omgevingen",
      "Fitness tracking en statistieken",
    ],
    warning: "Opwarmen aanbevolen. Scheepsarts beschikbaar voor blessures.",
  },
  arctic: {
    title: "ARCTIC EXPEDITION",
    code: "PROG-AD-011",
    category: "Avontuur",
    duration: "60-120 minuten",
    difficulty: "Gemiddeld",
    participants: "1-4 spelers",
    description:
      "Verken de wilde en ongerepte schoonheid van het Arctische gebied. Trek door sneeuwlandschappen, klim over ijsformaties, en ontmoet arctische wildlife zoals ijsberen, walrussen en arctische vossen - allemaal van een veilige afstand in deze holografische simulatie. Dit avontuurlijke programma biedt verschillende scenario's, van rustige natuurverkenning tot spannende survival situaties.",
    features: [
      "Uitgestrekte arctische landschappen en ijsvlaktes",
      "Realistische kou effecten (veilig gesimuleerd)",
      "Wilde dieren in hun natuurlijke habitat",
      "Verschillende scenario's: verkenning, survival, onderzoek",
      "Educatieve elementen over klimaat en ecosysteem",
      "Dag/nacht cyclus met noorderlicht",
    ],
    warning: "Bevat gesimuleerde koude temperaturen. Warm jezelf op na afloop.",
  },
};

function loadProgram(programId) {
  const program = programData[programId];
  const modalBody = document.getElementById("modal-body");

  let featuresHTML = '<ul class="features-list">';
  program.features.forEach((feature) => {
    featuresHTML += `<li>• ${feature}</li>`;
  });
  featuresHTML += "</ul>";

  const warningHTML = program.warning
    ? `<div class="warning-box">
        <strong>⚠️ WAARSCHUWING</strong>
        ${program.warning}
       </div>`
    : "";

  modalBody.innerHTML = `
    <h2 class="modal-title">${program.title}</h2>
    <p class="modal-code">${program.code} | ${program.category}</p>
    
    <div class="modal-info">
      <div class="info-badge">
        <span class="info-label">DUUR</span>
        <span class="info-value">${program.duration}</span>
      </div>
      <div class="info-badge">
        <span class="info-label">MOEILIJKHEID</span>
        <span class="info-value">${program.difficulty}</span>
      </div>
      <div class="info-badge">
        <span class="info-label">DEELNEMERS</span>
        <span class="info-value">${program.participants}</span>
      </div>
    </div>
    
    <p class="modal-description">${program.description}</p>
    
    <div class="features-section">
      <h3 class="section-title">PROGRAMMA FEATURES</h3>
      ${featuresHTML}
    </div>

    ${warningHTML}
    
    <button class="load-button" onclick="activateHolodeck('${programId}')">
      ▶ LAAD HOLODECK PROGRAMMA
    </button>
  `;

  document.getElementById("modal").classList.add("active");
}

function activateHolodeck(programId) {
  const program = programData[programId];

  // Update status bar
  document.querySelector(".status-value.available").textContent = "IN GEBRUIK";
  document
    .querySelector(".status-value.available")
    .classList.remove("available");
  document.querySelector(".status-value.available").style.color = "#fbbf24";
  document.querySelector(".status-value.available").style.textShadow =
    "0 0 8px #fbbf24";

  document.querySelectorAll(".status-value")[1].textContent = program.code;

  // Show loading animation
  const loadingSteps = [
    "INITIALISEREN HOLOGRAFISCHE PROJECTOREN...",
    "LADEN PROGRAMMA DATA...",
    "CALIBREREN RUIMTELIJKE COÖRDINATEN...",
    "ACTIVEREN SENSORISCHE SYSTEMEN...",
    "HOLODECK GEREED!",
  ];

  let currentStep = 0;
  const loadingInterval = setInterval(() => {
    if (currentStep < loadingSteps.length) {
      console.log(loadingSteps[currentStep]);
      currentStep++;
    } else {
      clearInterval(loadingInterval);
      alert(
        `🌐 HOLODECK GEACTIVEERD\n\n${program.title}\n\nJe kunt nu naar Holodeck Kamer 1 gaan.\n\nHet programma is geladen en wacht op je!\n\n⚠️ Vergeet niet de veiligheidsprotocollen te lezen voordat je begint.`
      );

      // Reset status after 3 seconds
      setTimeout(() => {
        document.querySelector(".status-value").textContent = "BESCHIKBAAR";
        document.querySelector(".status-value").classList.add("available");
        document.querySelector(".status-value").style.color = "#10b981";
        document.querySelector(".status-value").style.textShadow =
          "0 0 8px #10b981";
        document.querySelectorAll(".status-value")[1].textContent =
          program.code;
      }, 3000);

      closeModal();
    }
  }, 600);
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
}

// Close modal when clicking outside
document.addEventListener("click", function (event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

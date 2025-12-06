function showCategory(category) {
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => section.classList.remove("active"));

  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));

  document.getElementById(category).classList.add("active");
  event.target.classList.add("active");
}

const movieData = {
  interstellar: {
    title: "Interstellar",
    director: "Christopher Nolan",
    year: "2014",
    duration: "2h 49m",
    rating: "⭐ 8.6",
    genre: "Sci-Fi, Drama",
    description:
      "Een team van ontdekkingsreizigers reist door een wormgat in de ruimte in een poging om de overleving van de mensheid te verzekeren. Cooper, een voormalige NASA-piloot, moet zijn gezin achterlaten om een missie te leiden die de toekomst van de mensheid kan redden terwijl de tijd op aarde razendsnel voorbij gaat.",
    cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
  },
  martian: {
    title: "The Martian",
    director: "Ridley Scott",
    year: "2015",
    duration: "2h 24m",
    rating: "⭐ 8.0",
    genre: "Sci-Fi, Adventure",
    description:
      "Een astronaut wordt per ongeluk achtergelaten op Mars en moet zijn vindingrijkheid gebruiken om te overleven en een signaal naar de aarde te sturen dat hij nog leeft. Mark Watney gebruikt zijn botanische kennis en humor om te overleven in de meest vijandige omgeving die mensen kennen.",
    cast: "Matt Damon, Jessica Chastain, Kristen Wiig",
  },
  gravity: {
    title: "Gravity",
    director: "Alfonso Cuarón",
    year: "2013",
    duration: "1h 31m",
    rating: "⭐ 7.7",
    genre: "Sci-Fi, Thriller",
    description:
      "Twee astronauten werken samen om te overleven na een ongeluk dat hen gestrand achterlaat in de ruimte. Dr. Ryan Stone en Matt Kowalski moeten vechten tegen de tijd en de elementen om terug te keren naar de aarde terwijl hun zuurstof opraakt.",
    cast: "Sandra Bullock, George Clooney",
  },
  2001: {
    title: "2001: A Space Odyssey",
    director: "Stanley Kubrick",
    year: "1968",
    duration: "2h 29m",
    rating: "⭐ 8.3",
    genre: "Sci-Fi, Mystery",
    description:
      "Een reis van ontdekking die de mensheid naar Jupiter leidt met de geavanceerde AI HAL 9000. Dit meesterwerk verkent thema's van evolutie, kunstmatige intelligentie en de plaats van de mensheid in het universum door middel van adembenemende visuals en een iconische soundtrack.",
    cast: "Keir Dullea, Gary Lockwood, Douglas Rain",
  },
  arrival: {
    title: "Arrival",
    director: "Denis Villeneuve",
    year: "2016",
    duration: "1h 56m",
    rating: "⭐ 7.9",
    genre: "Sci-Fi, Drama",
    description:
      "Een linguïst werkt met het leger om te communiceren met buitenaardse wezens die op aarde zijn gearriveerd. Dr. Louise Banks ontdekt dat hun taal haar perceptie van tijd verandert, wat leidt tot een diepgaande persoonlijke en wereldwijde transformatie.",
    cast: "Amy Adams, Jeremy Renner, Forest Whitaker",
  },
  bladerunner: {
    title: "Blade Runner 2049",
    director: "Denis Villeneuve",
    year: "2017",
    duration: "2h 44m",
    rating: "⭐ 8.0",
    genre: "Sci-Fi, Thriller",
    description:
      "Een jonge blade runner ontdekt een lang begraven geheim dat chaos kan veroorzaken. Officer K moet Rick Deckard opsporen, een voormalige blade runner die al 30 jaar vermist is, in een visueel verbluffende dystopische toekomst.",
    cast: "Ryan Gosling, Harrison Ford, Ana de Armas",
  },
  apollo13: {
    title: "Apollo 13",
    director: "Ron Howard",
    year: "1995",
    duration: "2h 20m",
    rating: "⭐ 7.7",
    genre: "Drama, History",
    description:
      "Het waargebeurde verhaal van de NASA's Apollo 13 missie naar de maan die verandert in een strijd om te overleven. 'Houston, we hebben een probleem' wordt een iconische zin terwijl het team op aarde en de astronauten in de ruimte samenwerken voor een miraculeuze redding.",
    cast: "Tom Hanks, Bill Paxton, Kevin Bacon",
  },
  contact: {
    title: "Contact",
    director: "Robert Zemeckis",
    year: "1997",
    duration: "2h 30m",
    rating: "⭐ 7.5",
    genre: "Sci-Fi, Drama",
    description:
      "Een wetenschapper ontvangt een radiosignaal van een buitenaardse beschaving en wordt gekozen om eerste contact te maken. Dr. Ellie Arroway's levenslange zoektocht naar bewijs van buitenaards leven culmineert in een reis die wetenschap, geloof en de menselijke ervaring verkent.",
    cast: "Jodie Foster, Matthew McConaughey, Tom Skerritt",
  },
};

const musicData = {
  ambient: {
    title: "Space Ambient",
    subtitle: "Cosmic Soundscapes",
    tracks: 45,
    duration: "3h 12m",
    description:
      "Drijf weg op etherische soundscapes en kosmische texturen. Perfect voor meditatie en diepe ontspanning tijdens je reis door de ruimte.",
    trackList: [
      { name: "Nebula Dreams", duration: "6:24" },
      { name: "Stellar Winds", duration: "8:15" },
      { name: "Cosmic Silence", duration: "7:42" },
      { name: "Void Meditation", duration: "9:18" },
      { name: "Aurora Borealis", duration: "5:33" },
      { name: "Deep Space Echo", duration: "7:56" },
      { name: "Saturn's Rings", duration: "6:48" },
      { name: "Gravity Waves", duration: "8:27" },
    ],
  },
  electronic: {
    title: "Electronic Dreams",
    subtitle: "Synthwave Collection",
    tracks: 32,
    duration: "2h 18m",
    description:
      "Retro-futuristische synthwave beats die je terugnemen naar de jaren '80 terwijl je vooruit reist naar Mars. Neon-drenched melodies en pulserende basslines.",
    trackList: [
      { name: "Neon Highway", duration: "4:32" },
      { name: "Cyber Runner", duration: "3:48" },
      { name: "Retro Future", duration: "4:15" },
      { name: "Digital Sunset", duration: "5:02" },
      { name: "Chrome Dreams", duration: "4:26" },
      { name: "Arcade Memories", duration: "3:54" },
      { name: "Synth City", duration: "4:41" },
      { name: "Midnight Drive", duration: "5:18" },
    ],
  },
  classical: {
    title: "Classical in Space",
    subtitle: "Orchestral Masterpieces",
    tracks: 28,
    duration: "2h 45m",
    description:
      "Tijdloze orkestrale meesterwerken perfect voor contemplatie tijdens je kosmische reis. Van Beethoven tot Holst's The Planets.",
    trackList: [
      { name: "Jupiter - The Planets", duration: "7:52" },
      { name: "Moonlight Sonata", duration: "5:24" },
      { name: "Clair de Lune", duration: "4:48" },
      { name: "The Blue Danube", duration: "9:12" },
      { name: "Mars - The Planets", duration: "7:18" },
      { name: "Neptune - The Planets", duration: "8:06" },
      { name: "Symphony No. 9", duration: "8:42" },
      { name: "Also Sprach Zarathustra", duration: "8:36" },
    ],
  },
  jazz: {
    title: "Galactic Jazz",
    subtitle: "Smooth & Cosmic",
    tracks: 38,
    duration: "2h 56m",
    description:
      "Soepele jazz-interpretaties met een kosmische twist. Saxophone melodies zweven door de ruimte zoals stardust door het universum.",
    trackList: [
      { name: "Stardust Serenade", duration: "5:12" },
      { name: "Lunar Lounge", duration: "4:48" },
      { name: "Cosmic Cafe", duration: "5:36" },
      { name: "Interstellar Blues", duration: "6:24" },
      { name: "Orbit Swing", duration: "4:18" },
      { name: "Zero Gravity Groove", duration: "5:42" },
      { name: "Nebula Night", duration: "6:06" },
      { name: "Solar Sax", duration: "5:54" },
    ],
  },
  beats: {
    title: "Interstellar Beats",
    subtitle: "Electronic & Dance",
    tracks: 52,
    duration: "3h 34m",
    description:
      "Energieke electronic en dance tracks om je energie level hoog te houden. Perfect voor workouts in de zero-gravity fitness ruimte.",
    trackList: [
      { name: "Hyperdrive", duration: "3:42" },
      { name: "Warp Speed", duration: "4:15" },
      { name: "Pulse Drive", duration: "3:58" },
      { name: "Quantum Leap", duration: "4:24" },
      { name: "Light Speed", duration: "3:36" },
      { name: "Plasma Flow", duration: "4:48" },
      { name: "Energy Core", duration: "3:54" },
      { name: "Reactor Beat", duration: "4:12" },
    ],
  },
  meditation: {
    title: "Meditation Mix",
    subtitle: "Relaxation & Calm",
    tracks: 24,
    duration: "1h 48m",
    description:
      "Rustgevende meditatie muziek voor diepe ontspanning. Laat de stress van de reis achter je en vind inner peace terwijl je door de kosmos zweeft.",
    trackList: [
      { name: "Breath of Stars", duration: "6:12" },
      { name: "Cosmic Peace", duration: "7:24" },
      { name: "Silent Universe", duration: "8:06" },
      { name: "Zen Orbit", duration: "6:48" },
      { name: "Tranquil Void", duration: "7:36" },
      { name: "Mindful Journey", duration: "6:54" },
      { name: "Serenity Flow", duration: "7:18" },
      { name: "Inner Space", duration: "8:24" },
    ],
  },
  lofi: {
    title: "Lo-Fi Space Vibes",
    subtitle: "Chill & Study",
    tracks: 41,
    duration: "2h 35m",
    description:
      "Relaxte lo-fi beats voor studeren, werken of gewoon chillen. Jazzy samples gecombineerd met ambient space sounds voor de perfecte focus muziek.",
    trackList: [
      { name: "Study in Orbit", duration: "3:24" },
      { name: "Cosmic Coffee", duration: "3:48" },
      { name: "Chill Capsule", duration: "4:12" },
      { name: "Space Station Beats", duration: "3:36" },
      { name: "Homework in Zero-G", duration: "4:24" },
      { name: "Relax & Float", duration: "3:54" },
      { name: "Asteroid Belt Vibes", duration: "4:06" },
      { name: "Galaxy Study Session", duration: "3:42" },
    ],
  },
  epic: {
    title: "Epic Soundtracks",
    subtitle: "Cinematic Scores",
    tracks: 36,
    duration: "3h 02m",
    description:
      "Epische filmscores die je reis door de ruimte transformeren in een cinematische ervaring. Voel je een held in je eigen space odyssey.",
    trackList: [
      { name: "Journey to Mars", duration: "6:42" },
      { name: "Beyond the Stars", duration: "7:24" },
      { name: "Brave New Worlds", duration: "6:18" },
      { name: "Heroes of Tomorrow", duration: "5:54" },
      { name: "The Final Frontier", duration: "8:12" },
      { name: "Conquest of Space", duration: "6:36" },
      { name: "Starborn Legends", duration: "7:48" },
      { name: "Destiny Awaits", duration: "6:24" },
    ],
  },
};

const bookData = {
  expanse: {
    title: "The Expanse Series",
    author: "James S.A. Corey",
    books: "9 boeken",
    genre: "Space Opera, Sci-Fi",
    year: "2011-2021",
    description:
      "Een epische space opera serie die zich afspeelt in een toekomst waar de mensheid het zonnestelsel heeft gekoloniseerd. Volg de crew van de Rocinante terwijl ze verwikkeld raken in een conspiracy die het lot van de mensheid bepaalt. De serie combineert realistische ruimtevaart met politieke intriges en karakterontwikkeling.",
    books_list:
      "Leviathan Wakes, Caliban's War, Abaddon's Gate, Cibola Burn, Nemesis Games, Babylon's Ashes, Persepolis Rising, Tiamat's Wrath, Leviathan Falls",
  },
  dune: {
    title: "Dune",
    author: "Frank Herbert",
    pages: "688 pagina's",
    genre: "Sci-Fi Epic",
    year: "1965",
    description:
      "Op de woestijnplaneet Arrakis, de enige bron van het kostbare spice melange, ontvouwt zich een episch verhaal van politiek, religie, en ecologie. Volg Paul Atreides terwijl hij transformeert van een jonge edelman tot de messianische figuur Muad'Dib. Een meesterwerk dat generaties sci-fi auteurs heeft beïnvloed.",
    themes: "Ecologie, politiek, religie, macht, voorbestemming",
  },
  foundation: {
    title: "Foundation",
    author: "Isaac Asimov",
    pages: "255 pagina's",
    genre: "Classic Sci-Fi",
    year: "1951",
    description:
      "Het Galactisch Rijk staat op instorten. Psychohistoricus Hari Seldon voorspelt 30,000 jaar van barbarij, maar heeft een plan om dit te verkorten tot slechts 1,000 jaar door twee Foundations op te richten. Een tijdloos verhaal over de cyclus van beschavingen en de kracht van kennis.",
    themes: "Psychohistorie, val van imperiums, wetenschappelijke methode",
  },
  ender: {
    title: "Ender's Game",
    author: "Orson Scott Card",
    pages: "324 pagina's",
    genre: "Military Sci-Fi",
    year: "1985",
    description:
      "Andrew 'Ender' Wiggin, een briljant jong strategisch genie, wordt getraind in Battle School om de mensheid te verdedigen tegen een buitenaardse bedreiging. Maar de werkelijkheid van zijn training is complexer dan het lijkt. Een verhaal over leiderschap, moraliteit en de kosten van oorlog.",
    themes: "Kindersoldaten, militaire ethiek, leiderschap, empathie",
  },
  neuromancer: {
    title: "Neuromancer",
    author: "William Gibson",
    pages: "271 pagina's",
    genre: "Cyberpunk",
    year: "1984",
    description:
      "Case, een gevallen console cowboy, krijgt een laatste kans op een grote hack in de matrix. Deze baanbrekende roman definieerde het cyberpunk genre met zijn visie op cyberspace, AI, en de vervaging tussen mens en machine. Een neon-verlichte noir thriller in een dystopische toekomst.",
    themes: "Cyberspace, kunstmatige intelligentie, transhumanisme",
  },
  hitchhiker: {
    title: "The Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    pages: "193 pagina's",
    genre: "Sci-Fi Comedy",
    year: "1979",
    description:
      "Arthur Dent's huis staat op het punt gesloopt te worden. Helaas geldt hetzelfde voor de aarde - om plaats te maken voor een intergalactische snelweg. Gewapend met alleen een handdoek en The Hitchhiker's Guide, begint Arthur aan het meest absurde avontuur door het universum. Don't Panic!",
    themes:
      "Absurdisme, satire, het antwoord op leven, universum en alles (42)",
  },
  redmars: {
    title: "Red Mars",
    author: "Kim Stanley Robinson",
    pages: "572 pagina's",
    genre: "Hard Sci-Fi",
    year: "1992",
    description:
      "De eerste 100 kolonisten arriveren op Mars met de missie om de rode planeet te terraformen. Dit wetenschappelijk accurate epos volgt de politieke, wetenschappelijke en persoonlijke conflicten terwijl Mars langzaam transformeert. Deel 1 van de Mars Trilogy is must-read tijdens je reis naar de rode planeet.",
    themes: "Terraforming, kolonisatie, wetenschappelijke ethiek",
  },
  threebody: {
    title: "The Three-Body Problem",
    author: "Liu Cixin",
    pages: "400 pagina's",
    genre: "Hard Sci-Fi",
    year: "2008",
    description:
      "Tijdens China's Cultural Revolution maakt een geheim militair project contact met aliens op een stervend planeet met drie zonnen. Dit Hugo Award winnende meesterwerk combineert wetenschappelijke precisie met filosofische vragen over de mensheid's plaats in het universum en de Fermi paradox.",
    themes:
      "First contact, Fermi paradox, wetenschapsgeschiedenis, kosmische horror",
  },
};

function showMovieInfo(movieId) {
  const movie = movieData[movieId];
  const popupBody = document.getElementById("popup-body");

  popupBody.innerHTML = `
        <h2 class="popup-title">${movie.title}</h2>
        <p class="popup-subtitle">Geregisseerd door ${movie.director}</p>
        
        <div class="popup-info">
            <span class="info-badge">${movie.year}</span>
            <span class="info-badge">${movie.duration}</span>
            <span class="info-badge">${movie.rating}</span>
            <span class="info-badge">${movie.genre}</span>
        </div>
        
        <p class="popup-description">${movie.description}</p>
        
        <div class="popup-info">
            <span style="color: #33afff; font-family: Orbitron;">Cast:</span>
            <span style="opacity: 0.85;">${movie.cast}</span>
        </div>
        
        <button class="play-button" onclick="alert('Nu afspelen: ${movie.title}')">▶ Speel Film Af</button>
    `;

  document.getElementById("popup").classList.add("active");
}

function showMusicInfo(musicId) {
  const music = musicData[musicId];
  const popupBody = document.getElementById("popup-body");

  let trackListHTML = '<ul class="track-list">';
  music.trackList.forEach((track, index) => {
    trackListHTML += `
            <li>
                <div>
                    <span class="track-number">${(index + 1)
                      .toString()
                      .padStart(2, "0")}</span>
                    <span>${track.name}</span>
                </div>
                <span class="track-duration">${track.duration}</span>
            </li>
        `;
  });
  trackListHTML += "</ul>";

  popupBody.innerHTML = `
        <h2 class="popup-title">${music.title}</h2>
        <p class="popup-subtitle">${music.subtitle}</p>
        
        <div class="popup-info">
            <span class="info-badge">${music.tracks} tracks</span>
            <span class="info-badge">${music.duration}</span>
        </div>
        
        <p class="popup-description">${music.description}</p>
        
        <h3 style="color: #33afff; font-family: Orbitron; margin: 20px 0 15px 0;">Track List</h3>
        ${trackListHTML}
        
        <button class="play-button" onclick="alert('Nu afspelen: ${music.title}')">▶ Speel Playlist Af</button>
    `;

  document.getElementById("popup").classList.add("active");
}

function showBookInfo(bookId) {
  const book = bookData[bookId];
  const popupBody = document.getElementById("popup-body");

  const extraInfo = book.books_list
    ? `<p style="opacity: 0.85; line-height: 1.8; margin-top: 15px;"><strong style="color: #33afff;">Boeken in serie:</strong><br>${book.books_list}</p>`
    : "";

  const themeInfo = book.themes
    ? `<div style="margin-top: 20px;">
            <span style="color: #33afff; font-family: Orbitron;">Thema's:</span>
            <span style="opacity: 0.85;"> ${book.themes}</span>
           </div>`
    : "";

  popupBody.innerHTML = `
        <h2 class="popup-title">${book.title}</h2>
        <p class="popup-subtitle">door ${book.author}</p>
        
        <div class="popup-info">
            <span class="info-badge">${book.year}</span>
            <span class="info-badge">${book.pages || book.books}</span>
            <span class="info-badge">${book.genre}</span>
        </div>
        
        <p class="popup-description">${book.description}</p>
        
        ${themeInfo}
        ${extraInfo}
        
        <button class="play-button" onclick="alert('Nu lezen: ${
          book.title
        }')">📖 Start Lezen</button>
    `;

  document.getElementById("popup").classList.add("active");
}

function closePopup() {
  document.getElementById("popup").classList.remove("active");
}

document.addEventListener("click", function (event) {
  const popup = document.getElementById("popup");
  if (event.target === popup) {
    closePopup();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closePopup();
  }
});

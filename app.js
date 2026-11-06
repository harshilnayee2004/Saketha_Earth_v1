// ==========================================================================
// Saketha Earth Luxury Estates — Application Controller
// Vanta.js Clouds + React Bits Micro-Animations + iOS Foggy Glass UI
// ==========================================================================

let vantaEffect = null;
let currentSkyMode = "day"; // "day" or "sunset"

// 1. Architectural Models Data (Inspired by Image 1)
const ARCH_MODELS = [
  {
    name: "Villa Type C — Comfort Horizon",
    area: "340 M²",
    areaFt: "(3,660 SQ.FT)",
    svg: `<polygon points="20,40 50,22 80,40 50,58" stroke="rgba(250,248,245,0.7)"></polygon>
          <polygon points="50,22 80,40 80,60 50,42" stroke="#DFC9A6"></polygon>
          <polygon points="20,40 50,22 50,42 20,60" stroke="rgba(250,248,245,0.5)"></polygon>
          <polyline points="20,60 50,42 80,60" stroke="#CFB384"></polyline>
          <line x1="50" y1="42" x2="50" y2="22" stroke="#FAF8F5" stroke-dasharray="2 2"></line>`
  },
  {
    name: "Sky Mansion B — Cantilever Glass",
    area: "480 M²",
    areaFt: "(5,165 SQ.FT)",
    svg: `<rect x="25" y="15" width="50" height="40" stroke="#DFC9A6" stroke-width="1.2"></rect>
          <line x1="15" y1="35" x2="85" y2="35" stroke="rgba(250,248,245,0.8)" stroke-width="1.5"></line>
          <polyline points="25,15 15,35 85,35 75,15" stroke="rgba(250,248,245,0.6)"></polyline>
          <rect x="35" y="35" width="30" height="20" stroke="rgba(223,201,166,0.4)"></rect>`
  },
  {
    name: "Pavilion A — Modern Courtyard",
    area: "220 M²",
    areaFt: "(2,368 SQ.FT)",
    svg: `<polygon points="30,50 50,20 70,50" stroke="#DFC9A6"></polygon>
          <rect x="20" y="35" width="60" height="25" stroke="rgba(250,248,245,0.6)"></rect>
          <line x1="50" y1="20" x2="50" y2="60" stroke="rgba(223,201,166,0.4)" stroke-dasharray="2 2"></line>`
  },
  {
    name: "Presidential Penthouse D — 360° Deck",
    area: "650 M²",
    areaFt: "(7,000 SQ.FT)",
    svg: `<polygon points="15,45 50,15 85,45 50,65" stroke="#DFC9A6" stroke-width="1.5"></polygon>
          <circle cx="50" cy="40" r="14" stroke="rgba(250,248,245,0.8)"></circle>
          <line x1="15" y1="45" x2="85" y2="45" stroke="rgba(223,201,166,0.5)"></line>`
  }
];

let currentModelIndex = 0;

function updateModelDisplay() {
  const model = ARCH_MODELS[currentModelIndex];
  document.getElementById("model-name-display").textContent = model.name;
  document.getElementById("model-area-display").innerHTML = `${model.area} <span class="text-xs font-mono-tech text-amber-300 font-normal">${model.areaFt}</span>`;
  document.getElementById("wireframe-svg").innerHTML = model.svg;
}

function nextModel() {
  currentModelIndex = (currentModelIndex + 1) % ARCH_MODELS.length;
  updateModelDisplay();
}

function prevModel() {
  currentModelIndex = (currentModelIndex - 1 + ARCH_MODELS.length) % ARCH_MODELS.length;
  updateModelDisplay();
}

// 2. Plot Inventory Model (Cadastral Map)
const PLOTS_DATA = [
  // Sector A - Row 1 (North 60-Ft Boulevard frontage)
  { id: 101, facing: "North", dim: "36 × 50 ft", dimW: "36'", dimH: "50'", sqyd: 200, rate: 21500, status: "available", road: "60ft Main Boulevard", x: 42, y: 100, w: 112, h: 96 },
  { id: 102, facing: "North", dim: "36 × 50 ft", dimW: "36'", dimH: "50'", sqyd: 200, rate: 21500, status: "sold", road: "60ft Main Boulevard", x: 160, y: 100, w: 112, h: 96 },
  { id: 103, facing: "North-East", dim: "45 × 60 ft", dimW: "45'", dimH: "60'", sqyd: 300, rate: 24000, status: "premium", road: "60ft Boulevard Corner", x: 278, y: 100, w: 118, h: 96 },
  { id: 104, facing: "North", dim: "40 × 60 ft", dimW: "40'", dimH: "60'", sqyd: 267, rate: 22000, status: "available", road: "60ft Main Boulevard", x: 402, y: 100, w: 112, h: 96 },
  { id: 105, facing: "North", dim: "40 × 60 ft", dimW: "40'", dimH: "60'", sqyd: 267, rate: 22000, status: "reserved", road: "60ft Main Boulevard", x: 520, y: 100, w: 112, h: 96 },
  { id: 106, facing: "North-West", dim: "50 × 65 ft", dimW: "50'", dimH: "65'", sqyd: 361, rate: 24500, status: "premium", road: "60ft Boulevard Corner", x: 638, y: 100, w: 124, h: 96 },

  // Sector A - Row 2 (East & Avenue frontage)
  { id: 107, facing: "East", dim: "40 × 55 ft", dimW: "40'", dimH: "55'", sqyd: 244, rate: 22500, status: "available", road: "40ft Internal Avenue", x: 42, y: 202, w: 112, h: 96 },
  { id: 108, facing: "East", dim: "45 × 60 ft", dimW: "45'", dimH: "60'", sqyd: 300, rate: 22500, status: "available", road: "40ft Internal Avenue", x: 160, y: 202, w: 112, h: 96 },
  { id: 109, facing: "East", dim: "45 × 60 ft", dimW: "45'", dimH: "60'", sqyd: 300, rate: 22500, status: "sold", road: "40ft Internal Avenue", x: 278, y: 202, w: 118, h: 96 },
  { id: 110, facing: "East", dim: "40 × 60 ft", dimW: "40'", dimH: "60'", sqyd: 267, rate: 22500, status: "available", road: "40ft Internal Avenue", x: 402, y: 202, w: 112, h: 96 },
  { id: 111, facing: "East", dim: "40 × 60 ft", dimW: "40'", dimH: "60'", sqyd: 267, rate: 22500, status: "reserved", road: "40ft Internal Avenue", x: 520, y: 202, w: 112, h: 96 },
  { id: 112, facing: "South-East", dim: "50 × 70 ft", dimW: "50'", dimH: "70'", sqyd: 388, rate: 23500, status: "available", road: "40ft Internal Avenue Corner", x: 638, y: 202, w: 124, h: 96 },

  // Sector B - Row 3 (Central Avenue frontage)
  { id: 113, facing: "West", dim: "36 × 50 ft", dimW: "36'", dimH: "50'", sqyd: 200, rate: 21000, status: "available", road: "40ft Central Avenue", x: 42, y: 354, w: 112, h: 96 },
  { id: 114, facing: "West", dim: "36 × 50 ft", dimW: "36'", dimH: "50'", sqyd: 200, rate: 21000, status: "sold", road: "40ft Central Avenue", x: 160, y: 354, w: 112, h: 96 },
  { id: 115, facing: "West", dim: "40 × 55 ft", dimW: "40'", dimH: "55'", sqyd: 244, rate: 21500, status: "available", road: "40ft Central Avenue", x: 278, y: 354, w: 118, h: 96 },
  { id: 116, facing: "South-West", dim: "55 × 70 ft", dimW: "55'", dimH: "70'", sqyd: 427, rate: 23000, status: "premium", road: "40ft Central Avenue Corner", x: 402, y: 354, w: 112, h: 96 },
  { id: 117, facing: "East", dim: "40 × 60 ft", dimW: "40'", dimH: "60'", sqyd: 267, rate: 22500, status: "available", road: "40ft Central Avenue", x: 520, y: 354, w: 112, h: 96 },
  { id: 118, facing: "East", dim: "40 × 60 ft", dimW: "40'", dimH: "60'", sqyd: 267, rate: 22500, status: "available", road: "40ft Central Avenue", x: 638, y: 354, w: 124, h: 96 },

  // Sector B - Row 4 (South Avenue frontage)
  { id: 119, facing: "North", dim: "45 × 60 ft", dimW: "45'", dimH: "60'", sqyd: 300, rate: 22000, status: "sold", road: "40ft South Avenue", x: 42, y: 456, w: 112, h: 96 },
  { id: 120, facing: "North", dim: "45 × 60 ft", dimW: "45'", dimH: "60'", sqyd: 300, rate: 22000, status: "available", road: "40ft South Avenue", x: 160, y: 456, w: 112, h: 96 },
  { id: 121, facing: "North", dim: "50 × 65 ft", dimW: "50'", dimH: "65'", sqyd: 361, rate: 22500, status: "reserved", road: "40ft South Avenue", x: 278, y: 456, w: 118, h: 96 },
  { id: 122, facing: "East", dim: "40 × 60 ft", dimW: "40'", dimH: "60'", sqyd: 267, rate: 22500, status: "available", road: "40ft South Avenue", x: 402, y: 456, w: 112, h: 96 },
  { id: 123, facing: "East", dim: "40 × 60 ft", dimW: "40'", dimH: "60'", sqyd: 267, rate: 22500, status: "available", road: "40ft South Avenue", x: 520, y: 456, w: 112, h: 96 },
  { id: 124, facing: "North-East", dim: "60 × 80 ft", dimW: "60'", dimH: "80'", sqyd: 533, rate: 25000, status: "premium", road: "40ft South Boulevard Corner", x: 638, y: 456, w: 124, h: 96 }
];

let selectedPlot = PLOTS_DATA[7];

// 3. Project Dossier Data
const PROJECTS_INFO = {
  presente: {
    title: "Saketha Présénte",
    category: "Sky Mansions & Penthouses",
    tagline: "Ultra-Luxury Waterfront Sky Residences in GIFT City Core",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85",
    rera: "PR/GJ/GANDHINAGAR/GIFT/RAA10091",
    location: "GIFT City Waterfront Promenade",
    totalArea: "Riverfront Iconic Tower",
    plotsCount: "Exclusive 64 Sky Mansions",
    sizes: "4,200 to 7,500 Sq.Ft",
    priceRange: "₹3.2 Crore — ₹8.5 Crore",
    specifications: [
      "Panoramic Sabarmati Riverfront & GIFT Financial Center View",
      "Private High-Speed Destination Elevators Opening to Foyer",
      "Double-Height Glass Cantilevers with Private Plunge Pools",
      "IGBC Platinum Green Building Certified Architecture",
      "Concierge Valet, Rooftop Helipad & Private Cigar Lounge"
    ]
  },
  meadows: {
    title: "Saketha Earth Meadows",
    category: "Residential Gated Estate",
    tagline: "45-Acre Master-Planned Sanctuary in the Greenfield Highway Corridor",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    rera: "P02400004921",
    location: "Greenfield Highway Corridor • 15 Mins from Outer Ring Road",
    totalArea: "45 Acres",
    plotsCount: "340 Gated Parcels",
    sizes: "180 to 450 Sq. Yards",
    priceRange: "₹38 Lakhs — ₹1.1 Crore",
    specifications: [
      "100% DTCP & RERA Sanctioned Master Layout",
      "60-Foot Main Boulevard & 40-Foot Internal Avenue Roadways",
      "Concealed Armored Subterranean Electrical Network",
      "15,000 Sq.Ft Private Members Clubhouse with Heated Pool",
      "Bank Loan Pre-Approved by SBI, HDFC & ICICI (up to 75%)"
    ]
  },
  serenity: {
    title: "Saketha Farmland — Soil to Soul",
    category: "Managed Organic Orchards",
    tagline: "60-Acre Managed Sandalwood, Neem & Organic Mango Plantation Retreat",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85",
    rera: "Clear Title / Agricultural Passbook 1B",
    location: "Scenic Foothills • Nature Reserve Frontage",
    totalArea: "60 Acres",
    plotsCount: "120 Eco Farm Units",
    sizes: "605 to 1,210 Sq. Yards",
    priceRange: "₹39 Lakhs — ₹78 Lakhs",
    specifications: [
      "10-Year Agronomic Care by Certified Agricultural Scientists",
      "High-Yield Sandalwood, Malabar Neem & Mango Cultivations",
      "Country Sanctuary Clubhouse with Overnight Guest Suites",
      "Subterranean Drip Irrigation & Continuous Pressurized Supply",
      "Tax-Free Agricultural Timber Harvest Revenue Rights"
    ]
  }
};

// ==========================================================================
// 4. Vanta.js Clouds Engine Initialization
// ==========================================================================
function initVantaClouds() {
  if (window.VANTA && window.VANTA.CLOUDS) {
    try {
      const targetEl = document.getElementById("vanta-clouds-contact") || document.getElementById("vanta-clouds");
      if (!targetEl) return;
      vantaEffect = window.VANTA.CLOUDS({
        el: targetEl,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        backgroundColor: 0xffffff,
        skyColor: 0x68b8d7,
        cloudColor: 0xadc1de,
        cloudShadowColor: 0x183550,
        sunColor: 0xff9919,
        sunGlareColor: 0xff6633,
        sunlightColor: 0xff9933,
        speed: 1.00
      });
    } catch (e) {
      console.warn("Vanta Clouds initialization note:", e);
    }
  }
}

function toggleSkyAtmosphere() {
  const label = document.getElementById("sky-mode-label");
  if (!vantaEffect) return;

  if (currentSkyMode === "day") {
    // Switch to Golden Sunset Mode
    vantaEffect.setOptions({
      backgroundColor: 0xffffff,
      skyColor: 0xe07a5f,
      cloudColor: 0xf4a261,
      cloudShadowColor: 0x264653,
      sunColor: 0xffb703,
      sunGlareColor: 0xfb8500,
      sunlightColor: 0xffd166,
      speed: 1.00
    });
    currentSkyMode = "sunset";
    if (label) label.textContent = "Golden Sunset";
  } else {
    // Switch back to Daytime Clouds
    vantaEffect.setOptions({
      backgroundColor: 0xffffff,
      skyColor: 0x68b8d7,
      cloudColor: 0xadc1de,
      cloudShadowColor: 0x183550,
      sunColor: 0xff9919,
      sunGlareColor: 0xff6633,
      sunlightColor: 0xff9933,
      speed: 1.00
    });
    currentSkyMode = "day";
    if (label) label.textContent = "Daylight Sky";
  }
}

// ==========================================================================
// 5. React Bits Animations Implementations (https://reactbits.dev)
// ==========================================================================

// A. React Bits SpotlightCard effect
function initSpotlightCards() {
  document.querySelectorAll(".spotlight-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}

// B. React Bits 3D Tilt Card effect
function initTiltCards() {
  document.querySelectorAll(".tilt-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });
}

// C. React Bits Magnet Button effect
function initMagnetButtons() {
  document.querySelectorAll(".magnet-btn").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0px, 0px)";
    });
  });
}

// ==========================================================================
// 6. Cadastral Master Layout & Architectural Blueprint Controller
// ==========================================================================
let currentCadFilter = "all";
let currentCadView = "blueprint";

function renderPlots() {
  renderCadSvgPlots();
  renderCadInventoryTable();
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function renderCadSvgPlots() {
  const svgLayer = document.getElementById("cad-plots-svg-layer");
  if (!svgLayer) return;

  svgLayer.innerHTML = "";

  PLOTS_DATA.forEach(plot => {
    const isSelected = selectedPlot && selectedPlot.id === plot.id;
    
    // Filter matching
    let isDimmed = false;
    if (currentCadFilter === "available" && plot.status !== "available") isDimmed = true;
    if (currentCadFilter === "premium" && plot.status !== "premium") isDimmed = true;
    if (currentCadFilter === "vaastu" && !(plot.facing.includes("North") || plot.facing.includes("East"))) isDimmed = true;

    // Colors according to status
    let fillColor = "rgba(16, 185, 129, 0.08)";
    let strokeColor = "rgba(52, 211, 153, 0.65)";
    let setbackStroke = "rgba(52, 211, 153, 0.35)";
    let strokeWidth = isSelected ? 2.5 : 1.2;

    if (plot.status === "sold") {
      fillColor = "rgba(17, 24, 39, 0.85)";
      strokeColor = "rgba(75, 85, 99, 0.5)";
      setbackStroke = "rgba(55, 65, 81, 0.3)";
    } else if (plot.status === "reserved") {
      fillColor = "rgba(180, 83, 9, 0.14)";
      strokeColor = "rgba(245, 158, 11, 0.75)";
      setbackStroke = "rgba(245, 158, 11, 0.35)";
    } else if (plot.status === "premium") {
      fillColor = "rgba(212, 175, 55, 0.16)";
      strokeColor = "rgba(212, 175, 55, 0.9)";
      setbackStroke = "rgba(212, 175, 55, 0.4)";
    }

    if (isSelected) {
      fillColor = "rgba(212, 175, 55, 0.28)";
      strokeColor = "#D4AF37";
      strokeWidth = 2.5;
    }

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", `cad-plot ${isSelected ? 'is-selected' : ''} ${isDimmed ? 'is-dimmed' : ''}`);
    g.setAttribute("data-id", plot.id);

    let innerHTML = `
      <!-- Main Parcel Geometry -->
      <rect class="plot-bg" x="${plot.x}" y="${plot.y}" width="${plot.w}" height="${plot.h}" rx="6" 
            fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
      
      <!-- Interior Architectural Setback Guideline -->
      <rect x="${plot.x + 6}" y="${plot.y + 6}" width="${plot.w - 12}" height="${plot.h - 12}" rx="3"
            fill="none" stroke="${setbackStroke}" stroke-dasharray="2.5 2" stroke-width="0.8" opacity="0.75" />
      
      <!-- Boundary Survey Dimensions (Civil CAD Style) -->
      <text x="${plot.x + plot.w / 2}" y="${plot.y + 14}" text-anchor="middle" class="cad-dim-text">${plot.dimW}</text>
      <text x="${plot.x + 12}" y="${plot.y + plot.h / 2}" text-anchor="middle" class="cad-dim-text" transform="rotate(-90, ${plot.x + 12}, ${plot.y + plot.h / 2})">${plot.dimH}</text>
      
      <!-- Survey Parcel Identification -->
      <text x="${plot.x + plot.w / 2}" y="${plot.y + plot.h / 2 - 4}" text-anchor="middle" class="cad-plot-num">#${plot.id}</text>
      <text x="${plot.x + plot.w / 2}" y="${plot.y + plot.h / 2 + 13}" text-anchor="middle" class="cad-plot-sqyd">${plot.sqyd} YD²</text>
      <text x="${plot.x + plot.w / 2}" y="${plot.y + plot.h / 2 + 25}" text-anchor="middle" class="cad-plot-facing">${plot.facing.toUpperCase()}</text>
    `;

    // Sold Stamp
    if (plot.status === "sold") {
      innerHTML += `
        <rect x="${plot.x + plot.w / 2 - 20}" y="${plot.y + plot.h / 2 - 18}" width="40" height="13" rx="2.5" fill="rgba(0,0,0,0.85)" stroke="#4b5563" stroke-width="0.7" />
        <text x="${plot.x + plot.w / 2}" y="${plot.y + plot.h / 2 - 8}" text-anchor="middle" font-family="'DM Mono', monospace" font-size="7.5" fill="#9ca3af" font-weight="bold" letter-spacing="1">SOLD</text>
      `;
    }

    // Active Golden CAD Crosshair / Corner Brackets
    if (isSelected) {
      innerHTML += `
        <g stroke="#D4AF37" stroke-width="2.5" fill="none">
          <path d="M ${plot.x - 2} ${plot.y + 8} L ${plot.x - 2} ${plot.y - 2} L ${plot.x + 8} ${plot.y - 2}" />
          <path d="M ${plot.x + plot.w - 8} ${plot.y - 2} L ${plot.x + plot.w + 2} ${plot.y - 2} L ${plot.x + plot.w + 2} ${plot.y + 8}" />
          <path d="M ${plot.x - 2} ${plot.y + plot.h - 8} L ${plot.x - 2} ${plot.y + plot.h + 2} L ${plot.x + 8} ${plot.y + plot.h + 2}" />
          <path d="M ${plot.x + plot.w - 8} ${plot.y + plot.h + 2} L ${plot.x + plot.w + 2} ${plot.y + plot.h + 2} L ${plot.x + plot.w + 2} ${plot.y + plot.h - 8}" />
        </g>
      `;
    }

    g.innerHTML = innerHTML;

    // Events
    if (plot.status !== "sold") {
      g.addEventListener("click", () => selectPlot(plot));
    }
    g.addEventListener("mouseenter", (e) => showCadTooltip(e, plot));
    g.addEventListener("mousemove", (e) => updateCadTooltipPos(e));
    g.addEventListener("mouseleave", hideCadTooltip);

    svgLayer.appendChild(g);
  });
}

function renderCadInventoryTable() {
  const tbody = document.getElementById("cad-inventory-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  PLOTS_DATA.forEach(plot => {
    const isSelected = selectedPlot && selectedPlot.id === plot.id;
    const tr = document.createElement("tr");
    tr.className = `border-b border-white/5 hover:bg-white/5 transition font-mono-tech text-xs ${isSelected ? 'bg-amber-400/10 border-amber-400/40' : ''}`;

    let statusPill = `<span class="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold bg-emerald-400/15 text-emerald-300 border border-emerald-400/30">Available</span>`;
    if (plot.status === "sold") {
      statusPill = `<span class="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold bg-gray-600/20 text-gray-400 border border-gray-600/30">Sold Out</span>`;
    } else if (plot.status === "reserved") {
      statusPill = `<span class="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30">Reserved</span>`;
    } else if (plot.status === "premium") {
      statusPill = `<span class="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold bg-amber-400/25 text-amber-300 border border-amber-400/50">Prime Corner</span>`;
    }

    const total = (plot.sqyd * plot.rate).toLocaleString('en-IN');

    tr.innerHTML = `
      <td class="py-3 px-4 text-white font-bold">#${plot.id}</td>
      <td class="py-3 px-4 text-gray-300">${plot.dim}</td>
      <td class="py-3 px-4 text-gray-300 flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>${plot.facing}</td>
      <td class="py-3 px-4 text-white font-semibold">${plot.sqyd} Sq.Yd <span class="text-gray-400 text-[10px]">(${plot.sqyd * 9} Sq.Ft)</span></td>
      <td class="py-3 px-4 text-gray-300">${plot.road}</td>
      <td class="py-3 px-4 text-gray-300">₹${plot.rate.toLocaleString('en-IN')}</td>
      <td class="py-3 px-4 text-amber-300 font-bold">₹${total}</td>
      <td class="py-3 px-4">${statusPill}</td>
      <td class="py-3 px-4 text-right">
        ${plot.status !== 'sold' ? `<button onclick="selectPlotById(${plot.id})" class="px-3 py-1.5 rounded-lg ios-glass-pill text-xs text-white hover:bg-white hover:text-black transition">Inspect</button>` : `<span class="text-gray-600 text-xs">Locked</span>`}
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function selectPlotById(plotId) {
  const p = PLOTS_DATA.find(item => item.id === plotId);
  if (p && p.status !== "sold") {
    selectPlot(p);
  }
}

function selectPlot(plot) {
  selectedPlot = plot;
  
  const plotIdEl = document.getElementById("panel-plot-id");
  if (!plotIdEl) return;
  plotIdEl.textContent = `Plot #${plot.id}`;
  
  const statusEl = document.getElementById("panel-plot-status");
  statusEl.textContent = plot.status.toUpperCase();
  if (plot.status === "available") {
    statusEl.className = "font-mono-tech text-[10px] uppercase tracking-wider px-3 py-1 rounded-full ios-glass-pill text-emerald-300 border border-emerald-400/40";
  } else if (plot.status === "premium") {
    statusEl.className = "font-mono-tech text-[10px] uppercase tracking-wider px-3 py-1 rounded-full ios-glass-pill text-amber-300 border border-amber-400/50";
  } else if (plot.status === "reserved") {
    statusEl.className = "font-mono-tech text-[10px] uppercase tracking-wider px-3 py-1 rounded-full ios-glass-pill text-amber-400 border border-amber-400/40";
  } else {
    statusEl.className = "font-mono-tech text-[10px] uppercase tracking-wider px-3 py-1 rounded-full ios-glass-pill text-gray-400 border border-gray-600/40";
  }
  
  document.getElementById("panel-plot-facing").textContent = `${plot.facing} (Vaastu Compliant)`;
  document.getElementById("panel-plot-dim").textContent = plot.dim;
  document.getElementById("panel-plot-sqyd").textContent = `${plot.sqyd} Sq. Yards (${plot.sqyd * 9} Sq.Ft)`;
  document.getElementById("panel-plot-rate").textContent = `₹${plot.rate.toLocaleString('en-IN')} / Sq.Yd`;
  document.getElementById("panel-plot-road").textContent = plot.road;

  const total = plot.sqyd * plot.rate;
  document.getElementById("panel-plot-total").textContent = `₹${total.toLocaleString('en-IN')}`;

  const actionBtn = document.getElementById("panel-plot-action");
  if (plot.status === "reserved") {
    actionBtn.textContent = `Join Waitlist on Parcel #${plot.id}`;
  } else {
    actionBtn.textContent = `Hold Parcel #${plot.id} for Review`;
  }

  const waMsg = encodeURIComponent(`Hello Saketha Earth Team, I am inquiring about Plot #${plot.id} (${plot.sqyd} Sq.Yd, ${plot.facing} Facing) in Saketha Earth Meadows. Kindly share the sanctioned cadastral blueprint.`);
  document.getElementById("panel-whatsapp-link").href = `https://wa.me/919876543210?text=${waMsg}`;

  renderPlots();
}

function showCadTooltip(e, plot) {
  const tooltip = document.getElementById("cad-plot-tooltip");
  if (!tooltip) return;

  const total = (plot.sqyd * plot.rate).toLocaleString('en-IN');
  let statusBadge = `<span class="text-emerald-400">Available</span>`;
  if (plot.status === "sold") statusBadge = `<span class="text-gray-400">Sold Out</span>`;
  if (plot.status === "reserved") statusBadge = `<span class="text-amber-400">Reserved</span>`;
  if (plot.status === "premium") statusBadge = `<span class="text-amber-300 font-bold">Prime Corner</span>`;

  tooltip.innerHTML = `
    <div class="flex items-center justify-between gap-3 pb-1 border-b border-white/10">
      <span class="font-bold text-white text-xs">Parcel #${plot.id}</span>
      ${statusBadge}
    </div>
    <div class="pt-1.5 space-y-0.5 text-[11px] text-gray-300">
      <p><span class="text-gray-400">Area:</span> <span class="text-white font-medium">${plot.sqyd} Sq.Yd (${plot.sqyd * 9} Sq.Ft)</span></p>
      <p><span class="text-gray-400">Dimensions:</span> ${plot.dim}</p>
      <p><span class="text-gray-400">Facing:</span> ${plot.facing}</p>
      <p class="pt-1 text-amber-300 font-bold">Total: ₹${total}</p>
    </div>
  `;

  tooltip.classList.remove("opacity-0");
  tooltip.classList.add("opacity-100");
  updateCadTooltipPos(e);
}

function updateCadTooltipPos(e) {
  const tooltip = document.getElementById("cad-plot-tooltip");
  const container = document.getElementById("cad-blueprint-view");
  if (!tooltip || !container) return;

  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left + 15;
  const y = e.clientY - rect.top - 10;

  tooltip.style.left = `${Math.min(x, rect.width - 200)}px`;
  tooltip.style.top = `${Math.max(10, Math.min(y, rect.height - 110))}px`;
}

function hideCadTooltip() {
  const tooltip = document.getElementById("cad-plot-tooltip");
  if (tooltip) {
    tooltip.classList.remove("opacity-100");
    tooltip.classList.add("opacity-0");
  }
}

function filterCadPlots(filterType) {
  currentCadFilter = filterType;

  // Update button classes
  document.querySelectorAll(".cad-filter-chip").forEach(btn => {
    btn.classList.remove("active", "bg-white", "text-black", "font-bold");
    btn.classList.add("text-gray-300", "bg-white/5");
  });

  const activeBtn = document.getElementById(`cad-filter-${filterType}`);
  if (activeBtn) {
    activeBtn.classList.add("active", "bg-white", "text-black", "font-bold");
    activeBtn.classList.remove("text-gray-300", "bg-white/5");
  }

  renderPlots();
}

function setCadViewMode(mode) {
  currentCadView = mode;
  const blueprintView = document.getElementById("cad-blueprint-view");
  const tableView = document.getElementById("cad-table-view");
  const btnBlueprint = document.getElementById("btn-view-blueprint");
  const btnTable = document.getElementById("btn-view-table");

  if (mode === "blueprint") {
    blueprintView.classList.remove("hidden");
    tableView.classList.add("hidden");
    btnBlueprint.className = "px-3.5 py-1.5 rounded-full bg-white text-black font-bold text-xs tracking-wider transition shadow";
    btnTable.className = "px-3.5 py-1.5 rounded-full text-gray-300 hover:text-white text-xs tracking-wider transition";
  } else {
    blueprintView.classList.add("hidden");
    tableView.classList.remove("hidden");
    btnTable.className = "px-3.5 py-1.5 rounded-full bg-white text-black font-bold text-xs tracking-wider transition shadow";
    btnBlueprint.className = "px-3.5 py-1.5 rounded-full text-gray-300 hover:text-white text-xs tracking-wider transition";
  }
}

function bookSelectedPlot() {
  if (!selectedPlot) return;
  openBrochureModal(`Parcel #${selectedPlot.id} (${selectedPlot.sqyd} Sq.Yds)`);
}

// 7. Filter Projects
function filterProjects(category) {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => {
    btn.classList.remove("active", "bg-white", "text-black", "font-bold");
    btn.classList.add("text-gray-300");
  });

  event.currentTarget.classList.add("active", "bg-white", "text-black", "font-bold");
  event.currentTarget.classList.remove("text-gray-300");

  const cards = document.querySelectorAll(".project-card");
  cards.forEach(card => {
    const cardCat = card.getAttribute("data-category");
    if (category === "all" || cardCat === category) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

// 8. Financial Modeling Yield Studio (ROI Calculator)
function calculateROI() {
  const size = parseInt(document.getElementById("calc-size").value) || 250;
  const rate = parseInt(document.getElementById("calc-rate").value) || 22000;
  const years = parseInt(document.getElementById("calc-years").value) || 5;
  const cagr = parseInt(document.getElementById("calc-cagr").value) || 18;

  document.getElementById("calc-size-display").textContent = `${size} Sq. Yds (${size * 9} Sq.Ft)`;
  document.getElementById("calc-rate-display").textContent = `₹${rate.toLocaleString('en-IN')} / Sq. Yd`;
  document.getElementById("calc-years-display").textContent = `${years} Years`;
  document.getElementById("calc-cagr-display").textContent = `${cagr}% p.a.`;

  const initialCost = size * rate;
  const futureValue = Math.round(initialCost * Math.pow(1 + (cagr / 100), years));
  const capitalGain = futureValue - initialCost;

  const loanPrincipal = initialCost * 0.70;
  const monthlyRate = 0.09 / 12;
  const months = 15 * 12;
  const emi = Math.round((loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));

  document.getElementById("calc-initial-cost").textContent = `₹${formatIndianCurrency(initialCost)}`;
  document.getElementById("calc-gain").textContent = `+₹${formatIndianCurrency(capitalGain)}`;
  document.getElementById("calc-future-value").textContent = `₹${formatIndianCurrency(futureValue)}`;
  document.getElementById("calc-emi").textContent = `EMI ~ ₹${emi.toLocaleString('en-IN')}/mo`;
}

function formatIndianCurrency(num) {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(2) + " Cr";
  } else if (num >= 100000) {
    return (num / 100000).toFixed(2) + " Lakhs";
  } else {
    return num.toLocaleString('en-IN');
  }
}

// 9. Modals Management
function openProjectDetail(key) {
  const project = PROJECTS_INFO[key];
  if (!project) return;

  const content = document.getElementById("modal-project-content");
  content.innerHTML = `
    <div>
      <div class="h-64 sm:h-80 rounded-2xl overflow-hidden mb-6 border border-white/20 bg-black/40">
        <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover">
      </div>

      <div class="space-y-6">
        <div>
          <span class="font-mono-tech text-[10px] uppercase tracking-widest text-amber-300">${project.category} • RERA: ${project.rera}</span>
          <h2 class="font-syne-brand text-3xl sm:text-4xl font-bold text-white mt-1">${project.title}</h2>
          <p class="font-mono-tech text-xs text-gray-300 mt-2">${project.location}</p>
        </div>

        <div class="border-y border-white/10 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono-tech text-xs">
          <div>
            <span class="text-[10px] text-gray-400 uppercase block">Total Area</span>
            <span class="text-white font-bold">${project.totalArea}</span>
          </div>
          <div>
            <span class="text-[10px] text-gray-400 uppercase block">Units / Inventory</span>
            <span class="text-white font-bold">${project.plotsCount}</span>
          </div>
          <div>
            <span class="text-[10px] text-gray-400 uppercase block">Sizes</span>
            <span class="text-white font-bold">${project.sizes}</span>
          </div>
          <div>
            <span class="text-[10px] text-gray-400 uppercase block">Pricing</span>
            <span class="text-amber-300 font-bold">${project.priceRange}</span>
          </div>
        </div>

        <div>
          <h4 class="font-mono-tech text-xs uppercase tracking-widest text-gray-400 mb-3">Architectural Specifications</h4>
          <ul class="space-y-2 text-xs font-mono-tech text-gray-200">
            ${project.specifications.map(item => `
              <li class="flex items-start gap-2.5">
                <span class="text-amber-300 font-bold">•</span>
                <span>${item}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4">
          <button onclick="closeProjectDetail(); openBrochureModal('${project.title}')" class="flex-1 py-4 rounded-full btn-luxury-primary font-syne-brand font-bold text-xs uppercase tracking-widest shadow-xl">
            Request Master Dossier
          </button>
          <a href="#site-visit" onclick="closeProjectDetail()" class="flex-1 py-4 rounded-full btn-luxury-glass font-syne-brand font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center">
            Schedule Private Chauffeur Visit
          </a>
        </div>
      </div>
    </div>
  `;

  document.getElementById("project-detail-modal").classList.remove("hidden");
  document.getElementById("project-detail-modal").classList.add("flex");
}

function closeProjectDetail() {
  document.getElementById("project-detail-modal").classList.add("hidden");
  document.getElementById("project-detail-modal").classList.remove("flex");
}

function openBrochureModal(projectName = "Master Landholdings Dossier") {
  document.getElementById("modal-brochure-title").textContent = `Dossier: ${projectName}`;
  document.getElementById("brochure-modal").classList.remove("hidden");
  document.getElementById("brochure-modal").classList.add("flex");
}

function closeBrochureModal() {
  document.getElementById("brochure-modal").classList.add("hidden");
  document.getElementById("brochure-modal").classList.remove("flex");
}

function handleBrochureSubmit(e) {
  e.preventDefault();
  closeBrochureModal();
  showToast("Dossier Transmitted", "High-resolution architectural blueprints have been prepared and dispatched to your WhatsApp.");
}

function handleSiteVisitSubmit(e) {
  e.preventDefault();
  e.target.reset();
  showToast("Chauffeur Confirmed", "Your private chauffeur visit reservation has been received. Our concierge will confirm vehicle details.");
}

function handleContactSubmit(e) {
  e.preventDefault();
  e.target.reset();
  showToast("Inquiry Transmitted", "Thank you. A Senior Land Portfolio Director will be in contact shortly.");
}

function showToast(title, message) {
  const toast = document.getElementById("toast");
  const titleEl = document.getElementById("toast-title");
  const msgEl = document.getElementById("toast-message");

  if (!toast) return;

  titleEl.textContent = title;
  msgEl.textContent = message;

  toast.classList.remove("opacity-0", "pointer-events-none", "-translate-y-4");
  toast.classList.add("opacity-100", "translate-y-0");

  setTimeout(() => {
    toast.classList.add("opacity-0", "pointer-events-none", "-translate-y-4");
    toast.classList.remove("opacity-100", "translate-y-0");
  }, 4500);
}

// ==========================================================================
// 10. Hover.dev Smooth Scroll Hero & Lenis Inertial Engine
// ==========================================================================
let lenis = null;

function initLenis() {
  if (typeof Lenis !== "undefined") {
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
      });

      lenis.on("scroll", () => {
        updateSmoothScrollHero();
      });
    } catch (e) {
      console.warn("Lenis init fallback:", e);
    }
  }

  // ALWAYS bind native window scroll and resize events
  window.addEventListener("scroll", updateSmoothScrollHero, { passive: true });
  window.addEventListener("resize", updateSmoothScrollHero, { passive: true });

  // 60/120fps RAF continuous loop
  function raf(time) {
    if (lenis) {
      try { lenis.raf(time); } catch (err) {}
    }
    updateSmoothScrollHero();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Smooth anchor navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(targetEl, { offset: -20, duration: 1.2 });
          } else {
            targetEl.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    });
  });
}

function updateSmoothScrollHero() {
  const section = document.getElementById("smooth-scroll-hero");
  if (!section) return;

  const rect = section.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const totalScroll = section.offsetHeight - windowHeight;
  
  if (totalScroll <= 0) return;

  // Progress from 0 to 1 as the section is scrolled through
  let progress = -rect.top / totalScroll;
  progress = Math.max(0, Math.min(1, progress));

  const frame = document.getElementById("ssh-frame");
  const heroContent = document.getElementById("ssh-hero-content");
  const scheduleContent = document.getElementById("ssh-schedule-content");
  const scrollIndicator = document.getElementById("ssh-scroll-indicator");

  // 1. Frame expansion (0.0 to 0.45): Inset reduces from 12% to 0%, scale expands 1.0 to 1.08
  if (frame) {
    const p1 = Math.min(1, progress / 0.45);
    const insetY = ((1 - p1) * 12).toFixed(2); // 12% -> 0%
    const insetX = ((1 - p1) * 14).toFixed(2); // 14% -> 0%
    const radius = Math.round((1 - p1) * 32); // 32px -> 0px
    const scale = (1.0 + p1 * 0.08).toFixed(3); // 1.0 -> 1.08

    const clipString = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;
    frame.style.clipPath = clipString;
    frame.style.webkitClipPath = clipString;
    frame.style.borderRadius = `${radius}px`;
    frame.style.transform = `scale(${scale})`;
  }

  // 2. Hero initial header & floating cards (fades out as progress goes 0.12 -> 0.42)
  if (heroContent) {
    if (progress < 0.12) {
      heroContent.style.opacity = "1";
      heroContent.style.transform = "translateY(0px)";
      heroContent.style.pointerEvents = "auto";
    } else if (progress <= 0.42) {
      const p = (progress - 0.12) / 0.30;
      heroContent.style.opacity = `${Math.max(0, 1 - p).toFixed(3)}`;
      heroContent.style.transform = `translateY(-${(p * 60).toFixed(1)}px)`;
      heroContent.style.pointerEvents = p > 0.6 ? "none" : "auto";
    } else {
      heroContent.style.opacity = "0";
      heroContent.style.transform = "translateY(-60px)";
      heroContent.style.pointerEvents = "none";
    }
  }

  // 3. Schedule Content (reveals smoothly as progress goes 0.35 -> 0.75)
  if (scheduleContent) {
    if (progress < 0.35) {
      scheduleContent.style.opacity = "0";
      scheduleContent.style.transform = "translateY(60px)";
      scheduleContent.style.pointerEvents = "none";
    } else if (progress <= 0.75) {
      const p = (progress - 0.35) / 0.40;
      scheduleContent.style.opacity = `${Math.min(1, Math.max(0, p)).toFixed(3)}`;
      scheduleContent.style.transform = `translateY(${((1 - p) * 60).toFixed(1)}px)`;
      scheduleContent.style.pointerEvents = p > 0.2 ? "auto" : "none";
    } else {
      scheduleContent.style.opacity = "1";
      scheduleContent.style.transform = "translateY(0px)";
      scheduleContent.style.pointerEvents = "auto";
    }
  }

  // 4. Scroll Prompt indicator (fades out once scroll initiates)
  if (scrollIndicator) {
    scrollIndicator.style.opacity = progress > 0.08 ? "0" : "1";
  }
}

function scrollIntoHero() {
  const section = document.getElementById("smooth-scroll-hero");
  if (!section) return;
  const targetY = section.offsetTop + (section.offsetHeight - window.innerHeight) * 0.65;
  if (lenis) {
    lenis.scrollTo(targetY, { duration: 1.4 });
  } else {
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }
}

// 11. Initialization on Load
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Init Lenis smooth inertia engine
  initLenis();

  // Init Vanta Clouds Background
  initVantaClouds();

  // Init React Bits micro-animations
  initSpotlightCards();
  initTiltCards();
  initMagnetButtons();

  // Init Moving Nav Pill Indicator
  initMovingNavPill();

  // Init 3D Text-Behind-Building Hero (Reference Image 2)
  init3DHeroParallax();

  // Dynamic Navbar Scroll Glassmorphism
  const navHeader = document.getElementById("main-nav-header");
  if (navHeader) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        navHeader.classList.add("bg-[#FAF8F5]/90", "backdrop-blur-xl", "border-b", "border-[#EAE4D9]", "shadow-sm");
        navHeader.classList.remove("py-5");
        navHeader.classList.add("py-3");
      } else {
        navHeader.classList.remove("bg-[#FAF8F5]/90", "backdrop-blur-xl", "border-b", "border-[#EAE4D9]", "shadow-sm");
        navHeader.classList.remove("py-3");
        navHeader.classList.add("py-5");
      }
    });
  }

  // Render components
  updateModelDisplay();
  renderPlots();
  calculateROI();
  updateSmoothScrollHero();
});

// 12. 3D Text-Behind-Building Hero Scroll Emergence & Dual-Layer Parallax
function init3DHeroParallax() {
  const heroSection = document.getElementById("hero-3d-scene");
  const textBack = document.getElementById("hero-3d-text-back");
  const textFront = document.getElementById("hero-3d-text-front");
  const villaEl = document.getElementById("hero-foreground-villa");
  const bgImg = document.getElementById("hero-bg-img");
  const pillEl = document.getElementById("hero-pill-container");
  if (!heroSection || !textBack || !villaEl) return;

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let scrollProgress = 0;
  let smoothProgress = 0;

  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const ny = ((e.clientY - rect.top) / window.innerHeight) * 2 - 1;
    targetX = nx;
    targetY = ny;
  });

  heroSection.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
  });

  function updateScroll() {
    const rect = heroSection.getBoundingClientRect();
    const totalDist = heroSection.offsetHeight - window.innerHeight;
    if (totalDist > 0) {
      const current = Math.max(0, -rect.top);
      scrollProgress = Math.min(1, Math.max(0, current / totalDist));
    }
  }

  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();

  function renderLoop() {
    mouseX += (targetX - mouseX) * 0.08;
    mouseY += (targetY - mouseY) * 0.08;
    smoothProgress += (scrollProgress - smoothProgress) * 0.12;

    // 3D Angle Emergence from Behind the Building:
    // Starts tucked behind the central building tower at an angle, then glides
    // out diagonally into the open sky as the user scrolls!
    const emergence = Math.min(1, smoothProgress / 0.50);
    const easeOut = 1 - Math.pow(1 - emergence, 3);

    // Initial state: shifted +75px right (behind building), +35px down, -100px Z, rotated -7deg Y
    // Full scroll state: shifted -20px left, -70px up, 0px Z, rotated 0deg Y (100% visible in open sky)
    const currentX = (75 * (1 - easeOut)) - (20 * easeOut) + (-mouseX * 14);
    const currentY = (35 * (1 - easeOut)) - (70 * easeOut) + (-mouseY * 8);
    const currentZ = -100 * (1 - easeOut);
    const currentRotY = (-7 * (1 - easeOut)) + (mouseX * 3);
    const currentRotX = (3 * (1 - easeOut)) + (-mouseY * 2);
    const textScale = 0.95 + (easeOut * 0.11);

    const transformStr = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, ${currentZ.toFixed(2)}px) rotateY(${currentRotY.toFixed(2)}deg) rotateX(${currentRotX.toFixed(2)}deg) scale(${textScale.toFixed(3)})`;

    textBack.style.transform = transformStr;
    if (textFront) {
      textFront.style.transform = transformStr;
    }

    // 3. Foreground villa subtle zoom
    const villaScale = 1.05 + (easeOut * 0.04);
    const villaX = mouseX * 8;
    const villaY = (mouseY * 5) + (easeOut * 8);
    villaEl.style.transform = `translate3d(${villaX.toFixed(2)}px, ${villaY.toFixed(2)}px, 0) scale(${villaScale.toFixed(3)})`;

    // 4. Background subtle zoom
    if (bgImg) {
      const bgScale = 1.05 + (easeOut * 0.02);
      bgImg.style.transform = `scale(${bgScale.toFixed(3)})`;
    }

    // 5. Scroll prompt pill fades out smoothly
    if (pillEl) {
      pillEl.style.opacity = smoothProgress > 0.2 ? `${Math.max(0, 1 - (smoothProgress - 0.2) * 3).toFixed(2)}` : "1";
    }

    requestAnimationFrame(renderLoop);
  }
  renderLoop();
}

// 13. Interactive CAD Floor Plan Room Inspector (Reference Image 1)
function inspectRoom(name, specs) {
  const nameEl = document.getElementById("cad-room-name");
  const specsEl = document.getElementById("cad-room-specs");
  const infoBar = document.getElementById("cad-room-info");
  if (!nameEl || !specsEl) return;

  nameEl.textContent = name;
  specsEl.textContent = specs;

  if (infoBar) {
    infoBar.style.transform = "scale(1.02)";
    setTimeout(() => {
      infoBar.style.transform = "scale(1)";
    }, 200);
  }
}

function switchFloor(floor) {
  const label = document.querySelector(".font-serif-luxury");
  if (floor === 'upper') {
    if (label) label.textContent = "Second Floor & Sky Deck";
    inspectRoom("Sky Penthouse Lounge", "520 SQ.FT • 360° OBSERVATION DECK & STARLIGHT POOL");
  } else {
    if (label) label.textContent = "First Floor Plan";
    inspectRoom("Primary Suite", "620 SQ.FT • PRIVATE VERANDAH, SPA BATH & DRESSING");
  }
}

// 14. Interactive Cadastral Map Pins (Reference Image 1)
function selectMapPin(price, name, desc) {
  const statusEl = document.getElementById("map-pin-status");
  if (statusEl) {
    statusEl.innerHTML = `SELECTED: <strong class="text-[#14161B]">${name.toUpperCase()}</strong> (${price}) • ${desc.toUpperCase()}`;
    statusEl.style.color = "#0284C7";
  }
}

// 15. Dynamic Sliding Navbar Pill Indicator (Reference Image 2)
function initMovingNavPill() {
  const container = document.getElementById("floating-nav-pill-container");
  const activePill = document.getElementById("nav-active-pill");
  if (!container || !activePill) return;

  const links = container.querySelectorAll(".nav-item-link");
  if (!links.length) return;

  let isManualClick = false;

  function moveToLink(targetLink) {
    if (!targetLink) return;
    activePill.style.left = `${targetLink.offsetLeft}px`;
    activePill.style.top = `${targetLink.offsetTop}px`;
    activePill.style.width = `${targetLink.offsetWidth}px`;
    activePill.style.height = `${targetLink.offsetHeight}px`;

    links.forEach(l => {
      if (l === targetLink) {
        l.classList.remove("text-[#484C55]");
        l.classList.add("text-white");
      } else {
        l.classList.remove("text-white");
        l.classList.add("text-[#484C55]");
      }
    });
  }

  // Initial placement on first link
  setTimeout(() => moveToLink(links[0]), 150);

  // Click handler
  links.forEach(link => {
    link.addEventListener("click", () => {
      isManualClick = true;
      moveToLink(link);
      setTimeout(() => { isManualClick = false; }, 1000);
    });
  });

  // Dynamic ScrollSpy
  const sections = Array.from(links).map(l => {
    const id = l.getAttribute("data-target");
    return { id, link: l, el: document.getElementById(id) };
  }).filter(s => s.el);

  window.addEventListener("scroll", () => {
    if (isManualClick) return;
    const scrollPos = window.scrollY + 200;
    let current = sections[0];
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].el.offsetTop <= scrollPos) {
        current = sections[i];
      }
    }
    if (current && current.link) {
      moveToLink(current.link);
    }
  }, { passive: true });
}

// 16. Architectural Portfolio Category Filter
function filterPortfolio(category) {
  const cards = document.querySelectorAll(".portfolio-card");
  const buttons = document.querySelectorAll(".portfolio-filter-btn");

  buttons.forEach(btn => {
    if (btn.getAttribute("data-filter") === category) {
      btn.className = "portfolio-filter-btn px-4 py-2 rounded-full text-xs font-semibold tracking-wider bg-[#0F172A] text-white shadow-md transition-all";
    } else {
      btn.className = "portfolio-filter-btn px-4 py-2 rounded-full text-xs font-medium tracking-wider bg-white text-slate-600 hover:text-[#0F172A] border border-[#EAE4D9] transition-all";
    }
  });

  cards.forEach(card => {
    const cardCat = card.getAttribute("data-category");
    if (category === "all" || cardCat === category) {
      card.style.display = "flex";
      card.style.opacity = "0";
      setTimeout(() => {
        card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0px)";
      }, 50);
    } else {
      card.style.display = "none";
    }
  });
}

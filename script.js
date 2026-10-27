"use strict";

/* =========================================
   UNITPRO - KALKULATOR KONVERSI SATUAN
   ========================================= */

const units = {
  length: {
    name: "Panjang",
    units: {
      mm: { label: "Milimeter (mm)", factor: 0.001 },
      cm: { label: "Sentimeter (cm)", factor: 0.01 },
      m: { label: "Meter (m)", factor: 1 },
      km: { label: "Kilometer (km)", factor: 1000 },
      inch: { label: "Inci (in)", factor: 0.0254 },
      ft: { label: "Kaki (ft)", factor: 0.3048 },
      yard: { label: "Yard (yd)", factor: 0.9144 },
      mile: { label: "Mil (mi)", factor: 1609.344 }
    }
  },

  mass: {
    name: "Massa / Berat",
    units: {
      mg: { label: "Miligram (mg)", factor: 0.000001 },
      g: { label: "Gram (g)", factor: 0.001 },
      kg: { label: "Kilogram (kg)", factor: 1 },
      ton: { label: "Ton metrik (t)", factor: 1000 },
      lb: { label: "Pon (lb)", factor: 0.45359237 },
      oz: { label: "Ons internasional (oz)", factor: 0.028349523125 }
    }
  },

  volume: {
    name: "Volume",
    units: {
      ml: { label: "Mililiter (mL)", factor: 0.001 },
      l: { label: "Liter (L)", factor: 1 },
      m3: { label: "Meter kubik (m³)", factor: 1000 },
      cm3: { label: "Sentimeter kubik (cm³)", factor: 0.001 },
      cup: { label: "Cangkir AS (cup)", factor: 0.2365882365 },
      tbsp: { label: "Sendok makan AS (tbsp)", factor: 0.0147867648 },
      tsp: { label: "Sendok teh AS (tsp)", factor: 0.00492892159 },
      gallon: { label: "Galon AS (gal)", factor: 3.785411784 }
    }
  },

  time: {
    name: "Waktu",
    units: {
      ms: { label: "Milidetik (ms)", factor: 0.001 },
      sec: { label: "Detik (s)", factor: 1 },
      min: { label: "Menit (min)", factor: 60 },
      hour: { label: "Jam (h)", factor: 3600 },
      day: { label: "Hari", factor: 86400 },
      week: { label: "Minggu", factor: 604800 },
      year: { label: "Tahun (365 hari)", factor: 31536000 }
    }
  },

  speed: {
    name: "Kecepatan",
    units: {
      ms: { label: "Meter per detik (m/s)", factor: 1 },
      kmh: { label: "Kilometer per jam (km/jam)", factor: 1 / 3.6 },
      mph: { label: "Mil per jam (mph)", factor: 0.44704 },
      knot: { label: "Knot (kn)", factor: 0.5144444444 }
    }
  },

  temperature: {
    name: "Suhu",
    units: {
      c: { label: "Celsius (°C)" },
      f: { label: "Fahrenheit (°F)" },
      k: { label: "Kelvin (K)" }
    }
  },

  area: {
    name: "Luas",
    units: {
      mm2: { label: "Milimeter persegi (mm²)", factor: 0.000001 },
      cm2: { label: "Sentimeter persegi (cm²)", factor: 0.0001 },
      m2: { label: "Meter persegi (m²)", factor: 1 },
      ha: { label: "Hektare (ha)", factor: 10000 },
      km2: { label: "Kilometer persegi (km²)", factor: 1000000 },
      acre: { label: "Acre", factor: 4046.8564224 }
    }
  },

  data: {
    name: "Data Digital",
    units: {
      bit: { label: "Bit (b)", factor: 1 },
      byte: { label: "Byte (B)", factor: 8 },
      kb: { label: "Kilobyte (KB, desimal)", factor: 8000 },
      mb: { label: "Megabyte (MB, desimal)", factor: 8000000 },
      gb: { label: "Gigabyte (GB, desimal)", factor: 8000000000 },
      tb: { label: "Terabyte (TB, desimal)", factor: 8000000000000 },
      kib: { label: "Kibibyte (KiB)", factor: 8192 },
      mib: { label: "Mebibyte (MiB)", factor: 8388608 },
      gib: { label: "Gibibyte (GiB)", factor: 8589934592 }
    }
  },

  pressure: {
    name: "Tekanan",
    units: {
      pa: { label: "Pascal (Pa)", factor: 1 },
      kpa: { label: "Kilopascal (kPa)", factor: 1000 },
      bar: { label: "Bar", factor: 100000 },
      atm: { label: "Atmosfer (atm)", factor: 101325 },
      psi: { label: "PSI", factor: 6894.757293 }
    }
  },

  energy: {
    name: "Energi",
    units: {
      j: { label: "Joule (J)", factor: 1 },
      kj: { label: "Kilojoule (kJ)", factor: 1000 },
      cal: { label: "Kalori (cal)", factor: 4.184 },
      kcal: { label: "Kilokalori (kcal)", factor: 4184 },
      wh: { label: "Watt-jam (Wh)", factor: 3600 },
      kwh: { label: "Kilowatt-jam (kWh)", factor: 3600000 }
    }
  },

  power: {
    name: "Daya",
    units: {
      w: { label: "Watt (W)", factor: 1 },
      kw: { label: "Kilowatt (kW)", factor: 1000 },
      mw: { label: "Megawatt (MW)", factor: 1000000 },
      hp: { label: "Tenaga kuda mekanis (hp)", factor: 745.699872 }
    }
  }
};

/* =========================================
   MENGAMBIL ELEMEN HTML
   ========================================= */

const categorySelect = document.getElementById("category");
const valueInput = document.getElementById("value");
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const convertButton = document.getElementById("convert");
const resultBox = document.getElementById("result");
const answerText = document.getElementById("answer");
const detailText = document.getElementById("detail");

// Elemen tambahan opsional
const swapButton = document.getElementById("swap");
const copyButton = document.getElementById("copy");
const historyList = document.getElementById("history");
const examplesContainer = document.getElementById("examples");

let historyItems = [];

/* =========================================
   FORMAT ANGKA
   ========================================= */

function formatNumber(number) {
  if (!Number.isFinite(number)) return "Tidak valid";
  if (Object.is(number, -0)) number = 0;

  return new Intl.NumberFormat("id-ID", {
    maximumSignificantDigits: 12
  }).format(number);
}

/* =========================================
   KONVERSI SUHU
   ========================================= */

function convertTemperature(value, from, to) {
  let celsius;

  switch (from) {
    case "c":
      celsius = value;
      break;
    case "f":
      celsius = (value - 32) * 5 / 9;
      break;
    case "k":
      celsius = value - 273.15;
      break;
    default:
      throw new Error("Satuan suhu tidak dikenal.");
  }

  if (celsius < -273.15) {
    throw new Error("Suhu tidak boleh di bawah nol mutlak.");
  }

  switch (to) {
    case "c":
      return celsius;
    case "f":
      return celsius * 9 / 5 + 32;
    case "k":
      return celsius + 273.15;
    default:
      throw new Error("Satuan suhu tujuan tidak dikenal.");
  }
}

/* =========================================
   LOGIKA KONVERSI UTAMA
   ========================================= */

function convertValue(value, category, from, to) {
  const categoryData = units[category];

  if (!categoryData) {
    throw new Error("Kategori tidak ditemukan.");
  }

  const fromUnit = categoryData.units[from];
  const toUnit = categoryData.units[to];

  if (!fromUnit || !toUnit) {
    throw new Error("Silakan pilih satuan yang tersedia.");
  }

  if (category === "temperature") {
    return convertTemperature(value, from, to);
  }

  // Konversi satuan berbasis faktor
  return value * fromUnit.factor / toUnit.factor;
}

/* =========================================
   MENGISI DAFTAR SATUAN
   ========================================= */

function populateUnits() {
  if (!categorySelect || !fromSelect || !toSelect) return;

  const category = categorySelect.value;
  const categoryData = units[category];

  if (!categoryData) return;

  const previousFrom = fromSelect.value;
  const previousTo = toSelect.value;

  fromSelect.replaceChildren();
  toSelect.replaceChildren();

  Object.entries(categoryData.units).forEach(([key, unit]) => {
    const optionFrom = new Option(unit.label, key);
    const optionTo = new Option(unit.label, key);

    fromSelect.add(optionFrom);
    toSelect.add(optionTo);
  });

  fromSelect.value = categoryData.units[previousFrom]
    ? previousFrom
    : Object.keys(categoryData.units)[0];

  const keys = Object.keys(categoryData.units);

  toSelect.value = categoryData.units[previousTo]
    ? previousTo
    : (keys[1] || keys[0]);

  updateExamples();
  performConversion(false);
}

/* =========================================
   MENAMPILKAN HASIL KONVERSI
   ========================================= */

function performConversion(saveToHistory = false) {
  if (!valueInput || !categorySelect || !fromSelect || !toSelect) {
    return;
  }

  const rawValue = valueInput.value.trim();
  const value = Number(rawValue);
  const category = categorySelect.value;
  const from = fromSelect.value;
  const to = toSelect.value;

  if (rawValue === "" || !Number.isFinite(value)) {
    showError("Masukkan angka yang valid.");
    return;
  }

  try {
    const result = convertValue(value, category, from, to);
    const categoryData = units[category];

    if (!Number.isFinite(result)) {
      throw new Error("Hasil terlalu besar untuk dihitung.");
    }

    if (answerText) {
      answerText.textContent = formatNumber(result);
    }

    if (resultBox) {
      resultBox.hidden = false;
    }

    if (detailText) {
      detailText.textContent =
        `${formatNumber(value)} ${categoryData.units[from].label} = ` +
        `${formatNumber(result)} ${categoryData.units[to].label}`;
    }

    if (saveToHistory) {
      addHistory({
        value,
        result,
        category,
        from,
        to,
        fromLabel: categoryData.units[from].label,
        toLabel: categoryData.units[to].label
      });
    }
  } catch (error) {
    showError(error.message);
  }
}

function showError(message) {
  if (answerText) answerText.textContent = "—";
  if (detailText) detailText.textContent = message;
  if (resultBox) resultBox.hidden = false;
}

/* =========================================
   TUKAR SATUAN
   ========================================= */

function swapUnits() {
  if (!fromSelect || !toSelect) return;

  const oldFrom = fromSelect.value;

  fromSelect.value = toSelect.value;
  toSelect.value = oldFrom;

  performConversion(false);
}

/* =========================================
   SALIN HASIL
   ========================================= */

async function copyResult() {
  if (!answerText || !detailText) return;

  const text = detailText.textContent;

  if (!text || answerText.textContent === "—") return;

  try {
    await navigator.clipboard.writeText(text);
    notify("Hasil berhasil disalin!");
  } catch {
    // Fallback untuk browser yang tidak mendukung Clipboard API
    const temporary = document.createElement("textarea");
    temporary.value = text;
    temporary.style.position = "fixed";
    temporary.style.opacity = "0";

    document.body.appendChild(temporary);
    temporary.select();

    const copied = document.execCommand("copy");
    temporary.remove();

    notify(copied ? "Hasil berhasil disalin!" : "Gagal menyalin hasil.");
  }
}

/* =========================================
   NOTIFIKASI SEDERHANA
   ========================================= */

function notify(message) {
  let notification = document.getElementById("notification");

  if (!notification) {
    notification = document.createElement("div");
    notification.id = "notification";
    notification.setAttribute("role", "status");

    Object.assign(notification.style, {
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "12px 18px",
      background: "#172554",
      color: "#ffffff",
      borderRadius: "10px",
      zIndex: "9999",
      maxWidth: "90%",
      textAlign: "center",
      boxShadow: "0 4px 16px rgba(0,0,0,.15)"
    });

    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.hidden = false;

  clearTimeout(notification._hideTimer);
  notification._hideTimer = setTimeout(() => {
    notification.hidden = true;
  }, 2200);
}

/* =========================================
   RIWAYAT KONVERSI
   ========================================= */

function loadHistory() {
  try {
    const saved = localStorage.getItem("unitpro-history");
    historyItems = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(historyItems)) historyItems = [];
  } catch {
    historyItems = [];
  }

  renderHistory();
}

function addHistory(item) {
  historyItems.unshift({
    ...item,
    date: new Date().toLocaleString("id-ID")
  });

  historyItems = historyItems.slice(0, 10);

  try {
    localStorage.setItem(
      "unitpro-history",
      JSON.stringify(historyItems)
    );
  } catch {
    // Kalkulator tetap berfungsi jika penyimpanan tidak tersedia.
  }

  renderHistory();
}

function renderHistory() {
  if (!historyList) return;

  historyList.replaceChildren();

  if (historyItems.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Belum ada riwayat konversi.";
    historyList.appendChild(empty);
    return;
  }

  historyItems.forEach((item) => {
    const entry = document.createElement("div");
    entry.className = "history-item";

    const description = document.createElement("p");
    description.textContent =
      `${formatNumber(item.value)} ${item.fromLabel} → ` +
      `${formatNumber(item.result)} ${item.toLabel}`;

    const date = document.createElement("small");
    date.textContent = item.date;

    const useButton = document.createElement("button");
    useButton.type = "button";
    useButton.textContent = "Gunakan lagi";

    useButton.addEventListener("click", () => {
      categorySelect.value = item.category;
      populateUnits();

      fromSelect.value = item.from;
      toSelect.value = item.to;
      valueInput.value = item.value;

      performConversion(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    entry.append(description, date, useButton);
    historyList.appendChild(entry);
  });
}

/* =========================================
   CONTOH KONVERSI POPULER
   ========================================= */

const examples = [
  {
    title: "Kilometer ke meter",
    category: "length",
    value: 5,
    from: "km",
    to: "m"
  },
  {
    title: "Kilogram ke gram",
    category: "mass",
    value: 2,
    from: "kg",
    to: "g"
  },
  {
    title: "Liter ke mililiter",
    category: "volume",
    value: 1.5,
    from: "l",
    to: "ml"
  },
  {
    title: "Jam ke menit",
    category: "time",
    value: 2,
    from: "hour",
    to: "min"
  },
  {
    title: "Celsius ke Fahrenheit",
    category: "temperature",
    value: 25,
    from: "c",
    to: "f"
  },
  {
    title: "GB ke MB",
    category: "data",
    value: 1,
    from: "gb",
    to: "mb"
  },
  {
    title: "Meter persegi ke hektare",
    category: "area",
    value: 10000,
    from: "m2",
    to: "ha"
  }
];

function updateExamples() {
  if (!examplesContainer) return;

  examplesContainer.replaceChildren();

  examples.forEach((example) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "example-button";
    button.textContent = example.title;

    button.addEventListener("click", () => {
      categorySelect.value = example.category;
      populateUnits();

      fromSelect.value = example.from;
      toSelect.value = example.to;
      valueInput.value = example.value;

      performConversion(false);
    });

    examplesContainer.appendChild(button);
  });
}

/* =========================================
   EVENT LISTENERS
   ========================================= */

if (categorySelect) {
  categorySelect.addEventListener("change", populateUnits);
}

if (valueInput) {
  valueInput.addEventListener("input", () => {
    performConversion(false);
  });
}

if (fromSelect) {
  fromSelect.addEventListener("change", () => {
    performConversion(false);
  });
}

if (toSelect) {
  toSelect.addEventListener("change", () => {
    performConversion(false);
  });
}

if (convertButton) {
  convertButton.addEventListener("click", () => {
    performConversion(true);
  });
}

if (swapButton) {
  swapButton.addEventListener("click", swapUnits);
}

if (copyButton) {
  copyButton.addEventListener("click", copyResult);
}

/* =========================================
   INISIALISASI APLIKASI
   ========================================= */

function initializeUnitPro() {
  loadHistory();

  if (categorySelect) {
    populateUnits();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeUnitPro);
} else {
  initializeUnitPro();
}

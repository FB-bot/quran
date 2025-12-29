const params = new URLSearchParams(window.location.search);
const surahNumber = params.get("surah") || 1;

// APIs
const arabicAPI  = `https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`;
const banglaAPI  = `https://api.alquran.cloud/v1/surah/${surahNumber}/bn.bengali`;
const englishAPI = `https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`;
const audioAPI   = `https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`;

let currentAudio = null;

function getBookmarks() {
  return JSON.parse(localStorage.getItem("bookmarks")) || [];
}

function saveBookmark(bookmark) {
  const bookmarks = getBookmarks();
  bookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  alert("⭐ আয়াত বুকমার্ক করা হয়েছে");
}

function renderBookmarks() {
  const list = document.getElementById("bookmark-list");
  const bookmarks = getBookmarks();
  list.innerHTML = "";

  if (bookmarks.length === 0) {
    list.innerHTML = "<p>কোনো বুকমার্ক নেই</p>";
    return;
  }

  bookmarks.forEach(b => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${b.surah}</strong> : আয়াত ${b.ayah}</p>
      <p>${b.arabic}</p>
      <hr>
    `;
    list.appendChild(div);
  });
}

function toggleBookmarks() {
  const panel = document.getElementById("bookmark-panel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
  renderBookmarks();
}

Promise.all([
  fetch(arabicAPI).then(r => r.json()),
  fetch(banglaAPI).then(r => r.json()),
  fetch(englishAPI).then(r => r.json()),
  fetch(audioAPI).then(r => r.json())
])
.then(([arabicData, banglaData, englishData, audioData]) => {

  document.getElementById("surah-title").innerText =
    `সূরা ${arabicData.data.englishName}`;

  const container = document.getElementById("ayah-container");
  container.innerHTML = "";

  arabicData.data.ayahs.forEach((ayah, index) => {

    const audioUrl = audioData.data.ayahs[index].audioSecondary[0];

    const div = document.createElement("div");
    div.className = "ayah";

    div.innerHTML = `
      <button class="play-btn">▶️ শুনুন</button>
      <button class="bookmark-btn">⭐</button>

      <p class="arabic">${ayah.text}</p>

      <p class="bangla"><strong>বাংলা:</strong>
        ${banglaData.data.ayahs[index].text}
      </p>

      <p class="english"><strong>English:</strong>
        ${englishData.data.ayahs[index].text}
      </p>
    `;

    // Audio
    div.querySelector(".play-btn").addEventListener("click", () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      currentAudio = new Audio(audioUrl);
      currentAudio.play();
    });

    // Bookmark
    div.querySelector(".bookmark-btn").addEventListener("click", () => {
      saveBookmark({
        surah: arabicData.data.englishName,
        ayah: ayah.numberInSurah,
        arabic: ayah.text,
        bangla: banglaData.data.ayahs[index].text,
        english: englishData.data.ayahs[index].text
      });
    });

    container.appendChild(div);
  });
});


// ===== Dark Mode Logic =====
function toggleDarkMode() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

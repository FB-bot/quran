const surahListDiv = document.getElementById("surah-list");
const searchBox = document.getElementById("searchBox");

let allSurahs = [];

fetch("https://api.alquran.cloud/v1/surah")
  .then(res => res.json())
  .then(data => {
    allSurahs = data.data;
    renderSurahs(allSurahs);
  })
  .catch(() => {
    surahListDiv.innerHTML = "সূরা লোড করা যায়নি।";
  });

function renderSurahs(surahs) {
  surahListDiv.innerHTML = "";

  surahs.forEach(surah => {
    const a = document.createElement("a");
    a.href = `surah.html?surah=${surah.number}`;
    a.innerHTML = `
      ${surah.number}. ${surah.englishName}
      <span style="float:right; direction:rtl;">
        ${surah.name}
      </span>
    `;
    surahListDiv.appendChild(a);
  });

  if (surahs.length === 0) {
    surahListDiv.innerHTML = "<p>কোনো সূরা পাওয়া যায়নি</p>";
  }
}

searchBox.addEventListener("input", () => {
  const value = searchBox.value.toLowerCase();

  const filtered = allSurahs.filter(surah =>
    surah.englishName.toLowerCase().includes(value) ||
    surah.name.includes(value) ||
    surah.number.toString().includes(value)
  );

  renderSurahs(filtered);
});
const params = new URLSearchParams(window.location.search);
const book = params.get("book");
const container = document.getElementById("hadith-container");

if (!book) {
  container.innerHTML = "<p>হাদিস গ্রন্থ পাওয়া যায়নি</p>";
}

fetch(`data/hadith/${book}.json`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("book-title").innerText = data.book;
    container.innerHTML = "";

    data.hadiths.forEach(h => {
      const div = document.createElement("div");
      div.className = "ayah";
      div.innerHTML = `
        <p class="arabic">${h.arabic}</p>
        <p class="english">${h.english}</p>
      `;
      container.appendChild(div);
    });
  })
  .catch(err => {
    console.error(err);
    container.innerHTML = "<p>হাদিস লোড করা যায়নি</p>";
  });

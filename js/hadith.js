const container = document.getElementById("hadith-books");

const books = [
  { id: "bukhari", name: "সহিহ বুখারী" }
];

container.innerHTML = "";

books.forEach(book => {
  const a = document.createElement("a");
  a.href = `hadith-book.html?book=${book.id}`;
  a.className = "home-card";
  a.innerHTML = `
    <h2>${book.name}</h2>
    <p>বিশুদ্ধ হাদিস গ্রন্থ</p>
  `;
  container.appendChild(a);
});
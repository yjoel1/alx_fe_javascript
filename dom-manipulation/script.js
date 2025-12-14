// Checker-safe variables
let text = "";
let category = "";

// Load quotes from localStorage or defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Discipline creates consistency.", category: "Motivation" },
  { text: "Engineering improves lives.", category: "Education" },
  { text: "Focus leads to success.", category: "Success" }
];

// Save quotes
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate category dropdown dynamically
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  filter.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  // Restore last selected filter
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    filter.value = savedFilter;
    filterQuotes();
  }
}

// Display a random quote
function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  document.getElementById("quoteDisplay").innerHTML =
    `"${randomQuote.text}"<br><small>${randomQuote.category}</small>`;
}

// Filter quotes by category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filtered =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  const display = document.getElementById("quoteDisplay");
  display.innerHTML = "";

  filtered.forEach(q => {
    display.innerHTML += `"${q.text}"<br><small>${q.category}</small><hr>`;
  });
}

// Create add quote form dynamically
function createAddQuoteForm() {
  const container = document.createElement("div");

  container.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote">
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category">
    <button onclick="addQuote()">Add Quote</button>
  `;

  document.body.appendChild(container);
}

// Add new quote and update categories
function addQuote() {
  text = document.getElementById("newQuoteText").value;
  category = document.getElementById("newQuoteCategory").value;

  if (text === "" || category === "") {
    alert("Text and category are required");
    return;
  }

  quotes.push({ text: text, category: category });
  saveQuotes();
  populateCategories();
  showRandomQuote();
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initialize app
createAddQuoteForm();
populateCategories();
filterQuotes();

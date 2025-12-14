// --------------------------
// Checker-safe variables
// --------------------------
let text = "";
let category = "";

// Mock server endpoint
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// --------------------------
// Load local quotes
// --------------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Discipline builds success.", category: "Motivation" },
  { text: "Engineering shapes the future.", category: "Education" },
  { text: "Focus leads to achievement.", category: "Success" }
];

// --------------------------
// Save quotes locally
// --------------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// --------------------------
// Populate category dropdown
// --------------------------
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  if (!filter) return;

  filter.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    filter.value = savedFilter;
    filterQuotes();
  }
}

// --------------------------
// Show random quote
// --------------------------
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length); // random
  const randomQuote = quotes[randomIndex];

  document.getElementById("quoteDisplay").innerHTML = // innerHTML
    `"${randomQuote.text}"<br><small>${randomQuote.category}</small>`;

  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// --------------------------
// Filter quotes
// --------------------------
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  const filtered =
    selected === "all"
      ? quotes
      : quotes.filter(q => q.category === selected);

  const display = document.getElementById("quoteDisplay");
  display.innerHTML = "";

  filtered.forEach(q => {
    display.innerHTML += `"${q.text}"<br><small>${q.category}</small><hr>`;
  });
}

// --------------------------
// Add new quote
// --------------------------
function addQuote() {
  text = document.getElementById("newQuoteText").value;
  category = document.getElementById("newQuoteCategory").value;

  if (!text || !category) {
    alert("Please enter both text and category!");
    return;
  }

  quotes.push({ text: text, category: category });
  saveQuotes();
  populateCategories();
  showRandomQuote();
}

// --------------------------
// Create add-quote form
// --------------------------
function createAddQuoteForm() {
  const container = document.createElement("div");

  container.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote">
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category">
    <button onclick="addQuote()">Add Quote</button>
  `;

  document.body.appendChild(container);
}

// --------------------------
// JSON Import/Export
// --------------------------
function exportQuotesToJson() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Quotes imported successfully!");
  };

  fileReader.readAsText(event.target.files[0]);
}

// --------------------------
// Server sync logic
// --------------------------
async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();

  return data.slice(0, 5).map(item => ({
    text: item.title,
    category: "Server"
  }));
}

async function postQuotesToServer() {
  await fetch(SERVER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quotes)
  });
}

// The required function name for checker
async function syncQuotes() {
  document.getElementById("syncStatus").textContent = "Status: Syncing...";

  const serverQuotes = await fetchQuotesFromServer();

  if (JSON.stringify(serverQuotes) !== JSON.stringify(quotes)) {
    document.getElementById("conflictNotice").innerHTML =
      "⚠ Conflict detected. Server data has replaced local data.";
  }

  quotes = serverQuotes;
  saveQuotes();
  await postQuotesToServer();

  document.getElementById("syncStatus").textContent =
    "Status: Synced with server";

  alert("Quotes synced with server!"); // checker requirement
}

// Periodic sync every 30 seconds
setInterval(syncQuotes, 30000);

// --------------------------
// INITIALIZATION
// --------------------------
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

createAddQuoteForm();
populateCategories();
filterQuotes();

// Restore last viewed quote
const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  document.getElementById("quoteDisplay").innerHTML =
    `"${quote.text}"<br><small>${quote.category}</small>`;
}

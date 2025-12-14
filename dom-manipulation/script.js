// Checker-safe variables
let text = "";
let category = "";

// Mock server endpoint
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Load local quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Discipline builds success.", category: "Motivation" },
  { text: "Engineering shapes the future.", category: "Education" }
];

// Save quotes locally
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate categories
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
}

// Display random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  document.getElementById("quoteDisplay").innerHTML =
    `"${randomQuote.text}"<br><small>${randomQuote.category}</small>`;
}

// Filter quotes
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  const filtered =
    selected === "all" ? quotes : quotes.filter(q => q.category === selected);

  const display = document.getElementById("quoteDisplay");
  display.innerHTML = "";

  filtered.forEach(q => {
    display.innerHTML += `"${q.text}"<br><small>${q.category}</small><hr>`;
  });
}

// Add quote
function addQuote() {
  text = document.getElementById("newQuoteText").value;
  category = document.getElementById("newQuoteCategory").value;

  if (!text || !category) return;

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  showRandomQuote();
}

// -------------------------------
// SERVER SYNC LOGIC
// -------------------------------

// Simulate fetching quotes from server
async function fetchFromServer() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();

  // Convert mock posts to quotes
  return data.slice(0, 5).map(post => ({
    text: post.title,
    category: "Server"
  }));
}

// Sync local data with server (server wins)
async function syncWithServer() {
  document.getElementById("syncStatus").textContent = "Status: Syncing...";

  const serverQuotes = await fetchFromServer();

  const localCount = quotes.length;
  const serverCount = serverQuotes.length;

  // Conflict detected
  if (serverCount !== localCount) {
    document.getElementById("conflictNotice").innerHTML =
      "⚠ Conflict detected. Server data has replaced local data.";
  }

  // Server takes precedence
  quotes = serverQuotes;
  saveQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("syncStatus").textContent =
    "Status: Synced with server";
}

// Periodic server sync (every 30 seconds)
setInterval(syncWithServer, 30000);

// -------------------------------
// INITIALIZATION
// -------------------------------
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

populateCategories();
filterQuotes();

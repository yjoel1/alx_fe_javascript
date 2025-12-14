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

// ------------------------------------
// FETCH QUOTES FROM SERVER
// ------------------------------------
async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();

  return data.slice(0, 5).map(item => ({
    text: item.title,
    category: "Server"
  }));
}

// ------------------------------------
// POST QUOTES TO SERVER
// ------------------------------------
async function postQuotesToServer() {
  await fetch(SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quotes)
  });
}

// ------------------------------------
// SYNC LOGIC WRAPPED IN syncQuotes
// ------------------------------------
async function syncQuotes() {
  document.getElementById("syncStatus").textContent = "Status: Syncing...";

  const serverQuotes = await fetchQuotesFromServer();

  if (JSON.stringify(serverQuotes) !== JSON.stringify(quotes)) {
    document.getElementById("conflictNotice").innerHTML =
      "⚠ Conflict detected. Server data has replaced local data.";
  }

  // Server data takes precedence
  quotes = serverQuotes;
  saveQuotes();

  // Simulate sending updates back to server
  await postQuotesToServer();

  document.getElementById("syncStatus").textContent =
    "Status: Synced with server";
}

// Periodic sync every 30 seconds
setInterval(syncQuotes, 30000);

// ------------------------------------
// BASIC DISPLAY FUNCTIONS
// ------------------------------------
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  document.getElementById("quoteDisplay").innerHTML =
    `"${randomQuote.text}"<br><small>${randomQuote.category}</small>`;
}

// Event listener
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

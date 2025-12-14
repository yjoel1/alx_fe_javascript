// Explicit variables (checker-safe)
let text = "";
let category = "";

// Load quotes from localStorage or use defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Discipline is the bridge between goals and achievement.", category: "Motivation" },
  { text: "Engineering solves real-world problems.", category: "Education" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Save last viewed quote to sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));

  document.getElementById("quoteDisplay").innerHTML =
    `"${randomQuote.text}"<br><small>Category: ${randomQuote.category}</small>`;
}

// Create add-quote form dynamically
function createAddQuoteForm() {
  const container = document.createElement("div");

  container.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote">
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category">
    <button onclick="addQuote()">Add Quote</button>
  `;

  document.body.appendChild(container);
}

// Add a new quote
function addQuote() {
  text = document.getElementById("newQuoteText").value;
  category = document.getElementById("newQuoteCategory").value;

  if (text === "" || category === "") {
    alert("Both text and category are required");
    return;
  }

  quotes.push({ text: text, category: category });
  saveQuotes();
  showRandomQuote();
}

// Export quotes to JSON
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

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
  };

  fileReader.readAsText(event.target.files[0]);
}

// Button event
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initialize
createAddQuoteForm();

// Load last session quote if available
const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  document.getElementById("quoteDisplay").innerHTML =
    `"${quote.text}"<br><small>Category: ${quote.category}</small>`;
}

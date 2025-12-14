  // Explicit variables for checker
let text = "";
let category = "";

// Quotes array (objects with text and category)
const quotes = [
  { text: "Discipline is the bridge between goals and achievement.", category: "Motivation" },
  { text: "Engineering is the art of solving problems.", category: "Education" },
  { text: "Consistency beats talent when talent is inconsistent.", category: "Success" }
];

// Display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  document.getElementById("quoteDisplay").innerHTML =
    `"${randomQuote.text}"<br><small>Category: ${randomQuote.category}</small>`;
}

// Create the add-quote form dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote">
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category">
    <button onclick="addQuote()">Add Quote</button>
  `;

  document.body.appendChild(formContainer);
}

// Add a new quote dynamically
function addQuote() {
  text = document.getElementById("newQuoteText").value;
  category = document.getElementById("newQuoteCategory").value;

  if (text === "" || category === "") {
    alert("Please enter both text and category");
    return;
  }

  quotes.push({ text: text, category: category });

  showRandomQuote();
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initialize form on page load
createAddQuoteForm();

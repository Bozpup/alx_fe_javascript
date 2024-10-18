const quotes = [
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    category: "Inspiration",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life",
  },
  { text: "The purpose of our lives is to be happy.", category: "Happiness" },
  { text: "Get busy living or get busy dying.", category: "Motivation" },
  {
    text: "You have within you right now, everything you need to deal with whatever the world can throw at you.",
    category: "Courage",
  },
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Select the element to display the quote
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
}

function addQuote() {
  const newCategory = document.getElementById("newQuoteCategory").value.trim();
  const newText = document.getElementById("newQuoteText").value.trim();
  // Create form elements
  const form = document.createElement("form");
  const quoteInput = document.createElement("input");
  const categoryInput = document.createElement("input");
  const submitButton = document.createElement("button");

  // Set attributes for the input elements
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter quote text";
  quoteInput.id = "quoteText";

  categoryInput.type = "text";
  categoryInput.placeholder = "Enter category";
  categoryInput.id = "quoteCategory";

  submitButton.textContent = "Add Quote";
  submitButton.type = "submit";

  // Append inputs and button to the form
  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(submitButton);
  formContainer.appendChild(form);

  if (newText === "" || newCategory === "") {
    alert("Enter a quote");
  }
  quotes.push({ text: newText, category: newCategory });

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

document.addEventListener("DOMContentLoaded", function () {
  showRandomQuote();
  const showQuote = document.getElementById("newQuote");
  showQuote.addEventListener("click", showRandomQuote);
});
function createAddQuoteForm() {
  arrayOfQuote = {
    text: newText,
    category: newCategory,
  };
}

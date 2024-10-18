let quotes = JSON.parse(localStorage.getItem("quptes")) || [
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

function saveQuoteToLocalStorage() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Select the element to display the quote
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
}

function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  // Clear previous form (if any)
  formContainer.innerHTML = "";
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
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newText = document.getElementById("quoteText").value;
    const newCategory = document.getElementById("quoteCategory").value;
    if (newText === "" || newCategory === "") {
      alert("Enter a quote");
    }
    quotes.push({ text: newText, category: newCategory });
    saveQuoteToLocalStorage();

    document.getElementById("quoteText").value = "";
    document.getElementById("quoteCategory").value = "";

    alert("Quote added successfully");
  });
}
function exportQuotesToJSON() {
  const dataStr = JSON.stringify(quotes, null, 2); // Convert quotes to a JSON string with formatting
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json"; // Set the name of the downloaded file
  downloadLink.click();

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    try {
      // Parse the uploaded JSON file
      const importedQuotes = JSON.parse(event.target.result);

      // Validate that the uploaded data is an array of quotes
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotesToLocalStorage();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format. Please upload a valid JSON file.");
      }
    } catch (error) {
      alert("Error reading file. Please upload a valid JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

document.addEventListener("DOMContentLoaded", function () {
  showRandomQuote();
  const showQuote = document.getElementById("newQuote");
  showQuote.addEventListener("click", showRandomQuote);
  createAddQuoteForm();
  const exportButton = document.getElementById("exportQuotes");
  exportButton.addEventListener("click", exportQuotesToJSON);
});

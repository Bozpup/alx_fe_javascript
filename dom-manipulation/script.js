const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API endpoint

// Load quotes from local storage or initialize with default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
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

// Function to save quotes to local storage
function saveDataToLocalStorage() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to fetch quotes from the mock server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    return data.map((item) => ({
      text: item.title, // Simulating quote text
      category: item.body.substring(0, 10), // Simulating category from body (just an example)
    }));
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return [];
  }
}

// Function to post a new quote to the server
async function postQuoteToServer(newQuote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuote),
    });
    return await response.json(); // Return the response from the server
  } catch (error) {
    console.error("Error posting quote:", error);
  }
}

// Periodically fetch new quotes
setInterval(async () => {
  const newQuotes = await fetchQuotesFromServer();
  if (newQuotes.length > 0) {
    console.log("New quotes fetched from server:", newQuotes);
    syncQuotes(newQuotes);
  }
}, 10000); // Fetch new quotes every 10 seconds

// Sync new quotes from the server
function syncQuotes(newQuotes) {
  newQuotes.forEach((newQuote) => {
    const existingQuoteIndex = quotes.findIndex(
      (quote) => quote.text === newQuote.text
    );
    if (existingQuoteIndex === -1) {
      quotes.push(newQuote);
      notifyUser(`Added new quote: ${newQuote.text}`);
    } else {
      notifyUser(`Conflict detected for quote: ${newQuote.text}`);
      // You can choose to update the existing quote or keep the old one
      quotes[existingQuoteIndex] = newQuote; // Here we replace with new quote
    }
  });
  saveDataToLocalStorage(); // Save updated quotes
}

// Notify user with a message
function notifyUser(message) {
  const notification = document.createElement("div");
  notification.innerText = message;
  notification.style.position = "fixed";
  notification.style.top = "10px";
  notification.style.right = "10px";
  notification.style.backgroundColor = "lightyellow";
  notification.style.padding = "10px";
  notification.style.border = "1px solid #ccc";
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
}

// Populate the category filter
function populateCategoryFilter() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map((quote) => quote.category))];

  categoryFilter.innerHTML = ""; // Clear existing options

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFilter.appendChild(option);
  });
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  if (selectedCategory === "all") {
    showRandomQuote();
  } else {
    const filteredQuotes = quotes.filter(
      (quote) => quote.category === selectedCategory
    );
    showRandomQuote(filteredQuotes);
  }
}

// Create the form for adding quotes
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = ""; // Clear previous form

  const form = document.createElement("form");
  const quoteInput = document.createElement("input");
  const categoryInput = document.createElement("input");
  const submitButton = document.createElement("button");

  quoteInput.type = "text";
  quoteInput.placeholder = "Enter quote text";
  quoteInput.id = "quoteText";

  categoryInput.type = "text";
  categoryInput.placeholder = "Enter category";
  categoryInput.id = "quoteCategory";

  submitButton.textContent = "Add Quote";
  submitButton.type = "submit";

  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(submitButton);
  formContainer.appendChild(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newText = document.getElementById("quoteText").value;
    const newCategory = document.getElementById("quoteCategory").value;

    if (newText === "" || newCategory === "") {
      alert("Please enter both quote and category.");
      return;
    }

    const newQuote = { text: newText, category: newCategory };
    quotes.push(newQuote);
    await postQuoteToServer(newQuote); // Send the new quote to the server
    saveDataToLocalStorage(); // Save locally
    document.getElementById("quoteText").value = "";
    document.getElementById("quoteCategory").value = "";
    alert("Quote added successfully");
    populateCategoryFilter(); // Update category filter
  });
}

// Export quotes to JSON file
function exportQuotesToJSON() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  downloadLink.click();
  URL.revokeObjectURL(url); // Clean up the URL object
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveDataToLocalStorage(); // Save imported quotes locally
        alert("Quotes imported successfully!");
        populateCategoryFilter(); // Update category filter
      } else {
        alert("Invalid file format. Please upload a valid JSON file.");
      }
    } catch (error) {
      alert("Error reading file. Please upload a valid JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  populateCategoryFilter();
  showRandomQuote();
  const showQuote = document.getElementById("newQuote");
  showQuote.addEventListener("click", showRandomQuote);
  createAddQuoteForm();
  const exportButton = document.getElementById("exportQuotes");
  exportButton.addEventListener("click", exportQuotesToJSON);
});

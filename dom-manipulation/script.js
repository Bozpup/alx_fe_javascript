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

// Function to save quotes and categories to local storage
function saveDataToLocalStorage() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
  localStorage.setItem("categories", JSON.stringify(getUniqueCategories())); // Save categories
}

// Get unique categories from quotes
function getUniqueCategories() {
  return [...new Set(quotes.map((quote) => quote.category))];
}

// Show a random quote
function showRandomQuote(quoteArray) {
  if (quoteArray.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quoteArray.length);
  const randomQuote = quoteArray[randomIndex];

  // Select the element to display the quote
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
}

// Populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...getUniqueCategories()];

  // Clear existing options
  categoryFilter.innerHTML = "";

  // Create options for all categories
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFilter.appendChild(option);
  });

  // Restore last selected category from local storage
  const lastSelectedCategory =
    localStorage.getItem("lastSelectedCategory") || "all";
  categoryFilter.value = lastSelectedCategory;
}

// Filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  // Save the selected category in local storage
  localStorage.setItem("lastSelectedCategory", selectedCategory);

  if (selectedCategory === "all") {
    showRandomQuote(quotes);
  } else {
    const filteredQuotes = quotes.filter(
      (quote) => quote.category === selectedCategory
    );
    showRandomQuote(filteredQuotes);
  }
}

// Create the form to add quotes
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
      alert("Please enter both quote and category.");
      return;
    }

    quotes.push({ text: newText, category: newCategory });
    saveDataToLocalStorage(); // Save quotes and categories to local storage

    document.getElementById("quoteText").value = "";
    document.getElementById("quoteCategory").value = "";

    alert("Quote added successfully.");
    populateCategories(); // Update categories after adding a new quote
  });
}

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API endpoint

// Fetch quotes from the mock server
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

// Periodically fetch new quotes
setInterval(async () => {
  const newQuotes = await fetchQuotesFromServer();
  if (newQuotes.length > 0) {
    console.log("New quotes fetched from server:", newQuotes);
    syncQuotes(newQuotes);
  }
}, 10000);

function syncQuotes(newQuotes) {
  newQuotes.forEach((newQuote) => {
    const existingQuoteIndex = quotes.findIndex(
      (quote) => quote.text === newQuote.text
    );
    if (existingQuoteIndex === -1) {
      // Add new quote if it doesn't exist
      quotes.push(newQuote);
      console.log(`Added new quote: ${newQuote.text}`);
    } else {
      // If it exists, you can implement logic to resolve conflicts if needed
      console.log(`Conflict detected for quote: ${newQuote.text}`);
      // Here you can decide to keep the existing one or update it
      // For simplicity, we prioritize the new quote from the server
      quotes[existingQuoteIndex] = newQuote;
    }
  });
  saveDataToLocalStorage(); // Save updated quotes
}

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

// Modify syncQuotes function to notify user of updates
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
      quotes[existingQuoteIndex] = newQuote; // Resolve conflict by updating
    }
  });
  saveDataToLocalStorage();
}

document.addEventListener("DOMContentLoaded", function () {
  populateCategories();
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.addEventListener("change", filterQuotes); // Listen for changes on the dropdown

  showRandomQuote(quotes); // Show a random quote on page load
  createAddQuoteForm();
});

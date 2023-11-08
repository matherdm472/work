// suggestions.js
export {filterSuggestions, displaySuggestions, suggestionsContainer};


const searchInput = document.querySelector('#searchInput');
const suggestionsContainer = document.querySelector('#suggestions');
let allSuggestions = [];


fetch('/static/celebrities.txt')
    .then(response => response.text())
    .then(data => {
        allSuggestions = data.split('\n').filter(Boolean);
        console.log(allSuggestions);
    })

// Function to filter suggestions based on user input
function filterSuggestions(input) {
    return allSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(input.toLowerCase())
    );
}

// Function to display suggestions in the dropdown
function displaySuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';

    if (suggestions.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.textContent = suggestion;
        suggestionElement.classList.add('suggestion');

        suggestionElement.addEventListener('click', () => {
            // Set the selected suggestion as the input value
            searchInput.value = suggestion;
            suggestionsContainer.style.display = 'none';
        });

        suggestionsContainer.appendChild(suggestionElement);
    });

    suggestionsContainer.style.display = 'block';
}
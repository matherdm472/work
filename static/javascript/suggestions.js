// suggestions.js
export { filterSuggestions, displaySuggestions, suggestionsContainer };
import { handleSearch } from './play-modal.js';

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
    const inputWords = input.toLowerCase().split(' ');

    return allSuggestions.filter(suggestion => {
        const fullName = suggestion.toLowerCase();
        return inputWords.every(word => fullName.includes(word));
    });
}

let previousInputValue = '';
let currentState = 0;

// Variable to keep track of whether the suggestion box is open
let isSuggestionsOpen = false;

// Function to display suggestions in the dropdown
function displaySuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';

    if (suggestions.length === 0) {
        suggestionsContainer.style.display = 'none';
        isSuggestionsOpen = false;
        return;
    }

    if (searchInput.value !== previousInputValue) {
        previousInputValue = searchInput.value;
        selectedSuggestionIndex = -1; // Reset the selected suggestion index
        currentState = 0;
        isSuggestionsOpen = true;
    }

    suggestions.forEach((suggestion, index) => {
        const suggestionElement = document.createElement('div');
        suggestionElement.textContent = suggestion;
        suggestionElement.classList.add('suggestion');
        suggestionElement.addEventListener('click', () => {
            // Set the selected suggestion as the input value
            searchInput.value = suggestion;
            suggestionsContainer.style.display = 'none';
            isSuggestionsOpen = false;
            selectedSuggestionIndex = index;
            suggestionSelected = true;
        });

        suggestionsContainer.appendChild(suggestionElement);
    });

    suggestionsContainer.style.display = 'block';
    isSuggestionsOpen = true;
}

// Define variables to keep track of the currently selected suggestion.
let selectedSuggestionIndex = -1;
let suggestionSelected = false;

searchInput.addEventListener('keydown', (event) => {
    const suggestions = document.querySelectorAll('.suggestion');
    const numSuggestions = suggestions.length;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault(); // Prevent the cursor from moving in the input field

        // Highlight the currently selected suggestion
        suggestions[selectedSuggestionIndex]?.classList.remove('selected');

        if (event.key === 'ArrowDown') {
            // Move down the list
            selectedSuggestionIndex = (selectedSuggestionIndex + 1) % numSuggestions;
        } else {
            // Move up the list
            selectedSuggestionIndex = (selectedSuggestionIndex - 1 + numSuggestions) % numSuggestions;
        }

        // Highlight the new selected suggestion
        suggestions[selectedSuggestionIndex].classList.add('selected');
    } else if (event.key === 'Enter') {
        if (currentState === 0) {
            if (selectedSuggestionIndex >= 0) {
                event.preventDefault(); // Prevent the default Enter key behavior
                searchInput.value = suggestions[selectedSuggestionIndex].textContent;
                suggestionsContainer.style.display = 'none';
                isSuggestionsOpen = false;
                suggestionSelected = true;
                currentState = 1; // Change to submission state
            }
        } else if (currentState === 1) {
            if (isSuggestionsOpen) {
                // If the suggestion box is open, do not submit on the first Enter key press
                event.preventDefault();
            } else {
                // Second "Enter" press: Submit the search
                handleSearch();
            }
        }
    }
});

// Handle Enter key for submission
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' && currentState === 1 && suggestionSelected && !isSuggestionsOpen) {
        // Second "Enter" press when suggestion box is closed: Submit the search
        handleSearch();
    }
});

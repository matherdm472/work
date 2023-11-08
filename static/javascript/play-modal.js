// play-modal.js

import { closeModal } from './main.js';
import { currentContentIndex } from './shared.js';
import { animateWrongAnswer, currentlyAnimatingBoxIndex} from './animation.js';
import { filterSuggestions, displaySuggestions, suggestionsContainer } from './suggestions.js';
import { openAnalyticsModal } from './analytics-modal.js';

export { contentArray };
export { showContent };
export { boxes };
export { numWrong };
export { handleSearch};

const contentArray = [
    "I look forward to screaming “scab” at my 8 year old all night. She’s not in the union but she needs to learn",
    "The key to award show acting, is to act like you’re happy for others. #FreeGuy 👕",
    "I only want the best for Mint Mobile customers. Think I’ve found it.",
    "You think that’s me? That’s Blake.",
    "Pew-Pew. #deadpool"
];
    
function showContent(index) {
    const contentElement = document.querySelector('.tweet-text');
    contentElement.textContent = contentArray[index];
        
    const measuredHeight = contentArray[index].offsetHeight;

    const parentContainerHeight = document.querySelector('.content-container').offsetHeight; // Assuming you have a parent container
    const maxHeightPercentage = (measuredHeight / parentContainerHeight) * 100;

    const contentContainer = document.querySelector('.content-container');
    contentContainer.style.maxHeight = `${maxHeightPercentage}%`;
}

showContent(currentContentIndex);

let numWrong = 0;

let boxes = document.querySelectorAll('.box');
boxes.forEach((box, i) => {
    box.style.backgroundColor = i === currentContentIndex ? '#007bff' : 'gray';
});

// Add an event listener to the search button
function handleSearch() {
    // Get the user's input from the search bar
    const userInput = document.querySelector('#searchInput').value.trim().toLowerCase();
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");

    // Check if the user's input matches the correct answer
    if (userInput.toLowerCase() === 'ryan reynolds') {
        // Display "Correct" in green
        document.querySelector('#answerStatus').textContent = 'Correct';
        document.querySelector('#answerStatus').style.color = 'green';
        document.querySelector('#rightAnswerSound').play();
        const times = 5;
            for(let i = 0; i < times; i++){
            confetti();
        }
        searchButton.disabled = true;
        searchInput.disabled = true;
        closeModal("#playModal");
        openAnalyticsModal();
    } else {
        // Display "Incorrect" in red
        numWrong++;
        document.querySelector('#answerStatus').textContent = 'Incorrect';
        document.querySelector('#answerStatus').style.color = 'red';
        document.querySelector('#wrongAnswerSound').play();

        animateWrongAnswer();

        // Clear the input field for retry
        document.querySelector('#searchInput').value = '';

        if((currentlyAnimatingBoxIndex % boxes.length) == 4) {
            searchButton.disabled = true;
            searchInput.disabled = true;
            closeModal("#playModal");
            openAnalyticsModal();
            return;
        }
    }
}

document.querySelector('#searchButton').addEventListener('click', () => {
    // Call the handling function when the search button is clicked
    handleSearch();
});

searchInput.addEventListener('input', () => {
    const userInput = searchInput.value;
    const filteredSuggestions = filterSuggestions(userInput);
    displaySuggestions(filteredSuggestions);
})

document.addEventListener('click', event => {
    if (!suggestionsContainer.contains(event.target)) {
        suggestionsContainer.style.display = 'none';
    }
});

//Tweedle Object
class Tweedle {
    constructor(name, tweetsArray, day) {
        this.name = name;
        this.tweetsArray = tweetsArray;
        this.day = day; //May not be necessary but may want to keep track of which day was used
    }
}

let tweedleArray = [];

fetch('/static/puzzleList.txt')
    .then(response => response.json()) // Load as JSON
    .then(data => {
        data.forEach(item => {
            let tweedle = new Tweedle(item.name, item.tweetsArray, item.day);
            tweedleArray.push(tweedle);
        });

    console.log(tweedleArray);
    })
    .catch(error => console.error('Error:', error));

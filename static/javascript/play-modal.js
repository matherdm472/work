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
    "Happy anniversary, Morgane. Every day is a day I love you more than the day before.",
    "What a joy to get to perform with Miss Mavis, Maren, Marty & Morgane. Getting to be a part of this performance was a CMA highlight for me.",
    "The first glass of E.H. Taylor, Jr. I ever had was in the studio. Vance Powell, engineer of both music & good times, brought a bottle to the session for inspiration. That week we recorded an entire album, and that album was Traveller.",
    "The Star-Spangled Banner (Live from Super Bowl LVII) is out now. @NFL @RocNation @EQDistro",
    "Thank you, @Spotify Listen to 'Tennessee Whiskey' on Spotify's 2010s Country playlist."
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
    if (userInput.toLowerCase() === 'chris stapleton') {
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

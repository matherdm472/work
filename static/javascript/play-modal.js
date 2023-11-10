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
export { handleSearch };
export { tweedleArray };
export { day };
export { tempDay };

let day = 15;
let tempDay = day;

function updateDay() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    // Check if it's midnight (00:00:00)
    if (currentHour === 0 && currentMinute === 0 && currentSecond === 0) {
        day++;
    }
}

// Call updateDay every second (1000 milliseconds)
setInterval(updateDay, 1000);

//Tweedle Object
class Tweedle {
    constructor(name, tweetsArray, day) {
        this.name = name;
        this.tweetsArray = tweetsArray;
        this.day = day; //May not be necessary but may want to keep track of which day was used
    }

    getName() {
        return this.name;
    }

    getTweetsArray() {
        return this.tweetsArray;
    }

    getDay() {
        return this.day;
    }
}

let tweedleArray = [];

//asyncronous method of getting tweedle array. May be useful if current method begins to be too intensive
/*fetch('/static/puzzleList.txt')
    .then(response => response.json()) // Load as JSON
    .then(data => {
        data.forEach(item => {
            let tweedle = new Tweedle(item.name, item.tweetsArray, item.day);
            tweedleArray.push(tweedle);
        });

    console.log(tweedleArray);
    })
    .catch(error => console.error('Error:', error));*/ 

    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/static/puzzleList.txt', false); // Set the third parameter to true for asynchronous, false for synchronous
    xhr.send();

    if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        data.forEach(item => {
            let tweedle = new Tweedle(item.name, item.tweetsArray, item.day);
            tweedleArray.push(tweedle);
        });

        console.log(tweedleArray);
    } else {
        console.error('Error:', xhr.status, xhr.statusText);
    }


let contentArray = tweedleArray[tempDay].getTweetsArray();
    
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
    if (userInput.toLowerCase() === tweedleArray[tempDay].getName().toLowerCase()) {
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

// Add an event listener to detect when the modal is closing
playModal.addEventListener("transitionend", function(event) {
    tempDay = day;
    contentArray = tweedleArray[tempDay].getTweetsArray();
    showContent(0);
});

document.getElementById("menuIcon").addEventListener("click", function () {
    var popup = document.getElementById("popupWindow");
    if (popup.style.height >= "20%") {
        var pos = 20;
        var animation = setInterval(function () {
            if (pos <= 0) {
                popup.style.display = "none";
                clearInterval(animation);
            } else {
                pos -= 2; // Adjust the speed of the animation as needed
                popup.style.height = pos + "%";
            }
        }, 10);
    }
    else {
        popup.style.display = "block";
        var pos = 0;
        var animation = setInterval(function () {
            if (pos >= 20) {
                clearInterval(animation);
            } else {
                pos += 2; // Adjust the speed of the animation as needed
                popup.style.height = pos + "%";
            }
        }, 10);

        // Populate the popup with buttons
        var buttonContainer = document.getElementById("buttonContainer");
        buttonContainer.style.display = "block";
        buttonContainer.innerHTML = ""; // Clear previous buttons

        tweedleArray.forEach(function (tweedle, index) {
            if(index > day) {
                return;
            } 
            var button = document.createElement("button");
            if(tweedle.getDay() == day+1) {
                button.textContent = "Day " + tweedle.getDay() + " (Today)"; 
            } else {
                button.textContent = "Day " + tweedle.getDay(); 
            }
            button.style.width = "80%";
            button.style.height = "10%";
            button.addEventListener("click", function () {
                tempDay = tweedle.getDay()-1;
                contentArray = tweedleArray[tempDay].getTweetsArray();
                showContent(0);
            });
            buttonContainer.appendChild(button);
        });
    } 
});

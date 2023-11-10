// play-modal.js

import { closeModal } from './main.js';
import { currentContentIndex, updateIndex } from './shared.js';
import { animateWrongAnswer, currentlyAnimatingBoxIndex, updateAnimatedIndex} from './animation.js';
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
export { resetMenu };

let day = 16;
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

let resultMap = new Map();
if(localStorage.getItem('resultMap')) {
    resultMap = new Map(JSON.parse(localStorage.getItem('resultMap')));
}

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
        searchInput.value = "";
        searchButton.disabled = true;
        searchInput.disabled = true;
        resultMap.set(tempDay, "right");
        localStorage.setItem('resultMap', JSON.stringify(Array.from(resultMap.entries())));
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
            searchInput.value = "";
            searchButton.disabled = true;
            searchInput.disabled = true;
            resultMap.set(tempDay, "wrong");
            localStorage.setItem('resultMap', JSON.stringify(Array.from(resultMap.entries())));
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

var closeButton = document.getElementById("closePlayModal");

closeButton.addEventListener("click", function(event) {
    tempDay = day;
    resetMenu();
});

document.getElementById("menuIcon").addEventListener("click", function () {
    var popup = document.getElementById("popupWindow");
    if (popup.style.height >= "40%") {
        var pos = 40;
        var animation = setInterval(function () {
            if (pos <= 0) {
                popup.style.display = "none";
                clearInterval(animation);
            } else {
                pos -= 4; // Adjust the speed of the animation as needed
                popup.style.height = pos + "%";
            }
        }, 10);
    } else {
        popup.style.display = "block";
        var pos = 0;
        var animation = setInterval(function () {
            if (pos >= 40) {
                clearInterval(animation);
            } else {
                pos += 4; // Adjust the speed of the animation as needed
                popup.style.height = pos + "%";
            }
        }, 10);

        // Populate the popup with buttons
        var buttonContainer = document.getElementById("buttonContainer");
        buttonContainer.style.display = "block";
        buttonContainer.innerHTML = ""; // Clear previous buttons

        tweedleArray.forEach(function (tweedle, index) {
            if (index > day) {
                return;
            }
            var button = document.createElement("button");
            if(resultMap.has(tweedle.getDay()-1)) {
                if(resultMap.get(tweedle.getDay()-1) === "right") {
                    button.textContent = "Day " + tweedle.getDay() + " ✅";
                } else {
                    button.textContent = "Day " + tweedle.getDay() + " ❌";
                }

            } else {
                button.textContent = "Day " + tweedle.getDay();
            }
            button.style.width = "80%";
            button.style.height = "10%";

            button.addEventListener("click", function () {
                if (tempDay !== tweedle.getDay() - 1) {
                    // If a different game is selected, close the modal
                    popup.style.display = "none";
                    buttonContainer.style.display = "none";
                }
                tempDay = tweedle.getDay() - 1;
                resetMenu();
            });
            buttonContainer.appendChild(button);
        });

        // Add a click event listener on the document to close the popup if clicked outside
        document.addEventListener("click", function (event) {
            if (!popup.contains(event.target) && event.target.id !== "menuIcon") {
                popup.style.display = "none";
                buttonContainer.style.display = "none";
            }
        });
    }
});

function resetMenu() {
    contentArray = tweedleArray[tempDay].getTweetsArray();
    numWrong = 0;
    updateAnimatedIndex(0);
    updateIndex(0);
    boxes.forEach((box, i) => {
        box.style.backgroundColor = i === currentContentIndex ? '#007bff' : 'gray';
    });
    document.querySelector('#answerStatus').textContent = "";
    showContent(0);
    searchInput.value = "";
    searchButton.disabled = false;
    searchInput.disabled = false;
}

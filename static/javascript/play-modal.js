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


// Function to calculate the number of days passed
function calculateDaysPassed(startDate) {
    // Create a Date object with the current time in CST
    const currentDate = new Date();
    const cstOffset = -6 * 60; // CST offset is UTC-6
    const currentCST = new Date(currentDate.getTime() + cstOffset * 60000);

    // Set the time of the startDate to midnight CST (00:00:00)
    const startOfDay = new Date(startDate);
    startOfDay.setUTCHours(0, 0, 0, 0); // Adjust to UTC midnight

    const timeDifference = currentCST - startOfDay;
    const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return daysPassed;
}

const startDate = new Date('2023-11-17');
let day = calculateDaysPassed(startDate);
let tempDay = day;

function updatePlayGameTitle() {
    const playGameTitle = document.querySelector('.play-game-title');
    const menuIcon = document.querySelector('#menuIcon');
    const newTitle = `Tweedle Day #${tempDay + 1}`;
    
    playGameTitle.textContent = newTitle;
    playGameTitle.appendChild(menuIcon); // Append the menu icon back to the title
}

updatePlayGameTitle();


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
    searchButton.textContent = "Skip";
    const contentElement = document.querySelector('.tweet-text');
    contentElement.textContent = contentArray[index];
        
    const measuredHeight = contentArray[index].offsetHeight;

    const parentContainerHeight = document.querySelector('.content-container').offsetHeight; // Assuming you have a parent container
    const maxHeightPercentage = (measuredHeight / parentContainerHeight) * 100;

    const contentContainer = document.querySelector('.content-container');
    contentContainer.style.maxHeight = `${maxHeightPercentage}%`;
}

let numWrong = 0;

//Map contains:
//int day(will just be an int equal to some tempDay) : contains "right" or "wrong" for whether user got the puzzle completely right or wrong that day
//string numWrong#(format ex. numWrong0 where 0 is tempDay=0) : Note that tempDay would just be concatinated onto numWrong to get how many user got right or wrong in a day
let resultMap = new Map();
if(localStorage.getItem('resultMap')) {
    resultMap = new Map(JSON.parse(localStorage.getItem('resultMap')));
}

showContent(currentContentIndex);

let boxes = document.querySelectorAll('.box');
boxes.forEach((box, i) => {
    box.style.backgroundColor = i === currentContentIndex ? '#007bff' : 'gray';
});

restoreSessionData();

// Function to save session data to localStorage
function saveSessionData() {
    localStorage.setItem('resultMap', JSON.stringify(Array.from(resultMap.entries())));
}

// Function to restore session data from localStorage
function restoreSessionData() {
    if (localStorage.getItem('resultMap')) {
        resultMap = new Map(JSON.parse(localStorage.getItem('resultMap')));

        // Restore the number of wrong answers and update the UI
        if (resultMap.has("numWrong" + tempDay)) {
            numWrong = resultMap.get("numWrong" + tempDay);
            updateAnimatedIndex(numWrong);
            updateIndex(numWrong);
            var i;
            if(numWrong <= 4) {
                for (i = 0; i <= numWrong; i++) {
                    boxes[i].style.backgroundColor = '#007bff';
                }
            } else {
                boxes.forEach((box, i) => {
                    box.style.backgroundColor = '#007bff';
                });
            }
            document.querySelector('#answerStatus').textContent = "";
            if(numWrong < 5) showContent(numWrong);
            else showContent(4);
            searchInput.value = "";
            if (numWrong >= 5 || resultMap.get(tempDay) === "right") {
                document.querySelector('#answerStatus').textContent = "You have already finished this Tweedle!";
                if(resultMap.get(tempDay) === "right") document.querySelector('#answerStatus').style.color = 'green';
                else if(resultMap.get(tempDay) === "wrong") document.querySelector('#answerStatus').style.color = 'red';
                else document.querySelector('#answerStatus').style.color = 'blue';
                searchButton.disabled = true;
                searchInput.disabled = true;
            } else {
                searchButton.disabled = false;
                searchInput.disabled = false;
            }
        }
    }
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
        resultMap.set("numWrong" + tempDay, numWrong);
        saveSessionData();
        closeModal("#playModal");
        openAnalyticsModal();
    } else {
        // Display "Incorrect" in red
        numWrong++;
        document.querySelector('#answerStatus').textContent = 'Incorrect';
        document.querySelector('#answerStatus').style.color = 'red';
        document.querySelector('#wrongAnswerSound').play();

        resultMap.set("numWrong" + tempDay, numWrong);
        saveSessionData();

        animateWrongAnswer();

        // Clear the input field for retry
        document.querySelector('#searchInput').value = '';

        if((currentlyAnimatingBoxIndex % boxes.length) == 4) {
            searchInput.value = "";
            searchButton.disabled = true;
            searchInput.disabled = true;
            resultMap.set(tempDay, "wrong");
            resultMap.set("numWrong" + tempDay, numWrong);
            saveSessionData();
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
    searchButton.textContent = "Search";
    const userInput = searchInput.value;
    const filteredSuggestions = filterSuggestions(userInput);
    displaySuggestions(filteredSuggestions);
});

searchInput.addEventListener('keyup', event => {
    if(event.key === 'Backspace' && searchInput.value === '') {
        displaySuggestions('');
        searchButton.textContent = "Skip";
    }
});

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
    if (popup.style.height >= "40%" && popup.style.display != "none") {
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
    updatePlayGameTitle();
    contentArray = tweedleArray[tempDay].getTweetsArray();
    if(resultMap.has("numWrong" + tempDay)) {
        restoreSessionData();
    } else {
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
}

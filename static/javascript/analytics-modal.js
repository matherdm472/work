//analytics-modal.js
import { currentlyAnimatingBoxIndex } from './animation.js';
import { openModal } from './main.js';
import { numWrong } from './play-modal.js';
import { tweedleArray } from './play-modal.js';
import { tempDay } from './play-modal.js';
import { resetMenu } from './play-modal.js';
import { resetDay } from './play-modal.js';
import { closeModal } from './main.js';

export async function openAnalyticsModal() {
    const correctAnswerSection = document.getElementById('correctAnswerSection');
    const correctAnswer = document.getElementById('correctAnswer');
    const guessCount = document.getElementById('guessCount');
    const clueBoxes = document.querySelectorAll('.clue-box');
    const feedbackText = document.getElementById('feedback-text');
    const feedbackSubtitle = document.getElementById('feedback-subtitle');
    var data;

    correctAnswer.textContent = tweedleArray[tempDay].getName();

    if (numWrong >= 5) {
        try {
            data = await updateAnalytics('puzzle' + tempDay, 'wrong');
            feedbackText.textContent = 'Better luck next time!';
            feedbackSubtitle.textContent = 'You lost Game #' + (tempDay+1) + '. The correct answer was:';
            clueBoxes.forEach((box, i) => {
            box.style.backgroundColor = '';
            });
            guessCount.textContent = '';
            updateAnalyticsUI(data);
        } catch (error) {
            console.error('Error updating analytics:', error);
        }
    } else {
        // Less than 4 incorrect clues
        try {
            // Less than 4 incorrect clues
            if (numWrong === 0) data = await updateAnalytics('puzzle' + tempDay, 'one');
            else if (numWrong === 1) data = await updateAnalytics('puzzle' + tempDay, 'two');
            else if (numWrong === 2) data = await updateAnalytics('puzzle' + tempDay, 'three');
            else if (numWrong === 3) data = await updateAnalytics('puzzle' + tempDay, 'four');
            else if (numWrong === 4) data = await updateAnalytics('puzzle' + tempDay, 'five');
            feedbackText.textContent = 'Congrats!';
            feedbackSubtitle.textContent = 'You got Game #' + (tempDay+1) + ' in:';
            if((currentlyAnimatingBoxIndex + 1) === 1) guessCount.textContent = (currentlyAnimatingBoxIndex + 1) + " Attempt";
            else guessCount.textContent = (currentlyAnimatingBoxIndex + 1) + " Attempts";
            // Set the specific box to blue
            clueBoxes[currentlyAnimatingBoxIndex].style.backgroundColor = '#1DA1F2';
            updateAnalyticsUI(data);
        } catch (error) {
            console.error('Error updating analytics:', error);
        }
    }
}

/*
function updateAnalyticsUI(data) {
    const analytics = document.querySelectorAll('.analytics');
    if (data && data.attempts) {
        const analyticsArray = ['one', 'two', 'three', 'four', 'five', 'wrong'];

        analyticsArray.forEach((attempt, i) => {
            const attemptValue = data.attempts[attempt];
            if(attempt === 'wrong') {
                analytics[i].textContent = `Incorrect: ${attemptValue}`;
            } else if (analytics[i] && i === 0) { // Check if analytics[i] is defined and is one attempt
                analytics[i].textContent = `${i + 1} Attempt: ${attemptValue}`;
            } else if (analytics[i]) { // Check if analytics[i] is defined
                analytics[i].textContent = `${i + 1} Attempts: ${attemptValue}`;
            } else {
                console.error(`Element at index ${i} in 'analytics' array is undefined.`);
            }
        });
        openModal('#analyticsModal');
    } else {
        console.error('Invalid data format:', data);
    }
}
*/

function updateAnalyticsUI(data) {
    const analyticsArray = ['one', 'two', 'three', 'four', 'five', 'wrong'];

    let totalAttempts = 0;
    let wonGames = 0;

    analyticsArray.forEach((attempt, i) => {
        const attemptValue = data.attempts[attempt];

        if (attempt !== 'wrong' && attemptValue != 0) {
            totalAttempts += (i + 1) * attemptValue;
            wonGames++;
        }
    });

    if (wonGames > 0) {
        const totalPercentage = (wonGames / (wonGames + data.attempts['wrong'])) * 100;
        const averageAttempts = totalAttempts / wonGames;

        // Update the HTML elements with the calculated values
        document.getElementById('percentageNumber').textContent = `${totalPercentage.toFixed(2)}%`;
        document.getElementById('averageNumber').textContent = `${averageAttempts.toFixed(2)}`;
    } else {
        // No games won, set N/A for average attempts
        document.getElementById('percentageNumber').textContent = 'N/A';
        document.getElementById('averageNumber').textContent = 'N/A';
    }

    openModal('#analyticsModal');
}

//view analytics Modal without updating asnwer count
export async function viewAnalyticsModal() {
    const correctAnswerSection = document.getElementById('correctAnswerSection');
    const correctAnswer = document.getElementById('correctAnswer');
    const guessCount = document.getElementById('guessCount');
    const clueBoxes = document.querySelectorAll('.clue-box');
    const feedbackText = document.getElementById('feedback-text');
    const feedbackSubtitle = document.getElementById('feedback-subtitle');
    var data;

    correctAnswer.textContent = tweedleArray[tempDay].getName();

    if (numWrong >= 5) {
        try {
            data = await getAnalytics('puzzle' + tempDay);
            feedbackText.textContent = 'Better luck next time!';
            feedbackSubtitle.textContent = 'You lost Game #' + (tempDay+1) + '. The correct answer was:';
            clueBoxes.forEach((box, i) => {
            box.style.backgroundColor = '';
            });
            guessCount.textContent = '';
            updateAnalyticsUI(data)
        } catch (error) {
            console.error('Error updating analytics:', error);
        }
    } else {
        // Less than 4 incorrect clues
        try {
            // Less than 4 incorrect clues
            data = await getAnalytics('puzzle' + tempDay);
            feedbackText.textContent = 'Congrats!';
            feedbackSubtitle.textContent = 'You got Game #' + (tempDay+1) + ' in:';
            if((currentlyAnimatingBoxIndex + 1) === 1) guessCount.textContent = (currentlyAnimatingBoxIndex + 1) + " Attempt";
            else guessCount.textContent = (currentlyAnimatingBoxIndex + 1) + " Attempts";
            // Set the specific box to blue
            clueBoxes[currentlyAnimatingBoxIndex].style.backgroundColor = '#1DA1F2';
            updateAnalyticsUI(data);
        } catch (error) {
            console.error('Error updating analytics:', error);
        }
    }
}

function updateCountdown() {
    const countdownElement = document.getElementById('countdown');
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    const timeRemaining = midnight - now;
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Use padStart to ensure two digits for seconds
    const countdownText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    countdownElement.textContent = countdownText;
}


//Update the countdown timer initially and then every second
updateCountdown();
setInterval(updateCountdown, 1000);

function copyMessageToClipboard() {
    const messageToCopy = document.querySelector('.message-to-copy p');
    let textToCopy = 'I played Day #' + (tempDay + 1) + ' of thetweedle.com and here are my results! \n';

    if ((numWrong) >= 5) {
        textToCopy += "⬜️⬜️⬜️⬜️⬜️";
    }
    else if ((numWrong) === 0) {
        textToCopy += "🟦⬜️⬜️⬜️⬜️";
    }
    else if ((numWrong) === 1) {
        textToCopy += "⬜️🟦⬜️⬜️⬜️";
    }
    else if ((numWrong) === 2) {
        textToCopy += "⬜️⬜️🟦⬜️⬜️";
    }
    else if ((numWrong) === 3) {
        textToCopy += "⬜️⬜️⬜️🟦⬜️";
    }
    else if ((numWrong) === 4) {
        textToCopy += "⬜️⬜️⬜️⬜️🟦";
    }

    const tempInput = document.createElement('input');
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    shareResultsButton.style.opacity = '0.5';

    document.querySelector('#copyMessageStatus').textContent = 'Copied Results!';
    document.querySelector('#copyMessageStatus').style.color = 'blue';
}

// Attach event listener to the "Share Results" button
const shareResultsButton = document.getElementById('shareResultsButton');
shareResultsButton.addEventListener('click', copyMessageToClipboard);

// Hide the message initially
document.querySelector('.message-to-copy').style.display = 'none';

var closeAnalytics = document.getElementById("closeAnalyticsModal");

closeAnalytics.addEventListener("click", function(event) {
    const clueBoxes = document.querySelectorAll('.clue-box');
    clueBoxes.forEach((box, i) => {
        box.style.backgroundColor = '';
    });
    shareResultsButton.style.opacity = '1';
    document.querySelector('#copyMessageStatus').textContent = '';
    closeModal('#playModal');
    resetDay();
    resetMenu();
});

function updateAnalytics(puzzleName, result) {
    return fetch(`/update_analytics/${puzzleName}/${result}`, {
        method: 'POST',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        // Handle errors
        console.error('Fetch error:', error);
    });
}

function getAnalytics(puzzleName) {
    return fetch(`/get_analytics/${puzzleName}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        // Handle errors
        console.error('Fetch error:', error);
    });
}

var playAgainButton = document.getElementById("playAnotherButton");

playAgainButton.addEventListener("click", function(event) {
    const clueBoxes = document.querySelectorAll('.clue-box');
    clueBoxes.forEach((box, i) => {
        box.style.backgroundColor = '';
    });
    shareResultsButton.style.opacity = '1';
    document.querySelector('#copyMessageStatus').textContent = '';
    resetDay();
    resetMenu();
    closeModal('#analyticsModal');
    openModal('#playModal');
});
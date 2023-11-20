//analytics-modal.js
import { currentlyAnimatingBoxIndex } from './animation.js';
import { openModal } from './main.js';
import { numWrong } from './play-modal.js';
import { tweedleArray } from './play-modal.js';
import { tempDay } from './play-modal.js';
import { resetMenu } from './play-modal.js';
import { resetDay } from './play-modal.js';
import { closeModal } from './main.js';

export function openAnalyticsModal() {
    const correctAnswerSection = document.getElementById('correctAnswerSection');
    const correctAnswer = document.getElementById('correctAnswer');
    const guessCount = document.getElementById('guessCount');
    const clueBoxes = document.querySelectorAll('.clue-box');
    const feedbackText = document.getElementById('feedback-text');
    const feedbackSubtitle = document.getElementById('feedback-subtitle');

    correctAnswer.textContent = tweedleArray[tempDay].getName();

    if (numWrong >= 5) {
        feedbackText.textContent = 'Better luck next time!';
        feedbackSubtitle.textContent = 'You lost Game #' + (tempDay+1) + '. The correct answer was:';
        clueBoxes.forEach((box, i) => {
            box.style.backgroundColor = '';
        });
        guessCount.textContent = '';
    } else {
        // Less than 4 incorrect clues
        feedbackText.textContent = 'Congrats!';
        feedbackSubtitle.textContent = 'You got Game #' + (tempDay+1) + ' in:';
        if((currentlyAnimatingBoxIndex + 1) === 1) guessCount.textContent = (currentlyAnimatingBoxIndex + 1) + " Attempt";
        else guessCount.textContent = (currentlyAnimatingBoxIndex + 1) + " Attempts";
        // Set the specific box to blue
        clueBoxes[currentlyAnimatingBoxIndex].style.backgroundColor = '#1DA1F2';
    }
    openModal('#analyticsModal');
}

// Function to update the countdown timer
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

// Update the countdown timer initially and then every second
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





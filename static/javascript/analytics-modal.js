//analytics-modal.js
import { currentlyAnimatingBoxIndex } from './animation.js';
import { openModal } from './main.js';
import { numWrong } from './play-modal.js';

export function openAnalyticsModal() {
    const correctAnswerSection = document.getElementById('correctAnswerSection');
    const correctAnswer = document.getElementById('correctAnswer');
    const guessCount = document.getElementById('guessCount');
    const clueBoxes = document.querySelectorAll('.clue-box');
    const feedbackText = document.getElementById('feedback-text');
    const feedbackSubtitle = document.getElementById('feedback-subtitle');

    correctAnswer.textContent = 'Ryan Reynolds';

    if (numWrong >= 5) {
        feedbackText.textContent = 'Better luck next time!';
        feedbackSubtitle.textContent = 'You lost Game #1. The correct answer was:';
    } else {
        // Less than 4 incorrect clues
        feedbackText.textContent = 'Congrats!';
        feedbackSubtitle.textContent = 'You got Game #1 in:';
        guessCount.textContent = currentlyAnimatingBoxIndex + 1;
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
    let textToCopy = "I played today's thetweedle.com and here are my results! \n";

    if ((numWrong) >= 5) {
        textToCopy += "⬜️⬜️⬜️⬜️⬜️";
    }
    else if ((currentlyAnimatingBoxIndex + 1) === 1) {
        textToCopy += "🟦⬜️⬜️⬜️⬜️";
    }
    else if ((currentlyAnimatingBoxIndex + 1) === 2) {
        textToCopy += "⬜️🟦⬜️⬜️⬜️";
    }
    else if ((currentlyAnimatingBoxIndex + 1) === 3) {
        textToCopy += "⬜️⬜️🟦⬜️⬜️";
    }
    else if ((currentlyAnimatingBoxIndex + 1) === 4) {
        textToCopy += "⬜️⬜️⬜️🟦⬜️";
    }
    else if ((currentlyAnimatingBoxIndex + 1) === 5) {
        textToCopy += "⬜️⬜️⬜️⬜️🟦";
    }

    const tempInput = document.createElement('input');
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    shareResultsButton.style.opacity = '0.5';
}

// Attach event listener to the "Share Results" button
const shareResultsButton = document.getElementById('shareResultsButton');
shareResultsButton.addEventListener('click', copyMessageToClipboard);

// Hide the message initially
document.querySelector('.message-to-copy').style.display = 'none';







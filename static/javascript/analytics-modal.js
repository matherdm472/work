//analytics-modal.js
import { currentlyAnimatingBoxIndex } from './animation.js';
import { openModal } from './main.js';

export function openAnalyticsModal() {
    const rightAnswerSection = document.getElementById('rightAnswerSection'); // Corrected ID
    const correctAnswerSection = document.getElementById('correctAnswerSection'); // Corrected ID
    const correctAnswer = document.getElementById('correctAnswer');
    const guessCount = document.getElementById('guessCount');
    const clueBoxes = document.querySelectorAll('.clue-box'); // Corrected class selection
    
    if (currentlyAnimatingBoxIndex === 4) {
        // All 5 clues were incorrect
        correctAnswerSection.style.display = 'block';
        rightAnswerSection.style.display = 'none';
        correctAnswer.textContent = 'Chris Stapleton'; // Replace with the actual correct answer
    } else {
        // Less than 4 incorrect clues
        correctAnswerSection.style.display = 'none';
        rightAnswerSection.style.display = 'block';
        correctAnswer.textContent = 'Chris Stapleton';
        guessCount.textContent = currentlyAnimatingBoxIndex + 1;
    
        // Set the specific box to blue
        clueBoxes[currentlyAnimatingBoxIndex].style.backgroundColor = '#1DA1F2';
    }
    openModal('#analyticsModal');
}
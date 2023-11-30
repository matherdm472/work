// main.js
import './suggestions.js';
import './sound-effects.js';
import './play-modal.js';
import './dark-mode.js';
import './animation.js';
import './analytics-modal.js';
import { restoreSessionData } from './play-modal.js';

export function openModal(modalId) {
    document.querySelector(modalId).style.display = 'block';
}

export function closeModal(modalId) {
    document.querySelector(modalId).style.display = 'none';
}


//event listeners to open and close modals
document.querySelector('#howToPlayButton').addEventListener('click', () => openModal('#instructionModal'));
document.querySelector('#playButton').addEventListener('click', () => {
    restoreSessionData();
    openModal('#playModal');
});
document.querySelector('#settingsButton').addEventListener('click', () => openModal('#settingsModal'));
document.querySelector('#get-credits').addEventListener('click', () => openModal('#creditsModal'));

document.querySelector('#closeModal').addEventListener('click', () => closeModal('#instructionModal'));
document.querySelector('#closePlayModal').addEventListener('click', () => closeModal('#playModal'));
document.querySelector('#closeSettingsModal').addEventListener('click', () => closeModal('#settingsModal'));
document.querySelector('#closeAnalyticsModal').addEventListener('click', () => closeModal('#analyticsModal'));
document.querySelector('#closeCreditsModal').addEventListener('click', () => closeModal('#creditsModal'));


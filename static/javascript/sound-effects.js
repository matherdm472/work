// sound-effects.js

export const rightAnswerSound = new Audio('/static/soundeffects/correct-answer.wav');
export const wrongAnswerSound = new Audio('/static/soundeffects/wrong-answer.wav');

// Function to toggle sound effects
export function toggleSoundEffects() {
    const soundEffectsToggle = document.querySelector('#soundEffectsToggle');

    // Check the initial setting from local storage or set it to 'enabled' by default
    const soundEffectsEnabled = localStorage.getItem('soundEffects') !== 'disabled';

    // Update the toggle switch based on the setting
    soundEffectsToggle.checked = soundEffectsEnabled;

    // Update the sound effects based on the setting
    rightAnswerSound.muted = !soundEffectsEnabled;
    wrongAnswerSound.muted = !soundEffectsEnabled;

    // Listen for changes in the toggle switch
    soundEffectsToggle.addEventListener('change', () => {
        const soundEffectsEnabled = soundEffectsToggle.checked;
        rightAnswerSound.muted = !soundEffectsEnabled;
        wrongAnswerSound.muted = !soundEffectsEnabled;

        // Save the user's preference to local storage
        if (soundEffectsEnabled) {
            localStorage.setItem('soundEffects', 'enabled');
        } else {
            localStorage.setItem('soundEffects', 'disabled');
        }
    });
}

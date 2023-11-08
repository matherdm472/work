// sound-effects.js

export const rightAnswerSound = new Audio('/static/soundeffects/correct-answer.wav');
export const wrongAnswerSound = new Audio('/static/soundeffects/wrong-answer.wav');

 // Function to toggle sound effects
export function toggleSoundEffects() {
    const soundEffectsToggle = document.querySelector('#soundEffectsToggle');
    
    // Check if the toggle switch is checked
    if (soundEffectsToggle.checked) {
        rightAnswerSound.muted = false; // Unmute the right answer sound
        wrongAnswerSound.muted = false; // Unmute the wrong answer sound
    } else {
        rightAnswerSound.muted = true; // Mute the right answer sound
        wrongAnswerSound.muted = true; // Mute the wrong answer sound
    }
}

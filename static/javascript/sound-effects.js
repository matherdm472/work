// sound-effects.js

const rightAnswerSound = document.getElementById('rightAnswerSound');
const wrongAnswerSound = document.getElementById('wrongAnswerSound');
const soundEffectToggle = document.getElementById('sound-effects');
soundEffectToggle.addEventListener('change', function () {
    if (this.checked) {
        enableSoundMode();
    } else {
        disableSoundMode();
    }
});

<<<<<<< HEAD
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
=======
function enableSoundMode() {
    rightAnswerSound.muted = false;
    wrongAnswerSound.muted = false;
    localStorage.setItem('soundEffectToggle', 'enabled');
    console.log("Enabling sounds");
>>>>>>> 0fc44fe869b412c13090c97ebf972866e7c5ca24
}

function disableSoundMode() {
    rightAnswerSound.muted = true;
    wrongAnswerSound.muted = true;
    localStorage.setItem('soundEffectToggle', 'disabled');
    console.log("Disabling sounds");
}

const savedSoundEffectMode = localStorage.getItem('soundEffectToggle');
    if (savedSoundEffectMode === 'enabled') {
    enableSoundMode();
    var soundEffectCheckbox = document.getElementById('sound-effects');

    // Trigger the 'change' event
    soundEffectCheckbox.checked = true; // Set it to true for checked, false for unchecked
    soundEffectCheckbox.dispatchEvent(new Event('change'));
    }
    else if (savedSoundEffectMode === 'disabled') {
        disableSoundMode();
        var soundEffectCheckbox = document.getElementById('sound-effects');

        // Trigger the 'change' event
        soundEffectCheckbox.checked = false; // Set it to true for checked, false for unchecked
        soundEffectCheckbox.dispatchEvent(new Event('change'));
    }

// animation.js

import { nextContent } from './shared.js';
import { boxes } from './play-modal.js';

export {animateWrongAnswer};
export { currentlyAnimatingBoxIndex };
export { updateAnimatedIndex };

let currentlyAnimatingBoxIndex = 0;

function animateWrongAnswer() {
    // Get the current and next box indexes
    let currentBoxIndex = currentlyAnimatingBoxIndex % boxes.length;
    let nextBoxIndex = (currentlyAnimatingBoxIndex + 1) % boxes.length;

    let currentBox = boxes[currentBoxIndex];
    let nextBox = boxes[nextBoxIndex];
    if (nextBoxIndex === 0) {
        // Return without animation
        return;
    }

    // Add the animation class to the current box
    currentBox.classList.add('move-box-animation');
    // Listen for the animation end event on the current box
    const animationPromise = new Promise(resolve => {
        currentBox.addEventListener('animationend', () => {
            currentBox.classList.remove('move-box-animation');
            resolve();
        });
    });

    // Wait for the animation to end before proceeding
    animationPromise.then(() => {
        nextBox.style.backgroundColor = '#007bff';
        currentlyAnimatingBoxIndex = nextBoxIndex;

        nextContent();
    });
}

function updateAnimatedIndex(newIndex) {
    currentlyAnimatingBoxIndex = newIndex;
}
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
    currentBox.addEventListener('animationend', () => {
        // Remove the animation class from the current box
        currentBox.classList.remove('move-box-animation');

        // Set the next box to blue
        nextBox.style.backgroundColor = '#007bff';

        // Update the currently animating box index after the animation is finished
        currentlyAnimatingBoxIndex =  nextBoxIndex;

        nextContent();
    });
}

function updateAnimatedIndex(newIndex) {
    currentlyAnimatingBoxIndex = newIndex;
}
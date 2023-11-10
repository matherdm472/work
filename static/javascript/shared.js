// shared.js
export let currentContentIndex = 0;
export { nextContent };
export { updateIndex };

import { showContent, contentArray } from "./play-modal.js"

function nextContent() {
    currentContentIndex = (currentContentIndex + 1) % contentArray.length;
    showContent(currentContentIndex);
}

function updateIndex(newIndex) {
    currentContentIndex = newIndex;
}
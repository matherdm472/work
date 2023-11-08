// shared.js
export let currentContentIndex = 0;
export { nextContent };

import { showContent, contentArray } from "./play-modal.js"

function nextContent() {
    currentContentIndex = (currentContentIndex + 1) % contentArray.length;
    showContent(currentContentIndex);
}

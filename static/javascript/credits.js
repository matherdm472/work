// credits.js

import { openModal, closeModal } from "/main.js";

document.getElementById("get-credits").addEventListener("click", function () {
    openModal("creditsModal");
});

document.getElementById("closeCreditsModal").addEventListener("click", function () {
    closeModal("creditsModal");
});



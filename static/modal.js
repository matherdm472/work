// Function to display instructions in a modal dialog
function showInstructions() {
    // Send an AJAX POST request to the Flask server
    fetch('/how_to_play', {
        method: 'POST',
    })
    .then(response => response.text())
    .then(data => {
        // Display the modal dialog with the game instructions
        alert(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Add a click event listener to the "How to Play" button
document.querySelector('#howToPlayButton').addEventListener('click', showInstructions);

// Function to display the "Play" modal
function showPlayModal() {
    // Show the "Play" modal by changing its style to 'block'
    document.querySelector('#playModal').style.display = 'block';
}

// Add a click event listener to the "Play" button
document.querySelector('#playButton').addEventListener('click', showPlayModal);

// JavaScript code to handle the slideshow and box color changes
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const boxes = document.querySelectorAll('.box');

function showSlides() {
    slides.forEach((slide) => {
        slide.style.display = 'none';
    });
    boxes.forEach((box) => {
        box.style.backgroundColor = 'gray';
    });

    slides[slideIndex].style.display = 'block';
    boxes[slideIndex].style.backgroundColor = 'blue';
}

function nextSlide() {
    if (slideIndex < 4) {
        slideIndex++;
    } else {
        slideIndex = 0;
    }
    showSlides();
}

document.querySelector('#nextButton').addEventListener('click', nextSlide);
showSlides(); // Call the function to display the first slide


    function openModal(modalId) {
        document.querySelector(modalId).style.display = 'block';
    }

    function closeModal(modalId) {
        document.querySelector(modalId).style.display = 'none';
    }

    // Add event listeners to open and close modals
    document.querySelector('#howToPlayButton').addEventListener('click', () => openModal('#instructionModal'));
    document.querySelector('#playButton').addEventListener('click', () => openModal('#playModal'));
    document.querySelector('#settingsButton').addEventListener('click', () => openModal('#settingsModal'));

    document.querySelector('#closeModal').addEventListener('click', () => closeModal('#instructionModal'));
    document.querySelector('#closePlayModal').addEventListener('click', () => closeModal('#playModal'));
    document.querySelector('#closeSettingsModal').addEventListener('click', () => closeModal('#settingsModal'));
    document.querySelector('#closeAnalyticsModal').addEventListener('click', () => closeModal('#analyticsModal'));

    let currentContentIndex = 0;
    const contentArray = [
        "We’re cooking with Kmet and the Commanders on @fdsportsbook🔥🔥🔥",
        "I’m Back!!! See you Sunday! @NFLonFOX",
        "Tommy, since I already wrote you a long retirement message last year, this time I shall say, welcome to the 2x retired club. You’re a legend and you always will be, my friend ♥️🏉 @TomBrady",
        "What do you say @TomBrady, one more touchdown pass at the @Autograph party today for old time’s sake?",
        "The Gronk Spike returns to @EAMaddenNFL tomorrow 😤 @EASPORTS_MUTx #EAathlete  #ad"
    ];
    
    function showContent(index) {

        const contentElement = document.querySelector('.tweet-text');
        contentElement.textContent = contentArray[index];
        
        // Measure the height
        const measuredHeight = contentArray[index].offsetHeight;

        // Calculate max-height as a percentage based on the measured height
        const parentContainerHeight = document.querySelector('.content-container').offsetHeight; // Assuming you have a parent container
        const maxHeightPercentage = (measuredHeight / parentContainerHeight) * 100;

        // Set the max-height of .content-container
        const contentContainer = document.querySelector('.content-container');
        contentContainer.style.maxHeight = `${maxHeightPercentage}%`;
    }

    function nextContent() {
        currentContentIndex = (currentContentIndex + 1) % contentArray.length;
        showContent(currentContentIndex);
    }

    // Initialize with the first content and box colors
    showContent(currentContentIndex);

    // Set the initial colors for the boxes
    const boxes = document.querySelectorAll('.box');
    boxes.forEach((box, i) => {
        box.style.backgroundColor = i === currentContentIndex ? '#007bff' : 'gray';
    });

    let currentlyAnimatingBoxIndex = 0; // Initialize to 0

    function animateWrongAnswer() {
        // Get the current and next box indexes
        const currentBoxIndex = currentlyAnimatingBoxIndex % boxes.length;
        const nextBoxIndex = (currentlyAnimatingBoxIndex + 1) % boxes.length;

        const currentBox = boxes[currentBoxIndex];
        const nextBox = boxes[nextBoxIndex];

        if (nextBoxIndex === 0) {
            //return without animation
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
            currentlyAnimatingBoxIndex = nextBoxIndex;

            nextContent();
        });
    }

    // Load the sound effects
    const rightAnswerSound = new Audio('/static/soundeffects/correct-answer.wav');
    const wrongAnswerSound = new Audio('/static/soundeffects/wrong-answer.wav');

    // Function to toggle sound effects
    function toggleSoundEffects() {
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

    function openAnalyticsModal() {
        const analyticsContent = document.getElementById('analyticsContent');
        const correctAnswerSection = document.getElementById('correctAnswerSection');
        const rightAnswerSection = document.getElementById('rightAnswerSection');
        const correctAnswer = document.getElementById('correctAnswer');
        const guessCount = document.getElementById('guessCount');
    
        if (currentlyAnimatingBoxIndex === 4) {
            // All 5 clues were incorrect
            correctAnswerSection.style.display = 'block';
            rightAnswerSection.style.display = 'none';
            correctAnswer.textContent = 'Rob Gronkowski'; // Replace with the actual correct answer
        } else {
            // Less than 4 incorrect clues
            correctAnswerSection.style.display = 'none';
            rightAnswerSection.style.display = 'block';
            guessCount.textContent = currentlyAnimatingBoxIndex + 1;
        }
    
        openModal('#analyticsModal');
    }
    
    
    // Add an event listener to the search button
    document.querySelector('#searchButton').addEventListener('click', function() {
        // Get the user's input from the search bar
        const userInput = document.querySelector('#searchInput').value.trim().toLowerCase();
        const searchButton = document.getElementById("searchButton");
        const searchInput = document.getElementById("searchInput");

        // Check if the user's input matches the correct answer
        if (userInput.toLowerCase() === 'rob gronkowski') {
            // Display "Correct" in green
            document.querySelector('#answerStatus').textContent = 'Correct';
            document.querySelector('#answerStatus').style.color = 'green';
            document.querySelector('#rightAnswerSound').play();
            const times = 5;
                for(let i = 0; i < times; i++){
                confetti();
            }
            searchButton.disabled = true;
            searchInput.disabled = true;
            //document.body.classList.add("analyticsModal"); // analytic modal
            openAnalyticsModal();
        } else {
            // Display "Incorrect" in red
            document.querySelector('#answerStatus').textContent = 'Incorrect';
            document.querySelector('#answerStatus').style.color = 'red';
            document.querySelector('#wrongAnswerSound').play();

            animateWrongAnswer();

            // Clear the input field for retry
            document.querySelector('#searchInput').value = '';

            if((currentlyAnimatingBoxIndex % boxes.length) == 4) {
                searchButton.disabled = true;
                searchInput.disabled = true;
                //document.body.add("analyticsModal"); // analytic modal
                openAnalyticsModal();
                return;
            }
        }
    });

    const searchInput = document.querySelector('#searchInput');
    const suggestionsContainer = document.querySelector('#suggestions');

    let allSuggestions = [];

    fetch('/static/celebrities.txt')
        .then(response => response.text())
        .then(data => {
            allSuggestions = data.split('\n').filter(Boolean);
            console.log(allSuggestions);
        })

    // Function to filter suggestions based on user input
    function filterSuggestions(input) {
        return allSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(input.toLowerCase())
        );
    }

    // Function to display suggestions in the dropdown
    function displaySuggestions(suggestions) {
        suggestionsContainer.innerHTML = '';

        if (suggestions.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        suggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('div');
            suggestionElement.textContent = suggestion;
            suggestionElement.classList.add('suggestion');

            suggestionElement.addEventListener('click', () => {
            // Set the selected suggestion as the input value
            searchInput.value = suggestion;
            suggestionsContainer.style.display = 'none';
            });

            suggestionsContainer.appendChild(suggestionElement);
        });

        suggestionsContainer.style.display = 'block';
    }

    const darkModeToggle = document.getElementById('dark-mode');
    darkModeToggle.addEventListener('change', function () {
        if (this.checked) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });

    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    }

    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }

    const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'enabled') {
        enableDarkMode();
        var darkModeCheckbox = document.getElementById('dark-mode');

        // Trigger the 'change' event
        darkModeCheckbox.checked = true; // Set it to true for checked, false for unchecked
        darkModeCheckbox.dispatchEvent(new Event('change'));
    }


    searchInput.addEventListener('input', () => {
        const userInput = searchInput.value;
        const filteredSuggestions = filterSuggestions(userInput);
        displaySuggestions(filteredSuggestions);
    });

    document.addEventListener('click', event => {
    if (!suggestionsContainer.contains(event.target)) {
        suggestionsContainer.style.display = 'none';
    }
    /*
    // COPY TO CLIPBOARD FUNCTIONALITY
    document.addEventListener('DOMContentLoaded', function() {
        const copyCorrectAnswerButton = document.getElementById('copyCorrectAnswerButton');
        const copyBox = document.querySelector('.copy-box');

        copyCorrectAnswerButton.addEventListener('click', function() {
            // Create a textarea element to hold the text to be copied
            const textArea = document.createElement('textarea');
            textArea.value = copyBox.textContent;

            // Append the textarea to the document
            document.body.appendChild(textArea);

            // Select the text inside the textarea
            textArea.select();

            // Copy the selected text to the clipboard
            document.execCommand('copy');

            // Remove the textarea from the document
            document.body.removeChild(textArea);

            // Provide some visual feedback (e.g., change the button text)
            copyCorrectAnswerButton.textContent = 'Copied!';
            setTimeout(function() {
                copyCorrectAnswerButton.textContent = 'Copy to Clipboard';
            }, 2000); // Reset the button text after 2 seconds

            copyCorrectAnswerButton.addEventListener('click', function() {
                console.log('Button clicked'); // Add this line
                // ... rest of the code
            });
        });
    });
    */

    

});



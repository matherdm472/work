    function showInstructionModal() {
        // Show the "Play" modal by changing its style to 'block'
        document.querySelector('#instructionModal').style.display = 'block';
    }

    // Add a click event listener to the "How to Play" button
    document.querySelector('#howToPlayButton').addEventListener('click', showInstructionModal);

    // Function to display the "Play" modal
    function showPlayModal() {
        // Show the "Play" modal by changing its style to 'block'
        document.querySelector('#playModal').style.display = 'block';
    }

    // Function to display the settings modal
    function showSettingsModal() {
        // Show the settings modal by changing its style to 'block'
        document.querySelector('#settingsModal').style.display = 'block';
    }

    // Add a click event listener to the "Play" button
    document.querySelector('#playButton').addEventListener('click', showPlayModal);

        // Add click event listener to close modal
    document.querySelector('#closeModal').addEventListener('click', function() {
        document.querySelector('#instructionModal').style.display = 'none';
    });

    // Show modal when "How to Play" button is clicked
    document.querySelector('#howToPlayButton').addEventListener('click', function() {
        document.querySelector('#instructionModal').style.display = 'block';
    });

    // Close the "Play" modal when the close button is clicked
    document.querySelector('#closePlayModal').addEventListener('click', function() {
        document.querySelector('#playModal').style.display = 'none';
    });


    // Show the "Play" modal when the "Play" button is clicked
    document.querySelector('#playButton').addEventListener('click', function() {
        document.querySelector('#playModal').style.display = 'block';
    });

    // Show modal when settings button is clicked
    document.querySelector('#settingsButton').addEventListener('click', function() {
        document.querySelector('#settingsModal').style.display = 'block';
    });

    // Close modal when settings button is clicked
    document.querySelector('#closeSettingsModal').addEventListener('click', function() {
        document.querySelector('#settingsModal').style.display = 'none';
    });

    let currentContentIndex = 0;

    const contentArray = [
        "We’re cooking with Kmet and the Commanders on @fdsportsbook🔥🔥🔥",
        "I’m Back!!! See you Sunday! @NFLonFOX",
        "Tommy, since I already wrote you a long retirement message last year, this time I shall say, welcome to the 2x retired club. You’re a legend and you always will be, my friend ♥️🏉 @TomBrady",
        "What do you say @TomBrady, one more touchdown pass at the @Autograph party today for old time’s sake?",
        "The Gronk Spike returns to @EAMaddenNFL tomorrow 😤 @EASPORTS_MUTx #EAathlete  #ad"
    ];

    function showContent(index) {
        const contentElement = document.querySelector('.content');
        contentElement.textContent = contentArray[index];
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

    // Add an event listener to the search button
    document.querySelector('#searchButton').addEventListener('click', function() {
        // Get the user's input from the search bar
        const userInput = document.querySelector('#searchInput').value.trim().toLowerCase();

        // Check if the user's input matches the correct answer
        if (userInput.toLowerCase() === 'rob gronkowski') {
            // Display "Correct" in green
            document.querySelector('#answerStatus').textContent = 'Correct';
            document.querySelector('#answerStatus').style.color = 'green';
            document.querySelector('#rightAnswerSound').play();
        } else {
            // Display "Incorrect" in red
            document.querySelector('#answerStatus').textContent = 'Incorrect';
            document.querySelector('#answerStatus').style.color = 'red';
            document.querySelector('#wrongAnswerSound').play();
            
            animateWrongAnswer();

            // Clear the input field for retry
            document.querySelector('#searchInput').value = '';
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

    document.querySelector('#dark-mode').addEventListener('click', function() {
        const darkModeToggle = document.getElementById('dark-mode');

        darkModeToggle.addEventListener('change', function() {
            if(this.checked) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        });

        function enableDarkMode() {
            document.body.classList.add('dark-mode');
        }

        function disableDarkMode() {
            document.body.classList.remove('dark-mode');
        }
    });

    // Event listener for user input in the search bar
    searchInput.addEventListener('input', () => {
        const userInput = searchInput.value;
        const filteredSuggestions = filterSuggestions(userInput);
        displaySuggestions(filteredSuggestions);
    });

    // Close the dropdown when clicking outside
    document.addEventListener('click', event => {
    if (!suggestionsContainer.contains(event.target)) {
        suggestionsContainer.style.display = 'none';
    }
});




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

    let currentContentIndex = 0;

    const contentArray = [
        "Incredibly proud to share that together we raised $375,628 for the Maui Strong Fund! Thank you to everyone who showed up and helped support the incredible people of Maui. I am so grateful for all of you and for @TRAVISMATHEW for working with me on putting this together. If you'd still like to donate, head on over to @HCFHawai or you can donate here:",
        "What a day! Jack and I got to hit the mound together, eat our bodyweight in Dodger Dogs and delivered the game opening announcement! Thank you @ClaytonKersh22 for asking me to throw yesterday’s first pitch for faith and family day, what an honor! ⚾️  Let’s go @Dodgers!",
        "We’ve had some fun over the years! This is just the beginning! Love you man @JKCorden",
        "Happy Anniversary!! Mom and dads first night away in three years. Back to the spot where we said “I do!” Love you honey! @KSchwarzenegger",
        "#1 Movie in the Galaxy! 🚀 Thank you to everyone who came out to support #GOTGVol3 this weekend!"
    ];

    function showContent(index) {
        const contentElement = document.querySelector('.content');
        contentElement.textContent = contentArray[index];
    }

    function updateBoxes(index) {
        const boxes = document.querySelectorAll('.box');
        boxes.forEach((box, i) => {
            box.style.backgroundColor = i === index ? '#007bff' : 'gray';
        });
    }

    function nextContent() {
        currentContentIndex = (currentContentIndex + 1) % contentArray.length;
        showContent(currentContentIndex);
        updateBoxes(currentContentIndex);
    }

    // Add click event listener to the "Next" button
    document.querySelector('#nextButton').addEventListener('click', nextContent);

    // Initialize with the first content and box colors
    showContent(currentContentIndex);
    updateBoxes(currentContentIndex);

    // Add an event listener to the search button
    document.querySelector('#searchButton').addEventListener('click', function() {
        // Get the user's input from the search bar
        const userInput = document.querySelector('#searchInput').value.trim().toLowerCase();

        // Check if the user's input matches the correct answer
        if (userInput.toLowerCase() === 'chris pratt') {
            // Display "Correct" in green
            document.querySelector('#answerStatus').textContent = 'Correct';
            document.querySelector('#answerStatus').style.color = 'green';
        } else {
            // Display "Incorrect" in red
            document.querySelector('#answerStatus').textContent = 'Incorrect';
            document.querySelector('#answerStatus').style.color = 'red';

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



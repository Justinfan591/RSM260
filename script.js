// Get DOM elements
const roleSelection = document.getElementById('roleSelection');
const drawButton = document.getElementById('drawButton');
const guessButton = document.getElementById('guessButton');

const drawingMode = document.getElementById('drawingMode');
const drawingCanvas = document.getElementById('drawingCanvas');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearCanvasButton = document.getElementById('clearCanvas');
const resetTimerButton = document.getElementById('resetTimerButton'); // Reset Timer Button
const nextRoundDrawingButton = document.getElementById('nextRoundDrawingButton'); // Next Round Button in drawing mode

const guessingMode = document.getElementById('guessingMode');
const pointsDisplay = document.getElementById('points');
const guessesLeftDisplay = document.getElementById('guessesLeft');
const currentRoundDisplay = document.getElementById('currentRound');
const guessInput = document.getElementById('guessInput');
const submitGuessButton = document.getElementById('submitGuess');
const nextRoundButton = document.getElementById('nextRoundButton');
const wordTable = document.getElementById('wordTable');
const timerDisplay = document.getElementById('timerDisplay'); // For the timer

// Game variables
let drawing = false;
let context; // Declare context here but initialize it later
let points = 0;
let guessesLeft = 5;
let currentRound = 1;
const totalRounds = 5;
let selectedWord = '';
let wordsToGuess = ['Leadership', 'Communication', 'Interview', 'Organizational Behaviour', 'Group Mechanism']; // Predefined answers for each round
const allWords = ["Leadership", "Teamwork", "Motivation", "Organization", "Structure", "Communication", "Performance", "Diversity", "Strategy", "Conflict", "Collaboration", "Group Mechanism", "Surveys", "Experiments", "Interviews", "Behavior", "Organizational Behaviour", "Satisfaction", "Decision-making", "Feedback"]; // 20 possible words
let timerInterval; // For the timer
let timerStarted = false; // Track if the timer has started

// Event listeners for role selection
drawButton.addEventListener('click', () => {
    roleSelection.style.display = 'none';
    drawingMode.style.display = 'block';
    initializeDrawingMode();
});

guessButton.addEventListener('click', () => {
    roleSelection.style.display = 'none';
    guessingMode.style.display = 'block';
    initializeGuessingMode();
});

// Drawing Mode Functions
function initializeDrawingMode() {
    context = drawingCanvas.getContext('2d');

    // Set default brush settings
    context.lineWidth = brushSize.value;
    context.lineCap = 'round';
    context.strokeStyle = '#000000'; // Default brush color set to white

    // Mouse events for drawing
    drawingCanvas.addEventListener('mousedown', startDrawing);
    drawingCanvas.addEventListener('mouseup', stopDrawing);
    drawingCanvas.addEventListener('mousemove', draw);

    // Touch events for mobile devices
    drawingCanvas.addEventListener('touchstart', startDrawing);
    drawingCanvas.addEventListener('touchend', stopDrawing);
    drawingCanvas.addEventListener('touchmove', draw);

    // Brush controls
    colorPicker.value = '#000000'; // Set the color picker default to black
    colorPicker.addEventListener('change', () => {
        context.strokeStyle = colorPicker.value;
    });

    brushSize.addEventListener('change', () => {
        context.lineWidth = brushSize.value;
    });

    clearCanvasButton.addEventListener('click', clearCanvas);

    // Reset Timer Button functionality
    resetTimerButton.addEventListener('click', resetTimer);

    // Next Round Button functionality in drawing mode
    nextRoundDrawingButton.addEventListener('click', nextRound);
}

function startDrawing(e) {
    e.preventDefault();
    drawing = true;
    draw(e);

    // Start the timer when drawing begins, if it hasn't started already
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }
}

function stopDrawing(e) {
    e.preventDefault();
    drawing = false;
    context.beginPath();
}

function draw(e) {
    e.preventDefault();
    if (!drawing) return;

    let rect = drawingCanvas.getBoundingClientRect();
    let x, y;

    if (e.type.includes('mouse')) {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    } else {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    }

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
}

function clearCanvas() {
    context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
}

// Timer function to countdown from 1:20
function startTimer() {
    let timeRemaining = 80; // 1 minute 20 seconds in seconds
    timerDisplay.textContent = formatTime(timeRemaining); // Show initial time

    // Clear any previous timer
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = formatTime(timeRemaining);

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert('Time is up! Moving to the next round.');
            nextRound(); // Move to the next round automatically
        }
    }, 1000); // Decrease time every second
}

// Function to format the time (e.g., 1:20)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Reset the timer manually
function resetTimer() {
    clearInterval(timerInterval);
    timerStarted = false; // Allow the timer to start again when drawing begins
    timerDisplay.textContent = 'Timer: 1:20'; // Reset the timer display
    clearCanvas(); // Optionally clear the canvas as well
}

// Guessing Mode Functions
function initializeGuessingMode() {
    points = 0;
    currentRound = 1;
    pointsDisplay.textContent = points;
    currentRoundDisplay.textContent = currentRound;
    guessesLeft = 5;
    guessesLeftDisplay.textContent = guessesLeft;

    // Predefined answers for each round
    wordsToGuess = ['Leadership', 'Communication', 'Interview', 'Organizational Behaviour', 'Group Mechanism']; // Correct answers for each round

    // Display the possible words (all 20 words) in a table
    displayWordTable();

    // Start the first round
    startRound();

    // Add event listener for submitting guesses
    submitGuessButton.addEventListener('click', handleGuess);

    // Add event listener for Next Round button
    nextRoundButton.addEventListener('click', nextRound);
}

function displayWordTable() {
    wordTable.innerHTML = '';
    let row;
    allWords.forEach((word, index) => {
        if (index % 5 === 0) {
            row = wordTable.insertRow();
        }
        let cell = row.insertCell();
        cell.textContent = word;
    });
}

function startRound() {
    if (currentRound > totalRounds) {
        endGame();
        return;
    }

    selectedWord = wordsToGuess[currentRound - 1]; // Use the predefined word for the current round
    guessesLeft = 5;
    guessesLeftDisplay.textContent = guessesLeft;
    currentRoundDisplay.textContent = currentRound;
    guessInput.value = '';
    submitGuessButton.disabled = false;
    nextRoundButton.style.display = 'none';
    guessInput.disabled = false;

    // Start the timer for the round (only in guessing mode)
    startTimer();
}

function handleGuess() {
    let userGuess = guessInput.value.trim().toLowerCase();
    if (userGuess === '') {
        alert('Please enter your guess.');
        return;
    }

    if (userGuess === selectedWord.toLowerCase()) {
        points += 1;
        pointsDisplay.textContent = points;
        alert('Correct! You earned 1 point.');
        submitGuessButton.disabled = true;
        guessInput.disabled = true;
        nextRoundButton.style.display = 'inline-block';
        clearInterval(timerInterval); // Stop the timer if the user guesses correctly
    } else {
        guessesLeft -= 1;
        guessesLeftDisplay.textContent = guessesLeft;
        if (guessesLeft > 0) {
            alert('Incorrect guess. Try again!');
        } else {
            alert(`Out of guesses! The word was "${selectedWord}".`);
            submitGuessButton.disabled = true;
            guessInput.disabled = true;
            nextRoundButton.style.display = 'inline-block';
            clearInterval(timerInterval); // Stop the timer if out of guesses
        }
    }
    guessInput.value = '';
}

function nextRound() {
    currentRound += 1;
    startRound();
}

function endGame() {
    alert(`Game over! You scored ${points} out of ${totalRounds} points.`);
    // Reset the game
    guessingMode.style.display = 'none';
    roleSelection.style.display = 'block';
}

// Utility function to shuffle an array
function shuffleArray(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

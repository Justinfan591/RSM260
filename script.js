// Get DOM elements
const roleSelection = document.getElementById('roleSelection');
const drawButton = document.getElementById('drawButton');
const guessButton = document.getElementById('guessButton');

const drawingMode = document.getElementById('drawingMode');
const drawingCanvas = document.getElementById('drawingCanvas');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearCanvasButton = document.getElementById('clearCanvas');

const guessingMode = document.getElementById('guessingMode');
const pointsDisplay = document.getElementById('points');
const guessesLeftDisplay = document.getElementById('guessesLeft');
const currentRoundDisplay = document.getElementById('currentRound');
const guessInput = document.getElementById('guessInput');
const submitGuessButton = document.getElementById('submitGuess');
const nextRoundButton = document.getElementById('nextRoundButton');
const wordTable = document.getElementById('wordTable');

// Game variables
let drawing = false;
let context; // Declare context here but initialize it later
let points = 0;
let guessesLeft = 3;
let currentRound = 1;
const totalRounds = 8;
let selectedWord = '';
let wordsToGuess = ['apple','banana','orange','mango','peach','strawberry', 'pineapple', 'watermelon']; // Predefined answers for each round
const allWords = ['apple', 'banana', 'orange', 'grape', 'melon', 'strawberry', 'pineapple', 'watermelon', 'kiwi', 'peach', 'mango', 'pear', 'cherry', 'lemon', 'lime', 'apricot', 'blueberry', 'blackberry', 'coconut', 'fig']; // 20 possible words

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
// Drawing Mode Functions
function initializeDrawingMode() {
    context = drawingCanvas.getContext('2d');

    // Set default brush settings
    context.lineWidth = brushSize.value;
    context.lineCap = 'round';
    context.strokeStyle = '#ffffff'; // Default brush color set to white

    // Mouse events for drawing
    drawingCanvas.addEventListener('mousedown', startDrawing);
    drawingCanvas.addEventListener('mouseup', stopDrawing);
    drawingCanvas.addEventListener('mousemove', draw);

    // Touch events for mobile devices
    drawingCanvas.addEventListener('touchstart', startDrawing);
    drawingCanvas.addEventListener('touchend', stopDrawing);
    drawingCanvas.addEventListener('touchmove', draw);

    // Brush controls
    colorPicker.value = '#ffffff'; // Set the color picker default to white
    colorPicker.addEventListener('change', () => {
        context.strokeStyle = colorPicker.value;
    });

    brushSize.addEventListener('change', () => {
        context.lineWidth = brushSize.value;
    });

    clearCanvasButton.addEventListener('click', clearCanvas);
}


function startDrawing(e) {
    e.preventDefault();
    drawing = true;
    draw(e);
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

// Guessing Mode Functions
function initializeGuessingMode() {
    points = 0;
    currentRound = 1;
    pointsDisplay.textContent = points;
    currentRoundDisplay.textContent = currentRound;
    guessesLeft = 3;
    guessesLeftDisplay.textContent = guessesLeft;

    // Predefined answers for each round
    wordsToGuess = ['apple', 'kiwi', 'melon', 'pear', 'grape', 'blueberry', 'fig', 'coconut']; // Correct answers for each round

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
    guessesLeft = 3;
    guessesLeftDisplay.textContent = guessesLeft;
    currentRoundDisplay.textContent = currentRound;
    guessInput.value = '';
    submitGuessButton.disabled = false;
    nextRoundButton.style.display = 'none';
    guessInput.disabled = false;
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
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // Swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

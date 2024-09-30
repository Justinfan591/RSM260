// Drawing functionality
const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');

let drawing = false;

// Set up the canvas
context.lineWidth = 5;
context.lineCap = 'round';
context.strokeStyle = '#000000';

// Mouse events for drawing
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

// Touch events for mobile devices
canvas.addEventListener('touchstart', startPosition);
canvas.addEventListener('touchend', endPosition);
canvas.addEventListener('touchmove', draw);

function startPosition(e) {
    e.preventDefault();
    drawing = true;
    draw(e);
}

function endPosition(e) {
    e.preventDefault();
    drawing = false;
    context.beginPath();
}

function draw(e) {
    e.preventDefault();
    if (!drawing) return;

    let x, y;

    if (e.type.includes('mouse')) {
        x = e.clientX - canvas.getBoundingClientRect().left;
        y = e.clientY - canvas.getBoundingClientRect().top;
    } else {
        x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
        y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
    }

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
}

// Game variables
const allWords = ['apple', 'banana', 'orange', 'grape', 'melon', 'strawberry', 'pineapple', 'watermelon', 'kiwi', 'peach', 'mango', 'pear', 'cherry', 'lemon', 'lime', 'apricot', 'blueberry', 'blackberry', 'coconut', 'fig', 'guava', 'papaya', 'plum', 'pomegranate', 'raspberry', 'tangerine', 'cantaloupe', 'date', 'elderberry', 'grapefruit'];

let selectedWords = [];
let currentWord = '';
let currentRound = 1;
const totalRounds = 8;
let guessesLeft = 3;

// DOM elements
const playGameButton = document.getElementById('playGame');
const gameInfo = document.getElementById('gameInfo');
const wordListElement = document.getElementById('wordList');
const currentRoundElement = document.getElementById('currentRound');
const guessesLeftElement = document.getElementById('guessesLeft');

const gameControls = document.getElementById('gameControls');
const submitGuessButton = document.getElementById('submitGuess');
const guessInput = document.getElementById('guessInput');
const clearCanvasButton = document.getElementById('clearCanvas');

// Brush controls
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');

// Event listeners
playGameButton.addEventListener('click', startGame);
submitGuessButton.addEventListener('click', handleGuess);
clearCanvasButton.addEventListener('click', clearCanvas);
colorPicker.addEventListener('change', () => {
    context.strokeStyle = colorPicker.value;
});
brushSize.addEventListener('change', () => {
    context.lineWidth = brushSize.value;
});

// Start the game
function startGame() {
    // Hide the play button
    playGameButton.style.display = 'none';

    // Show the game info, canvas, and controls
    gameInfo.style.display = 'block';
    canvas.style.display = 'block';
    gameControls.style.display = 'block';

    // Reset game variables
    currentRound = 1;
    guessesLeft = 3;
    currentRoundElement.textContent = currentRound;
    guessesLeftElement.textContent = guessesLeft;

    // Select 20 random words from allWords
    selectedWords = [];
    let wordsCopy = [...allWords];
    for (let i = 0; i < 20; i++) {
        let randomIndex = Math.floor(Math.random() * wordsCopy.length);
        selectedWords.push(wordsCopy[randomIndex]);
        wordsCopy.splice(randomIndex, 1);
    }

    // Display the possible words
    wordListElement.innerHTML = '';
    selectedWords.forEach(word => {
        let li = document.createElement('li');
        li.textContent = word;
        wordListElement.appendChild(li);
    });

    // Start the first round
    startRound();
}

// Start a new round
function startRound() {
    // Reset guesses left
    guessesLeft = 3;
    guessesLeftElement.textContent = guessesLeft;

    // Select a word for this round
    let randomIndex = Math.floor(Math.random() * selectedWords.length);
    currentWord = selectedWords[randomIndex];
    // Remove the word from the array to avoid repetition
    selectedWords.splice(randomIndex, 1);

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Clear the guess input
    guessInput.value = '';

    // Reset drawing variables if necessary
}

// Handle the user's guess
function handleGuess() {
    const userGuess = guessInput.value.trim().toLowerCase();
    if (userGuess === '') {
        alert('Please enter a guess.');
    } else if (userGuess === currentWord) {
        alert('Correct! You guessed the word.');
        nextRound();
    } else {
        guessesLeft--;
        if (guessesLeft > 0) {
            guessesLeftElement.textContent = guessesLeft;
            alert('Incorrect guess. Try again!');
        } else {
            alert(`Out of guesses! The word was "${currentWord}".`);
            nextRound();
        }
    }
    guessInput.value = '';
}

// Proceed to the next round
function nextRound() {
    currentRound++;
    if (currentRound > totalRounds) {
        endGame();
    } else {
        currentRoundElement.textContent = currentRound;
        startRound();
    }
}

// End the game
function endGame() {
    alert('Game over! Thanks for playing.');
    // Reset the game
    playGameButton.style.display = 'block';
    gameInfo.style.display = 'none';
    canvas.style.display = 'none';
    gameControls.style.display = 'none';
}

// Clear the canvas
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

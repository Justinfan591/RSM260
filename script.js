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

// Handle the guess input
const submitGuessButton = document.getElementById('submitGuess');
const guessInput = document.getElementById('guessInput');

submitGuessButton.addEventListener('click', handleGuess);

function handleGuess() {
    const userGuess = guessInput.value.trim().toLowerCase();
    if (userGuess === '') {
        alert('Please enter a guess.');
    } else {
        alert(`You guessed: ${userGuess}`);
        guessInput.value = '';
    }
}

// Clear canvas functionality
const clearCanvasButton = document.getElementById('clearCanvas');

clearCanvasButton.addEventListener('click', () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
});

// Brush color and size controls
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');

colorPicker.addEventListener('change', () => {
    context.strokeStyle = colorPicker.value;
});

brushSize.addEventListener('change', () => {
    context.lineWidth = brushSize.value;
});


const container = document.getElementById('diamond-container');
const columnHeights = [2, 3, 4, 5, 6, 5, 4, 3, 2];

function buildDiamondGrid() {
columnHeights.forEach((height, colIndex) => {
  const column = document.createElement('div');
  column.className = 'column';

  for (let rowIndex = 0; rowIndex < height; rowIndex++) {
    const square = document.createElement('div');
    square.className = 'square';
    square.id = `Square${colIndex}${rowIndex}`;

     // Color specific squares yellow
     if ((colIndex === 4 && rowIndex === 0) || (colIndex === 4 && rowIndex === 5)) {
      square.style.backgroundColor = 'yellow';
     }

    column.appendChild(square);
  }

  container.appendChild(column);
});
}

function startCountdown(duration, display) {
  let timer = duration;
  const interval = setInterval(() => {
    const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
    const seconds = String(timer % 60).padStart(2, '0');
    display.textContent = `${minutes}:${seconds}`;

    if (--timer < 0) {
      clearInterval(interval);
      display.textContent = "Time's up!";
    }
  }, 1000);
}

let questionData = [];

async function loadQuestions() {
  console.log("Loading questions from JSON...");
  const response = await fetch('questions.json');
  questionData = await response.json();

  // Example: use the first category
  const scienceSet = questionData.find(q => q.category === "Science");
  assignStatementsToSquares(scienceSet.statements);
}

function assignStatementsToSquares(statements) {
  const allSquares = document.querySelectorAll('.square');
  
  /*if (statements.length !== allSquares.length) {
    console.warn("Mismatch: Number of statements doesn't match number of squares.");
    return;
  }
*/
  allSquares.forEach((square, index) => {
    const statement = statements[index];
  

    if (!statement) return; // Skip if no statement available
    
    // Store the statement text in a data attribute
    square.dataset.statement = statement.text;

    // Add click event to display the statement
    square.addEventListener('click', () => {
      square.textContent = statement.text;
      square.style.fontSize = '0.8em'; // Optional: shrink text to fit
      //square.style.backgroundColor = 'green'; // Change color on click  
      square.style.whiteSpace = 'normal'; // Allow wrapping
    });
  });
}

const categoryButtons = document.querySelectorAll('.footer-buttons button');

categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    categoryButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
  });
});

window.onload = () => {
  const display = document.getElementById('timer');
  buildDiamondGrid();
  startCountdown(5 * 60, display);
  loadQuestions();

};
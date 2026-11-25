
/* =========================================================
   AMELIA HARPER ABC LETTER CHALLENGE
   Main game JavaScript
   ========================================================= */

const $ = (id) => document.getElementById(id);

let bank = [];
let round = [];
let index = 0;
let score = 0;
let answered = false;
let gameStarted = false;

/* ---------------------------------------------------------
   SHUFFLE QUESTIONS AND ANSWERS
--------------------------------------------------------- */

function shuffle(items) {
  const array = [...items];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

/* ---------------------------------------------------------
   ANALYTICS
--------------------------------------------------------- */

function track(eventName, details = {}) {
  fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event: eventName,
      game: 'abc-letter-adventure',
      details,
      timestamp: new Date().toISOString()
    })
  }).catch(() => {
    // Analytics must never interrupt gameplay.
  });
}

/* ---------------------------------------------------------
   LOAD QUESTION BANK
--------------------------------------------------------- */

async function init() {
  try {
    const response = await fetch(
      '/games/abc-letter-adventure/question-bank.json'
    );

    if (!response.ok) {
      throw new Error('Question bank could not be found.');
    }

    const data = await response.json();

    bank = Array.isArray(data) ? data : data.questions;

    if (!Array.isArray(bank) || bank.length === 0) {
      throw new Error('No questions were found.');
    }

    start();

  } catch (error) {
    console.error('Game loading error:', error);

    if ($('progress')) {
      $('progress').textContent =
        'The question bank could not be loaded. Please refresh the game.';
    }
  }
}

/* ---------------------------------------------------------
   START GAME
--------------------------------------------------------- */

function start() {
  if (!bank.length) return;

  const requestedAge = $('age-filter')?.value || 'all';

  if (requestedAge === 'all') {
    round = shuffle(bank).slice(0, 20);
  } else {
    const ageQuestions = bank.filter(q =>
      q.age_band && q.age_band.includes(requestedAge)
    );

    round = shuffle(ageQuestions).slice(0, 20);
  }

  if (!round.length) {
    round = shuffle(bank).slice(0, 20);
  }

  index = 0;
  score = 0;
  answered = false;
  gameStarted = true;

  track('game_start', {
    question_count: round.length
  });

  show();
}

/* ---------------------------------------------------------
   DISPLAY QUESTION
--------------------------------------------------------- */

function show() {
  answered = false;

  const q = round[index];

  if (!q) {
    finishGame();
    return;
  }

  // Progress indicator
  if ($('progress')) {
    $('progress').textContent =
      `Question ${index + 1} of ${round.length} · Score ${score}`;
  }

  // Display question
  $('question').textContent = q.prompt;

  // Create or locate visual area
  let visual = document.getElementById('question-visual');

  if (!visual) {
    visual = document.createElement('div');
    visual.id = 'question-visual';

    $('question').insertAdjacentElement('afterend', visual);
  }

  // Remove previous visual
  visual.innerHTML = '';

  // Display actual image if available
  if (q.image) {
    const img = document.createElement('img');

    img.src = q.image;
    img.alt = 'Picture clue';
    img.style.width = '100%';
    img.style.maxWidth = '320px';
    img.style.height = '240px';
    img.style.objectFit = 'contain';
    img.style.display = 'block';
    img.style.margin = '20px auto';

    img.onerror = () => {
      visual.textContent = 'Picture could not be loaded.';
    };

    visual.appendChild(img);
    visual.style.display = 'block';
  }

  // Display visual clues only when supplied
  else if (q.visual && q.visual.trim() !== '') {
    const display = document.createElement('div');

    display.textContent = q.visual;
    display.style.fontSize = '100px';
    display.style.fontWeight = 'bold';
    display.style.textAlign = 'center';
    display.style.margin = '20px auto';

    visual.appendChild(display);
    visual.style.display = 'block';
  }

  // Hide empty visual area
  else {
    visual.style.display = 'none';
  }

  // Clear previous feedback and answers
  $('answers').innerHTML = '';
  $('feedback').textContent = '';

  if ($('next')) {
    $('next').hidden = true;
  }

  // Display text-only answer options
  shuffle(q.options).forEach(option => {
    const button = document.createElement('button');

    button.type = 'button';
    button.textContent = option;

    button.addEventListener('click', () => {
      choose(option, q, button);
    });

    $('answers').appendChild(button);
  });
}

/* ---------------------------------------------------------
   CHECK ANSWER
--------------------------------------------------------- */

function choose(option, question, selectedButton) {
  if (answered) return;

  answered = true;

  const correct = option === question.answer;

  const buttons = $('answers').querySelectorAll('button');

  buttons.forEach(button => {
    button.disabled = true;

    if (button.textContent === question.answer) {
      button.classList.add('correct');
    }
  });

  if (correct) {
    score++;

    selectedButton.classList.add('correct');

    $('feedback').textContent =
      question.feedback || 'Excellent! That is correct.';

  } else {
    selectedButton.classList.add('incorrect');

    $('feedback').textContent =
      'Not quite! The correct answer is ' + question.answer + '.';
  }

  // Update progress score
  $('progress').textContent =
    `Question ${index + 1} of ${round.length} · Score ${score}`;

  track('question_answered', {
    question_id: question.id,
    selected_answer: option,
    correct_answer: question.answer,
    is_correct: correct
  });

  // Show next button
  if ($('next')) {
    $('next').hidden = false;
    $('next').textContent =
      index === round.length - 1 ? 'See My Results' : 'Next Question';
  }
}

/* ---------------------------------------------------------
   NEXT QUESTION
--------------------------------------------------------- */

function nextQuestion() {
  if (!answered) return;

  index++;

  if (index < round.length) {
    show();
  } else {
    finishGame();
  }
}

/* ---------------------------------------------------------
   FINISH GAME
--------------------------------------------------------- */

function finishGame() {
  track('game_complete', {
    score,
    total_questions: round.length
  });

  $('question').textContent = 'Amazing Work!';

  const visual = document.getElementById('question-visual');

  if (visual) {
    visual.style.display = 'none';
  }

  $('answers').innerHTML = '';

  $('feedback').textContent =
    `You scored ${score} out of ${round.length}!`;

  if ($('progress')) {
    $('progress').textContent = 'Challenge completed!';
  }

  if ($('next')) {
    $('next').hidden = false;
    $('next').textContent = 'Play Again';
    $('next').onclick = replay;
  }
}

/* ---------------------------------------------------------
   REPLAY GAME
--------------------------------------------------------- */

function replay() {
  if ($('next')) {
    $('next').onclick = nextQuestion;
  }

  start();
}

/* ---------------------------------------------------------
   BUTTON EVENTS
--------------------------------------------------------- */

if ($('next')) {
  $('next').addEventListener('click', nextQuestion);
}

if ($('restart')) {
  $('restart').addEventListener('click', replay);
}

if ($('start')) {
  $('start').addEventListener('click', start);
}

/* ---------------------------------------------------------
   INITIALISE GAME
--------------------------------------------------------- */

init();


/* =========================================================
   AMELIA HARPER ABC LETTER CHALLENGE
   Supports text answers and illustrated picture answers
   ========================================================= */

const $ = (id) => document.getElementById(id);

let bank = [];
let round = [];
let index = 0;
let score = 0;
let answered = false;

/* ---------------------------------------------------------
   SHUFFLE
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
    // Analytics errors must not interrupt the game.
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
      throw new Error('Question bank could not be loaded.');
    }

    const data = await response.json();

    bank = Array.isArray(data) ? data : data.questions;

    if (!Array.isArray(bank) || bank.length === 0) {
      throw new Error('No questions found.');
    }

    start();

  } catch (error) {
    console.error(error);

    if ($('progress')) {
      $('progress').textContent =
        'Unable to load questions. Please refresh the game.';
    }
  }
}

/* ---------------------------------------------------------
   START GAME
--------------------------------------------------------- */

function start() {
  if (!bank.length) return;

  const ageFilter = $('age')?.value || 'all';

  let availableQuestions = bank;

  if (ageFilter !== 'all') {
    const [selectedMin, selectedMax] = ageFilter.split('-').map(Number);
    availableQuestions = bank.filter(question => {
      if (!question.age_band) return false;
      const band = question.age_band.match(/\d+/g);
      if (!band || !band.length) return false;
      const questionMin = Number(band[0]);
      const questionMax = Number(band[1] || band[0]);
      return questionMin <= selectedMax && questionMax >= selectedMin;
    });
  }

  if (!availableQuestions.length) {
    availableQuestions = bank;
  }

  round = shuffle(availableQuestions).slice(0, 20);

  index = 0;
  score = 0;
  answered = false;

  if ($('next')) {
    $('next').onclick = nextQuestion;
    $('next').hidden = true;
  }

  track('game_start', {
    question_count: round.length
  });

  show();
}

/* ---------------------------------------------------------
   QUESTION VISUAL
--------------------------------------------------------- */

function displayQuestionVisual(question) {
  let visual = document.getElementById('question-visual');

  if (!visual) {
    visual = document.createElement('div');
    visual.id = 'question-visual';

    $('question').insertAdjacentElement('afterend', visual);
  }

  visual.innerHTML = '';

  if (question.image) {
    const image = document.createElement('img');

    image.src = question.image;
    image.alt = question.imageAlt || 'Picture clue';
    image.style.width = '100%';
    image.style.maxWidth = '320px';
    image.style.height = '240px';
    image.style.objectFit = 'contain';
    image.style.display = 'block';
    image.style.margin = '20px auto';

    visual.appendChild(image);
    visual.style.display = 'block';

  } else if (
    question.visual &&
    question.visual.trim() !== ''
  ) {
    const display = document.createElement('div');

    display.textContent = question.visual;
    display.style.fontSize = '100px';
    display.style.fontWeight = 'bold';
    display.style.textAlign = 'center';
    display.style.margin = '20px auto';

    visual.appendChild(display);
    visual.style.display = 'block';

  } else {
    visual.style.display = 'none';
  }
}

/* ---------------------------------------------------------
   DISPLAY ANSWER OPTIONS
   Supports:
   1. Text options: "A", "B", "C"
   2. Picture options: { label: "Goat", image: "..." }
--------------------------------------------------------- */

function displayAnswers(question) {
  const answerArea = $('answers');

  answerArea.innerHTML = '';

  shuffle(question.options).forEach(option => {
    const isPicture = typeof option === 'object';

    const label = isPicture ? option.label : option;

    const button = document.createElement('button');

    button.type = 'button';
    button.className = isPicture
      ? 'answer-option picture-answer'
      : 'answer-option text-answer';

    button.dataset.answer = label;

    if (isPicture && option.image) {
      const image = document.createElement('img');

      image.src = option.image;
      image.alt = label ? `Picture answer: ${label}` : 'Picture answer';
      image.loading = 'eager';
      image.style.width = '100%';
      image.style.height = '150px';
      image.style.objectFit = 'contain';
      image.style.display = 'block';

      button.appendChild(image);

      // No written answer label is shown for picture questions.
      button.setAttribute('aria-label', label);

    } else {
      // Text-only options for letter and word questions.
      button.textContent = label;
    }

    button.addEventListener('click', () => {
      choose(label, question, button);
    });

    answerArea.appendChild(button);
  });
}

/* ---------------------------------------------------------
   DISPLAY QUESTION
--------------------------------------------------------- */

function show() {
  answered = false;

  const question = round[index];

  if (!question) {
    finishGame();
    return;
  }

  if ($('progress')) {
    $('progress').textContent =
      `Question ${index + 1} of ${round.length} · Score ${score}`;
  }

  $('question').textContent = question.prompt;

  displayQuestionVisual(question);

  $('feedback').textContent = '';

  if ($('next')) {
    $('next').hidden = true;
  }

  displayAnswers(question);
}

/* ---------------------------------------------------------
   CHECK ANSWER
--------------------------------------------------------- */

function choose(selectedAnswer, question, selectedButton) {
  if (answered) return;

  answered = true;

  const correct =
    selectedAnswer === question.answer;

  const buttons = $('answers').querySelectorAll('button');

  buttons.forEach(button => {
    button.disabled = true;

    if (button.dataset.answer === question.answer) {
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
      `Not quite! The correct answer is ${question.answer}.`;
  }

  $('progress').textContent =
    `Question ${index + 1} of ${round.length} · Score ${score}`;

  track('question_answered', {
    question_id: question.id,
    selected_answer: selectedAnswer,
    correct_answer: question.answer,
    is_correct: correct
  });

  if ($('next')) {
    $('next').hidden = false;

    $('next').textContent =
      index === round.length - 1
        ? 'See My Results'
        : 'Next Question';
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
   REPLAY
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

if ($('start')) {
  $('start').addEventListener('click', start);
}

if ($('restart')) {
  $('restart').addEventListener('click', replay);
}

if ($('next')) {
  $('next').onclick = nextQuestion;
}

/* ---------------------------------------------------------
   INITIALISE
--------------------------------------------------------- */

init();


let bank = [];
let round = [];
let index = 0;
let score = 0;
let age = '5-7';
let answered = false;

const $ = id => document.getElementById(id);

const ageEl = $('age');

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

// Load the 500-question bank
async function init() {
  try {
    const response = await fetch(
      '/games/abc-letter-adventure/question-bank.json'
    );

    if (!response.ok) {
      throw new Error(
        `Question bank request failed: HTTP ${response.status}`
      );
    }

    const data = await response.json();

    if (!Array.isArray(data.questions) || data.questions.length === 0) {
      throw new Error('Question bank is empty or incorrectly formatted.');
    }

    bank = data.questions;

    console.log(`Successfully loaded ${bank.length} questions.`);

    start();

  } catch (error) {
    console.error('ABC Challenge loading error:', error);

    $('progress').textContent =
      'The question bank could not be loaded. Please try again.';
  }
}

// Select questions based on the child's age
function start() {
  if (!bank.length) return;

  age = ageEl.value;

  const target =
    age === '2-4'
      ? [
          'Letter recognition',
          'Uppercase and lowercase matching'
        ]
      : age === '5-7'
      ? [
          'Beginning letter sounds',
          'Missing letters',
          'Alphabet sequencing',
          'Letter recognition',
          'Uppercase and lowercase matching'
        ]
      : age === '8-10'
      ? [
          'Picture and word matching',
          'Early word spelling',
          'Word puzzles and simple riddles',
          'Mixed alphabet challenges'
        ]
      : [
          'Word puzzles and simple riddles',
          'Mixed alphabet challenges',
          'Early word spelling',
          'Vowels and consonants'
        ];

  let filtered = bank.filter(question =>
    target.some(category =>
      (question.category || '')
        .toLowerCase()
        .includes(category.toLowerCase())
    )
  );

  if (!filtered.length) {
    filtered = bank;
  }

  round = shuffle(filtered).slice(0, 10);

  index = 0;
  score = 0;
  answered = false;

  // Restore the normal Next button after a previous game
  $('next').textContent = 'Next question';
  $('next').onclick = nextQuestion;

  show();
}

// Display the current question
function show() {
  answered = false;

  const question = round[index];

  if (!question) return;

  $('progress').textContent =
    `Question ${index + 1} of ${round.length} · Score ${score}`;

  $('question').textContent = question.prompt;

  $('answers').innerHTML = '';

  $('feedback').textContent = '';

  $('next').hidden = true;

  shuffle(question.options).forEach(option => {
    const button = document.createElement('button');

    button.textContent = option;

    button.onclick = () => choose(option, question, button);

    $('answers').append(button);
  });
}

// Check the selected answer
function choose(option, question, button) {
  if (answered) return;

  answered = true;

  const correct = option === question.answer;

  if (correct) {
    score++;
  }

  $('feedback').textContent = correct
    ? 'Wonderful work! 🌟'
    : 'Good try! The answer is ' + question.answer + '.';

  $('answers').querySelectorAll('button').forEach(answerButton => {
    answerButton.disabled = true;

    if (answerButton.textContent === question.answer) {
      answerButton.classList.add('correct');
    } else if (answerButton === button && !correct) {
      answerButton.classList.add('incorrect');
    }
  });

  $('next').hidden = false;

  $('progress').textContent =
    `Question ${index + 1} of ${round.length} · Score ${score}`;

  if (correct) {
    track('level_complete');
  }
}

// Record game activity
function track(eventName) {
  fetch('/api/events', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      gameSlug: 'abc-letter-adventure',
      eventName,
      ageBand: age,
      deviceType: matchMedia('(max-width:700px)').matches
        ? 'mobile'
        : 'desktop'
    })
  }).catch(error => {
    console.warn('Analytics event could not be recorded:', error);
  });
}

// Move to the next question
function nextQuestion() {
  index++;

  if (index >= round.length) {
    finishGame();
    return;
  }

  show();
}

// Display the final score
function finishGame() {
  track('game_complete');

  $('question').textContent =
    `You did it! You scored ${score} out of ${round.length}.`;

  $('answers').innerHTML = '';

  $('feedback').textContent =
    'Fantastic effort! Play another round when you are ready.';

  $('progress').textContent =
    `Game completed · Final score: ${score}/${round.length}`;

  $('next').textContent = 'Play again';

  $('next').hidden = false;

  $('next').onclick = () => {
    track('replay');
    start();
  };
}

// Change questions when the age group changes
ageEl.onchange = start;

// Start the game
track('game_start');

init();

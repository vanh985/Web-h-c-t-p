// ============================================================
// js/quiz.js – Xử lý chức năng Quiz
// ============================================================

let quizCards      = [];  // Danh sách thẻ đang quiz
let currentIndex   = 0;   // Câu hỏi hiện tại
let correctCount   = 0;   // Số câu đúng

async function startQuiz() {
  const count   = parseInt(document.getElementById('quiz-count').value);
  const subject = document.getElementById('quiz-subject').value;

  const res = await CardsAPI.getQuiz(count, subject);

  if (!res || !res.success) {
    showToast('Không đủ flashcard để quiz!', 'error');
    return;
  }

  quizCards    = res.data;
  currentIndex = 0;
  correctCount = 0;

  document.getElementById('quiz-setup').style.display      = 'none';
  document.getElementById('quiz-result-screen').style.display = 'none';
  document.getElementById('quiz-playing').style.display    = 'block';

  showQuestion();
}

function showQuestion() {
  const card = quizCards[currentIndex];
  const total = quizCards.length;

  // Cập nhật progress bar
  const pct = ((currentIndex) / total) * 100;
  document.getElementById('quiz-progress-fill').style.width = pct + '%';
  document.getElementById('quiz-counter').textContent       = `Câu ${currentIndex + 1} / ${total}`;
  document.getElementById('quiz-score-display').textContent = `Đúng: ${correctCount}`;

  document.getElementById('quiz-q-subject').textContent = card.subject;
  document.getElementById('quiz-question').textContent  = card.front;
  document.getElementById('quiz-answer').value = '';
  document.getElementById('quiz-result').style.display  = 'none';
  document.getElementById('btn-check-answer').style.display = 'block';
}

function checkAnswer() {
  const userAnswer = document.getElementById('quiz-answer').value.trim();
  const card       = quizCards[currentIndex];

  if (!userAnswer) {
    showToast('Hãy nhập câu trả lời!', 'error');
    return;
  }

  // So sánh không phân biệt hoa/thường, bỏ khoảng trắng đầu cuối
  const isCorrect = userAnswer.toLowerCase() === card.back.toLowerCase();
  if (isCorrect) correctCount++;

  const resultEl = document.getElementById('quiz-result');
  resultEl.style.display = 'block';
  resultEl.className     = `quiz-result ${isCorrect ? 'correct' : 'wrong'}`;

  document.getElementById('result-label').textContent        = isCorrect ? '✅ Đúng rồi!' : '❌ Chưa đúng';
  document.getElementById('correct-answer-text').textContent = card.back;
  document.getElementById('btn-check-answer').style.display  = 'none';

  // Cập nhật điểm
  document.getElementById('quiz-score-display').textContent = `Đúng: ${correctCount}`;
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= quizCards.length) {
    showResult();
  } else {
    showQuestion();
  }
}

function showResult() {
  document.getElementById('quiz-playing').style.display      = 'none';
  document.getElementById('quiz-result-screen').style.display = 'block';

  const total   = quizCards.length;
  const pct     = Math.round((correctCount / total) * 100);

  document.getElementById('result-correct').textContent = correctCount;
  document.getElementById('result-total').textContent   = total;

  // Emoji và thông điệp theo kết quả
  let emoji, title, msg;
  if (pct === 100) {
    emoji = '🏆'; title = 'Hoàn hảo!';       msg = 'Tuyệt vời, bạn trả lời đúng tất cả!';
  } else if (pct >= 70) {
    emoji = '🎉'; title = 'Rất tốt!';         msg = 'Bạn đã nắm vững kiến thức này!';
  } else if (pct >= 50) {
    emoji = '💪'; title = 'Cố lên!';          msg = 'Ôn thêm một chút nữa nhé!';
  } else {
    emoji = '📚'; title = 'Cần ôn thêm!';     msg = 'Hãy xem lại flashcard và thử lại!';
  }

  document.getElementById('result-emoji').textContent   = emoji;
  document.getElementById('result-title').textContent   = title;
  document.getElementById('result-message').textContent = msg;
}

function retryQuiz() {
  document.getElementById('quiz-result-screen').style.display = 'none';
  document.getElementById('quiz-setup').style.display         = 'block';
  loadQuizSubjects(); // Làm mới danh sách môn
}

// Cập nhật dropdown môn học trong quiz
async function loadQuizSubjects() {
  const res = await CardsAPI.getAll();
  if (!res) return;

  const subjects = [...new Set(res.data.map(c => c.subject))];
  const sel      = document.getElementById('quiz-subject');

  sel.innerHTML = '<option value="">Tất cả môn</option>';
  subjects.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    sel.appendChild(opt);
  });
}

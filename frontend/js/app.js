// ============================================================
// js/app.js – File khởi động, gắn sự kiện, điều hướng tab
// ============================================================
// File này chạy cuối cùng (sau khi load xong HTML + các file JS khác)
// Nhiệm vụ: gắn sự kiện click cho tất cả các nút
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // ---- Khởi động: load dữ liệu ban đầu ----
  loadNotes();
  loadFlashcards();
  loadQuizSubjects();

  // ---- ĐIỀU HƯỚNG TAB ----
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      // Bỏ active khỏi tất cả
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

      // Bật tab được chọn
      btn.classList.add('active');
      document.getElementById(`tab-${tab}`).classList.add('active');
    });
  });

  // ---- NÚT GHI CHÚ ----
  document.getElementById('btn-open-note-form').addEventListener('click', openNoteForm);
  document.getElementById('btn-cancel-note').addEventListener('click', closeNoteForm);
  document.getElementById('btn-save-note').addEventListener('click', saveNote);

  // Chip lọc "Tất cả" cho notes
  document.querySelector('#notes-subject-filters .chip').addEventListener('click', function () {
    document.querySelectorAll('#notes-subject-filters .chip').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    loadNotes('');
  });

  // ---- NÚT FLASHCARD ----
  document.getElementById('btn-open-card-form').addEventListener('click', openCardForm);
  document.getElementById('btn-cancel-card').addEventListener('click', closeCardForm);
  document.getElementById('btn-save-card').addEventListener('click', saveCard);

  // Chip lọc "Tất cả" cho flashcards
  document.querySelector('#cards-subject-filters .chip').addEventListener('click', function () {
    document.querySelectorAll('#cards-subject-filters .chip').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    loadFlashcards('');
  });

  // ---- NÚT QUIZ ----
  document.getElementById('btn-start-quiz').addEventListener('click', startQuiz);
  document.getElementById('btn-check-answer').addEventListener('click', checkAnswer);
  document.getElementById('btn-next-question').addEventListener('click', nextQuestion);
  document.getElementById('btn-retry-quiz').addEventListener('click', retryQuiz);

  // Nhấn Enter trong ô trả lời quiz để kiểm tra
  document.getElementById('quiz-answer').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const checkBtn = document.getElementById('btn-check-answer');
      if (checkBtn.style.display !== 'none') checkAnswer();
    }
  });
});

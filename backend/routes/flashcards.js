// ============================================================
// routes/flashcards.js - Xử lý API cho Flashcard
// ============================================================

const express = require('express');
const router  = express.Router();
const store   = require('../data/store');

// ============================================================
// GET /flashcards - Lấy tất cả flashcard
// ============================================================
router.get('/', (req, res) => {
  const { subject } = req.query;

  let result = store.flashcards;

  if (subject) {
    result = store.flashcards.filter(card =>
      card.subject.toLowerCase() === subject.toLowerCase()
    );
  }

  res.status(200).json({
    success: true,
    total: result.length,
    data: result
  });
});

// ============================================================
// GET /flashcards/quiz - Lấy ngẫu nhiên flashcard để quiz
// ============================================================
// Gọi: fetch('http://localhost:3000/flashcards/quiz?count=5')
// ⚠️ Route này phải đặt TRƯỚC /:id để không bị nhầm 'quiz' = id
// ============================================================
router.get('/quiz', (req, res) => {
  const count   = parseInt(req.query.count) || 5; // Số lượng câu hỏi
  const subject = req.query.subject;

  let pool = store.flashcards;

  if (subject) {
    pool = pool.filter(c => c.subject.toLowerCase() === subject.toLowerCase());
  }

  if (pool.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Không có flashcard nào để quiz!'
    });
  }

  // Xáo trộn ngẫu nhiên (thuật toán Fisher-Yates)
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  // Lấy số lượng cần thiết
  const quizCards = shuffled.slice(0, Math.min(count, shuffled.length));

  res.status(200).json({
    success: true,
    total: quizCards.length,
    data: quizCards
  });
});

// ============================================================
// GET /flashcards/:id - Lấy một flashcard theo ID
// ============================================================
router.get('/:id', (req, res) => {
  const id   = parseInt(req.params.id);
  const card = store.flashcards.find(c => c.id === id);

  if (!card) {
    return res.status(404).json({
      success: false,
      message: `Không tìm thấy flashcard có ID = ${id}`
    });
  }

  res.status(200).json({ success: true, data: card });
});

// ============================================================
// POST /flashcards - Tạo flashcard mới
// ============================================================
// Body cần gửi: { subject, front, back }
// front = mặt trước (câu hỏi)
// back  = mặt sau (đáp án)
// ============================================================
router.post('/', (req, res) => {
  const { subject, front, back } = req.body;

  if (!subject || !front || !back) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu thông tin! Cần có: subject, front, back'
    });
  }

  const newCard = {
    id:        store.getNextFlashcardId(),
    subject:   subject.trim(),
    front:     front.trim(),   // Câu hỏi
    back:      back.trim(),    // Đáp án
    createdAt: new Date().toISOString()
  };

  store.flashcards.push(newCard);

  res.status(201).json({
    success: true,
    message: 'Tạo flashcard thành công!',
    data: newCard
  });
});

// ============================================================
// PUT /flashcards/:id - Cập nhật flashcard
// ============================================================
router.put('/:id', (req, res) => {
  const id    = parseInt(req.params.id);
  const index = store.flashcards.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Không tìm thấy flashcard có ID = ${id}`
    });
  }

  const { subject, front, back } = req.body;

  store.flashcards[index] = {
    ...store.flashcards[index],
    subject:   subject || store.flashcards[index].subject,
    front:     front   || store.flashcards[index].front,
    back:      back    || store.flashcards[index].back,
    updatedAt: new Date().toISOString()
  };

  res.status(200).json({
    success: true,
    message: 'Cập nhật flashcard thành công!',
    data: store.flashcards[index]
  });
});

// ============================================================
// DELETE /flashcards/:id - Xóa flashcard
// ============================================================
router.delete('/:id', (req, res) => {
  const id    = parseInt(req.params.id);
  const index = store.flashcards.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Không tìm thấy flashcard có ID = ${id}`
    });
  }

  const deleted = store.flashcards.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: 'Xóa flashcard thành công!',
    data: deleted
  });
});

module.exports = router;

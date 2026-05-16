// ============================================================
// data/store.js - Nơi lưu trữ dữ liệu (thay cho database)
// ============================================================
// Dữ liệu lưu trong bộ nhớ RAM (mảng JavaScript)
// Khi restart server, dữ liệu sẽ bị xóa (bình thường cho project học)
// Nếu muốn lưu lâu dài → dùng file JSON hoặc MongoDB sau này
// ============================================================

// Dữ liệu mẫu ban đầu để bạn thấy ngay kết quả khi chạy
let notes = [
  {
    id: 1,
    subject: 'Toán',         // Môn học
    title: 'Đạo hàm cơ bản',
    content: 'Đạo hàm của x^n là n*x^(n-1). Ví dụ: đạo hàm x^3 = 3x^2',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    subject: 'Tiếng Anh',
    title: 'Thì hiện tại đơn',
    content: 'Dùng để diễn tả thói quen, sự thật hiển nhiên. Công thức: S + V(s/es)',
    createdAt: new Date().toISOString()
  }
];

let flashcards = [
  {
    id: 1,
    subject: 'Toán',
    front: 'Đạo hàm của sin(x) là gì?',   // Mặt trước thẻ
    back: 'cos(x)',                          // Mặt sau thẻ (đáp án)
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    subject: 'Tiếng Anh',
    front: '"Persevere" nghĩa là gì?',
    back: 'Kiên trì, bền bỉ (to continue despite difficulty)',
    createdAt: new Date().toISOString()
  }
];

// Biến đếm ID tự tăng (giống AUTO_INCREMENT trong database)
let nextNoteId      = 3;
let nextFlashcardId = 3;

// Export để các file khác dùng được
module.exports = {
  notes,
  flashcards,
  getNextNoteId:      () => nextNoteId++,
  getNextFlashcardId: () => nextFlashcardId++
};

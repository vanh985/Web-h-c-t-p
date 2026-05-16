// ============================================================
// routes/notes.js - Xử lý tất cả API liên quan đến Ghi Chú
// ============================================================
// Router giống như "bộ phận" riêng xử lý một nhóm chức năng
// Server.js đã gắn router này vào đường dẫn /notes
// Nên ở đây chỉ cần viết '/' thay vì '/notes'
// ============================================================

const express = require('express');
const router  = express.Router(); // Tạo một router nhỏ
const store   = require('../data/store'); // Lấy dữ liệu dùng chung

// ============================================================
// GET /notes - Lấy danh sách tất cả ghi chú
// ============================================================
// Cách dùng: fetch('http://localhost:3000/notes')
// ============================================================
router.get('/', (req, res) => {
  // req = request (yêu cầu từ client)
  // res = response (phản hồi gửi về cho client)

  const { subject } = req.query; // Lọc theo môn học nếu có

  let result = store.notes;

  // Nếu có query ?subject=Toán → lọc chỉ lấy notes môn Toán
  if (subject) {
    result = store.notes.filter(note =>
      note.subject.toLowerCase() === subject.toLowerCase()
    );
  }

  // Trả về JSON với mã 200 (thành công)
  res.status(200).json({
    success: true,
    total: result.length,
    data: result
  });
});

// ============================================================
// GET /notes/:id - Lấy một ghi chú theo ID
// ============================================================
// Cách dùng: fetch('http://localhost:3000/notes/1')
// ============================================================
router.get('/:id', (req, res) => {
  const id   = parseInt(req.params.id); // Lấy id từ URL
  const note = store.notes.find(n => n.id === id); // Tìm trong mảng

  if (!note) {
    // Không tìm thấy → trả về mã 404 (Not Found)
    return res.status(404).json({
      success: false,
      message: `Không tìm thấy ghi chú có ID = ${id}`
    });
  }

  res.status(200).json({ success: true, data: note });
});

// ============================================================
// POST /notes - Tạo ghi chú mới
// ============================================================
// Cách dùng:
// fetch('http://localhost:3000/notes', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ subject: 'Toán', title: '...', content: '...' })
// })
// ============================================================
router.post('/', (req, res) => {
  const { subject, title, content } = req.body; // Lấy dữ liệu từ body

  // --- Kiểm tra dữ liệu hợp lệ ---
  if (!subject || !title || !content) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu thông tin! Cần có: subject, title, content'
    });
  }

  // Tạo object ghi chú mới
  const newNote = {
    id:        store.getNextNoteId(), // ID tự tăng
    subject:   subject.trim(),
    title:     title.trim(),
    content:   content.trim(),
    createdAt: new Date().toISOString() // Thời gian tạo
  };

  // Thêm vào mảng (push = thêm vào cuối mảng)
  store.notes.push(newNote);

  // Trả về mã 201 (Created) và ghi chú vừa tạo
  res.status(201).json({
    success: true,
    message: 'Tạo ghi chú thành công!',
    data: newNote
  });
});

// ============================================================
// PUT /notes/:id - Cập nhật ghi chú
// ============================================================
router.put('/:id', (req, res) => {
  const id    = parseInt(req.params.id);
  const index = store.notes.findIndex(n => n.id === id); // Tìm vị trí trong mảng

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Không tìm thấy ghi chú có ID = ${id}`
    });
  }

  const { subject, title, content } = req.body;

  // Cập nhật chỉ những trường được gửi lên (dùng ... spread operator)
  store.notes[index] = {
    ...store.notes[index], // Giữ nguyên dữ liệu cũ
    subject:   subject   || store.notes[index].subject,
    title:     title     || store.notes[index].title,
    content:   content   || store.notes[index].content,
    updatedAt: new Date().toISOString()
  };

  res.status(200).json({
    success: true,
    message: 'Cập nhật thành công!',
    data: store.notes[index]
  });
});

// ============================================================
// DELETE /notes/:id - Xóa ghi chú
// ============================================================
router.delete('/:id', (req, res) => {
  const id    = parseInt(req.params.id);
  const index = store.notes.findIndex(n => n.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Không tìm thấy ghi chú có ID = ${id}`
    });
  }

  // splice(vị_trí, số_phần_tử_xóa) - xóa 1 phần tử tại vị trí index
  const deletedNote = store.notes.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: 'Xóa ghi chú thành công!',
    data: deletedNote
  });
});

module.exports = router;

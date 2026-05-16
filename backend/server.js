// ============================================================
// server.js - File chính để khởi động backend
// ============================================================
// Express là thư viện giúp tạo server dễ dàng
// Chạy file này bằng lệnh: node server.js
// ============================================================

const express = require('express');
const cors    = require('cors');      // Cho phép frontend gọi backend
const path    = require('path');      // Xử lý đường dẫn file

// --- Import các "router" (bộ xử lý route) ---
const notesRouter      = require('./routes/notes');
const flashcardsRouter = require('./routes/flashcards');

// Khởi tạo ứng dụng Express
const app  = express();
const PORT = 3000; // Server chạy ở cổng 3000

// ============================================================
// MIDDLEWARE - Các hàm chạy trước khi xử lý request
// ============================================================

// Cho phép đọc JSON từ request body (khi POST dữ liệu lên)
app.use(express.json());

// Cho phép frontend (chạy ở cổng khác) gọi API này
app.use(cors());

// Phục vụ file tĩnh (HTML, CSS, JS) trong thư mục ../frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ============================================================
// ROUTES - Định nghĩa các đường dẫn API
// ============================================================

// Mọi request bắt đầu bằng /notes → xử lý trong routes/notes.js
app.use('/notes', notesRouter);

// Mọi request bắt đầu bằng /flashcards → xử lý trong routes/flashcards.js
app.use('/flashcards', flashcardsRouter);

// Route mặc định - trả về trang chủ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ============================================================
// KHỞI ĐỘNG SERVER
// ============================================================
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📝 API Notes:      http://localhost:${PORT}/notes`);
  console.log(`🃏 API Flashcards: http://localhost:${PORT}/flashcards`);
});

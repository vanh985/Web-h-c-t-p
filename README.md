# 📚 Note & Quiz – Ghi chú + Flashcard ôn tập

## 🗂️ Cấu trúc thư mục

```
note-quiz/
│
├── backend/                  ← Server Node.js + Express
│   ├── server.js             ← File khởi động server (chạy cái này)
│   ├── package.json          ← Cấu hình & danh sách thư viện
│   ├── data/
│   │   └── store.js          ← "Database" đơn giản (mảng JS)
│   └── routes/
│       ├── notes.js          ← Xử lý API /notes (CRUD)
│       └── flashcards.js     ← Xử lý API /flashcards (CRUD + quiz)
│
└── frontend/                 ← Giao diện người dùng
    ├── index.html            ← Trang chính (1 file HTML duy nhất)
    ├── css/
    │   └── style.css         ← Toàn bộ CSS
    └── js/
        ├── api.js            ← Hàm gọi API (fetch)
        ├── notes.js          ← Logic tab Ghi Chú
        ├── flashcards.js     ← Logic tab Flashcard
        ├── quiz.js           ← Logic tab Quiz
        └── app.js            ← Khởi động app, gắn sự kiện
```

---

## 🚀 Cách chạy project

### Bước 1: Cài đặt
```bash
cd backend
npm install
```

### Bước 2: Khởi động server
```bash
node server.js
# Hoặc (tự reload khi sửa code):
npx nodemon server.js
```

### Bước 3: Mở trình duyệt
```
http://localhost:3000
```

---

## 🔌 Danh sách API

| Method | Endpoint               | Mô tả                        |
|--------|------------------------|------------------------------|
| GET    | /notes                 | Lấy tất cả ghi chú           |
| GET    | /notes?subject=Toán    | Lọc ghi chú theo môn         |
| POST   | /notes                 | Tạo ghi chú mới              |
| PUT    | /notes/:id             | Cập nhật ghi chú             |
| DELETE | /notes/:id             | Xóa ghi chú                  |
| GET    | /flashcards            | Lấy tất cả flashcard         |
| POST   | /flashcards            | Tạo flashcard mới            |
| PUT    | /flashcards/:id        | Cập nhật flashcard           |
| DELETE | /flashcards/:id        | Xóa flashcard                |
| GET    | /flashcards/quiz?count=5 | Lấy ngẫu nhiên để quiz     |

### Ví dụ gọi API (dùng curl)
```bash
# Lấy tất cả notes
curl http://localhost:3000/notes

# Tạo note mới
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"subject":"Toán","title":"Tích phân","content":"Nội dung..."}'
```

---

## 💡 Giải thích từng file

### `backend/server.js`
- File chính, khởi động server Express
- Khai báo middleware (express.json, cors)
- Gắn các router vào đường dẫn tương ứng

### `backend/data/store.js`
- "Database" đơn giản dùng mảng JavaScript
- Dữ liệu lưu trong RAM → mất khi restart server
- Có dữ liệu mẫu để test ngay

### `backend/routes/notes.js` & `flashcards.js`
- Xử lý logic CRUD cho từng loại dữ liệu
- Mỗi hàm xử lý một HTTP method: GET, POST, PUT, DELETE

### `frontend/js/api.js`
- Tập trung tất cả lệnh `fetch()` vào một chỗ
- Dễ thay đổi địa chỉ server sau này

### `frontend/js/app.js`
- Khởi động app khi trang load xong
- Gắn event listener cho tất cả nút

---

## 🔧 Mở rộng sau này

- **Lưu dữ liệu vĩnh viễn**: Thay `store.js` bằng file `db.json` dùng thư viện `lowdb`
- **Database thật**: Chuyển sang MongoDB + Mongoose
- **Đăng nhập**: Thêm JWT authentication
- **Deploy**: Upload lên Render, Railway, hoặc VPS

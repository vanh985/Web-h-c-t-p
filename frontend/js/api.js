// ============================================================
// js/api.js – Hàm giao tiếp với backend API
// ============================================================
// File này chứa các hàm để gọi API (fetch)
// Mọi request lên server đều đi qua đây
// ============================================================

const API_BASE = 'http://localhost:3000'; // Địa chỉ backend

// Hàm fetch chung – xử lý lỗi một chỗ
async function apiFetch(path, options = {}) {
  try {
    const res  = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('❌ Lỗi kết nối API:', err);
    showToast('Không thể kết nối server!', 'error');
    return null;
  }
}

// --- NOTES API ---
const NotesAPI = {
  getAll:    (subject) => apiFetch(`/notes${subject ? `?subject=${subject}` : ''}`),
  create:    (data)    => apiFetch('/notes', { method: 'POST', body: JSON.stringify(data) }),
  update:    (id, d)   => apiFetch(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  remove:    (id)      => apiFetch(`/notes/${id}`, { method: 'DELETE' })
};

// --- FLASHCARDS API ---
const CardsAPI = {
  getAll:    (subject) => apiFetch(`/flashcards${subject ? `?subject=${subject}` : ''}`),
  getQuiz:   (count, subject) => apiFetch(`/flashcards/quiz?count=${count}${subject ? `&subject=${subject}` : ''}`),
  create:    (data)    => apiFetch('/flashcards', { method: 'POST', body: JSON.stringify(data) }),
  update:    (id, d)   => apiFetch(`/flashcards/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  remove:    (id)      => apiFetch(`/flashcards/${id}`, { method: 'DELETE' })
};

// --- TOAST THÔNG BÁO ---
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className   = `toast ${type} show`;
  setTimeout(() => { toast.className = 'toast'; }, 2800);
}

// --- FORMAT NGÀY GIỜ ---
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

// ============================================================
// js/notes.js – Xử lý chức năng Ghi Chú
// ============================================================

let currentNoteSubject = ''; // Môn đang lọc

async function loadNotes(subject = '') {
  currentNoteSubject = subject;
  const res = await NotesAPI.getAll(subject);
  if (!res) return;

  const container = document.getElementById('notes-list');

  if (res.data.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-text">Chưa có ghi chú nào. Hãy thêm ghi chú đầu tiên!</div>
      </div>`;
    return;
  }

  container.innerHTML = res.data.map(note => `
    <div class="note-card" data-id="${note.id}">
      <div class="note-subject-tag">${note.subject}</div>
      <div class="note-title">${escapeHtml(note.title)}</div>
      <div class="note-content">${escapeHtml(note.content)}</div>
      <div class="note-footer">
        <span class="note-date">${formatDate(note.createdAt)}</span>
        <button class="btn-danger" onclick="deleteNote(${note.id})">🗑 Xóa</button>
      </div>
    </div>
  `).join('');

  updateNotesFilters(res.data);
}

function updateNotesFilters(notes) {
  const subjects = [...new Set(notes.map(n => n.subject))];
  const container = document.getElementById('notes-subject-filters');
  const allChip   = container.querySelector('[data-subject=""]');

  // Xóa chip cũ (giữ chip "Tất cả")
  container.querySelectorAll('[data-subject]:not([data-subject=""])').forEach(el => el.remove());

  subjects.forEach(s => {
    const btn = document.createElement('button');
    btn.className = `chip${currentNoteSubject === s ? ' active' : ''}`;
    btn.dataset.subject = s;
    btn.textContent = s;
    btn.onclick = () => filterNotes(s, btn);
    container.appendChild(btn);
  });

  allChip.className = `chip${!currentNoteSubject ? ' active' : ''}`;
}

function filterNotes(subject, btn) {
  document.querySelectorAll('#notes-subject-filters .chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  loadNotes(subject);
}

async function saveNote() {
  const subject = document.getElementById('note-subject').value.trim();
  const title   = document.getElementById('note-title').value.trim();
  const content = document.getElementById('note-content').value.trim();

  if (!subject || !title || !content) {
    showToast('Vui lòng điền đầy đủ thông tin!', 'error');
    return;
  }

  const res = await NotesAPI.create({ subject, title, content });
  if (res?.success) {
    showToast('✅ Đã lưu ghi chú!');
    closeNoteForm();
    loadNotes(currentNoteSubject);
  }
}

async function deleteNote(id) {
  if (!confirm('Xóa ghi chú này?')) return;
  const res = await NotesAPI.remove(id);
  if (res?.success) {
    showToast('🗑 Đã xóa ghi chú');
    loadNotes(currentNoteSubject);
  }
}

function openNoteForm() {
  document.getElementById('note-form').style.display = 'block';
  document.getElementById('btn-open-note-form').style.display = 'none';
}

function closeNoteForm() {
  document.getElementById('note-form').style.display = 'none';
  document.getElementById('btn-open-note-form').style.display = '';
  document.getElementById('note-subject').value = '';
  document.getElementById('note-title').value   = '';
  document.getElementById('note-content').value = '';
}

// Chống XSS – không cho HTML lạ vào DOM
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

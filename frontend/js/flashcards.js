// ============================================================
// js/flashcards.js – Xử lý chức năng Flashcard
// ============================================================

let currentCardSubject = '';

async function loadFlashcards(subject = '') {
  currentCardSubject = subject;
  const res = await CardsAPI.getAll(subject);
  if (!res) return;

  const container = document.getElementById('flashcards-list');

  if (res.data.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🃏</div>
        <div class="empty-state-text">Chưa có flashcard. Hãy thêm thẻ đầu tiên!</div>
      </div>`;
    return;
  }

  container.innerHTML = res.data.map(card => `
    <div class="flashcard" id="card-${card.id}" onclick="flipCard(${card.id})">
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <div class="card-subject">${card.subject}</div>
          <div class="card-text">${escapeHtml(card.front)}</div>
          <div class="card-hint">Nhấn để xem đáp án 👆</div>
          <div class="card-actions" onclick="event.stopPropagation()">
            <button class="btn-danger" onclick="deleteCard(${card.id})">🗑</button>
          </div>
        </div>
        <div class="flashcard-back">
          <div class="card-subject">${card.subject}</div>
          <div class="card-text">${escapeHtml(card.back)}</div>
          <div class="card-hint">Nhấn để quay lại 🔄</div>
        </div>
      </div>
    </div>
  `).join('');

  updateCardFilters(res.data);
}

function flipCard(id) {
  document.getElementById(`card-${id}`).classList.toggle('flipped');
}

function updateCardFilters(cards) {
  const subjects  = [...new Set(cards.map(c => c.subject))];
  const container = document.getElementById('cards-subject-filters');
  const allChip   = container.querySelector('[data-subject=""]');

  container.querySelectorAll('[data-subject]:not([data-subject=""])').forEach(el => el.remove());

  subjects.forEach(s => {
    const btn = document.createElement('button');
    btn.className = `chip${currentCardSubject === s ? ' active' : ''}`;
    btn.dataset.subject = s;
    btn.textContent = s;
    btn.onclick = () => filterCards(s, btn);
    container.appendChild(btn);
  });

  allChip.className = `chip${!currentCardSubject ? ' active' : ''}`;
}

function filterCards(subject, btn) {
  document.querySelectorAll('#cards-subject-filters .chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  loadFlashcards(subject);
}

async function saveCard() {
  const subject = document.getElementById('card-subject').value.trim();
  const front   = document.getElementById('card-front').value.trim();
  const back    = document.getElementById('card-back').value.trim();

  if (!subject || !front || !back) {
    showToast('Vui lòng điền đầy đủ thông tin!', 'error');
    return;
  }

  const res = await CardsAPI.create({ subject, front, back });
  if (res?.success) {
    showToast('✅ Đã tạo flashcard!');
    closeCardForm();
    loadFlashcards(currentCardSubject);
  }
}

async function deleteCard(id) {
  if (!confirm('Xóa flashcard này?')) return;
  const res = await CardsAPI.remove(id);
  if (res?.success) {
    showToast('🗑 Đã xóa flashcard');
    loadFlashcards(currentCardSubject);
  }
}

function openCardForm() {
  document.getElementById('card-form').style.display = 'block';
  document.getElementById('btn-open-card-form').style.display = 'none';
}

function closeCardForm() {
  document.getElementById('card-form').style.display = 'none';
  document.getElementById('btn-open-card-form').style.display = '';
  document.getElementById('card-subject').value = '';
  document.getElementById('card-front').value   = '';
  document.getElementById('card-back').value    = '';
}

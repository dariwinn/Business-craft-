// Навігація між 5 фреймами
function navigateTo(frameId, openAdvisor = false) {
  // Сховати всі екрани
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  // Показати обраний екран
  const targetScreen = document.getElementById(frameId);
  if (targetScreen) {
    targetScreen.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Керування бічною панеллю AI Co-Pilot (Фрейм 4)
  if (frameId === 'frame-3') {
    toggleAdvisor(openAdvisor);
  } else {
    toggleAdvisor(false);
  }

  // Оновлення активної кнопки у нижньому перемикачі фреймів
  document.querySelectorAll('.fs-btn').forEach(btn => btn.classList.remove('active'));
  const activeKey = (frameId === 'frame-3' && openAdvisor) ? 'frame-4' : frameId;
  const activeBtn = document.querySelector(`.fs-btn[data-target="${activeKey}"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

// Відкриття / закриття AI Strategy Advisor (Фрейм 4)
function toggleAdvisor(isOpen) {
  const drawer = document.getElementById('advisor-drawer');
  const backdrop = document.getElementById('advisor-backdrop');
  if (!drawer || !backdrop) return;

  if (isOpen) {
    drawer.classList.add('open');
    backdrop.classList.add('open');
  } else {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
  }
}

// Вибір карти в руці гравця (Фрейм 3)
function selectHandCard(cardElement) {
  document.querySelectorAll('.hand-card').forEach(card => {
    card.classList.remove('selected');
    const footerSpan = card.querySelector('.hc-footer span:last-child');
    if (footerSpan) footerSpan.textContent = 'PLAY CARD →';
  });

  cardElement.classList.add('selected');
  const selectedLabel = cardElement.querySelector('.hc-footer span:last-child');
  if (selectedLabel) selectedLabel.textContent = 'SELECTED';
}

// Розіграш обраної карти на ігровий стіл
function playSelectedCard() {
  const selectedCard = document.querySelector('.hand-card.selected');
  const dropZone = document.getElementById('drop-zone');
  const crisisStatus = document.getElementById('crisis-status');
  const cashEl = document.getElementById('player-cash');

  if (!selectedCard || !dropZone) return;

  const cardType = selectedCard.getAttribute('data-card');
  const cardTitle = selectedCard.querySelector('h4').innerHTML;
  const cardEffect = selectedCard.querySelector('.hc-effect').textContent;

  // Візуалізація зіграної карти в слоті "Your next move"
  dropZone.style.border = 'none';
  dropZone.style.background = '#FAF7F0';
  dropZone.style.color = '#1C2421';
  dropZone.style.textAlign = 'left';
  dropZone.style.alignItems = 'flex-start';
  dropZone.innerHTML = `
    <div class="tc-tag burgundy-text">PLAYED THIS TURN</div>
    <h3 style="font-family: var(--font-serif); font-size: 1.2rem; margin-bottom: 6px;">${cardTitle}</h3>
    <div class="green-italic">${cardEffect}</div>
    <div class="muted-sm" style="margin-top: auto;">Confirmed · Resolving</div>
  `;

  // Якщо зіграно PR Crisis Management — знімаємо загрозу репутації
  if (cardType === 'pr' && crisisStatus) {
    crisisStatus.textContent = '✓ Crisis contained (0% loss)';
    crisisStatus.style.color = '#153B2E';
    if (cashEl) cashEl.textContent = '$420k';
  }

  // Зміна кнопки на перехід до підсумків матчу (Фрейм 5)
  const playBtn = document.getElementById('play-selected-btn');
  if (playBtn) {
    playBtn.textContent = 'Finish match & view results →';
    playBtn.style.background = '#153B2E';
    playBtn.onclick = () => navigateTo('frame-5');
  }
}

// Виконання рекомендації з панелі AI Co-Pilot (Фрейм 4)
function executeAdvisorRecommendation() {
  const prCard = document.querySelector('.hand-card[data-card="pr"]');
  if (prCard) selectHandCard(prCard);
  toggleAdvisor(false);
  playSelectedCard();
}

// Інтерактив для кнопки вебінару на Фреймі 5
function unlockWebinar() {
  const btn = document.getElementById('unlock-webinar-btn');
  if (btn) {
    btn.textContent = 'Unlocked ✓';
    btn.style.background = '#235744';
  }
}

// Живий зворотний відлік таймера ходу в матчі (00:42 -> 00:00)
let secondsLeft = 42;
setInterval(() => {
  const frame3 = document.getElementById('frame-3');
  const timerEl = document.getElementById('match-timer');
  if (frame3 && frame3.classList.contains('active') && timerEl && secondsLeft > 0) {
    secondsLeft--;
    const formatted = secondsLeft < 10 ? `00:0${secondsLeft}` : `00:${secondsLeft}`;
    timerEl.textContent = formatted;
  }
}, 1000);
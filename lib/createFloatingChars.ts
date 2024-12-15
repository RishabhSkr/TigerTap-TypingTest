export function createFloatingChars() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
  const container = document.querySelector('.floating-chars');
  
  if (!container) return;

  function createChar() {
    const char = document.createElement('span');
    char.className = 'char-particle';
    char.textContent = chars[Math.floor(Math.random() * chars.length)];
    char.style.left = `${Math.random() * 100}%`;
    char.style.animationDuration = `${15 + Math.random() * 10}s`;
    container.appendChild(char);

    setTimeout(() => {
      char.remove();
    }, 15000);
  }

  // Create initial set of characters
  for (let i = 0; i < 50; i++) {
    setTimeout(createChar, i * 300);
  }

  // Continuously create new characters
  setInterval(createChar, 500);
}

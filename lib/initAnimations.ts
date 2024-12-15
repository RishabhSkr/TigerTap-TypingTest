export function initAnimations() {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const intervals: number[] = []

  // Delay initialization to ensure DOM is ready
  setTimeout(() => {
    // Matrix rain animation
    const createMatrixRain = () => {
      const container = document.getElementById('matrix-rain');
      if (!container) return null;

      const createDrop = () => {
        const drop = document.createElement('span');
        drop.className = 'rain-drop';
        drop.textContent = String.fromCharCode(33 + Math.random() * 93);
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        drop.style.fontSize = `${Math.random() * 10 + 10}px`;
        container.appendChild(drop);

        setTimeout(() => drop.remove(), 2000);
      };

      // Create initial drops
      for (let i = 0; i < 50; i++) {
        setTimeout(createDrop, i * 100);
      }

      // Continue creating drops
      return window.setInterval(createDrop, 100);
    };

    // Floating symbols animation
    const createFloatingSymbols = () => {
      const container = document.getElementById('typing-symbols');
      if (!container) return null;

      const symbols = '⌨️✨💫⭐️🚀⚡️';
      
      const createSymbol = () => {
        const symbol = document.createElement('span');
        symbol.className = 'typing-symbol';
        symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        symbol.style.left = `${Math.random() * 100}%`;
        symbol.style.top = `${Math.random() * 100}%`;
        symbol.style.fontSize = `${Math.random() * 20 + 12}px`;
        symbol.style.opacity = '0.5';
        container.appendChild(symbol);

        setTimeout(() => symbol.remove(), 3000);
      };

      // Create initial symbols
      for (let i = 0; i < 20; i++) {
        setTimeout(createSymbol, i * 200);
      }

      // Continue creating symbols
      return window.setInterval(createSymbol, 500);
    };

    // Start animations and store intervals for cleanup
    const matrixInterval = createMatrixRain();
    const symbolsInterval = createFloatingSymbols();
    
    if (matrixInterval) intervals.push(matrixInterval);
    if (symbolsInterval) intervals.push(symbolsInterval);

    // Add keyboard glow effect on typing
    const addKeyboardGlow = () => {
      const keyboardKeys = document.querySelector('.keyboard-keys');
      if (!keyboardKeys) return;

      const addGlow = () => {
        keyboardKeys.classList.add('active');
        setTimeout(() => keyboardKeys.classList.remove('active'), 100);
      };

      document.addEventListener('keydown', addGlow);
    };

    addKeyboardGlow();
  }, 0);

  // Return cleanup function
  return () => {
    intervals.forEach(interval => window.clearInterval(interval));
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Referencias a elementos del DOM
  const timer = document.getElementById('stopwatch');
  const puzzleBoard = document.getElementById('puzzle-board');
  const resetBtn = document.getElementById('reset-btn');
  const shuffleBtn = document.getElementById('shuffle-btn');
  const winMessage = document.getElementById('win-message');
  const movesCount = document.getElementById('moves-count');
  const easyBtn = document.getElementById('easy-btn');
  const mediumBtn = document.getElementById('medium-btn');
  const hardBtn = document.getElementById('hard-btn');

  // URLs de las imágenes (reemplaza con tus propias URLs)
  const imageUrls = [
    './img/0.png', // Celda vacía (0)
    './img/1.png', // 1
    './img/2.png', // 2
    './img/3.png', // 3
    './img/4.png', // 4
    './img/5.png', // 5
    './img/6.png', // 6
    './img/7.png', // 7
    './img/8.png'  // 8
  ];

  // Estado del juego
  let gameState = {
    matrix: [
      [1, 2, 3],
      [4, 0, 6],
      [7, 5, 8]
    ],
    emptyCell: { row: 1, col: 1 },
    size: 3,
    isRunning: false,
    hasWon: false,
    seconds: 0,
    minutes: 0,
    moves: 0,
    timerInterval: null,
    difficulty: 'easy'
  };

  // Inicializar el juego
  initializeGame();

  // Configurar event listeners para botones de dificultad
  easyBtn.addEventListener('click', () => setDifficulty('easy'));
  mediumBtn.addEventListener('click', () => setDifficulty('medium'));
  hardBtn.addEventListener('click', () => setDifficulty('hard'));

  // Inicializar el juego
  function initializeGame() {
    createPuzzleBoard();
    setupEventListeners();
    renderBoard();
    updateMovesDisplay();
  }

  // Crear el tablero de puzzle
  function createPuzzleBoard() {
    puzzleBoard.innerHTML = '';

    for (let i = 0; i < gameState.size; i++) {
      for (let j = 0; j < gameState.size; j++) {
        const cell = document.createElement('div');
        cell.className = 'puzzle-cell';
        cell.id = `c${i}${j}`;
        cell.dataset.row = i;
        cell.dataset.col = j;

        const value = gameState.matrix[i][j];
        if (value !== 0) {
          const img = document.createElement('img');
          img.src = imageUrls[value];
          img.alt = `Número ${value}`;
          cell.appendChild(img);
        }

        puzzleBoard.appendChild(cell);
      }
    }
  }

  // Configurar event listeners
  function setupEventListeners() {
    // Usar event delegation para las celdas
    puzzleBoard.addEventListener('click', handleCellClick);

    // Botones de control
    resetBtn.addEventListener('click', resetGame);
    shuffleBtn.addEventListener('click', shuffleTiles);
  }

  // Manejar clic en una celda
  function handleCellClick(event) {
    if (gameState.hasWon) return;

    const cell = event.target.closest('.puzzle-cell');
    if (!cell) return;

    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (isAdjacent(row, col, gameState.emptyCell.row, gameState.emptyCell.col)) {
      moveTile(row, col);
      startTimer();
      checkWin();
    }
  }

  // Renderizar el tablero
  function renderBoard() {
    for (let i = 0; i < gameState.size; i++) {
      for (let j = 0; j < gameState.size; j++) {
        const cell = document.getElementById(`c${i}${j}`);
        const value = gameState.matrix[i][j];

        if (value === 0) {
          cell.classList.add('empty');
          cell.innerHTML = '';
        } else {
          cell.classList.remove('empty');

          // Solo actualizar el contenido si es necesario
          if (!cell.querySelector('img')) {
            const img = document.createElement('img');
            img.src = imageUrls[value];
            img.alt = `Número ${value}`;
            cell.innerHTML = '';
            cell.appendChild(img);
          }
        }
      }
    }
  }

  // Verificar si dos celdas son adyacentes
  function isAdjacent(row1, col1, row2, col2) {
    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);

    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }

  // Mover una ficha
  function moveTile(row, col) {
    // Intercambiar valores
    gameState.matrix[gameState.emptyCell.row][gameState.emptyCell.col] = gameState.matrix[row][col];
    gameState.matrix[row][col] = 0;

    // Actualizar celda vacía
    gameState.emptyCell = { row, col };

    // Incrementar contador de movimientos
    gameState.moves++;
    updateMovesDisplay();

    // Renderizar cambios
    renderBoard();
  }

  // Iniciar temporizador
  function startTimer() {
    if (!gameState.isRunning && !gameState.hasWon) {
      gameState.isRunning = true;

      gameState.timerInterval = setInterval(() => {
        gameState.seconds++;

        if (gameState.seconds === 60) {
          gameState.minutes++;
          gameState.seconds = 0;
        }

        updateTimerDisplay();
      }, 1000);
    }
  }

  // Detener temporizador
  function stopTimer() {
    if (gameState.isRunning) {
      clearInterval(gameState.timerInterval);
      gameState.isRunning = false;
    }
  }

  // Actualizar visualización del temporizador
  function updateTimerDisplay() {
    const minutes = gameState.minutes.toString().padStart(2, '0');
    const seconds = gameState.seconds.toString().padStart(2, '0');
    timer.textContent = `${minutes}:${seconds}`;
  }

  // Actualizar visualización de movimientos
  function updateMovesDisplay() {
    movesCount.textContent = gameState.moves;
  }

  // Verificar victoria
  function checkWin() {
    const winCondition = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 0]
    ];

    let isWin = true;

    for (let i = 0; i < gameState.size; i++) {
      for (let j = 0; j < gameState.size; j++) {
        if (gameState.matrix[i][j] !== winCondition[i][j]) {
          isWin = false;
          break;
        }
      }
      if (!isWin) break;
    }

    if (isWin) {
      gameState.hasWon = true;
      stopTimer();
      showWinMessage();
    }

    return isWin;
  }

  // Mostrar mensaje de victoria
  function showWinMessage() {
    let timeMessage;

    if (gameState.minutes > 0) {
      timeMessage = `con un tiempo de ${gameState.minutes} minutos y ${gameState.seconds} segundos`;
    } else {
      timeMessage = `con un tiempo de ${gameState.seconds} segundos`;
    }

    winMessage.innerHTML = `¡Felicidades! Has completado el puzzle ${timeMessage} y con ${gameState.moves} movimientos.`;
    winMessage.style.display = 'block';
  }

  // Reiniciar juego
  function resetGame() {
    stopTimer();

    // Reiniciar estado del juego
    gameState.matrix = [
      [1, 2, 3],
      [4, 0, 6],
      [7, 5, 8]
    ];
    gameState.emptyCell = { row: 1, col: 1 };
    gameState.isRunning = false;
    gameState.hasWon = false;
    gameState.seconds = 0;
    gameState.minutes = 0;
    gameState.moves = 0;

    // Actualizar UI
    updateTimerDisplay();
    updateMovesDisplay();
    renderBoard();
    winMessage.style.display = 'none';
  }

  // Mezclar fichas
  function shuffleTiles() {
    if (gameState.isRunning) {
      stopTimer();
    }

    // Determinar número de mezclas según la dificultad
    let shuffleCount;
    switch (gameState.difficulty) {
      case 'easy':
        shuffleCount = 20;
        break;
      case 'medium':
        shuffleCount = 50;
        break;
      case 'hard':
        shuffleCount = 100;
        break;
      default:
        shuffleCount = 30;
    }

    // Implementación de mezcla
    for (let i = 0; i < shuffleCount; i++) {
      const directions = [
        { row: -1, col: 0 },  // Arriba
        { row: 1, col: 0 },   // Abajo
        { row: 0, col: -1 },  // Izquierda
        { row: 0, col: 1 }    // Derecha
      ];

      const randomDirection = directions[Math.floor(Math.random() * directions.length)];
      const newRow = gameState.emptyCell.row + randomDirection.row;
      const newCol = gameState.emptyCell.col + randomDirection.col;

      if (newRow >= 0 && newRow < gameState.size &&
        newCol >= 0 && newCol < gameState.size) {
        // Intercambiar valores
        gameState.matrix[gameState.emptyCell.row][gameState.emptyCell.col] = gameState.matrix[newRow][newCol];
        gameState.matrix[newRow][newCol] = 0;

        // Actualizar celda vacía
        gameState.emptyCell = { row: newRow, col: newCol };
      }
    }

    // Reiniciar temporizador y movimientos
    gameState.isRunning = false;
    gameState.hasWon = false;
    gameState.seconds = 0;
    gameState.minutes = 0;
    gameState.moves = 0;

    // Actualizar UI
    updateTimerDisplay();
    updateMovesDisplay();
    renderBoard();
    winMessage.style.display = 'none';
  }

  // Establecer dificultad
  function setDifficulty(level) {
    gameState.difficulty = level;

    // Actualizar botones de dificultad
    easyBtn.classList.remove('active');
    mediumBtn.classList.remove('active');
    hardBtn.classList.remove('active');

    if (level === 'easy') {
      easyBtn.classList.add('active');
    } else if (level === 'medium') {
      mediumBtn.classList.add('active');
    } else if (level === 'hard') {
      hardBtn.classList.add('active');
    }
  }
});
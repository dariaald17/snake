const ROW_NUMBER = 10;
const COLUMN_NUMBER = 10;

const scoreNode = document.getElementById('score')
const endGameScoreNode = document.getElementById('end-game-score')
const bestScoreNode = document.getElementById('best-score')

let bestScore = localStorage.getItem('best') || 0
bestScoreNode.textContent = bestScore

const gameField = document.querySelector('.game-field')
const gameTextLayout = document.querySelector('.game-text-layout')
const grid = document.querySelector('.game-grid')
const btnAction = document.getElementById('action-button')

let interval = setInterval(tick, 300)

const gameStatuses = {
  init: 'Init',
  play: 'Play',
  pause: 'Pause',
  end: 'End',
}

const directions = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
}

const cells = []

const getInitSnakeCoords = () => {
  return [[5, 6], [5, 7], [5, 8]]
}

const state = {
  status: gameStatuses.init,
  cells,
  score: 0,
  snake: {
    direction: directions.up,
    coords: getInitSnakeCoords(),
  },
  fruit: null,
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

function generateGrid() {
  for (let rowIndex = 0; rowIndex < ROW_NUMBER; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < COLUMN_NUMBER; columnIndex += 1) {
      const element = document.createElement('div');
      element.classList.add('cell');
      grid.appendChild(element);
      const cell = {
        element,
        rowIndex, columnIndex,
        isSnake: false,
        fruit: '',
      }
      cells.push(cell);
    }
  }
}

function resetGameProgress() {
  state.score = 0
  state.snake.direction = directions.up
  state.snake.coords = getInitSnakeCoords()
  state.fruit = null
}

function resetCellsData() {
  cells.forEach((cell) => {
    const oldCell = cell
    const element = oldCell.element
    element.className = 'cell'

    cell = {
      ...oldCell,
      element,
      isSnake: false,
      fruit: ''
    }
  })
}

const placeSnake = () => {
  let isEnd = false

  try {
    state.cells.forEach((cell) => cell.isSnake = false);

    state.snake.coords.forEach(([columnIndex, rowIndex]) => {
      const cellIndex = rowIndex * COLUMN_NUMBER + columnIndex
      if (state.cells[cellIndex].isSnake) {
        isEnd = true
      }
      state.cells[cellIndex].isSnake = true;
    });
  } catch (e) {
    console.log('e: ', state.snake.coords)
  }

  if (isEnd) {
    endGame()
  }
}

const render = () => {
  state.cells.forEach((cell) => {
    cell.element.className = 'cell';
    if (cell.isSnake) cell.element.classList.add('snake');
    else if (cell.fruit !== '') cell.element.classList.add(cell.fruit);
  })
}

const generateFruit = () => {
  let columnIndex = getRandomInt(0, COLUMN_NUMBER);
  let rowIndex = getRandomInt(0, ROW_NUMBER);

  let isInvalidPoint = state.snake.coords.some((coord) => coord[0] === columnIndex || coord[1] === rowIndex);
  while (isInvalidPoint) {
    columnIndex = getRandomInt(0, COLUMN_NUMBER);
    rowIndex = getRandomInt(0, ROW_NUMBER);

    isInvalidPoint = state.snake.coords.some((coord) => coord[0] === columnIndex || coord[1] === rowIndex);
  }

  state.cells[rowIndex * COLUMN_NUMBER + columnIndex].fruit = getFruitClass();
}

function getFruitClass() {
  const classes = ['apple', 'orange', 'grap']
  const index = getRandomInt(0, classes.length - 1)
  return 'game-item--' + classes[index]
}

const moveSnake = () => {
  let isGameEnd = false
  const coords = state.snake.coords

  let next = [...coords[0]]
  const last = [...coords[coords.length - 1]]

  const isFruitEaten = moveSnakeHead()

  state.snake.coords.forEach((coord, index) => {
    if (index > 0) {
      const temp = [...coords[index]]
      coords[index] = next
      next = temp
    }
  });

  state.snake.coords.forEach((coord) => {
    if (
      coord[0] > ROW_NUMBER - 1 ||
      coord[0] < 0 ||
      coord[1] > COLUMN_NUMBER - 1 ||
      coord[1] < 0
    ) {
      isGameEnd = true
    }
  })

  if (isGameEnd) {
    return endGame()
  }

  if (isFruitEaten) {
    generateFruit()
    scoreNode.innerHTML = state.score;
    endGameScoreNode.textContent = state.score
    coords.push(last)
  }
}

const moveSnakeHead = () => {
  let isFruitEaten = false
  const xCoordinate = state.snake.coords[0][0]
  const yCoordinate = state.snake.coords[0][1]

  switch (state.snake.direction) {
    case directions.up:
      state.snake.coords[0][1] = yCoordinate - 1
      break
    case directions.down:
      state.snake.coords[0][1] = yCoordinate + 1
      break
    case directions.left:
      state.snake.coords[0][0] = xCoordinate - 1
      break
    case directions.right:
      state.snake.coords[0][0] = xCoordinate + 1
      break
  }

  placeSnake()

  state.cells.forEach((cell) => {
    if (cell.isSnake && cell.fruit) {
      state.score++
      cell.fruit = ''
      isFruitEaten = true
    }
  })

  return isFruitEaten
}

function tick() {
  if (state.status === gameStatuses.play) {
    moveSnake();
    if (state.status !== gameStatuses.end) {
      placeSnake();
      render();
    }
  }
}

const endGame = () => {
  bestScoreNode.textContent = localStorage.getItem('best') || 0
  window.clearInterval(interval)
  interval = null
  state.status = gameStatuses.end
  btnAction.dataset.status = 'pause'
  gameField.dataset.layout = 'end'
  gameTextLayout.classList.add('active')

  if (state.score > Number(bestScore)) {
    bestScore = state.score
    localStorage.setItem('best', bestScore)
  }

  resetGameProgress()
  resetCellsData()
}

const changeGameStatus = (status) => {
  if (status === gameStatuses.end) {
    return endGame()
  }

  if (
    status === gameStatuses.play &&
    (state.status === gameStatuses.end || state.status === gameStatuses.init)
  ) {
    btnAction.dataset.status = 'play'
    gameField.dataset.layout = ''
    gameTextLayout.classList.remove('active')
    initAndStartGame()
    return
  }

  if (status === gameStatuses.pause || status === gameStatuses.play) {
    if (state.status === gameStatuses.pause) {
      gameField.dataset.layout = ''
      state.status = gameStatuses.play
      btnAction.dataset.status = 'play'
      gameTextLayout.classList.remove('active')
    }
    else if (state.status === gameStatuses.play) {
      state.status = gameStatuses.pause
      btnAction.dataset.status = 'pause'
      gameField.dataset.layout = 'pause'
      gameTextLayout.classList.add('active')
    }
  }
}

function initAndStartGame() {
  scoreNode.textContent = '0'
  endGameScoreNode.textContent = '0'
  resetGameProgress()
  resetCellsData()
  state.status = gameStatuses.play

  if (!interval) {
    interval = setInterval(tick, 1000)
  }
}

document.addEventListener('keydown', (event) => {
  const current = state.snake.direction

  if (event.code === 'Space') {
    changeGameStatus(gameStatuses.pause)
  }

  if (event.code === 'ArrowUp' && current !== directions.down) {
    state.snake.direction = directions.up
  }
  else if (event.code === 'ArrowDown' && current !== directions.up) {
    state.snake.direction = directions.down
  }
  else if (event.code === 'ArrowLeft' && current !== directions.right) {
    state.snake.direction = directions.left
  }
  else if (event.code === 'ArrowRight' && current !== directions.left) {
    state.snake.direction = directions.right
  }
})

btnAction.addEventListener('click', function () {
  switch (state.status) {
    case gameStatuses.init:
      changeGameStatus(gameStatuses.play)
      break
    case gameStatuses.pause:
      changeGameStatus(gameStatuses.play)
      break
    case gameStatuses.end:
      changeGameStatus(gameStatuses.play)
      break
    case gameStatuses.play:
      changeGameStatus(gameStatuses.pause)
      break
  }
})

const main = () => {
  generateGrid();
  generateFruit();
}

main()

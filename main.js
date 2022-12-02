const AREA_WIDTH = 600
const BLOCK_WIDTH = 50
const ROW_NUMBER = 10;
const COLUMN_NUMBER = 10;

const grid = document.querySelector('.game-grid')
const btnAction = document.getElementById('action-button')
document.getElementById('action-button').addEventListener('click', () =>{
   tick();
})

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

const state = {
  status: gameStatuses.play,
  cells: [],
  score: 0,
  snake: {
    direction: directions.up,
    coords: [[5, 7], [5, 8], [5, 9]],
  },
  fruit: null,
};

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
      state.cells.push(cell);
    }
  }
}

const placeSnake = () => {
  state.cells.forEach((cell) => cell.isSnake = false);

  state.snake.coords.forEach(([columnIndex, rowIndex]) => {
    const cellIndex = rowIndex * COLUMN_NUMBER + columnIndex
    state.cells[cellIndex].isSnake = true;
  });
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

  if (isFruitEaten) {
    generateFruit()
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
      document.getElementById('score').innerHTML=state.score;
      cell.fruit = ''
      isFruitEaten = true
    }
  })

  return isFruitEaten
}

const tick = () => {
  if (state.status === gameStatuses.play) {
    moveSnake();
    placeSnake();
    render();
  }
  setTimeout(tick, 300);
}

const main = () => {
  generateGrid();
  generateFruit();
  //tick();
}

main()

const changeGameStatus = (status) => {
  if (status === gameStatuses.pause) {
    if (state.status === gameStatuses.pause) {
      state.status = gameStatuses.play
    }
    else if (state.status === gameStatuses.play) {
      state.status = gameStatuses.pause
    }
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

const AREA_WIDTH = 600
const BLOCK_WIDTH = 50
const ROW_NUMBER = 10;
const COLUMN_NUMBER = 10;

const grid = document.querySelector('.game-grid')
const btnAction = document.getElementById('action-button')

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
  snake: {
    direction: directions.up,
    coords: [[5, 7], [5, 8], [5, 9]],
  },
  fruitPosition: null,
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
        isFruit: '',
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
    else if (cell.isFruit !== '') cell.element.classList.add(cell.isFruit);
  })
}

const renderSnake = () => {
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

  state.cells[rowIndex * COLUMN_NUMBER + columnIndex].isFruit = getFruitClass();
}

function getFruitClass() {
  const classes = ['apple', 'orange', 'grap']
  const index = getRandomInt(0, classes.length - 1)
  return 'game-item--' + classes[index]
}

const moveSnake = () => {
  let next = [...state.snake.coords[0]]
  moveSnakeHead()
  state.snake.coords.forEach((coord, i) => {
    if (i > 0) {
      const temp = [...state.snake.coords[i]]
      state.snake.coords[i] = next
      next = temp
    }
  });
}

const moveSnakeHead = () => {
  switch (state.snake.direction) {
    case directions.up:
      state.snake.coords[0][1] = state.snake.coords[0][1] - 1
      break
    case directions.down:
      state.snake.coords[0][1] = state.snake.coords[0][1] + 1
      break
    case directions.left:
      state.snake.coords[0][0] = state.snake.coords[0][0] - 1
      break
    case directions.right:
      state.snake.coords[0][0] = state.snake.coords[0][0] + 1
      break
  }
}

const tick = () => {
  if (state.status === gameStatuses.play) {
    moveSnake();
    placeSnake();
    render();
    setTimeout(tick, 1000);
  }
}

const main = () => {
  generateGrid();
  generateFruit();
  tick();
}

main()

document.addEventListener('keydown', (event) => {
  const current = state.snake.direction

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
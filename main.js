const AREA_WIDTH = 600
const BLOCK_WIDTH = 50
const ROW_NUMBER = 10;
const COLUMN_NUMBER = 10;

const grid = document.querySelector('.game-grid')
const btnAction = document.getElementById('action-button')

const state = {
  cells: [],
  snake: {
    direction: [0, -1],
    coords: [[5, 2], [5, 3], [5, 4]],
  },
  fruitPosition: null,
  fruit: null
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
  const index = Math.round(Math.random() * (classes.length - 1))
  return 'game-item--' + classes[index]
}

const moveSnake = () => {
  state.snake.coords.forEach((coord) => {
    coord[0] += state.snake.direction[0];
    coord[1] += state.snake.direction[1];
  });
}

const tick = () => {
  moveSnake();
  placeSnake();
  render();
  setTimeout(tick, 1000);
}

const main = () => {
  generateGrid();
  generateFruit();
  tick();
}

main()
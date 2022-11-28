const AREA_WIDTH = 600
const BLOCK_WIDTH = 50
const ROW_NUMBER = 10;
const COLUMN_NUMBER = 10;

const grid = document.querySelector('.game-grid')
const btnAction = document.getElementById('action-button')

const state = {
  cells: [],
  snake: {
    coords: [[0, 2], [0, 3], [0, 4]],
  }
};

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
      }
      state.cells.push(cell);
    }
  }
}

const moveSnake = () => {
  state.snake.coords.forEach(([columnIndex, rowIndex]) => {
    state.cells[rowIndex * COLUMN_NUMBER + columnIndex].isSnake = true;
  });
}

const render = () => {

}

// function positionAppleRandom() {
//   let rand = Math.random() * 50;
//   return Math.round(rand);
// }

const main = () => {
  generateGrid();
  moveSnake();
  render();
}
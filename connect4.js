/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const COLS = 7;
const ROWS = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty ROWS x COLS matrix array
  while (board.length < ROWS) {
    let cells = [];
    while (cells.length < COLS) {
      cells = [...cells, undefined];
    }
    board = [...board, cells];
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");

  // TODO: add comment for this code
  // Create the grid with the specified number of rows and columns
  for (let y = 0; y < ROWS; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < COLS; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.prepend(row);
  }

  // TODO: add comment for this code
  // Create the top row which will be used to specify what column the user picked
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  top.dataset.player = currPlayer;

  for (let x = 0; x < COLS; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.prepend(top);
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let y = 0; y < board.length; y++) {
    if (!board[y][x]) return y;
  }

  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement("div");
  piece.style.transform = `translateY(${y * 100 - 600}px)`;
  piece.classList.add("piece", `player${currPlayer}`);
  const selectedCell = document.getElementById(`${y}-${x}`);
  selectedCell.append(piece);
  setTimeout(() => (piece.style.transform = "translateY(0)"), 50);
}

/** Reset game when game end */

function resetGame() {
  board = [];
  makeBoard();
  const rows = document.querySelectorAll("tr:not(#column-top)");
  for (const row of rows) {
    const cells = document.getElementsByTagName("td");
    for (const cell of cells) {
      cell.innerHTML = "";
    }
  }
}

/** checkForTie: check board cell-by-cell to see if we have filled all cells */

function checkForTie() {
  return board.every((y) => y.every((x) => !!x));
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  // Use setTimeout to prevent the alert to pop before adding player's piece to the UI
  setTimeout(() => {
    alert(msg);
    resetGame();
  }, 100);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // return when target element is not a cell
  if (evt.target.id === "column-top") return;

  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) return;

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) return endGame(`Player ${currPlayer} won!`);

  // check for tie
  // TODO: check if all cells in board are filled; if so call endGame
  if (checkForTie()) return endGame("It's a tie!");

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
  const top = document.getElementById("column-top");
  top.dataset.player = currPlayer;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 && y < ROWS && x >= 0 && x < COLS && board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      // For each cell create an array with selected cell as the start and rest are the values
      // of the cell next to it to the right
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      // For each cell create an array with selected cell as the start and rest are the values
      // of the cell positioned vertically in following rows.
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();

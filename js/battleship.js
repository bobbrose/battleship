// Battleship explorations and practice.
const BOARDSIZE = 8;

// Ship class that defines it's own print symbol based on shipType.
class Ship {
  constructor(shipType, x1, y1, x2, y2) {
    this.shipType = shipType;
    switch (this.shipType) {
      case 'cruiser':
        this.printSymbol = 'R';
        break;
      case 'pt':
        this.printSymbol = 'P';
        break;
      case 'battleship':
        this.printSymbol = 'B';
        break;
      case 'carrier':
        this.printSymbol = 'C'
        break;
      case 'submarine':
        this.printSymbol = 'S'
        break;
      default:
        this.printSymbol = 'x';
    }
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
  }
  toString() {
    return "Ship: " + this.shipType + "(" + this.x1 + ", " + this.y1 + ") - (" + this.x2 + ", " + this.y2 + ")";
  }
}

// Return true if a target is within 2 points
function inRange(target, p1, p2) {
  return ((target >= p1) && (target <= p2));
}

// Return true if the range of Point1 overlaps the range of Point2
function rangeOverlaps(range1p1, range1p2, range2p1, range2p2) {
  if (inRange(range1p1, range2p1, range2p2) ||
    inRange(range1p2, range2p1, range2p2)) {
    return true;
  }
  return (inRange(range2p1, range1p1, range1p2) ||
    inRange(range2p2, range1p1, range1p2));
}

// Return true if two ships overlap
function shipOverlap(ship1, ship2) {
  console.log("Compare " + ship1.toString() + " with: " + ship2.toString());
  // Check horizontal range
  if (!rangeOverlaps(ship1.x1, ship1.x2, ship2.x1, ship2.x2)) {
    //console.log("No horizontal overlap")
    return false;
  }
  // Check vertical range
  if (!rangeOverlaps(ship1.y1, ship1.y2, ship2.y1, ship2.y2)) {
    //console.log("No vertical overlap")
    return false;
  }
  //console.log("Ships overlap")
  return true;
}

// Retrun true if the given ship overlaps any of the existing ships
function shipsOverlap(ship, existing) {
  for (let existingShip of existing) {
    if (shipOverlap(ship, existingShip)) {
      return true;
    }
  }
  return false;
}

function assert(isTrue, message) {
  if (!isTrue) console.error('ERROR:', message);
  else console.info('PASS:', message);
}

// Test basic building and placing functionality
function runInitialTests() {
  const s1 = new Ship('battleship', 8, 3, 8, 6);
  const s2 = new Ship('carrier', 2, 2, 6, 2);
  const s3 = new Ship('cruiser', 6, 4, 8, 4);
  const s4 = new Ship('cruiser', 6, 5, 8, 5);
  const s5 = new Ship('cruiser', 4, 5, 6, 5);
  const s6 = new Ship('pt', 4, 5, 4, 7);

  assert(!shipOverlap(s1, s2), 'Expected s1 does not overlap s2');
  assert(shipOverlap(s1, s3), 'Expected s1 does overlap s3');
  assert(shipOverlap(s5, s6), 'Expected s5 does overlap s6');
  assert(!shipOverlap(s6, s4), 'Expected s6 does not overlap s4');

  // Non-intersecting
  assert(!shipsOverlap(s1, [s2]), 'Expected s1 does not overlap [s2]')
  // Parallel
  assert(!shipsOverlap(s3, [s4]), 'Expected s3 does not overlap [s4]')
  // Perpendicular intersection
  assert(shipsOverlap(s1, [s3]), 'Expected s1 overlaps [s3]')
  // Perpendicular intersection (array check)
  assert(shipsOverlap(s1, [s2, s3]), 'Expected s1 overlaps [s2, s3]')
  // One square overlap (horizontal lines)
  assert(shipsOverlap(s4, [s5]), 'Expected s4 overlaps [s5]')
}

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// createShip creates a new ship at randome place on the board,
// randomly horizontal or vertical
function createShip(shipType, shipSize, boardSize) {
  let horizontal = Math.random() > 0.5;
  var startX, startY;
  if (horizontal) {
    startX = getRandomNumber(1, boardSize - shipSize + 1)
    startY = getRandomNumber(1, boardSize);
    return new Ship(shipType, startX, startY, startX + shipSize - 1, startY);
  } else {
    startX = getRandomNumber(1, boardSize);
    startY = getRandomNumber(1, boardSize - shipSize + 1);
    return new Ship(shipType, startX, startY, startX, startY + shipSize - 1);
  }
}

// placeShips creates a new ship in an arbitrary place on the board
// that does not conflict with another ship and is within the board size.
function placeShips(shipType, shipSize, placedShips = [], boardSize = 8) {
  var newShipOverlaps = true;
  var newShip;
  var tries = 0;
  while (newShipOverlaps && (tries++ < 10)) {
    newShip = createShip(shipType, shipSize, boardSize);
    console.log("Trying to place ship: " + newShip.toString());
    newShipOverlaps = shipsOverlap(newShip, placedShips);
  }
  if (newShipOverlaps) {
    console.log("Couldn't place ship: " + newShip.toString());
    return null;
  }
  assert(!shipsOverlap(newShip, placedShips), 'Expected new ship does not overlap existing ships')
  return newShip;
}

function runAdvancedTests() {
  const s1 = new Ship('carrier', 2, 2, 6, 2);
  const s2 = new Ship('cruiser', 6, 4, 8, 4);

  // Check the ship is placed
  const s3 = placeShips('battleship', 4, [s1, s2], 8);

  assert(!!s3, 'Expected a ship to be returned from placeShips');

  const ships = [s1, s2, s3];

  // Check the expected number of cells are occupied
  const grid = Array(8).fill(0).map(() => Array(8).fill(0));

  for (const ship of ships) {
    for (let row = ship.y1; row <= ship.y2; ++row) {
      for (let col = ship.x1; col <= ship.x2; ++col) {
        grid[row - 1][col - 1] = 1;
      }
    }
  }
  const occupied = grid.flat().reduce((total, cell) => total += cell, 0);
  assert(occupied === 5 + 3 + 4, 'Expected number of occupied spaces to equal sum of ship sizes');
}

// Create some ships and place them in the shipGrid
function createAndPlaceShips(shipGrid) {
  var currentShips = [];
  // No error detection when you can't place more ships
  currentShips.push(placeShips('battleship', 4, currentShips, BOARDSIZE));
  currentShips.push(placeShips('pt', 2, currentShips, BOARDSIZE));
  currentShips.push(placeShips('cruiser', 3, currentShips, BOARDSIZE));
  currentShips.push(placeShips('carrier', 5, currentShips, BOARDSIZE));
  currentShips.push(placeShips('submarine', 3, currentShips, BOARDSIZE));

  for (const ship of currentShips) {
    for (let row = ship.y1; row <= ship.y2; ++row) {
      for (let col = ship.x1; col <= ship.x2; ++col) {
        shipGrid[row - 1][col - 1] = ship.printSymbol;
      }
    }
  }
}

// Show the ships in an HTML table
function showShips(shipGrid) {
  var shipTableHTML = "<table>";
  for (let row = 0; row < shipGrid.length; row++) {
    shipTableHTML += "<tr>"
    for (let col = 0; col < shipGrid[row].length; col++) {
      shipTableHTML += "<td>" + shipGrid[row][col] + "</td>";
    }
    shipTableHTML += "</tr>"
  }
  shipTableHTML += "</table>"
  //console.log(shipTableHTML);
  var infoArea = document.getElementById("infoArea");
  if (infoArea != null) {
    infoArea.innerHTML = shipTableHTML;
  }
}

function runTests() {
  runInitialTests();
  runAdvancedTests();
}

// Run some unit test, create some ships, and show them on an HTML board
function run() {
  runTests();
  var shipGrid = Array(BOARDSIZE).fill(0).map(() => Array(BOARDSIZE).fill(0));
  createAndPlaceShips(shipGrid);
  showShips(shipGrid);
}
run();
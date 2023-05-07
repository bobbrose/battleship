
// --------------------------------------------------------
// Q1: Check if ship overlaps existing
// --------------------------------------------------------

function inRange(target, p1, p2) {
  return ((target >= p1) && (target <= p2));
}

// Helper method to see if two lines overlap
function rangeOverlaps(range1p1, range1p2, range2p1, range2p2) {
  //console.log(range1p1 + " " + range1p2 + " " + range2p1 + " " +range2p2);
  if (inRange(range1p1, range2p1, range2p2) ||
    inRange(range1p2, range2p1, range2p2)) {
    return true;
  }
  return (inRange(range2p1, range1p1, range1p2) ||
    inRange(range2p2, range1p1, range1p2));
}
// Method to check if two ships overlap
function shipOverlap(ship1, ship2) {
  //console.log("Compare " + showShip(ship1) + " with: " + showShip(ship2));
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


function shipsOverlap(ship, existing) {
  /* Hints:
      Range A overlaps range B if B starts
      before A ends, and B ends after A
      starts. 2-D rectangles overlap if
      their horizontal and vertical
      ranges both overlap
       An alternative way is to see if they
      have any squares in common. */
  for (let existingShip of existing) {
    if (shipOverlap(ship, existingShip)) {
      return true;
    }
  }
  return false;
}


// Return a string showing the ship information for debugging.
function toString(ship) {
  return ship.type + "(" + ship.x1 + ", " + ship.y1 + ") - (" + ship.x2 + ", " + ship.y2 + ")";
}


function assert(isTrue, message) {
  if (!isTrue) console.error('ERROR:', message);
  else console.info('PASS:', message);
}


function runQ1Tests() {
  const s1 = {
    type: 'battleship',
    x1: 8,
    y1: 3,
    x2: 8,
    y2: 6
  }


  const s2 = {
    type: 'carrier',
    x1: 2,
    y1: 2,
    x2: 6,
    y2: 2
  }


  const s3 = {
    type: 'cruiser',
    x1: 6,
    y1: 4,
    x2: 8,
    y2: 4
  }


  const s4 = {
    type: 'cruiser',
    x1: 6,
    y1: 5,
    x2: 8,
    y2: 5
  }


  const s5 = {
    type: 'cruiser',
    x1: 4,
    y1: 5,
    x2: 6,
    y2: 5
  }


  const s6 = {
    type: 'pt',
    x1: 4,
    y1: 5,
    x2: 4,
    y2: 7
  }
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


//runQ1Tests();


/*
-----------------------------------------------------------
Q2
-----------------------------------------------------------
* - Which of the two algorithms is faster in the worst case?
* In the worst case, the first algorithm is faster as it runs in constant
* time, it's just checking ranges. 
* - Which of the two algorithms is faster on average?
* The first
* - Similarly, can you compare the memory usage of the two algorithms?
* The 2nd algorithm will use more memory as it has to compare every point
* to every point to see if there are any common points.
*/

// --------------------------------------------------------
// Q3
// --------------------------------------------------------


/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// createShip creates a new ship
function createShip(shipType, shipSize, boardSize) {
  let startX = getRandomNumber(1, boardSize - shipSize)
  let startY = getRandomNumber(1, boardSize - shipSize);
  return {
    type: shipType,
    x1: startX,
    y1: startY,
    x2: startX + shipSize - 1,
    y2: startY
  };
}
// placeShips creates a new ship in an arbitrary place on the board
// that does not conflict with another ship and is within the board size.
function placeShips(shipType, shipSize, placedShips = [], boardSize = 8) {
  var newShipOverlaps = true;
  var newShip;
  while (newShipOverlaps) {
    newShip = createShip(shipType, shipSize, boardSize);
    //console.log("New ship: " + toString(newShip));
    newShipOverlaps = shipsOverlap(newShip, placedShips);
    //console.log ("New ship overlaps? " + newShipOverlaps);
  }
  assert(!shipsOverlap(newShip, placedShips), 'Expected new ship does not overlap existing ships')
  return newShip;
}

function runQ3Tests() {
  const s1 = {
    type: 'carrier',
    x1: 2,
    y1: 2,
    x2: 6,
    y2: 2
  };


  const s2 = {
    type: 'cruiser',
    x1: 6,
    y1: 4,
    x2: 8,
    y2: 4
  };

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
runQ3Tests();
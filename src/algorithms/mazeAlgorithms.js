// ============================================
// HEURISTIC FUNCTION
// ============================================

// Manhattan Distance
// h(n) = |row1 - row2| + |col1 - col2|

export function manhattanDistance(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}


// ============================================
// UTILITY FUNCTIONS
// ============================================

function key(node) {
  return `${node.row}-${node.col}`;
}


function isValid(grid, row, col) {
  return (
    row >= 0 &&
    row < grid.length &&
    col >= 0 &&
    col < grid[0].length &&
    grid[row][col] === 0
  );
}


function getNeighbors(grid, node) {
  const directions = [
    [-1, 0], // Up
    [1, 0],  // Down
    [0, -1], // Left
    [0, 1]   // Right
  ];

  const neighbors = [];

  for (const [dr, dc] of directions) {
    const row = node.row + dr;
    const col = node.col + dc;

    if (isValid(grid, row, col)) {
      neighbors.push({
        row,
        col
      });
    }
  }

  return neighbors;
}


function reconstructPath(parent, start, goal) {
  const path = [];

  let current = goal;

  while (current) {
    path.push(current);

    if (key(current) === key(start)) {
      break;
    }

    current = parent[key(current)];
  }

  path.reverse();

  if (
    path.length === 0 ||
    key(path[0]) !== key(start)
  ) {
    return [];
  }

  return path;
}


// ============================================
// GREEDY BEST-FIRST SEARCH
// ============================================
//
// Evaluation:
//      f(n) = h(n)
//
// Greedy chooses the node with the smallest
// Manhattan distance to the goal.
//

export function greedyBestFirstSearch(grid, start, goal) {

  const openList = [start];

  const visited = new Set();

  const parent = {};

  const explored = [];

  while (openList.length > 0) {

    // Find node with smallest heuristic
    let bestIndex = 0;

    for (let i = 1; i < openList.length; i++) {

      const currentH =
        manhattanDistance(openList[i], goal);

      const bestH =
        manhattanDistance(openList[bestIndex], goal);

      if (currentH < bestH) {
        bestIndex = i;
      }
    }

    const current =
      openList.splice(bestIndex, 1)[0];

    const currentKey = key(current);

    if (visited.has(currentKey)) {
      continue;
    }

    visited.add(currentKey);

    explored.push(current);

    // Goal found
    if (currentKey === key(goal)) {

      return {
        path: reconstructPath(
          parent,
          start,
          goal
        ),
        explored,
        stuck: false
      };
    }

    const neighbors =
      getNeighbors(grid, current);

    for (const neighbor of neighbors) {

      const neighborKey =
        key(neighbor);

      if (!visited.has(neighborKey)) {

        if (!parent[neighborKey]) {
          parent[neighborKey] = current;
        }

        openList.push(neighbor);
      }
    }
  }

  return {
    path: [],
    explored,
    stuck: true
  };
}


// ============================================
// HILL CLIMBING
// ============================================
//
// Hill Climbing looks ONLY at the current
// node's neighbors.
//
// It selects the neighbor having the smallest
// heuristic value.
//
// If no neighbor has a smaller heuristic,
// the algorithm becomes stuck.
//
// This demonstrates the LOCAL OPTIMUM problem.
//

export function hillClimbing(grid, start, goal) {

  let current = start;

  const path = [start];

  const explored = [start];

  const visited = new Set();

  visited.add(key(start));

  while (key(current) !== key(goal)) {

    const neighbors =
      getNeighbors(grid, current);

    // Remove visited cells
    const availableNeighbors =
      neighbors.filter(
        neighbor =>
          !visited.has(key(neighbor))
      );

    // No available neighbors
    if (availableNeighbors.length === 0) {

      return {
        path: [],
        explored,
        stuck: true,
        reason: "No unvisited neighbors available."
      };
    }


    // Find neighbor with smallest heuristic
    let bestNeighbor =
      availableNeighbors[0];

    for (const neighbor of availableNeighbors) {

      if (
        manhattanDistance(
          neighbor,
          goal
        ) <
        manhattanDistance(
          bestNeighbor,
          goal
        )
      ) {
        bestNeighbor = neighbor;
      }
    }


    const currentH =
      manhattanDistance(
        current,
        goal
      );

    const bestH =
      manhattanDistance(
        bestNeighbor,
        goal
      );


    // LOCAL OPTIMUM
    //
    // If best neighbor is not better
    // than current node, stop.

    if (bestH >= currentH) {

      return {
        path: [],
        explored,
        stuck: true,
        reason:
          `Local optimum reached. Current h=${currentH}, best neighbor h=${bestH}`
      };
    }


    // Move to better neighbor

    current = bestNeighbor;

    visited.add(key(current));

    path.push(current);

    explored.push(current);
  }


  return {
    path,
    explored,
    stuck: false,
    reason: "Goal reached successfully."
  };
}
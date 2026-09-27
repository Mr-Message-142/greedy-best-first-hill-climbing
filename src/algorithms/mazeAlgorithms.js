// ============================================
// HEURISTIC
// ============================================

export function manhattanDistance(a, b) {
  return (
    Math.abs(a.row - b.row) +
    Math.abs(a.col - b.col)
  );
}


// ============================================
// HELPERS
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
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ];

  const neighbors = [];

  for (const [dr, dc] of directions) {
    const row = node.row + dr;
    const col = node.col + dc;

    if (isValid(grid, row, col)) {
      neighbors.push({ row, col });
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

export function greedyBestFirstSearch(
  grid,
  start,
  goal
) {
  const openList = [start];

  const visited = new Set();

  const parent = {};

  const explored = [];

  while (openList.length > 0) {

    let bestIndex = 0;

    for (let i = 1; i < openList.length; i++) {

      const currentH =
        manhattanDistance(
          openList[i],
          goal
        );

      const bestH =
        manhattanDistance(
          openList[bestIndex],
          goal
        );

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

    if (currentKey === key(goal)) {
      return {
        path: reconstructPath(
          parent,
          start,
          goal
        ),
        explored,
        stuck: false,
        reason: "Goal reached"
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
    stuck: true,
    reason: "No path found"
  };
}


// ============================================
// HILL CLIMBING
// ============================================

export function hillClimbing(
  grid,
  start,
  goal
) {
  let current = start;

  const path = [start];

  const explored = [start];

  const visited = new Set();

  visited.add(key(start));

  while (key(current) !== key(goal)) {

    const neighbors =
      getNeighbors(grid, current);

    const availableNeighbors =
      neighbors.filter(
        neighbor =>
          !visited.has(key(neighbor))
      );

    if (availableNeighbors.length === 0) {
      return {
        path,
        explored,
        stuck: true,
        reason:
          "No unvisited neighbors available"
      };
    }

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

    if (bestH >= currentH) {
      return {
        path,
        explored,
        stuck: true,
        reason:
          `Local optimum: current h=${currentH}, best neighbor h=${bestH}`
      };
    }

    current = bestNeighbor;

    visited.add(key(current));

    path.push(current);

    explored.push(current);
  }

  return {
    path,
    explored,
    stuck: false,
    reason: "Goal reached"
  };
}
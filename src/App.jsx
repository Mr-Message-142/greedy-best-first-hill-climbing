import { useState } from "react";

import {
  manhattanDistance,
  greedyBestFirstSearch,
  hillClimbing
} from "./algorithms/mazeAlgorithms";

import "./App.css";

// ============================================
// MAZE SETTINGS
// ============================================

const ROWS = 20;
const COLS = 30;

const START = {
  row: 1,
  col: 1
};

const GOAL = {
  row: ROWS - 2,
  col: COLS - 2
};

// ============================================
// DIFFICULTY
// ============================================

const difficulties = {
  easy: 0.12,
  medium: 0.20,
  hard: 0.28
};

// ============================================
// GENERATE MAZE
// ============================================

function generateMaze(difficulty = "medium") {
  const wallProbability = difficulties[difficulty];

  const maze = [];

  for (let row = 0; row < ROWS; row++) {
    const currentRow = [];

    for (let col = 0; col < COLS; col++) {
      if (
        row === 0 ||
        row === ROWS - 1 ||
        col === 0 ||
        col === COLS - 1
      ) {
        currentRow.push(1);
      } else if (
        (row === START.row && col === START.col) ||
        (row === GOAL.row && col === GOAL.col)
      ) {
        currentRow.push(0);
      } else {
        currentRow.push(
          Math.random() < wallProbability ? 1 : 0
        );
      }
    }

    maze.push(currentRow);
  }

  // Guaranteed basic route
  for (
    let col = START.col;
    col <= GOAL.col;
    col++
  ) {
    maze[START.row][col] = 0;
  }

  for (
    let row = START.row;
    row <= GOAL.row;
    row++
  ) {
    maze[row][GOAL.col] = 0;
  }

  return maze;
}

// ============================================
// APP
// ============================================

function App() {
  const [difficulty, setDifficulty] = useState("medium");

  const [maze, setMaze] = useState(
    generateMaze("medium")
  );

  const [algorithm, setAlgorithm] = useState("greedy");

  const [explored, setExplored] = useState([]);

  const [path, setPath] = useState([]);

  const [running, setRunning] = useState(false);

  const [status, setStatus] = useState(
    "Ready to solve the maze"
  );

  // ==========================================
  // PERFORMANCE DATA
  // ==========================================

  const [stats, setStats] = useState({
    algorithm: "Not Run",
    executionTime: 0,
    exploredNodes: 0,
    pathLength: 0,
    initialHeuristic: manhattanDistance(
      START,
      GOAL
    ),
    finalHeuristic: manhattanDistance(
      START,
      GOAL
    ),
    status: "Ready"
  });

  // ==========================================
  // NEW MAZE
  // ==========================================

  const newMaze = () => {
    setMaze(generateMaze(difficulty));

    setExplored([]);

    setPath([]);

    setStats({
      algorithm: "Not Run",
      executionTime: 0,
      exploredNodes: 0,
      pathLength: 0,
      initialHeuristic: manhattanDistance(
        START,
        GOAL
      ),
      finalHeuristic: manhattanDistance(
        START,
        GOAL
      ),
      status: "Ready"
    });

    setStatus("New maze generated");
  };

  // ==========================================
  // RESET
  // ==========================================

  const reset = () => {
    setExplored([]);

    setPath([]);

    setStats({
      algorithm: "Not Run",
      executionTime: 0,
      exploredNodes: 0,
      pathLength: 0,
      initialHeuristic: manhattanDistance(
        START,
        GOAL
      ),
      finalHeuristic: manhattanDistance(
        START,
        GOAL
      ),
      status: "Ready"
    });

    setStatus("Maze reset. Ready to solve.");
  };

  // ==========================================
  // RUN ALGORITHM
  // ==========================================

  const runAlgorithm = async () => {
    setRunning(true);

    setExplored([]);

    setPath([]);

    setStatus("Running algorithm...");

    const startTime = performance.now();

    let result;

    if (algorithm === "greedy") {
      result = greedyBestFirstSearch(
        maze,
        START,
        GOAL
      );
    } else {
      result = hillClimbing(
        maze,
        START,
        GOAL
      );
    }

    const endTime = performance.now();

    const executionTime =
      endTime - startTime;

    const algorithmName =
      algorithm === "greedy"
        ? "Greedy Best-First Search"
        : "Hill Climbing";

    // ========================================
    // INITIAL STATISTICS
    // ========================================

    setStats({
      algorithm: algorithmName,
      executionTime: executionTime,
      exploredNodes: 0,
      pathLength: 0,
      initialHeuristic: manhattanDistance(
        START,
        GOAL
      ),
      finalHeuristic:
        result.explored.length > 0
          ? manhattanDistance(
              result.explored[
                result.explored.length - 1
              ],
              GOAL
            )
          : manhattanDistance(
              START,
              GOAL
            ),
      status: result.stuck
        ? "Local Optimum / No Path"
        : "Goal Reached"
    });

    // ========================================
    // ANIMATE EXPLORED CELLS
    // ========================================

    for (
      let i = 0;
      i < result.explored.length;
      i++
    ) {
      await new Promise((resolve) =>
        setTimeout(resolve, 25)
      );

      const current =
        result.explored[i];

      setExplored((prev) => [
        ...prev,
        current
      ]);

      setStats((prev) => ({
        ...prev,
        exploredNodes: i + 1,
        finalHeuristic:
          manhattanDistance(
            current,
            GOAL
          )
      }));
    }

    // ========================================
    // ANIMATE PATH
    // ========================================

    for (
      let i = 0;
      i < result.path.length;
      i++
    ) {
      await new Promise((resolve) =>
        setTimeout(resolve, 40)
      );

      setPath((prev) => [
        ...prev,
        result.path[i]
      ]);

      setStats((prev) => ({
        ...prev,
        pathLength: i + 1
      }));
    }

    // ========================================
    // FINAL STATISTICS
    // ========================================

    setStats((prev) => ({
      ...prev,
      algorithm: algorithmName,
      executionTime: executionTime,
      exploredNodes:
        result.explored.length,
      pathLength: result.path.length,
      finalHeuristic:
        result.explored.length > 0
          ? manhattanDistance(
              result.explored[
                result.explored.length - 1
              ],
              GOAL
            )
          : manhattanDistance(
              START,
              GOAL
            ),
      status: result.stuck
        ? "Local Optimum / No Path"
        : "Goal Reached"
    }));

    // ========================================
    // FINAL MESSAGE
    // ========================================

    if (result.stuck) {
      setStatus(
        `${algorithmName}: ${result.reason}`
      );
    } else {
      setStatus(
        `${algorithmName} successfully reached the goal!`
      );
    }

    setRunning(false);
  };

  // ==========================================
  // CHECK CELL
  // ==========================================

  const contains = (array, row, col) => {
    return array.some(
      (cell) =>
        cell.row === row &&
        cell.col === col
    );
  };

  // ==========================================
  // CELL CLASS
  // ==========================================

  const getCellClass = (row, col) => {
    if (
      row === START.row &&
      col === START.col
    ) {
      return "cell start";
    }

    if (
      row === GOAL.row &&
      col === GOAL.col
    ) {
      return "cell goal";
    }

    if (maze[row][col] === 1) {
      return "cell wall";
    }

    if (
      contains(path, row, col)
    ) {
      return "cell path";
    }

    if (
      contains(explored, row, col)
    ) {
      return "cell explored";
    }

    return "cell";
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">
        <h1>🧭 Maze AI</h1>

        <p>
          Greedy Best-First Search & Hill
          Climbing Visualization
        </p>
      </header>

      {/* CONTROLS */}

      <section className="controls">

        <select
          value={algorithm}
          onChange={(e) =>
            setAlgorithm(e.target.value)
          }
          disabled={running}
        >
          <option value="greedy">
            Greedy Best-First Search
          </option>

          <option value="hill">
            Hill Climbing
          </option>
        </select>

        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value)
          }
          disabled={running}
        >
          <option value="easy">
            Easy
          </option>

          <option value="medium">
            Medium
          </option>

          <option value="hard">
            Hard
          </option>
        </select>

        <button
          onClick={runAlgorithm}
          disabled={running}
        >
          {running
            ? "Running..."
            : "▶ Run AI"}
        </button>

        <button
          onClick={reset}
          disabled={running}
        >
          ↻ Reset
        </button>

        <button
          onClick={newMaze}
          disabled={running}
        >
          ＋ New Maze
        </button>

      </section>

      {/* =====================================
          PERFORMANCE DASHBOARD
      ===================================== */}

      <section className="performance-dashboard">

        <div className="dashboard-title">
          <h2>📊 AI Performance</h2>

          <span
            className={
              stats.status === "Goal Reached"
                ? "success-badge"
                : stats.status === "Ready"
                ? "ready-badge"
                : "warning-badge"
            }
          >
            {stats.status}
          </span>
        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <span>Algorithm</span>

            <strong className="small-value">
              {stats.algorithm}
            </strong>
          </div>

          <div className="stat-card">
            <span>Execution Time</span>

            <strong>
              {stats.executionTime.toFixed(3)}
              <small> ms</small>
            </strong>
          </div>

          <div className="stat-card">
            <span>Explored Nodes</span>

            <strong>
              {stats.exploredNodes}
            </strong>
          </div>

          <div className="stat-card">
            <span>Path Length</span>

            <strong>
              {stats.pathLength}
            </strong>
          </div>

          <div className="stat-card">
            <span>Initial Heuristic</span>

            <strong>
              {stats.initialHeuristic}
            </strong>
          </div>

          <div className="stat-card">
            <span>Final Heuristic</span>

            <strong>
              {stats.finalHeuristic}
            </strong>
          </div>

        </div>

      </section>

      {/* STATUS */}

      <div className="status">
        {status}
      </div>

      {/* =====================================
          MAZE
      ===================================== */}

      <main className="maze-wrapper">

        <div
          className="maze"
          style={{
            gridTemplateColumns:
              `repeat(${COLS}, 28px)`
          }}
        >

          {maze.map(
            (row, rowIndex) =>
              row.map(
                (_, colIndex) => {

                  const isStart =
                    rowIndex ===
                      START.row &&
                    colIndex ===
                      START.col;

                  const isGoal =
                    rowIndex ===
                      GOAL.row &&
                    colIndex ===
                      GOAL.col;

                  const h =
                    manhattanDistance(
                      {
                        row: rowIndex,
                        col: colIndex
                      },
                      GOAL
                    );

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={getCellClass(
                        rowIndex,
                        colIndex
                      )}
                    >
                      {isStart
                        ? "S"
                        : isGoal
                        ? "G"
                        : maze[rowIndex][
                            colIndex
                          ] === 0 &&
                          !contains(
                            explored,
                            rowIndex,
                            colIndex
                          )
                        ? h
                        : ""}
                    </div>
                  );
                }
              )
          )}

        </div>

      </main>

      {/* LEGEND */}

      <section className="legend">

        <div>
          <span className="legend-box start-box" />
          Start
        </div>

        <div>
          <span className="legend-box goal-box" />
          Goal
        </div>

        <div>
          <span className="legend-box wall-box" />
          Wall
        </div>

        <div>
          <span className="legend-box explored-box" />
          Explored
        </div>

        <div>
          <span className="legend-box path-box" />
          Path
        </div>

      </section>

      {/* HEURISTIC INFORMATION */}

      <section className="info">

        <h2>📐 Heuristic Function</h2>

        <p>
          Manhattan Distance
        </p>

        <code>
          h(n) = |row₁ - row₂| +
          |col₁ - col₂|
        </code>

        <p>
          Lower values indicate cells that
          are geometrically closer to the
          goal.
        </p>

      </section>

    </div>
  );
}

export default App;
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
  const wallProbability =
    difficulties[difficulty];

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
        (row === START.row &&
          col === START.col) ||
        (row === GOAL.row &&
          col === GOAL.col)
      ) {
        currentRow.push(0);
      } else {
        currentRow.push(
          Math.random() < wallProbability
            ? 1
            : 0
        );
      }
    }

    maze.push(currentRow);
  }

  // Guarantee a basic route
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
// FORMAT TIME
// ============================================

function formatTime(time) {
  return `${time.toFixed(3)} ms`;
}

// ============================================
// CREATE RESULT OBJECT
// ============================================

function createAlgorithmResult(
  name,
  result,
  executionTime
) {
  const lastExplored =
    result.explored.length > 0
      ? result.explored[
          result.explored.length - 1
        ]
      : START;

  return {
    algorithm: name,

    exploredNodes:
      result.explored.length,

    pathLength:
      result.path.length,

    initialHeuristic:
      manhattanDistance(
        START,
        GOAL
      ),

    finalHeuristic:
      manhattanDistance(
        lastExplored,
        GOAL
      ),

    executionTime,

    status: result.stuck
      ? "Local Optimum / No Path"
      : "Goal Reached",

    success: !result.stuck,

    reason: result.reason
  };
}

// ============================================
// APP
// ============================================

function App() {
  const [difficulty, setDifficulty] =
    useState("medium");

  const [maze, setMaze] = useState(
    generateMaze("medium")
  );

  const [algorithm, setAlgorithm] =
    useState("greedy");

  const [explored, setExplored] =
    useState([]);

  const [path, setPath] =
    useState([]);

  const [running, setRunning] =
    useState(false);

  const [comparisonRunning, setComparisonRunning] =
    useState(false);

  const [status, setStatus] =
    useState(
      "Ready to solve the maze"
    );

  // ==========================================
  // SINGLE ALGORITHM STATS
  // ==========================================

  const [stats, setStats] = useState({
    algorithm: "Not Run",
    executionTime: 0,
    exploredNodes: 0,
    pathLength: 0,
    initialHeuristic:
      manhattanDistance(
        START,
        GOAL
      ),
    finalHeuristic:
      manhattanDistance(
        START,
        GOAL
      ),
    status: "Ready"
  });

  // ==========================================
  // COMPARISON RESULTS
  // ==========================================

  const [comparison, setComparison] =
    useState({
      gbfs: null,
      hill: null
    });

  // ==========================================
  // NEW MAZE
  // ==========================================

  const newMaze = () => {
    setMaze(
      generateMaze(difficulty)
    );

    setExplored([]);

    setPath([]);

    setComparison({
      gbfs: null,
      hill: null
    });

    setStats({
      algorithm: "Not Run",
      executionTime: 0,
      exploredNodes: 0,
      pathLength: 0,
      initialHeuristic:
        manhattanDistance(
          START,
          GOAL
        ),
      finalHeuristic:
        manhattanDistance(
          START,
          GOAL
        ),
      status: "Ready"
    });

    setStatus(
      "New maze generated"
    );
  };

  // ==========================================
  // RESET
  // ==========================================

  const reset = () => {
    setExplored([]);

    setPath([]);

    setComparison({
      gbfs: null,
      hill: null
    });

    setStats({
      algorithm: "Not Run",
      executionTime: 0,
      exploredNodes: 0,
      pathLength: 0,
      initialHeuristic:
        manhattanDistance(
          START,
          GOAL
        ),
      finalHeuristic:
        manhattanDistance(
          START,
          GOAL
        ),
      status: "Ready"
    });

    setStatus(
      "Maze reset. Ready to solve."
    );
  };

  // ==========================================
  // RUN SINGLE ALGORITHM
  // ==========================================

  const runAlgorithm = async () => {
    setRunning(true);

    setExplored([]);

    setPath([]);

    setComparison({
      gbfs: null,
      hill: null
    });

    setStatus(
      "Running algorithm..."
    );

    const startTime =
      performance.now();

    let result;

    let algorithmName;

    if (algorithm === "greedy") {
      result =
        greedyBestFirstSearch(
          maze,
          START,
          GOAL
        );

      algorithmName =
        "Greedy Best-First Search";
    } else {
      result =
        hillClimbing(
          maze,
          START,
          GOAL
        );

      algorithmName =
        "Hill Climbing";
    }

    const executionTime =
      performance.now() -
      startTime;

    setStats({
      algorithm:
        algorithmName,

      executionTime,

      exploredNodes: 0,

      pathLength: 0,

      initialHeuristic:
        manhattanDistance(
          START,
          GOAL
        ),

      finalHeuristic:
        manhattanDistance(
          START,
          GOAL
        ),

      status: result.stuck
        ? "Local Optimum / No Path"
        : "Goal Reached"
    });

    // ========================================
    // ANIMATE EXPLORATION
    // ========================================

    for (
      let i = 0;
      i < result.explored.length;
      i++
    ) {
      await new Promise(
        (resolve) =>
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

        exploredNodes:
          i + 1,

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
      await new Promise(
        (resolve) =>
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
    // FINAL STATS
    // ========================================

    const finalNode =
      result.explored.length > 0
        ? result.explored[
            result.explored.length - 1
          ]
        : START;

    setStats({
      algorithm:
        algorithmName,

      executionTime,

      exploredNodes:
        result.explored.length,

      pathLength:
        result.path.length,

      initialHeuristic:
        manhattanDistance(
          START,
          GOAL
        ),

      finalHeuristic:
        manhattanDistance(
          finalNode,
          GOAL
        ),

      status: result.stuck
        ? "Local Optimum / No Path"
        : "Goal Reached"
    });

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
  // COMPARE BOTH ALGORITHMS
  // ==========================================

  const compareAlgorithms = async () => {
    setComparisonRunning(true);

    setRunning(false);

    setExplored([]);

    setPath([]);

    setComparison({
      gbfs: null,
      hill: null
    });

    setStats({
      algorithm: "Comparison Mode",
      executionTime: 0,
      exploredNodes: 0,
      pathLength: 0,
      initialHeuristic:
        manhattanDistance(
          START,
          GOAL
        ),
      finalHeuristic:
        manhattanDistance(
          START,
          GOAL
        ),
      status: "Running Comparison"
    });

    setStatus(
      "Running GBFS and Hill Climbing on the same maze..."
    );

    // ========================================
    // GBFS
    // ========================================

    const gbfsStart =
      performance.now();

    const gbfsResult =
      greedyBestFirstSearch(
        maze,
        START,
        GOAL
      );

    const gbfsTime =
      performance.now() -
      gbfsStart;

    const gbfsStats =
      createAlgorithmResult(
        "Greedy Best-First Search",
        gbfsResult,
        gbfsTime
      );

    setComparison((prev) => ({
      ...prev,
      gbfs: gbfsStats
    }));

    // ========================================
    // SMALL DELAY
    // ========================================

    await new Promise(
      (resolve) =>
        setTimeout(resolve, 500)
    );

    // ========================================
    // HILL CLIMBING
    // ========================================

    const hillStart =
      performance.now();

    const hillResult =
      hillClimbing(
        maze,
        START,
        GOAL
      );

    const hillTime =
      performance.now() -
      hillStart;

    const hillStats =
      createAlgorithmResult(
        "Hill Climbing",
        hillResult,
        hillTime
      );

    setComparison((prev) => ({
      ...prev,
      hill: hillStats
    }));

    // ========================================
    // SHOW GBFS EXPLORATION
    // ========================================

    for (
      let i = 0;
      i < gbfsResult.explored.length;
      i++
    ) {
      await new Promise(
        (resolve) =>
          setTimeout(resolve, 15)
      );

      setExplored((prev) => [
        ...prev,
        gbfsResult.explored[i]
      ]);
    }

    // ========================================
    // SHOW GBFS PATH
    // ========================================

    for (
      let i = 0;
      i < gbfsResult.path.length;
      i++
    ) {
      await new Promise(
        (resolve) =>
          setTimeout(resolve, 25)
      );

      setPath((prev) => [
        ...prev,
        gbfsResult.path[i]
      ]);
    }

    setStatus(
      "Comparison completed. Results are shown below."
    );

    setComparisonRunning(false);
  };

  // ==========================================
  // CHECK CELL
  // ==========================================

  const contains =
    (array, row, col) => {
      return array.some(
        (cell) =>
          cell.row === row &&
          cell.col === col
      );
    };

  // ==========================================
  // CELL CLASS
  // ==========================================

  const getCellClass =
    (row, col) => {
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

      if (
        maze[row][col] === 1
      ) {
        return "cell wall";
      }

      if (
        contains(
          path,
          row,
          col
        )
      ) {
        return "cell path";
      }

      if (
        contains(
          explored,
          row,
          col
        )
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

        <h1>
          🧭 Maze AI
        </h1>

        <p>
          Greedy Best-First Search &
          Hill Climbing Visualization
        </p>

      </header>

      {/* CONTROLS */}

      <section className="controls">

        <select
          value={algorithm}
          onChange={(e) =>
            setAlgorithm(
              e.target.value
            )
          }
          disabled={
            running ||
            comparisonRunning
          }
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
            setDifficulty(
              e.target.value
            )
          }
          disabled={
            running ||
            comparisonRunning
          }
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
          disabled={
            running ||
            comparisonRunning
          }
        >
          {running
            ? "Running..."
            : "▶ Run AI"}
        </button>

        <button
          className="compare-button"
          onClick={
            compareAlgorithms
          }
          disabled={
            running ||
            comparisonRunning
          }
        >
          {comparisonRunning
            ? "Comparing..."
            : "⚖ Compare Algorithms"}
        </button>

        <button
          onClick={reset}
          disabled={
            running ||
            comparisonRunning
          }
        >
          ↻ Reset
        </button>

        <button
          onClick={newMaze}
          disabled={
            running ||
            comparisonRunning
          }
        >
          ＋ New Maze
        </button>

      </section>

      {/* PERFORMANCE DASHBOARD */}

      <section className="performance-dashboard">

        <div className="dashboard-title">

          <h2>
            📊 AI Performance
          </h2>

          <span
            className={
              stats.status ===
              "Goal Reached"
                ? "success-badge"
                : stats.status ===
                    "Ready"
                ? "ready-badge"
                : "warning-badge"
            }
          >
            {stats.status}
          </span>

        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <span>
              Algorithm
            </span>

            <strong className="small-value">
              {stats.algorithm}
            </strong>
          </div>

          <div className="stat-card">
            <span>
              Execution Time
            </span>

            <strong>
              {formatTime(
                stats.executionTime
              )}
            </strong>
          </div>

          <div className="stat-card">
            <span>
              Explored Nodes
            </span>

            <strong>
              {stats.exploredNodes}
            </strong>
          </div>

          <div className="stat-card">
            <span>
              Path Length
            </span>

            <strong>
              {stats.pathLength}
            </strong>
          </div>

          <div className="stat-card">
            <span>
              Initial Heuristic
            </span>

            <strong>
              {stats.initialHeuristic}
            </strong>
          </div>

          <div className="stat-card">
            <span>
              Final Heuristic
            </span>

            <strong>
              {stats.finalHeuristic}
            </strong>
          </div>

        </div>

      </section>

      {/* =====================================
          COMPARISON
      ===================================== */}

      {(comparison.gbfs ||
        comparison.hill) && (
        <section className="comparison-panel">

          <div className="comparison-header">

            <h2>
              ⚖ GBFS vs Hill Climbing
            </h2>

            <p>
              Both algorithms were tested
              on the same maze.
            </p>

          </div>

          <div className="comparison-table-wrapper">

            <table className="comparison-table">

              <thead>

                <tr>

                  <th>
                    Metric
                  </th>

                  <th>
                    Greedy Best-First Search
                  </th>

                  <th>
                    Hill Climbing
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td>
                    Status
                  </td>

                  <td>
                    {comparison.gbfs
                      ? (
                        <span
                          className={
                            comparison.gbfs
                              .success
                              ? "table-success"
                              : "table-warning"
                          }
                        >
                          {
                            comparison.gbfs
                              .status
                          }
                        </span>
                      )
                      : "Running..."}
                  </td>

                  <td>
                    {comparison.hill
                      ? (
                        <span
                          className={
                            comparison.hill
                              .success
                              ? "table-success"
                              : "table-warning"
                          }
                        >
                          {
                            comparison.hill
                              .status
                          }
                        </span>
                      )
                      : "Running..."}
                  </td>

                </tr>

                <tr>

                  <td>
                    Explored Nodes
                  </td>

                  <td>
                    {comparison.gbfs
                      ?.exploredNodes ??
                      "—"}
                  </td>

                  <td>
                    {comparison.hill
                      ?.exploredNodes ??
                      "—"}
                  </td>

                </tr>

                <tr>

                  <td>
                    Path Length
                  </td>

                  <td>
                    {comparison.gbfs
                      ?.pathLength ??
                      "—"}
                  </td>

                  <td>
                    {comparison.hill
                      ?.pathLength ??
                      "—"}
                  </td>

                </tr>

                <tr>

                  <td>
                    Initial Heuristic
                  </td>

                  <td>
                    {comparison.gbfs
                      ?.initialHeuristic ??
                      "—"}
                  </td>

                  <td>
                    {comparison.hill
                      ?.initialHeuristic ??
                      "—"}
                  </td>

                </tr>

                <tr>

                  <td>
                    Final Heuristic
                  </td>

                  <td>
                    {comparison.gbfs
                      ?.finalHeuristic ??
                      "—"}
                  </td>

                  <td>
                    {comparison.hill
                      ?.finalHeuristic ??
                      "—"}
                  </td>

                </tr>

                <tr>

                  <td>
                    Execution Time
                  </td>

                  <td>
                    {comparison.gbfs
                      ? formatTime(
                          comparison.gbfs
                            .executionTime
                        )
                      : "—"}
                  </td>

                  <td>
                    {comparison.hill
                      ? formatTime(
                          comparison.hill
                            .executionTime
                        )
                      : "—"}
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

          <div className="comparison-note">

            <strong>
              Why can Hill Climbing get stuck?
            </strong>

            <p>
              Hill Climbing only moves to a
              neighboring cell when its
              heuristic value improves.
              If every available neighbor
              has an equal or higher heuristic,
              the algorithm stops at a local
              optimum.
            </p>

          </div>

        </section>
      )}

      {/* STATUS */}

      <div className="status">
        {status}
      </div>

      {/* MAZE */}

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
                        : maze[
                              rowIndex
                            ][
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

        <h2>
          📐 Heuristic Function
        </h2>

        <p>
          Manhattan Distance
        </p>

        <code>
          h(n) = |row₁ - row₂| +
          |col₁ - col₂|
        </code>

        <p>
          Lower values indicate cells
          that are geometrically closer
          to the goal.
        </p>

      </section>

    </div>
  );
}

export default App;
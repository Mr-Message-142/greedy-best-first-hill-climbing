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
// CREATE MAZE
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
      }

      else if (
        (row === START.row &&
          col === START.col) ||
        (row === GOAL.row &&
          col === GOAL.col)
      ) {
        currentRow.push(0);
      }

      else {
        currentRow.push(
          Math.random() < wallProbability
            ? 1
            : 0
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

  const [difficulty, setDifficulty] =
    useState("medium");

  const [maze, setMaze] =
    useState(
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

  const [status, setStatus] =
    useState(
      "Ready to solve the maze"
    );

  const [stats, setStats] =
    useState({
      explored: 0,
      pathLength: 0,
      heuristic: 44
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

    setStats({
      explored: 0,
      pathLength: 0,
      heuristic:
        manhattanDistance(
          START,
          GOAL
        )
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

    setStats({
      explored: 0,
      pathLength: 0,
      heuristic:
        manhattanDistance(
          START,
          GOAL
        )
    });

    setStatus(
      "Maze reset. Ready to solve."
    );
  };


  // ==========================================
  // RUN
  // ==========================================

  const runAlgorithm = async () => {

    setRunning(true);

    setExplored([]);

    setPath([]);

    setStatus(
      `Running ${
        algorithm === "greedy"
          ? "Greedy Best-First Search"
          : "Hill Climbing"
      }...`
    );


    let result;

    if (algorithm === "greedy") {

      result =
        greedyBestFirstSearch(
          maze,
          START,
          GOAL
        );

    } else {

      result =
        hillClimbing(
          maze,
          START,
          GOAL
        );
    }


    // ========================================
    // ANIMATE EXPLORATION
    // ========================================

    for (
      let i = 0;
      i < result.explored.length;
      i++
    ) {

      await new Promise(
        resolve =>
          setTimeout(resolve, 25)
      );

      const current =
        result.explored[i];

      setExplored(prev => [
        ...prev,
        current
      ]);

      setStats(prev => ({
        ...prev,
        explored: i + 1,
        heuristic:
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
        resolve =>
          setTimeout(resolve, 40)
      );

      setPath(prev => [
        ...prev,
        result.path[i]
      ]);
    }


    setStats(prev => ({
      ...prev,
      pathLength:
        result.path.length
    }));


    // ========================================
    // STATUS
    // ========================================

    if (result.stuck) {

      setStatus(
        `${algorithm === "hill"
          ? "Hill Climbing"
          : "Greedy Best-First Search"
        }: ${result.reason}`
      );

    } else {

      setStatus(
        `${algorithm === "greedy"
          ? "Greedy Best-First Search"
          : "Hill Climbing"
        } successfully reached the goal!`
      );
    }

    setRunning(false);
  };


  // ==========================================
  // CELL CHECK
  // ==========================================

  const contains =
    (array, row, col) => {

      return array.some(
        cell =>
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

      if (maze[row][col] === 1) {
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


  const currentHeuristic =
    stats.heuristic;


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="app">

      <header className="header">

        <h1>
          🧭 Maze AI
        </h1>

        <p>
          Heuristic Search Visualization
        </p>

      </header>


      {/* CONTROLS */}

      <section className="controls">

        <select
          value={algorithm}
          onChange={e =>
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
          onChange={e =>
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


      {/* STATS */}

      <section className="stats">

        <div className="stat-card">

          <span>
            Current Heuristic
          </span>

          <strong>
            {currentHeuristic}
          </strong>

        </div>


        <div className="stat-card">

          <span>
            Explored Nodes
          </span>

          <strong>
            {stats.explored}
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
            Goal Heuristic
          </span>

          <strong>
            0
          </strong>

        </div>

      </section>


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
                    rowIndex === START.row &&
                    colIndex === START.col;

                  const isGoal =
                    rowIndex === GOAL.row &&
                    colIndex === GOAL.col;

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
                      className={
                        getCellClass(
                          rowIndex,
                          colIndex
                        )
                      }
                    >

                      {isStart
                        ? "S"
                        : isGoal
                        ? "G"
                        : maze[rowIndex][colIndex] === 0 &&
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


      {/* INFORMATION */}

      <section className="info">

        <h2>
          Heuristic
        </h2>

        <p>
          Manhattan Distance
        </p>

        <code>
          h(n) = |row₁ - row₂| + |col₁ - col₂|
        </code>

        <p>
          Lower heuristic values indicate
          cells that are geometrically closer
          to the goal.
        </p>

      </section>

    </div>
  );
}

export default App;
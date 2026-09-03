import { useState } from "react";

import {
  manhattanDistance,
  greedyBestFirstSearch,
  hillClimbing
} from "./algorithms/mazeAlgorithms";

import "./App.css";


// ============================================
// MAZE CONFIGURATION
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
// GENERATE MAZE
// ============================================

function generateMaze() {

  const maze = [];

  for (let row = 0; row < ROWS; row++) {

    const currentRow = [];

    for (let col = 0; col < COLS; col++) {

      // Border walls
      if (
        row === 0 ||
        row === ROWS - 1 ||
        col === 0 ||
        col === COLS - 1
      ) {
        currentRow.push(1);
      }

      // Start and goal
      else if (
        (row === START.row &&
          col === START.col) ||
        (row === GOAL.row &&
          col === GOAL.col)
      ) {
        currentRow.push(0);
      }

      // Random walls
      else {

        currentRow.push(
          Math.random() < 0.22
            ? 1
            : 0
        );
      }
    }

    maze.push(currentRow);
  }


  // Guaranteed horizontal corridor
  for (
    let col = START.col;
    col <= GOAL.col;
    col++
  ) {
    maze[START.row][col] = 0;
  }


  // Guaranteed vertical corridor
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

  const [maze, setMaze] =
    useState(generateMaze());

  const [algorithm, setAlgorithm] =
    useState("greedy");

  const [explored, setExplored] =
    useState([]);

  const [path, setPath] =
    useState([]);

  const [running, setRunning] =
    useState(false);

  const [message, setMessage] =
    useState(
      "Select an algorithm and click Run"
    );


  // ============================================
  // CREATE NEW MAZE
  // ============================================

  const newMaze = () => {

    setMaze(generateMaze());

    setExplored([]);

    setPath([]);

    setMessage(
      "New maze generated"
    );
  };


  // ============================================
  // RUN ALGORITHM
  // ============================================

  const runAlgorithm = async () => {

    setRunning(true);

    setExplored([]);

    setPath([]);

    setMessage(
      "Running algorithm..."
    );


    let result;


    // -------------------------------
    // GREEDY BEST-FIRST SEARCH
    // -------------------------------

    if (algorithm === "greedy") {

      result =
        greedyBestFirstSearch(
          maze,
          START,
          GOAL
        );

    }

    // -------------------------------
    // HILL CLIMBING
    // -------------------------------

    else {

      result =
        hillClimbing(
          maze,
          START,
          GOAL
        );
    }


    // ============================================
    // ANIMATE EXPLORED CELLS
    // ============================================

    for (
      let i = 0;
      i < result.explored.length;
      i++
    ) {

      await new Promise(
        resolve =>
          setTimeout(resolve, 25)
      );

      setExplored(prev => [
        ...prev,
        result.explored[i]
      ]);
    }


    // ============================================
    // ANIMATE PATH
    // ============================================

    if (result.path.length > 0) {

      for (
        let i = 0;
        i < result.path.length;
        i++
      ) {

        await new Promise(
          resolve =>
            setTimeout(resolve, 50)
        );

        setPath(prev => [
          ...prev,
          result.path[i]
        ]);
      }


      setMessage(
        algorithm === "greedy"
          ? "Greedy Best-First Search found a path!"
          : "Hill Climbing found a path!"
      );

    }

    else {

      if (result.stuck) {

        setMessage(
          algorithm === "hill"
            ? `Hill Climbing stuck: ${result.reason}`
            : "Greedy Best-First Search could not find a path."
        );

      } else {

        setMessage(
          "No path found."
        );
      }
    }


    setRunning(false);
  };


  // ============================================
  // CHECK WHETHER ARRAY CONTAINS CELL
  // ============================================

  const contains =
    (array, row, col) => {

      return array.some(
        cell =>
          cell.row === row &&
          cell.col === col
      );
    };


  // ============================================
  // CURRENT CELL
  // ============================================

  const currentCell =
    explored.length > 0
      ? explored[explored.length - 1]
      : START;


  // ============================================
  // CURRENT HEURISTIC
  // ============================================

  const currentHeuristic =
    manhattanDistance(
      currentCell,
      GOAL
    );


  // ============================================
  // CELL CLASS
  // ============================================

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


  // ============================================
  // RENDER
  // ============================================

  return (

    <div className="app">

      <h1>
        AI Maze Solver
      </h1>

      <p className="subtitle">
        Greedy Best-First Search vs Hill Climbing
      </p>


      {/* ====================================
          CONTROLS
      ==================================== */}

      <div className="controls">

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


        <button
          onClick={runAlgorithm}
          disabled={running}
        >
          {running
            ? "Running..."
            : "Run Algorithm"}
        </button>


        <button
          onClick={newMaze}
          disabled={running}
        >
          New Maze
        </button>

      </div>


      {/* ====================================
          HEURISTIC INFORMATION
      ==================================== */}

      <div className="heuristic">

        <h2>
          Heuristic Function
        </h2>

        <p>
          <strong>
            Manhattan Distance
          </strong>
        </p>

        <p>
          h(n) = |row₁ - row₂| +
          |col₁ - col₂|
        </p>

        <div className="heuristic-values">

          <div>
            Start h:
            <strong>
              {manhattanDistance(
                START,
                GOAL
              )}
            </strong>
          </div>

          <div>
            Current h:
            <strong>
              {currentHeuristic}
            </strong>
          </div>

          <div>
            Goal h:
            <strong>
              0
            </strong>
          </div>

        </div>

      </div>


      {/* ====================================
          STATUS
      ==================================== */}

      <div className="status">
        {message}
      </div>


      {/* ====================================
          MAZE
      ==================================== */}

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


      {/* ====================================
          LEGEND
      ==================================== */}

      <div className="legend">

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

      </div>

    </div>
  );
}


export default App;
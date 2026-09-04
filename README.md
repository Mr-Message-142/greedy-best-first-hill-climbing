# 🧭 Heuristic-Based Maze Solver

A React.js-based interactive maze-solving application that demonstrates two heuristic search algorithms:

- Greedy Best-First Search (GBFS)
- Hill Climbing

The project uses the Manhattan Distance heuristic to guide the search toward the goal and provides a visual representation of explored cells and the final path.

## 📌 Project Overview

This project demonstrates how heuristic search algorithms can be applied to solve a maze.

The application generates a maze containing walls, a start point, and a goal point. The user can select a search algorithm and visualize how it explores the maze.

The project is designed for understanding:

- Heuristic functions
- Informed search algorithms
- Greedy Best-First Search
- Hill Climbing
- Local optimum problems
- Maze navigation
- Search visualization using React.js

## 🎯 Aim

To design and implement a heuristic-based maze-solving system using Greedy Best-First Search and Hill Climbing algorithms with Manhattan Distance as the heuristic function.

## 🎯 Objectives

1. Understand heuristic-based search algorithms.
2. Implement Manhattan Distance as a heuristic function.
3. Implement Greedy Best-First Search.
4. Implement Hill Climbing Search.
5. Visualize the search process in a maze.
6. Display explored cells and the generated path.
7. Demonstrate the local optimum problem in Hill Climbing.
8. Compare the behavior of GBFS and Hill Climbing.

## 🧠 Algorithms Used

### 1. Greedy Best-First Search

Greedy Best-First Search selects the node that appears closest to the goal according to the heuristic value.

It uses:

f(n) = h(n)

where:

- `n` = current node
- `h(n)` = estimated distance from the current node to the goal

The node with the smallest heuristic value is selected first.

### 2. Hill Climbing

Hill Climbing is a local search algorithm that continuously moves toward the neighboring state with the best heuristic value.

For this project, the algorithm selects the neighboring cell with the lowest Manhattan Distance.

However, Hill Climbing can get stuck at a local optimum.

For example:

Current h(n) = 24  
Best neighboring h(n) = 25

Since the neighboring state is worse according to the heuristic, Hill Climbing stops.

This demonstrates one of the major limitations of Hill Climbing.

## 📐 Heuristic Function

The project uses Manhattan Distance.

The formula is:

h(n) = |x1 - x2| + |y1 - y2|

where:

- `(x1, y1)` = current cell
- `(x2, y2)` = goal cell

Manhattan Distance is suitable for this maze because movement is restricted to four directions:

- Up
- Down
- Left
- Right

## 🛠️ Technologies Used

- React.js
- JavaScript
- Vite
- HTML5
- CSS3
- Node.js
- npm


import React, { useState, useEffect, useRef } from "react";

// Constants for the game
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

// Tetris shapes (each is a 2D array)
const SHAPES = [
  [[1, 1, 1], [0, 1, 0]], // T shape
  [[1, 1, 1, 1]],         // I shape
  [[1, 1], [1, 1]],       // O shape
  [[0, 1, 1], [1, 1, 0]], // S shape
  [[1, 1, 0], [0, 1, 1]], // Z shape
  [[1, 0, 0], [1, 1, 1]], // L shape
  [[0, 0, 1], [1, 1, 1]], // J shape
];

// Function to create an empty game board
const createEmptyBoard = (): number[][] => {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
};

// Helper function to check for collision
const checkCollision = (board: number[][], shape: number[][], position: { x: number; y: number }): boolean => {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] && (board[row + position.y] && board[row + position.y][col + position.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
};

// Rotate a shape 90 degrees
const rotate = (shape: number[][]): number[][] => {
  return shape[0].map((_, index) => shape.map((row) => row[index])).reverse();
};

// Clear full lines
const clearFullLines = (board: number[][]): number[][] => {
  return board.filter((row) => row.some((cell) => cell === 0));
};

const Tetris: React.FC = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentShape, setCurrentShape] = useState<number[][]>(SHAPES[0]); // Start with T shape
  const [position, setPosition] = useState({ x: 4, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const moveDown = () => {
    if (!gameOver) {
      const newPosition = { x: position.x, y: position.y + 1 };
      if (checkCollision(board, currentShape, newPosition)) {
        // Lock the shape in place
        const newBoard = [...board];
        for (let row = 0; row < currentShape.length; row++) {
          for (let col = 0; col < currentShape[row].length; col++) {
            if (currentShape[row][col]) {
              newBoard[row + position.y][col + position.x] = 1;
            }
          }
        }

        // Check for full lines and clear them
        const clearedBoard = clearFullLines(newBoard);
        setBoard(clearedBoard);
        setPosition({ x: 4, y: 0 }); // Reset position
        setCurrentShape(SHAPES[Math.floor(Math.random() * SHAPES.length)]); // Get a random shape
      } else {
        setPosition(newPosition);
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (gameOver) return;
    if (event.key === "ArrowDown") {
      moveDown();
    } else if (event.key === "ArrowLeft") {
      const newPosition = { x: position.x - 1, y: position.y };
      if (!checkCollision(board, currentShape, newPosition)) {
        setPosition(newPosition);
      }
    } else if (event.key === "ArrowRight") {
      const newPosition = { x: position.x + 1, y: position.y };
      if (!checkCollision(board, currentShape, newPosition)) {
        setPosition(newPosition);
      }
    } else if (event.key === "ArrowUp") {
      const rotatedShape = rotate(currentShape);
      if (!checkCollision(board, rotatedShape, position)) {
        setCurrentShape(rotatedShape);
      }
    }
  };

  useEffect(() => {
    // Set up keydown event listener
    window.addEventListener("keydown", (event) => handleKeyDown(event));

    // Set game loop interval
    intervalRef.current = setInterval(() => {
      moveDown();
    }, 500);

    // Cleanup interval and event listener
    return () => {
      window.removeEventListener("keydown", (event) => handleKeyDown(event));
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [board, position, currentShape, gameOver]);

  // Render the board
  return (
    <div style={{ textAlign: "center", color: "white", backgroundColor: "#111", padding: "20px" }}>
      <h1>Tetris</h1>
      {gameOver && <div style={{ color: "red" }}>Game Over!</div>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${BLOCK_SIZE}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${BLOCK_SIZE}px)`,
          gap: "1px",
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: BLOCK_SIZE,
                height: BLOCK_SIZE,
                backgroundColor: cell === 0 ? "white" : "blue",
                border: "1px solid #ccc",
              }}
            />
          ))
        )}
        {/* Render the current falling shape */}
        {currentShape.map((row, rowIndex) =>
          row.map((cell, colIndex) =>
            cell ? (
              <div
                key={`shape-${rowIndex}-${colIndex}`}
                style={{
                  position: "absolute",
                  left: `${(position.x + colIndex) * BLOCK_SIZE}px`,
                  top: `${(position.y + rowIndex) * BLOCK_SIZE}px`,
                  width: BLOCK_SIZE,
                  height: BLOCK_SIZE,
                  backgroundColor: "red",
                }}
              />
            ) : null
          )
        )}
      </div>
    </div>
  );
};

export default Tetris;

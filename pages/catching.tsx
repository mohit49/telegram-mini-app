import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import SplashScreen from "@/public/catching/splash.png"
import TonLogo from "@/public/dimond.png"
import { TonIcon } from '@/utils/icons';

// Type for the blocks
interface Block {
  id: number;
  isBomb: boolean;
  revealed: boolean;
}

const Catching: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [betAmount, setBetAmount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(1000); // Account balance starts at 1000
  const [betPlaced, setBetPlaced] = useState<boolean>(false);
  const [popup, setPopUp] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0); // Track revealed non-bomb blocks
  const [currentBet, setCurrentBet] = useState<number>(0); // Track current bet for the session
  const [currentWinnings, setCurrentWinnings] = useState<number>(0); // Track winnings during the game

  useEffect(() => {
    if (gameStarted) {
      initializeGame();
    }
  }, [gameStarted]);

  // Function to initialize the game
  const initializeGame = () => {
    const numBlocks = 12; // 12 blocks
    const bombPositions = new Set<number>(); // To store unique bomb positions

    // Randomly place 3 bombs in the blocks
    while (bombPositions.size < 3) {
      const bombPosition = Math.floor(Math.random() * numBlocks);
      bombPositions.add(bombPosition);
    }

    const newBlocks = Array.from({ length: numBlocks }, (_, index) => ({
      id: index,
      isBomb: bombPositions.has(index),
      revealed: false,
    }));

    setBlocks(newBlocks);
    setGameOver(false);
    setMessage('');
    setRevealedCount(0); // Reset revealed count when game starts
    setCurrentWinnings(0); // Reset winnings when game starts
  };

  // Handle the block click event
  const handleBlockClick = (id: number) => {
    if (gameOver) return;

    const newBlocks = [...blocks];
    const block = newBlocks.find(b => b.id === id);
    if (block) {
      block.revealed = true;
      setBlocks(newBlocks);

      if (block.isBomb) {
        // Game over: Deduct both the bet and all winnings if a bomb is hit
        const totalLoss = currentBet + currentWinnings;
        setMessage(`Game Over! You hit the bomb. You lost $${totalLoss}.`);
        setBalance(balance - totalLoss); // Deduct bet and winnings if bomb is hit
        setGameOver(true);
        setTimeout(() => {
          setPopUp(true); // Show the popup after 1 second
        }, 1000);
      } else {
        // Player wins money on a correct tap (not a bomb)
        setRevealedCount(revealedCount + 1); // Increment revealed blocks count
        const earnedAmount = betAmount * 2; // Player earns double the bet amount for each correct tap
        setCurrentWinnings(currentWinnings + earnedAmount); // Add earnings to current winnings
        setBalance(balance + earnedAmount); // Add winnings to balance
        setMessage(`Keep going! Bet: $${betAmount}`);
        
        // If all non-bomb blocks are revealed, the player wins the game
        if (revealedCount === blocks.length - 3) {
          const totalWinnings = currentWinnings + betAmount; // Add the original bet amount to winnings
          setMessage(`You won! Total earnings: $${totalWinnings}`);
          setGameOver(true);
          setTimeout(() => {
            setPopUp(true);
          }, 1000);
        }
      }
    }
  };

  // Handle bet placement
  const handleBetPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (betAmount <= 0) {
      setMessage('Please enter a valid bet amount.');
    } else if (betAmount > balance) {
      setMessage('You do not have enough balance to place that bet.');
    } else {
      setBetPlaced(true);
      setCurrentBet(betAmount); // Store current bet for the session
      setBalance(balance - betAmount); // Deduct the bet amount from balance
      setGameStarted(true);
    }
  };

  // Cash out functionality
  const handleCashOut = () => {
    const totalWinnings = currentWinnings + betAmount; // Calculate total winnings (bet amount + revealed non-bomb blocks)
    setBalance(balance + totalWinnings); // Add winnings to balance
    setMessage(`You cashed out! Total earnings: $${totalWinnings}`);
    setGameOver(true); // End the game
    setPopUp(true); // Show the popup
  };

  // Increase or decrease bet amount by $5
  const increaseBet = () => {
    if (betAmount + 5 <= balance) {
      setBetAmount(betAmount + 5);
    }
  };

  const decreaseBet = () => {
    if (betAmount - 5 >= 0) {
      setBetAmount(betAmount - 5);
    }
  };

  // Render Splash Screen
  const renderSplashScreen = () => {
    return (
      <div onClick={() => setGameStarted(true)} className="splash-container overflow-hidden">
        <Image alt="splash" className='w-full object-cover' src={SplashScreen} />
      </div>
    );
  };

  // Render Game Board
  const renderGameBoard = () => {
    return (
      <div className='bg-[#fce062] h-[90vh]'>
        <h2 className='font-bold text-[13px] my-[3px]'>{message}</h2>
        <div className={`board-container ${betAmount === 0 ? 'pointer-events-none' : ''}`}>
          {blocks.map(block => (
            <div
              key={block.id}
              onClick={() => handleBlockClick(block.id)}
              className={`block ${block.revealed ? (block.isBomb ? 'bomb' : 'revealed') : ''}`}
            >
              {block.revealed && !block.isBomb && <TonIcon />}
              {block.revealed && block.isBomb && '💣'}
            </div>
          ))}
        </div>

        {/* Bet adjustment buttons */}
        <div className='flex flex-col items-center justify-between'>
          <h2 className='font-bold'>Bet your Ton Now</h2>
          <div className="bet-adjustment !m-0 gap-3 !mt-4">
            <button onClick={decreaseBet} className="bet-button w-[60px] bg-[#ff68b9] shadowtoonButton">-5</button>
            <span className='font-bold'>{betAmount}</span>
            <button onClick={increaseBet} className="bet-button w-[60px] bg-[#ff68b9] shadowtoonButton">+5</button>
          </div>
        </div>
        {/* Place Bet Button */}
        {!betPlaced && (
          <div className='flex flex-col m-auto w-[250px]'>
            <button onClick={handleBetPlace} className="bg-[#ff68b9] py-[15px] !rounded-lg mt-8 shadowtoonButton">
              Place Bet & Start
            </button>
          </div>
        )}

        {/* Cash Out Button */}
        {betPlaced && !gameOver && (
          <div className='flex flex-col m-auto w-[250px]'>
            <button onClick={handleCashOut} className="bg-[#4caf50] py-[15px] !rounded-lg mt-8 shadowtoonButton">
              Cash Out
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App bg-[#fce062] h-[100vh] overflow-hidden">
      {gameStarted &&
        <div className="account-info !m-0 flex flex-col w-full justify-center items-center gap-2 h-[15vh]">
          <p className='font-bold justify-center flex flex-row items-center gap-2 text-center text-[30px]'>{balance} <TonIcon /></p>
          <p className='font-bold flex justify-center flex-row items-center gap-2 text-center text-[16px]'>Find The Doodles to multiply your Tons</p>
        </div>
      }

      {!gameStarted ? renderSplashScreen() : renderGameBoard()}

      {popup && (
        <div className='w-[90%] h-[300px] bg-[#ffffff] flex fixed top-[50%] mt-[-150px] left-[50%] ml-[-45%] !rounded-lg popup justify-center flex-col'>
          {gameOver && (
            <div className="bet-info w-[100%] justify-center flex flex-col items-center text-center p-4">
              <h2 className='font-bold flex justify-center flex-row items-center gap-2 text-center text-[18px]'>{message}</h2>
              <button
                onClick={() => {
                  setGameStarted(false);
                  setBetPlaced(false);
                  setGameOver(false);
                  setBetAmount(0);
                  setPopUp(false);
                }}
                className="bg-[#ff68b9] py-[15px] w-[200px] !rounded-lg mt-8 shadowtoonButton"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Catching;

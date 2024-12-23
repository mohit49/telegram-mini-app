import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

// Lottery Game Component
const LotteryGame: React.FC = () => {
  const [userNumbers, setUserNumbers] = useState<number[]>([]);
  const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [prize, setPrize] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(1000); // Total wallet balance

  // Helper function to generate random numbers (from 1 to 20)
  const generateRandomNumbers = (): number[] => {
    let numbers: Set<number> = new Set();
    while (numbers.size < 6) {
      const randomNumber = Math.floor(Math.random() * 20) + 1;
      numbers.add(randomNumber);
    }
    return Array.from(numbers);
  };

  // Animation for the button and number reveal
  const buttonSpring = useSpring({
    transform: 'scale(1.1)',
    from: { transform: 'scale(1)' },
    reset: true,
    reverse: false,
  });

  // Handle the number selection (click event)
  const handleNumberSelect = (num: number) => {
    if (userNumbers.length < 6) {
      if (!userNumbers.includes(num)) {
        setUserNumbers([...userNumbers, num]);
      }
    } else {
      alert('You can only select 6 numbers.');
    }
  };

  // Handle bet change
  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= walletBalance) {
      setBetAmount(value);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (userNumbers.length !== 6) {
      alert('Please select 6 numbers.');
      return;
    }

    if (betAmount <= 0 || betAmount > walletBalance) {
      alert('Please enter a valid bet amount.');
      return;
    }

    // Deduct bet amount from wallet
    setWalletBalance(walletBalance - betAmount);

    // Shuffle numbers while waiting for the result
    let shuffledNumbers: number[] = Array.from({ length: 20 }, (_, index) => index + 1);
    shuffledNumbers = shuffleArray(shuffledNumbers);
    setWinningNumbers(shuffledNumbers);

    // Simulate a delay for lottery result
    setTimeout(() => {
      const generatedWinningNumbers = generateRandomNumbers();
      setWinningNumbers(generatedWinningNumbers);

      // Compare user numbers with winning numbers
      const matches = userNumbers.filter(num => generatedWinningNumbers.includes(num));
      setMatchCount(matches.length);

      // Calculate prize based on matching numbers
      const prizeMultipliers = [0, 0, 10, 100, 1000, 5000, 10000]; // Prize multiplier for matches
      const prizeMoney = betAmount * prizeMultipliers[matches.length];
      setPrize(prizeMoney);
    }, 2000); // 2 seconds delay for result

  };

  // Shuffle array function (for animation effect)
  const shuffleArray = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-blue-400 p-10 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Lottery Game</h1>
        
        {/* Wallet Balance */}
        <div className="mb-4 text-center">
          <h2 className="text-xl text-gray-700">Wallet Balance: ${walletBalance}</h2>
        </div>

        {/* Bet Section */}
        <div className="mb-6">
          <input
            type="number"
            value={betAmount}
            onChange={handleBetChange}
            placeholder="Enter your bet amount"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* User Number Selection */}
        <h2 className="text-xl text-center mb-4">Select 6 numbers (1-20)</h2>
        <div className="grid grid-cols-5 gap-4 mb-6">
          {/* Display numbers from 1 to 20 as selectable boxes */}
          {Array.from({ length: 20 }, (_, index) => {
            const num = index + 1;
            const isSelected = userNumbers.includes(num);
            return (
              <div
                key={num}
                onClick={() => handleNumberSelect(num)}
                className={`p-4 text-center cursor-pointer rounded-full ${
                  isSelected
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                } transition-all duration-200`}
              >
                {num}
              </div>
            );
          })}
        </div>

        {/* Submit Button with animation */}
        <animated.button
          style={buttonSpring}
          onClick={handleSubmit}
          className="w-full p-4 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
        >
          Submit
        </animated.button>

        {/* Results Section */}
        <div className="mt-6 text-center">
          {matchCount !== null && (
            <div>
              <h2 className="text-2xl text-blue-600 mb-4">Winning Numbers: {winningNumbers.join(', ')}</h2>
              <h3 className={`text-xl ${matchCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {matchCount > 0 ? `You matched ${matchCount} number(s)!` : 'Better luck next time!'}
              </h3>
              {betAmount > 0 && (
                <div className="mt-4">
                  <h4 className="text-xl font-bold">Your Prize: ${prize}</h4>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LotteryGame;

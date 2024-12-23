import { ExitIcon, TonIcon } from '@/utils/icons';
import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import Image from 'next/image';
import ticket from "@/public/lottery/ticket.gif";

// Lottery Game Component
const LotteryGame: React.FC = () => {
  const [userNumbers, setUserNumbers] = useState<number[]>([]);
  const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [prize, setPrize] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(1000); // Total wallet balance
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false); // Payment Modal state
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false); // Game Started flag
  const [modalMessage, setModalMessage] = useState<string>(''); // Message for modal
  const [gamePlayed, setGamePlayed] = useState<boolean>(false); // Track if the game has been played
  const [loading, setLoading] = useState<boolean>(false); // Track loading state

  const lotteryFee = 20; // Fixed fee for playing the lottery game
  const winChance = 0.7; // 40% chance of winning

  // Helper function to generate random numbers (from 1 to 20)
  const generateRandomNumbers = (): number[] => {
    let numbers: Set<number> = new Set();
    while (numbers.size < 6) {
      const randomNumber = Math.floor(Math.random() * 30) + 1;
      numbers.add(randomNumber);
    }
    return Array.from(numbers);
  };

  // Handle the number selection (click event)
  const handleNumberSelect = (num: number) => {
    // If the number is already selected, remove it from the list (deselect)
    if (userNumbers.includes(num)) {
      setUserNumbers(userNumbers.filter((number) => number !== num));
    } 
    // If it's not selected yet and the user has not already selected 6 numbers, select it
    else if (userNumbers.length < 6) {
      setUserNumbers([...userNumbers, num]);
    }
  };

  // Handle play button click
  const handlePlayClick = () => {
    setLoading(true); // Start loading state

    // Simulate a winning chance (percentage)
    const isWinner = Math.random() < winChance; // winChance is 40% (0.4)

    setTimeout(() => {
      if (isWinner) {
        // Generate random winning numbers after a delay
        const generatedWinningNumbers = generateRandomNumbers();
        setWinningNumbers(generatedWinningNumbers);

        // Compare user numbers with winning numbers
        const matches = userNumbers.filter(num => generatedWinningNumbers.includes(num));
        setMatchCount(matches.length);

        // Calculate prize based on matching numbers
        const prizeMultipliers = [0, 2, 5, 10, 20, 30]; // Prize multiplier for matches
        const prizeMoney = lotteryFee * prizeMultipliers[matches.length];
        setPrize(prizeMoney);

        // Add the prize money to wallet balance if any
        if (prizeMoney > 0) {
          setWalletBalance(walletBalance + prizeMoney);
        }

        // Set modal message for winning
        setModalMessage(`You matched ${matches.length} number(s)!\nWinning Numbers: ${generatedWinningNumbers.join(', ')}`);
        setGamePlayed(true); // Mark game as played
        setIsGameStarted(false);
        setUserNumbers([]);
      } else {
        // No prize, but still reset the game
        setModalMessage('Better luck next time!');
        setGamePlayed(true); // Mark game as played
        setIsGameStarted(false);
        setUserNumbers([]);
      }

      setLoading(false); // End loading state
    }, 2000); // 2 seconds delay for result
  };

  // Handle payment confirmation and start the game
  const handlePaymentConfirmation = () => {
    if (walletBalance < lotteryFee) {
      alert('Insufficient funds to play the lottery.');
      return;
    }

    setWalletBalance(walletBalance - lotteryFee); // Deduct the lottery fee from wallet
    setIsPaymentModalOpen(false); // Close the payment modal
    setIsGameStarted(true); // Start the game (allow number selection)
  };

  // Handle modal cancel (do not play)
  const handleCancelPayment = () => {
    setIsPaymentModalOpen(false); // Close the payment modal
  };

  // Handle closing the result modal
  const handleModalClose = () => {
    setModalMessage('');
  };

  // Handle play again action
  const handlePlayAgain = () => {
    if (walletBalance < lotteryFee) {
      alert('Insufficient funds to play again.');
      return;
    }

    setWalletBalance(walletBalance - lotteryFee); // Deduct the lottery fee again

    setGamePlayed(false); // Reset game played flag
    setUserNumbers([]); // Clear user numbers
    setIsGameStarted(true); // Allow the user to select numbers again
    setModalMessage(''); // Clear the modal message
  };

  // Animation for the button and number reveal
  const buttonSpring = useSpring({
    transform: 'scale(1.1)',
    from: { transform: 'scale(1)' },
    reset: true,
    reverse: false,
  });

  useEffect(() => {
    setIsPaymentModalOpen(true);
  }, []);

  return (
    <div className="h-[100vh] overflow-hidden bg-[#981ac4] p-0 flex items-center justify-center">
      <div className='h-[100vh] w-full p-[15px]'>
        <>
          <div className='flex flex-row justify-between'>
            <h1 className='font-bold flex flex-row items-center gap-2 text-[30px] text-[#ffffff] pb-[30px]'>{walletBalance} <TonIcon /></h1>
            <h2 className='font-bold flex flex-row items-center gap-2 text-[30px] text-[#ffffff] pb-[30px]'><ExitIcon /></h2>
          </div>
          <div className='w-[95%] m-auto bg-[#ffffff] p-[15px] rounded-lg text-left'>
            {/* Conditionally render the title text only when not loading */}
            {!loading && (
              <h2 className="text-[18px] text-left mb-4 font-bold border-b-[3px] border-yellow-500 pb-3">Select 6 numbers (1-20)</h2>
            )}

            {/* Container box will remain at the same height */}
            <div className="min-h-[300px] overflow-hidden grid grid-cols-5 gap-4 mb-6">
              {/* Display numbers from 1 to 20 as selectable boxes */}
              {loading ? (
                <div className="flex flex-row justify-center items-center w-[300px] m-auto ">
                  <Image src={ticket} alt="Loading..." className="w-[100%]" />
                </div>
              ) : (
                Array.from({ length: 30 }, (_, index) => {
                  const num = index + 1;
                  const isSelected = userNumbers.includes(num);
                  return (
                    <div
                      key={num}
                      onClick={() => handleNumberSelect(num)}
                      className={`p-2 text-center cursor-pointer rounded-lg font-bold ${isSelected
                          ? 'bg-[#981ac4] text-white'
                          : 'bg-[#f0f4f9] hover:bg-gray-300'
                        } transition-all duration-200`}
                    >
                      {num}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Play Button with animation */}
          <div className='flex py-4 flex-col'>
            <animated.button
              style={buttonSpring}
              onClick={handlePlayClick}
              disabled={userNumbers.length !== 6 || gamePlayed || loading} // Disable the button if user has not selected 6 numbers or game is in loading state
              className="bg-[#fee77f] m-auto py-2 rounded-lg px-[30px] shadowtoonButton text-[#000000]"
            >
              {loading ? 'Loading...' : 'Play Lottery'}
            </animated.button>

            {/* Display message if the user hasn't selected 6 numbers */}
            {userNumbers.length > 5 && (
              <p className="text-center py-3 text-[#FFFFFF] font-bold mt-2">You can only select 6 numbers.</p>
            )}
          </div>

        </>
        {/* Payment Modal */}
        {isPaymentModalOpen && !gamePlayed && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-[90%]">
              <h3 className=" font-bold text-center mb-2 text-[30px] ">Winning Chance</h3>
              <Image src={ticket} alt='ticket' className='w-[200px] m-auto' />
              <p className='font-bold flex flex-row justify-center items-center gap-3 text-[30px]'>@ {lotteryFee} <TonIcon /></p>
              <p className="text-center mb-6 font-bold mt-1">You will pay ${lotteryFee} to play the lottery game. Do you want to proceed?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handlePaymentConfirmation}
                  className="bg-[#981ac4] text-white py-2 rounded-lg px-[30px] shadowtoonButton"
                >
                  Yes, Pay
                </button>
                <button
                  onClick={handleCancelPayment}
                  className="bg-[#fee77f] py-2 rounded-lg px-[30px] shadowtoonButton text-[#000000]"
                >
                  Quit Game
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Result Modal */}
      {modalMessage && gamePlayed && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-[90%]">
            <h3 className="font-bold text-center mb-4 text-[30px]">Game Result</h3>
            <p className="text-center mb-6 font-bold">{modalMessage}</p>
            <p className="text-center mb-6 font-bold gap-2 flex flex-row justify-center items-center text-[30px]">{prize} <TonIcon/></p>
            <p className="text-center mb-6 font-bold flex flex-row gap-2 items-center justify-center"> @ 20 <TonIcon/> Play Again</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handlePlayAgain}
                className="bg-[#fee77f] m-auto py-2 rounded-lg px-[20px] shadowtoonButton text-[#000000]"
              >
                Play Again
              </button>
              <button
                onClick={handleModalClose}
                 className="bg-[#981ac4] m-auto py-2 rounded-lg px-[20px] shadowtoonButton text-[#ffffff]"
              >
                Quit Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LotteryGame;

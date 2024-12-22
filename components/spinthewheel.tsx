import Image from 'next/image';
import React, { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import FlappyBird from "@/public/doodle-coin.png";
import trophy from "@/public/trophy.gif"
import flappySad from "@/public/overbird.png"
import { Button } from './ui/button';
import { TonIcon } from '@/utils/icons';
// Create data for the wheel with options corresponding to 1x to 5x multipliers
const data = [
  { option: '1x', multiplier: 1 , style: { backgroundColor: '#48ef9d', textColor: 'black', fontSize:"40"  }  },
  { option: '2x', multiplier: 2 , style: { backgroundColor: '#ffa4d5', textColor: 'black', fontSize:"40" }},
  
  { option: '3x', multiplier: 3, style: { backgroundColor: '#80b1fe', textColor: 'black', fontSize:"40"  }  },
  { option: '4x', multiplier: 4, style: { backgroundColor: '#fee77f', textColor: 'black',fontSize:"40"  }  },
  { option: '5x', multiplier: 5, style: { backgroundColor: '#98e2ff', textColor: 'black',fontSize:"40"  }  },
  
];

export default function SpinWheelWithBetting() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [totalAmount, setTotalAmount] = useState(100); // Starting amount
  const [betAmount, setBetAmount] = useState(0);
  const [selectedMultiplier, setSelectedMultiplier] = useState(1); // User's selected multiplier bet
  const [message, setMessage] = useState('');
  const [spinResult, setSpinResult] = useState(null); // To store result before deduction
  const [isSpinning, setIsSpinning] = useState(false); // Flag to track spinning status
const [win , setWin] = useState(null);
  // Handle spin button click
  const handleSpinClick = () => {
    if (betAmount <= 0 || betAmount > totalAmount) {
        setWin(false)
      setMessage('Invalid bet amount! Make sure your bet is less than or equal to your total amount.');
      return;
    }

    // Ensure that the bet multiplied by the multiplier does not exceed the total amount
    if (betAmount * selectedMultiplier > totalAmount) {
        setWin(false)
      setMessage('You do not have enough balance to place this bet with the multiplier.');
      return;
    }

    // Spin the wheel
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    setIsSpinning(true); // Start spinning

    // Store the result for later calculation
    const prize = data[newPrizeNumber];
    const prizeMultiplier = prize.multiplier;
    setSpinResult({ prizeMultiplier, prizeAmount: betAmount * selectedMultiplier });
  };

  // Handle multiplier and bet amount changes
  const handleMultiplierChange = (amount) => {
    const newMultiplier = selectedMultiplier + amount;
    if (newMultiplier >= 1 && newMultiplier <= 5) {
      setSelectedMultiplier(newMultiplier);
    }
  };

  const handleBetAmountChange = (amount) => {
    const newBetAmount = betAmount + amount;
    if (newBetAmount >= 0 && newBetAmount <= totalAmount) {
      setBetAmount(newBetAmount);
    }
  };

  // Update the total amount and message once the wheel stops spinning
  const handleStopSpinning = () => {
    if (spinResult) {
      const { prizeMultiplier, prizeAmount } = spinResult;
      let newTotalAmount = totalAmount;
      
      if (selectedMultiplier === prizeMultiplier) {
        newTotalAmount += prizeAmount;
        setMessage(`You won! You bet on ${selectedMultiplier}x and won ${prizeAmount}.`);
        setWin(true)
      } else {
        newTotalAmount -= prizeAmount;
        setMessage(`You lost. You bet on ${selectedMultiplier}x and lost ${prizeAmount}.`);
        setWin(false)
      }
      
      // Update the total amount after the deduction/win
      setTotalAmount(newTotalAmount);
      setSpinResult(null); // Clear the spin result
    }

    // Reset the spinning state and show message
    setMustSpin(false);
    setIsSpinning(false); // Stop spinning
  };

  function setPopupclose(){
    setWin(null)
  }

  return (
    <div className="game-container spinwheel">
         <div className="balance-info flex flex-row justify-center">
        <p className='font-bold text-[35px] flex flex-row items-center gap-[10px]'> {totalAmount} <TonIcon/></p>
      </div>
   <div className='w-[300px] m-auto relative'>
<div className=' absolute left-[50%] top-[50%] z-[10] translate-x-[-50%] translate-y-[-50%]'><Image alt="flappy" src={FlappyBird}/></div>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        onStopSpinning={handleStopSpinning}
       
        textColors={['#ffffff']}
        outerBorderColor={"#ffffff"}
        radiusLineWidth={3}
        radiusLineColor={"#FFFFFF"}
       
      />
      </div>
      <div className='flex flex-row text-center justify-center gap-[30px]  py-[30px]'>
      <div className="control-section">
        <label className='font-bold !text-[25px]'>Your Bet  </label>
        <div className="multiplier-control flex flex-row items-center gap-[5px]">
          <button className="multiplier-btn w-[50px] h-[40px] !text-[#000000] !bg-[#fee77f] shadowtoonButton" onClick={() => handleMultiplierChange(-1)}>-1</button>
          <span className="multiplier-amount">{selectedMultiplier}x</span>
          <button className="multiplier-btn w-[50px] h-[40px] !text-[#000000] !bg-[#fee77f] shadowtoonButton"  onClick={() => handleMultiplierChange(1)}>+1</button>
        </div>
      </div>

      <div className="control-section">
      <label className='font-bold !text-[25px]'> Bet TON </label>
        <div className="bet-control flex flex-row items-center gap-[5px]">
        <button className="multiplier-btn w-[50px] h-[40px] !text-[#000000] !bg-[#fee77f] shadowtoonButton" onClick={() => handleBetAmountChange(-5)}>-5</button>
          <span className="bet-amount">{betAmount}</span>
          <button className="multiplier-btn w-[50px] h-[40px] !text-[#000000] !bg-[#fee77f] shadowtoonButton"  onClick={() => handleBetAmountChange(5)}>+5</button>
        </div>
      </div>
      </div>
     

      <button className="spin-btn !bg-[#48ef9d] shadowtoonButton !text-[#000000]" onClick={handleSpinClick} disabled={mustSpin || isSpinning}>
        {isSpinning ? 'SPINNING...' : 'SPIN NOW'}
      </button>

      {/* Display message only after the spin is completed */}
      {(win || !win) && win !== null && <div className="result-message popup !block !opacity-[1]">
        {win ? <div className='w-[70%] m-auto'><Image alt="flappy" src={trophy}/></div> : <div className='text-center w-full p-[20px] flex justify-center'><Image alt="sad" src={flappySad}/></div>}
        <p className='text-[20px] py-[20px]'>{ message}</p>
        <Button className="spin-btn !bg-[#fee77f] shadowtoonButton !text-[#000000] !font-bold" onClick={setPopupclose}  >
      SPIN AGAIN
      </Button>

        </div>}

    </div>
  );
}

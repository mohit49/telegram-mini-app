import Image from 'next/image';
import React, { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import FlappyBird from '@/public/doodle-coin.png';
import trophy from '@/public/trophy.gif';
import flappySad from '@/public/overbird.png';
import { Button } from './ui/button';
import { TonIcon } from '@/utils/icons';
import SpinSplash from "@/public/spin-wheel/spinSplash.jpg"
import { useGlobalContext } from "@/pages/_app";
import { updateWallet } from '@/utils/api';

// Define types for the data structure and spin result
interface ImageProps {
    uri: string;
    offsetX?: number; // Optional
    offsetY?: number; // Optional
    sizeMultiplier?: number; // Optional
    landscape?: boolean; // Optional
  }
interface StyleType {
    backgroundColor?: string; // Optional
    textColor?: string; // Optional
    fontFamily?: string; // Optional
    fontSize?: number; // Optional
    fontWeight?: number | string; // Optional
    fontStyle?: string; // Optional
  }

interface WheelData {
    option?: string;
    image?: ImageProps;
    style?: StyleType; // Optional
    optionSize?: number; // Optional
  }

interface SpinResult {
  prizeMultiplier: number;
  prizeAmount: number;
}

// Define data for the wheel with multipliers
const data: any = [
  { option: '1x', multiplier: 1, style: { backgroundColor: '#48ef9d', textColor: 'black', fontSize: '40' } },
  { option: '2x', multiplier: 2, style: { backgroundColor: '#ffa4d5', textColor: 'black', fontSize: '40' } },
  { option: '3x', multiplier: 3, style: { backgroundColor: '#80b1fe', textColor: 'black', fontSize: '40' } },
  { option: '4x', multiplier: 4, style: { backgroundColor: '#fee77f', textColor: 'black', fontSize: '40' } },
  { option: '5x', multiplier: 5, style: { backgroundColor: '#98e2ff', textColor: 'black', fontSize: '40' } },
];

const SpinWheelWithBetting: React.FC = () => {
     const {walletBalance , userData}  = useGlobalContext();
   
  const [mustSpin, setMustSpin] = useState<boolean>(false);
  const [prizeNumber, setPrizeNumber] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(walletBalance); // Starting amount
  const [betAmount, setBetAmount] = useState<number>(0);
  const [selectedMultiplier, setSelectedMultiplier] = useState<number>(1); // User's selected multiplier bet
  const [message, setMessage] = useState<string>('');
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null); // To store result before deduction
  const [isSpinning, setIsSpinning] = useState<boolean>(false); // Flag to track spinning status
  const [win, setWin] = useState<boolean | null>(null);
  const [splashScreen, setSplashScreen] = useState<boolean | null>(true);

  // Handle spin button click
  const handleSpinClick = (): void => {
    if (betAmount <= 0 || betAmount > totalAmount) {
      setWin(false);
      setMessage('Invalid bet amount! Make sure your bet is less than or equal to your total amount.');
      return;
    }

    // Ensure that the bet multiplied by the multiplier does not exceed the total amount
    if (betAmount * selectedMultiplier > totalAmount) {
      setWin(false);
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
  const handleMultiplierChange = (amount: number): void => {
    const newMultiplier = selectedMultiplier + amount;
    if (newMultiplier >= 1 && newMultiplier <= 5) {
      setSelectedMultiplier(newMultiplier);
    }
  };

  const handleBetAmountChange = (amount: number): void => {
    const newBetAmount = betAmount + amount;
    if (newBetAmount >= 0 && newBetAmount <= totalAmount) {
      setBetAmount(newBetAmount);
    }
  };

  // Update the total amount and message once the wheel stops spinning
  const handleStopSpinning = (): void => {
   const  userId =userData?.tele_id
    if (spinResult) {
      const { prizeMultiplier, prizeAmount } = spinResult;
      let newTotalAmount = totalAmount;

      if (selectedMultiplier === prizeMultiplier) {
        newTotalAmount += prizeAmount;
        setMessage(`You won! You bet on ${selectedMultiplier}x and won ${prizeAmount}.`);
        const walletData:any =  {
          "type": "profit",
          "amount": prizeAmount,
          "description": `Won ${prizeAmount} Ton on Spin The Wheel`
        }
        updateWallet({userId , walletData})
        setWin(true);
      } else {
        newTotalAmount -= prizeAmount;
        setMessage(`You lost. You bet on ${selectedMultiplier}x and lost ${prizeAmount}.`);
        const walletData:any =  {
          "type": "loss",
          "amount": prizeAmount,
          "description": `Loss ${prizeAmount} Ton on Spin The Wheel`
        }
        updateWallet({userId , walletData})
        setWin(false);
      }

      // Update the total amount after the deduction/win
      setTotalAmount(newTotalAmount);
      setSpinResult(null); // Clear the spin result
    }

    // Reset the spinning state and show message
    setMustSpin(false);
    setIsSpinning(false); // Stop spinning
  };

  // Close the result popup
  const setPopupclose = (): void => {
    setWin(null);
  };

  const closeSplash =() :void =>{
    setSplashScreen(false)
  }

  return (
    <>
    {splashScreen && <div onClick={closeSplash}><Image alt="splash" className='w-full' src={SpinSplash}/></div>}
    {!splashScreen && <div className="game-container spinwheel">
      <div className="balance-info flex flex-row justify-center">
        <p className="font-bold text-[35px] flex flex-row items-center gap-[10px]">
          {totalAmount} <TonIcon />
        </p>
      </div>

      <div className="w-[300px] m-auto relative">
        <div className="absolute left-[50%] top-[50%] z-[10] translate-x-[-50%] translate-y-[-50%]">
          <Image alt="flappy" src={FlappyBird} />
        </div>
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={handleStopSpinning}
          textColors={['#ffffff']}
          outerBorderColor="#ffffff"
          radiusLineWidth={3}
          radiusLineColor="#FFFFFF"
        />
      </div>

      <div className="flex flex-row text-center justify-center gap-[30px] py-[30px]">
        <div className="control-section">
          <label className="font-bold !text-[25px]">Your Bet</label>
          <div className="multiplier-control flex flex-row items-center gap-[5px]">
            <button
              className="multiplier-btn w-[50px] h-[40px] !text-[#000000] !bg-[#fee77f] shadowtoonButton"
              onClick={() => handleMultiplierChange(-1)}
            >
              -1
            </button>
            <span className="multiplier-amount">{selectedMultiplier}x</span>
            <button
              className="multiplier-btn w-[50px] h-[40px] !text-[#000000] !bg-[#fee77f] shadowtoonButton"
              onClick={() => handleMultiplierChange(1)}
            >
              +1
            </button>
          </div>
        </div>

        <div className="control-section">
          <label className="font-bold !text-[25px]">Bet TON</label>
          <div className="bet-control flex flex-row items-center gap-[5px]">
            <button
              className="multiplier-btn w-[50px] h-[40px] !text-[#000000] !bg-[#fee77f] shadowtoonButton"
              onClick={() => handleBetAmountChange(-5)}
            >
              -5
            </button>
            <span className="bet-amount">{betAmount}</span>
            <button
              className="multiplier-btn w-[50px] h-[40px] !text-[#000000] !bg-[#fee77f] shadowtoonButton"
              onClick={() => handleBetAmountChange(5)}
            >
              +5
            </button>
          </div>
        </div>
      </div>

      <button
        className="spin-btn !bg-[#48ef9d] shadowtoonButton !text-[#000000]"
        onClick={handleSpinClick}
        disabled={mustSpin || isSpinning}
      >
        {isSpinning ? 'SPINNING...' : 'SPIN NOW'}
      </button>

      {/* Display message only after the spin is completed */}
      {win !== null && (
        <div className="result-message popup !block !opacity-[1]">
          {win ? (
            <div className="w-[70%] m-auto">
              <Image alt="flappy" src={trophy} />
            </div>
          ) : (
            <div className="text-center w-full p-[20px] flex justify-center">
              <Image alt="sad" src={flappySad} />
            </div>
          )}
          <p className="text-[20px] py-[20px]">{message}</p>
          <Button
            className="spin-btn !bg-[#fee77f] shadowtoonButton !text-[#000000] !font-bold"
            onClick={setPopupclose}
          >
            SPIN AGAIN
          </Button>
        </div>
      )}
    </div>}
    </>
  );
};

export default SpinWheelWithBetting;

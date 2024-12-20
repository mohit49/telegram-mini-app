import React, { useState } from 'react';
import head from "@/public/coinflip/head.png";
import tails from "@/public/coinflip/tails.png";
import Image from 'next/image';
import splash from "@/public/coinflip/splash.png";
type BetMultiplier = 0.5 | 1 | 1.5 | 2;

interface CoinFlipProps {
  initialBet: number;
}

const CoinFlipGame: React.FC<CoinFlipProps> = ({ initialBet }) => {
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails'>('heads');
  const [betMultiplier, setBetMultiplier] = useState<BetMultiplier>(1);
  const [betAmount, setBetAmount] = useState<number>(10); // Default bet amount is 10
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [playerBalance, setPlayerBalance] = useState(500);
  const [flipResult, setFlipResult] = useState<'heads' | 'tails' | null>(null); // To store the result of the flip
  const [winningAmount, setWinningAmount] = useState<number | null>(null); // To store the winning amount
  const [totalWinnings, setTotalWinnings] = useState<number>(0); // New state to track total winnings
  const [play, setPlay] = useState<boolean>(false);
  // Predefined bet amounts
  const betAmounts = [1, 10, 20, 50];

  const handleFlip = () => {
    if (isFlipping || betAmount > playerBalance) return; // Cannot flip if already flipping or if insufficient balance

    setIsFlipping(true);

    // Coin flip outcome based on the user's selection
    const userWinChance = 0.4; // 40% chance of winning
    const outcome = Math.random() < userWinChance ? selectedSide : (selectedSide === 'heads' ? 'tails' : 'heads');

    setTimeout(() => {
      // Determine win/loss based on outcome
      const didWin = selectedSide === outcome;
      setFlipResult(outcome); // Set the result of the flip to show inside the coin
      const winAmount = didWin ? betAmount * betMultiplier : 0;
      setWinningAmount(winAmount); // Set the winning amount or 0 if lost

      setResult(didWin ? `You win!` : `You lose.`);
      setPlayerBalance(prev => (didWin ? prev + winAmount : prev - betAmount));

      // Update total winnings (if win, add; if lose, subtract)
      setTotalWinnings(prevTotal => prevTotal + (didWin ? winAmount : -betAmount));

      setIsFlipping(false); // Stop the flip animation
    }, 2500); // Adjust the timeout duration to simulate the flip (reduced for demonstration)
  };

  const handleBetMultiplierChange = (multiplier: BetMultiplier) => {
    setBetMultiplier(multiplier);
  };

  const handleSideSelect = (side: 'heads' | 'tails') => {
    setSelectedSide(side);
  };

  const handleBetAmountChange = (amount: number) => {
    setBetAmount(amount);
  };

  const handleBetAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(Number(e.target.value));
  };

  const increaseBetByFive = () => {
    setBetAmount(prevBet => prevBet + 5); // Increase bet by 5
  };

  const decreaseBetByFive = () => {
    setBetAmount(prevBet => Math.max(prevBet - 5, 1)); // Decrease bet by 5 but ensure it doesn't go below 1
  };

  const increaseMultiplierByHalf = () => {
    if (betMultiplier < 2) {
      setBetMultiplier(prevMultiplier => (prevMultiplier + 0.5) as BetMultiplier);
    }
  };

  const decreaseMultiplierByHalf = () => {
    if (betMultiplier > 0.5) {
      setBetMultiplier(prevMultiplier => (prevMultiplier - 0.5) as BetMultiplier);
    }
  };
  const playfunctionality =()=>{
    setPlay(true)
  }

  return (
   <>
   {!play && <div className='fixed w-full h-full left-0 top-0 bg-[#80b1fe]' ><Image onClick={playfunctionality} alt="coin flips" src={splash} className='h-full object-cover'/></div>}
    {play && <div className="coin-flip-game bg-[#98e2ff] w-full !justify-between">
      <div className='flex flex-row justify-between w-full px-[20px]'>
        <div className="balance ">
          <p className='text-[30px] font-bold text-[#ff68b9] m-0'>{playerBalance} TON</p>
        </div>
        <div> <p className='text-[30px] font-bold text-[#ff68b9] m-0'>{totalWinnings} TON</p></div>
      </div>
      <div className='winig-info min-h-[60px]'>
        {result && <div className="result text-[30px] !m-0">{result}</div>}

        {winningAmount !== null && (
          <div className="winning-amount font-bold text-[#ff68b9] text-[20px]">
            {winningAmount > 0 ? (
              <p>You won: {winningAmount} TON</p>
            ) : (
              <p>You lost: {betAmount} TON</p>
            )}
          </div>
        )}
      </div>
      <div className='relative h-[200px] w-[200px] flex'>
        <div className={(isFlipping ? "coin-flip-animation blurMt" : "static-coin") + " " + "coin-creative"}>
          <div className="coin w-full h-full">
            {isFlipping && (
              <div className='coinanimation'>
                <Image
                  className="coin-head side"
                  src={head}
                  alt="Heads"
                  style={{ zIndex: flipResult === 'heads' ? 2 : 1 }} // Higher z-index for heads
                />
                <Image
                  className="coin-tail side"
                  src={tails}
                  alt="Tails"
                  style={{ zIndex: flipResult === 'tails' ? 2 : 1 }} // Higher z-index for tails
                />
              </div>
            )}
            {!isFlipping && (
              <Image
                className="coin-side"
                src={flipResult === 'heads' ? head : tails}
                alt="gg"
              />
            )}
          </div>
        </div>
      </div>
      <div className="side-selection flex flex-row gap-0 w-full justify-center rounded-xl overflow-hidden ">
        <button
          className={(selectedSide === 'heads' ? 'selected bg-[#82fec2] text-[#1b9759] border-[#02d0ad] ' : 'border-r-0') + " " + "m-0 px-[20px] text-[20px] rounded-none rounded-l-[10px]"}
          onClick={() => handleSideSelect('heads')}
        >
          HEAD
        </button>
        <button
          className={(selectedSide === 'tails' ? 'selected text-[#1b9759] bg-[#82fec2] border-[#3088f7]' : 'border-l-0 bg-[#ffffff]') + " " + "m-0 px-[20px] text-[20px] rounded-none rounded-r-[10px]"}
          onClick={() => handleSideSelect('tails')}
        >
          TAILS
        </button>
      </div>
      <div className='bottom-area bg-[#ff68b9] w-full overflow-x-hidden overflow-y-hidden mt-[20px] rounded-t-[30px]'>
        <div className='flex-row flex justify-center gap-[10px]'>
          <div className="bet-options pt-3">
            <p className='font-bold !text-[25px] m-0 !text-[#ffffff]'> Bet </p>
            <div className="bet-controls flex items-center flex-row">
              <button onClick={decreaseBetByFive} className='bg-[#ffe980] border-none rounded-lg text-[#000000] font-bold !text-[30px] leading-[100%] p-0 !w-[40px] !h-[40px] shadowtoonButton'>-</button>
              <input className='w-[60px] h-[40px] p-2 !rounded-lg text-[20px] font-bold shadowtoonButton'
                type="number"
                value={betAmount}
                onChange={handleBetAmountInputChange}
                min="1"
              />
              <button onClick={increaseBetByFive} className='bg-[#ffe980] border-none rounded-lg text-[#000000] font-bold !text-[30px] leading-[100%] p-0 !w-[40px] !h-[40px] shadowtoonButton'>+</button>
            </div>
          </div>

          <div className="bet-options pt-3">
            <p className='font-bold !text-[25px] !text-[#ffffff] m-0 '> Multiplier</p>
            <div className="multiplier-controls flex flex-row items-center">
              <button onClick={decreaseMultiplierByHalf} className='bg-[#ffe980] border-none rounded-lg text-[#000000] font-bold !text-[30px] leading-[100%] p-0 !w-[40px] !h-[40px] shadowtoonButton'>-</button>
              <input className='w-[60px] h-[40px] p-2 !rounded-lg text-[20px] font-bold shadowtoonButton'
                type="number"
                value={betMultiplier}
                readOnly
              />
              <button className='bg-[#ffe980] border-none rounded-lg text-[#000000] font-bold !text-[30px] leading-[100%] p-0 !w-[40px] !h-[40px] shadowtoonButton' onClick={increaseMultiplierByHalf}>+</button>
            </div>
          </div>
        </div>



        <button className="shadowtoonButton bg-[#ffe980] border-none rounded-lg !text-[25px] mt-[25px] w-[250px] mb-[50px] py-[10px]" onClick={handleFlip} disabled={isFlipping}>
          Flip Doodle
        </button>



       {// <div className="total-winnings">
         // <p>Total Winnings: {totalWinnings} TON</p>
        //</div>
       }
      </div>
    </div>}
    </> 
  );
};

export default CoinFlipGame;

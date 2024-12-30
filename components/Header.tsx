import React, { useState } from "react";
import { motion } from "framer-motion";
import logoImg from "@/public/logo.png";
import DimondIcon from "@/public/dimond.png";
import Doodle from "@/public/doodle-coin.png";
import Image from "next/image";
import QrCode from "@/public/QR-code.png"
import { CopyIcon, DepositeIcon, DownArrow, LocIcon, TonIcon, Withdraw } from "@/utils/icons";
import { useGlobalContext } from "@/pages/_app";
import { Button } from "@/components/ui/button"
// Define the props for the Header component
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
interface HeaderProps {
  userData: any; // userData can be UserData or null
}


const Header: React.FC<HeaderProps> = () => {
  const { userData, walletBalance } = useGlobalContext();
  const [isActive, setIsActive] = useState<boolean>(false); // State with explicit type
  const [textToCopy, setTextToCopy] = useState("UQANEMrGMg5QK4F7njbsc1pdMmZO2pFdYKlFLBCE2Z-oy8UC");
  const [copySuccess, setCopySuccess] = useState(false);
  // Function to toggle the account details visibility
  const toggleClass = (): void => {
    setIsActive((prevState) => !prevState);
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopySuccess(true);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        setCopySuccess(false);
      });
  };
  return (
    <header className="w-full bg-[#ffa4d5] py-0 px-0 m-0 z-[35]">
      <div className="relative p-0 m-0 flex flex-row py-3 px-3 justify-between items-center">
        {/* Logo Section */}
        <div className="logo w-[60px]">
          <Image className="h-[35px] w-[auto]" src={logoImg} alt="Logo" />
        </div>

        {/* Account Section */}
        <div className="w-auto flex flex-row gap-3 items-center">
        
         
          <div
            className="flex flex-row items-center gap-2"
            onClick={toggleClass}
          >
            <span className="flex flex-row gap-0 relative items-center">  <Image className="h-[35px] w-[35px] p-[8px] rounded-[50px] bg-[#c4c5fe] object-cover " src={logoImg} alt="Logo" /> <div className="ml-[-15px]"><TonIcon/> </div><Image className="h-[35px]  w-[35px] object-cover ml-[-15px]" src={DimondIcon} alt="Logo" /></span>
           
            <DownArrow />
          </div>
        </div>
      </div>

      {/* Dropdown Section */}
     
        <div className={`leaderboard overflow-hidden bg-[#ffa4d5]  ${
          isActive ? "h-[auto] border-t border-white pt-2" : "h-[0px]"
        } transition-all duration-300 ease-in-out px-3`}
        >
           <div className="flex flex-row justify-between mb-0 py-2">
            <div className="flex flex-row items-center gap-2">
            <Image className="h-[35px] w-[35px] object-cover " src={Doodle} alt="Dimond" />
             
              <p className="text-[#000000] font-bold">$DOODLE </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-[#000000] font-bold">0</p>
            </div>
          </div>
          <div className="flex flex-row justify-between mb-0 py-2">
            <div className="flex flex-row items-center gap-2">
            <TonIcon />
              <p className="text-[#000000] font-bold">$TON</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-[#000000] font-bold">{walletBalance}</p>
            </div>
          </div>
         
          <div className="flex flex-row justify-between mb-0 py-2">
            <div className="flex flex-row items-center gap-2">
            <Image className="h-[35px] w-[35px] object-cover " src={DimondIcon} alt="Dimond" />
              <p className="text-[#000000] font-bold">DIAMONDS</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-[#000000] font-bold">{userData?.credit}</p>
            </div>
          </div>
<div className=" flex flex-row gap-7 mb-4">
          <Drawer>
      <DrawerTrigger asChild>
        <Button className="deposit  !rounded-[0] h-[50px] mt-4 mb-4 ml-auto !rounded-[10px] mr-auto w-[95%]  !bg-[#83fec1] !flex items-center justify-center !font-bold !text-[20px] !p-4 leading-4 hard-shadow"> <span className="text-[#000000] leading-4 !font-bold inline-block">DEPOSIT</span></Button>
      </DrawerTrigger>
   
      <DrawerContent >
        <div className="flex justify-center flex-col w-[100%] text-center items-center gap-4 pt-5">
        <div className="ico w-[70px] m-auto text-center flex justify-center items-center"><span className="!bg-[#80b1fe] h-[60px] w-[60px] rounded-[50px]  p-2 flex items-center justify-center"><DepositeIcon/></span></div>
        <h2 className="text-[30px] font-bold">Deposit</h2>
        <div className="w-[200px] h-[200px] m-8"> <Image className="w-[100%] object-cover " src={QrCode} alt="Dimond" /></div>
       
        <div className="flex flex-row justify-between w-[100%]  px-4 items-center">
         <div className="text-left font-bold" onClick={handleCopyClick}> <h4>Address</h4>
         <p>UQANEMr...-oy8UC</p></div>
         <div className="font-bold bg-[#dceaff] rounded-lg p-1 relative">
          {copySuccess && <span className="absolute">{copySuccess}</span>}
          <CopyIcon/>
          </div>
        </div>
        <div className="font-bold w-[80%] text-[12px]">Please carefully send your $Doodles or $TON to
        this address.</div>
        </div>
     <br/>
     <br/>
        </DrawerContent>
      
    </Drawer>
    <Button className="deposit  !rounded-[0] h-[50px] mt-4 mb-4 ml-auto !rounded-[10px] mr-auto w-[95%]  !bg-[#ffffff] !flex items-center justify-center !font-bold !text-[20px] !p-4 leading-4 hard-shadow"> <span className="text-[#000000] leading-4 !font-bold inline-block">WITHDRAW</span></Button>

    </div>
        </div>
     

    </header>
  );
};

export default Header;

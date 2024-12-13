import React, { useState } from "react";
import { motion } from "framer-motion";
import logoImg from "@/public/logo.png";
import DimondIcon from "@/public/dimond.png";
import Doodle from "@/public/doodle-coin.png";
import Image from "next/image";
import { CopyIcon, DepositeIcon, DownArrow, LocIcon, QrCode, TonIcon, Withdraw } from "@/utils/icons";
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
  const { userData } = useGlobalContext();
  const [isActive, setIsActive] = useState<boolean>(false); // State with explicit type

  // Function to toggle the account details visibility
  const toggleClass = (): void => {
    setIsActive((prevState) => !prevState);
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
             
              <p className="text-[#000000] font-bold">Doodle</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-[#000000] font-bold">20</p>
            </div>
          </div>
          <div className="flex flex-row justify-between mb-0 py-2">
            <div className="flex flex-row items-center gap-2">
            <TonIcon />
              <p className="text-[#000000] font-bold">TON</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-[#000000] font-bold">0</p>
            </div>
          </div>
         
          <div className="flex flex-row justify-between mb-0 py-2">
            <div className="flex flex-row items-center gap-2">
            <Image className="h-[35px] w-[35px] object-cover " src={DimondIcon} alt="Dimond" />
              <p className="text-[#000000] font-bold">Diamonds</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-[#000000] font-bold">{userData?.credit}</p>
            </div>
          </div>

          <Drawer>
      <DrawerTrigger asChild>
        <Button className="deposit  !rounded-[0] h-[50px] mt-4 mb-4 ml-auto mr-auto w-[95%]  !bg-[#83fec1] !flex items-center justify-center !font-bold !text-[20px] !p-4 leading-4"> <span className="text-[#000000] leading-4 !font-bold inline-block">Deposit / Withdraw</span></Button>
      </DrawerTrigger>
      <DrawerContent>
     <div className="flex flex-row justify-center ">
     <Drawer>
     <DrawerTrigger className="text-left flex flex-row gap-4 p-4 items-center">
      <div className="ico"><span className="!bg-[#80b1fe] h-[60px] w-[60px] rounded-[50px]  p-4 flex items-center justify-center"><DepositeIcon/></span></div>
      <div className="content">
    
    
      <h2 className="text-[28px] font-bold text-[#000000] font-bold">Deposit</h2>
      <p className="text-[14px] text-[#000000] font-bold">Securely deposit $TON into your account to start exploring.</p>
    
  
       
      </div>
      </DrawerTrigger>
      <DrawerContent >
        <div className="flex justify-center flex-col w-[100%] text-center items-center gap-4 pt-5">
        <div className="ico w-[70px] m-auto text-center flex justify-center items-center"><span className="!bg-[#80b1fe] h-[50px] w-[50px] rounded-[50px]  p-4 flex items-center justify-center"><DepositeIcon/></span></div>
        <h2 className="text-[30px] font-bold">Deposit</h2>
        <div className="bg-[#ffa4d5] w-[200px] h-[200px] m-8"><QrCode/></div>
        <div className="flex flex-row justify-between w-[100%]  px-4 items-center">
         <div className="text-left font-bold"> <h4>Address</h4>
         <p>0Q0TM...284ht</p></div>
         <div className="font-bold"><CopyIcon/></div>
        </div>
        <div className="flex flex-row justify-between w-[100%]  px-4 items-center">
         <div className="text-left font-bold"> <h4>Address</h4>
         <p>0Q0TM...284ht</p></div>
         <div className="font-bold"><CopyIcon/></div>
        </div>
        </div>
     <br/>
     <br/>
        </DrawerContent>
        </Drawer>
     </div>
     <hr/>
     <div className="flex flex-row justify-center gap-4 p-4 items-center">
      <div className="ico"><span className="!bg-[#80b1fe] h-[60px] w-[60px] rounded-[50px]  p-4 flex items-center justify-center"><Withdraw/></span></div>
      <div className="content">
        <h2 className="text-[28px] font-bold text-[#000000]">Withdraw</h2>
        <p className="text-[14px] text-[#000000] font-bold">Withdraw assets to your wallet instantly and safely.</p>
      </div>
     </div>
      </DrawerContent>
    </Drawer>
        </div>
     

    </header>
  );
};

export default Header;

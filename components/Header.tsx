import React, { useState } from "react";
import { motion } from "framer-motion";
import logoImg from "@/public/logo.png";
import Image from "next/image";
import { CopyIcon, DepositeIcon, DownArrow, LocIcon, QrCode, TonIcon, Withdraw } from "@/utils/icons";
import { Button } from "@/components/ui/button"
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
const Header: React.FC = () => {
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
          <Image className="h-[50px] w-[auto]" src={logoImg} alt="Logo" />
        </div>

        {/* Account Section */}
        <div className="w-auto flex flex-row gap-3 items-center">
          <p className="text-[20px] font-medium">$0</p>
          <LocIcon />
          <div
            className="flex flex-row items-center gap-2"
            onClick={toggleClass}
          >
            <TonIcon />
            <DownArrow />
          </div>
        </div>
      </div>

      {/* Dropdown Section */}
     
        <div className={`leaderboard overflow-hidden bg-[#fc4eac] ${
          isActive ? " h-[60px]" : "h-[0px]"
        } transition-all duration-300 ease-in-out px-3`}
        >
          <div className="flex flex-row justify-between mb-3 py-3">
            <div className="flex flex-row items-center gap-2">
              <TonIcon />
              <p className="text-[#ffffff] font-bold">#TON</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-[#ffffff] font-bold">0</p>.<p>$0</p>
            </div>
          </div>
          <hr />
        </div>
     
      <Drawer>
      <DrawerTrigger asChild>
        <Button className="deposite fixed !rounded-[50px] h-[50px] w-[50px] bottom-[85px] right-[10px] !bg-[#80b1fe] flex items-center justify-center !font-bold !text-[40px]"> <span className="text-[#000000] !font-bold">+</span></Button>
      </DrawerTrigger>
      <DrawerContent>
     <div className="flex flex-row justify-center ">
     <Drawer>
     <DrawerTrigger className="text-left flex flex-row gap-4 p-4 items-center">
      <div className="ico"><span className="!bg-[#80b1fe] h-[60px] w-[60px] rounded-[50px]  p-4 flex items-center justify-center"><DepositeIcon/></span></div>
      <div className="content">
    
    
      <h2 className="text-[28px] font-bold">Deposite</h2>
      <p className="text-[14px]">Securely deposit $TON into your account to start exploring.</p>
    
  
       
      </div>
      </DrawerTrigger>
      <DrawerContent >
        <div className="flex justify-center flex-col w-[100%] text-center items-center gap-4">
        <div className="ico w-[70px]"><span className="!bg-[#80b1fe] h-[50px] w-[50px] rounded-[50px]  p-4 flex items-center justify-center"><DepositeIcon/></span></div>
        <h2 className="text-[30px] font-bold">Deposite</h2>
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
        <h2 className="text-[28px] font-bold">Withdraw</h2>
        <p>Securely deposit $TON into your account to start exploring.</p>
      </div>
     </div>
      </DrawerContent>
    </Drawer>
    </header>
  );
};

export default Header;

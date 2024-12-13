import React, { useState } from "react";
import { motion } from "framer-motion";
import logoImg from "@/public/logo.png";
import Image from "next/image";
import { CopyIcon, DepositeIcon, DownArrow, LocIcon, QrCode, TonIcon, Withdraw } from "@/utils/icons";
import { useGlobalContext } from "@/pages/_app";
// Define the props for the Header component

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
          <p className="text-[20px] font-medium">$0</p>
         
          <div
            className="flex flex-row items-center gap-2"
            onClick={toggleClass}
          >
            <span className="flex flex-row gap-0 relative items-center">  <Image className="h-[40px] w-[40px] p-[8px] rounded-[50px] bg-[#c4c5fe] object-cover " src={logoImg} alt="Logo" /> <div className="ml-[-15px]"><TonIcon/></div></span>
           
            <DownArrow />
          </div>
        </div>
      </div>

      {/* Dropdown Section */}
     
        <div className={`leaderboard overflow-hidden bg-[#fc4eac] ${
          isActive ? "h-[auto]" : "h-[0px]"
        } transition-all duration-300 ease-in-out px-3`}
        >
           <div className="flex flex-row justify-between mb-0 py-3">
            <div className="flex flex-row items-center gap-2">
              <TonIcon />
              <p className="text-[#000000] font-bold">Doodle</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-[#000000] font-bold">20</p>
            </div>
          </div>
          <div className="flex flex-row justify-between mb-0 py-3">
            <div className="flex flex-row items-center gap-2">
              <TonIcon />
              <p className="text-[#000000] font-bold">#TON</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-[#000000] font-bold">0</p>.<p>$0</p>
            </div>
          </div>
         
          <div className="flex flex-row justify-between mb-0 py-3">
            <div className="flex flex-row items-center gap-2">
              <TonIcon />
              <p className="text-[#000000] font-bold">Dimonds</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-[#000000] font-bold">{userData?.credit}</p>
            </div>
          </div>
        </div>
     

    </header>
  );
};

export default Header;

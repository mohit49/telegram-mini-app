import React, { useState } from "react";
import { motion } from "framer-motion";
import userImg from "@/public/USER.png"
import shareHand from "@/public/share-hand.png"
import { EarnIcon, GamePad, ViewIcon, CopyIcon , QrCode, Withdraw, ShareIcon, DepositeIcon , Activity } from "@/utils/icons";
import _, { fill } from "lodash";
import games from "@/public/gamebg.png"
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "@/components/Header";
import Image from "next/image";
import Friend from "@/pages/friend";
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



const AppFooter: React.FC = () => {
    const { userData, setUserDate , setTeleUser, teleUser , setTelegram , telegram } = useGlobalContext();

  const router = useRouter();
  return (
    <>
<div className="flex justify-center fixed left-[00px] bottom-[0px] border z-[30] w-[calc(100%)]  bg-white py-2 px-0 border-t bg-[#f5f5f5] ">
<div className="flex flex-row gap- items-center justify-around w-[100%] items-end ">
<Link href={`/`} className="flex flex-col justify-center active-menu">
    <div
      className={
        "gamePad flex flex-col justify-center space-y-1 text-xs h-[55px] text-center rounded-xl items-center " +
        (router.pathname === "/mine"
          ? "text-[#00B2FF]"
          : "text-[#A4A4A4]")
      }
    >
      <div className={(router.pathname === "/"
          ? "active-menu svg-icons mt-[-3px]"
          : "")}>
             <GamePad />
          </div>
      
    
     <div className={"text-center text-[11px] font-bold text-[#000000] m-0 " + (router.pathname === "/"
          ? "text-[#ffa4d5]"
          : "text-[#000000]")}>Games</div>
    </div>
  </Link>
  <Link href={`/`}  className="flex flex-col justify-between">
    <div
      className={
        "gamePad flex flex-col justify-center space-y-1 text-xs h-[55px] text-center rounded-xl items-center " +
        (router.pathname === "/"
          ? "text-[#00B2FF]"
          : "text-[#A4A4A4]")
      }
    >
       <Drawer>
<DrawerTrigger className="text-left flex flex-col gap-0 p-0 items-center justify-center">

<ShareIcon/>
      <div className={"text-center text-[11px] font-bold text-[#aeaeae] m-0" + (router.pathname === "/"
          ? "text-[#00B2FF]"
          : "text-[#A4A4A4]")}>Share</div>
</DrawerTrigger>
<DrawerContent >
<Friend tetegram={telegram} user={teleUser}/>
</DrawerContent>
</Drawer>
    
    </div>
  </Link>
  <Link href={`/`}  className="flex flex-col justify-between">
    <div
      className={
        "gamePad flex flex-col justify-center space-y-1 text-xs h-[55px] text-center rounded-xl items-center " +
        (router.pathname === "/mine"
          ? "text-[#00B2FF]"
          : "text-[#A4A4A4]")
      }
    >
     <ViewIcon/>
      <div className="text-center text-[11px] font-bold text-[#aeaeae] !m-0">Leaderboard</div>
    </div>
  </Link>
  <Link href={`/`}  className="flex flex-col justify-between">
    <div
      className={
        "gamePad flex flex-col justify-center space-y-1 text-xs h-[55px] text-center rounded-xl items-center " +
        (router.pathname === "/mine"
          ? "text-[#00B2FF]"
          : "text-[#A4A4A4]")
      }
    >
     <Activity/>
      <div className="text-center text-[11px] font-bold text-[#aeaeae] !m-0">Activity</div>
    </div>
  </Link>
    <div
      className={
        "gamePad flex flex-col justify-center space-y-1 text-xs h-[55px] text-center rounded-xl items-center " +
        (router.pathname === "/mine"
          ? "text-[#00B2FF]"
          : "text-[#A4A4A4]")
      }
    >
  
      <div className="text-center text-[11px] font-bold text-[#aeaeae] m-0"> 
   
<EarnIcon/>
Earn

     </div>
    </div>
 
</div>
</div>
</>
  );
};

export default AppFooter;






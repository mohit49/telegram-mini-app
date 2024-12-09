"use client";

import React, { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import axios from "@/app/axios";
import { updateItem } from "../app/lib/api";
import * as idleAnim from "../app/animations/Ghost_Idle.json";
import * as eatAnim from "../app/animations/Ghost_Eat.json";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setMountStore } from "@/redux/reducers/TaskReducer";
import fs from "fs";
import path from "path";
import Link from "next/link";
import Header from "@/components/Header";
import Image from "next/image";
import announcmnt from "@/public/announcment.png"
import games from "@/public/gamebg.png"
import flappy from "@/public/flppy.png"
import funGames from "@/public/fungames.png"
import gm2 from "@/public/gamebg-card.png"
import gm3 from "@/public/raceing.png"
import gm4 from "@/public/crdwe.png"
import { EarnIcon, GamePad, ViewIcon, CopyIcon , QrCode, DepositeIcon, Withdraw } from "@/utils/icons";
import { fill } from "lodash";
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
interface Game {
  level: number;
  name: string;
  mount: number;
}

interface Data {
  games: Game[];
}

interface IndexProps {
  data: Data;
}

const Index: React.FC<IndexProps> = ({ data }) => {
  const dispatch = useDispatch();
  const user = useSelector((x: any) => x.TaskReducer.user);
  const [count, setCount] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [Games, setGames] = useState<Game[]>(data.games);
  const [mount, setMount] = useState<number>(1000);
  const [lvlcoin, setlvlcoin] = useState<number>(5000);
  const [tap, settap] = useState<number>(1);
  const [alert, setalert] = useState<number>(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [pulses, setPulses] = useState([]);
  const router = useRouter();
  const userFromQuery = router.query.user?.toString() || "";
  const [openGame, setOpenGame] = useState(false);

  const getMountBylevel = (level: number): number | number => {
    const item = Games.find((item: Game) => item.level === level);
    return item ? item.mount : 0;
  };

  const defaultOption = {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const animsOption = {
    ...defaultOption,
    animationData: showAnimation ? eatAnim : idleAnim,
  };

  const handleChange = () => {
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
    }, 500);
  };
  const getLevelInfo = () => {
    switch (Math.floor(count / 20)) {
      case 0:
        return { text: "Rookie", number: 1, image: "/images/lvl-1-rookie.png" };
      case 1:
        return { text: "Bronze", number: 2, image: "/images/lvl-2-bronze.png" };
      case 2:
        return { text: "Silver", number: 3, image: "/images/lvl-3-silver.png" };
      case 3:
        return { text: "Gold", number: 4, image: "/images/lvl-4-gold.png" };
      case 4:
        return {
          text: "Platinum",
          number: 5,
          image: "/images/lvl-5-platinum.png",
        };
      case 5:
        return {
          text: "Diamond",
          number: 6,
          image: "/images/lvl-6-diamond.png",
        };
      case 6:
        return { text: "Master", number: 7, image: "/images/lvl-7-master.png" };
      case 7:
        return {
          text: "Grand Master",
          number: 8,
          image: "/images/lvl-8-grand-master.png",
        };
      case 8:
        return { text: "Lord", number: 9, image: "/images/lvl-9-lord.png" };
      default:
        return {
          text: "Legendary",
          number: 10,
          image: "/images/lvl-10-legendary.png",
        };
    }
  };

  const handleIncrement = (event: React.MouseEvent<HTMLDivElement>) => {
    let payload: any = [...pulses];
    payload.push(0);
    setPulses(payload);
    const { userAgent } = window.navigator;
    // if (!user || !userAgent.includes("Mobi")) return;
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
    setalert(0);
    if (mount < tap) return;
    setalert(1);
    const newCount: number = count + tap;
    setCount(newCount);
    setMount(mount - tap);
    if (!showAnimation) handleChange();
    try {
      dispatch(setMountStore(newCount));
      updateItem(user, newCount);
    } catch (error) {
      console.error("Failed to update item", error);
    }
  };
  useEffect(() => {
    if (mount < 1000) {
      const intervalId = setInterval(() => {
        setMount((prevMount) => Math.min(prevMount + 1, 1000));
      }, 1500);

      return () => clearInterval(intervalId);
    }
  }, [mount]);

  useEffect(() => {
    if (userFromQuery) {
      const func = async () => {
        const { data } = await axios.post("/users", { user: userFromQuery });
        dispatch(setUser(data.user));
      };
      func();
    }
  }, [userFromQuery]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const { data } = await axios.get("/users");
        const item = data.find((item: any) => item.tgid === user);
        dispatch(setMountStore(item?.mount));
        setCount(item?.mount | 0);
        setProfit(item?.profit | 0);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    settap(getLevelInfo().number);
  }, [count]);

  useEffect(() => {
    const mountValue = getMountBylevel(tap);
    setlvlcoin(mountValue);
  }, [tap]);

  useEffect(() => {
    if (profit > 0) {
      const intervalTime = (3600 / profit) * 1000;

      const interval = setInterval(() => {
        setCount((prevCount) => {
          const newCount = prevCount + 1;
          dispatch(setMountStore(newCount)); // Update Redux store with the new count
          return newCount;
        });
      }, intervalTime);

      return () => clearInterval(interval);
    }
  }, [profit, dispatch]);


  return (

    <>
       <Header/>
       <div>
        
       </div>
   <div className="flex-row flex justify-around p-2 h-[6vh]">
    <p>  <Image className="h-[25px] w-[35px]" src={announcmnt} alt="Logo" /></p><p className="font-bold">mohit_sh earn        3,500 in Racing</p>
    <p>  <Image className="h-[25px] w-[35px] transform scale-x-[-1]" src={announcmnt} alt="Logo" /></p>
   </div>
<div className="h-[75vh] overflow-scroll">
   <div className="games gap-3 px-3 flex flex-row mt-3">
    <div className="w-[50%]"  >
  <Link   href={`/flappygame`} className="rounded-[10px] overflow-hidden block"> <Image className="h-[auto] w-[100%]" src={flappy} alt="Logo" /></Link> 

    </div>
    <div className="w-[50%]">
    <Image className="h-[auto] w-[100%]" src={gm2} alt="Logo" />

    </div>
   </div>
   <div className="games gap-3 px-3 flex flex-row mt-3">
    <div className="w-[50%]">
    <Image className="h-[auto] w-[100%]" src={gm3} alt="Logo" />

    </div>
    <div className="w-[50%]">
    <Image className="h-[auto] w-[100%]" src={gm4} alt="Logo" />

    </div>
   </div>



   <div className="games gap-3 px-3 flex flex-row mt-3">
    <div className="w-[100%]">
    <Image className="h-[auto] w-[100%]" src={funGames} alt="Logo" />

    </div>
   
   </div>
     <Drawer>
      <DrawerTrigger asChild>
        <Button className="deposite  !rounded-[10px] h-[50px] mt-4 ml-auto mr-auto w-[95%]  !bg-[#80b1fe] !flex items-center justify-center !font-bold !text-[20px] !p-4 leading-4"> <span className="text-[#ffffff] leading-4 !font-bold inline-block">Deposite / Withdraw</span></Button>
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
        <h2 className="text-[28px] font-bold text-[#000000]">Withdraw</h2>
        <p className="text-[#000000] font-bold">Securely deposit $TON into your account to start exploring.</p>
      </div>
     </div>
      </DrawerContent>
    </Drawer>

    <div className="p-4">
      <h2 className="text-[28px] font-bold">Live Stats</h2>
      <div className="board-con bg-[#f5f5f5] p-[10px] rounded-[10px]">
      <div className="flex flex-row justify-between mb-0 py-3 ">
            <div className="flex flex-row items-center gap-2">
            😊
              <p className="text-[#000000] font-bold">Mohit_12345</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-[#000000] font-bold ">Dicing</p>.<p  className="text-[#358103] w-[90px] text-right">600</p>
            </div>
          </div>
          <hr/>
          <div className="flex flex-row justify-between mb-0 py-1">
            <div className="flex flex-row items-center gap-2">
            😊
              <p className="text-[#000000] font-bold">Mohit_12345</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-[#000000] font-bold ">Dicing</p>.<p className="text-[#358103] w-[90px] text-right">6</p>
            </div>
          </div>
<hr/>
          <div className="flex flex-row justify-between mb-0 py-1">
            <div className="flex flex-row items-center gap-2">
            😊
              <p className="text-[#000000] font-bold">Mohit_12345</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-[#000000] font-bold ">Dicing</p>.<p className="text-[#ff0505] w-[90px] text-right">-6</p>
            </div>
          </div>
      </div>
    </div>
   </div>
 
   <div className="flex justify-center fixed left-[00px] bottom-[0px] border z-[30] w-[calc(100%)] h-[10vh] bg-white py-3 px-4 border-t bg-[#f5f5f5] ">
        <div className="flex flex-row gap-8 items-center justify-between w-[100%] ">
        <Link href={`/`}>
            <div
              className={
                "gamePad flex flex-col justify-center space-y-1 text-xs h-[64px] text-center rounded-xl items-center " +
                (router.pathname === "/mine"
                  ? "text-[#00B2FF]"
                  : "text-[#A4A4A4]")
              }
            >
             <GamePad/>
              <div className="text-center text-[16px]">GAMES</div>
            </div>
          </Link>
          <Link href={`/`}>
            <div
              className={
                "gamePad flex flex-col justify-center space-y-1 text-xs h-[64px] text-center rounded-xl items-center " +
                (router.pathname === "/mine"
                  ? "text-[#00B2FF]"
                  : "text-[#A4A4A4]")
              }
            >
             <ViewIcon/>
              <div className="text-center text-[16px]">LEADERBOARD.</div>
            </div>
          </Link>
          <Link href={`/`}>
            <div
              className={
                "gamePad flex flex-col justify-center space-y-1 text-xs h-[64px] text-center rounded-xl items-center " +
                (router.pathname === "/mine"
                  ? "text-[#00B2FF]"
                  : "text-[#A4A4A4]")
              }
            >
             <EarnIcon/>
              <div className="text-center text-[16px]">EARN</div>
            </div>
          </Link>
        </div>
      </div>
    
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), "public", "data.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data: Data = JSON.parse(jsonData);

  return {
    props: {
      data,
    },
  };
};

export default Index;

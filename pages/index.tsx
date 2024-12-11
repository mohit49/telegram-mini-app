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
import flappy from "@/public/flappy-bird.png"
import funGames from "@/public/fungames.png"
import gm2 from "@/public/gamebg-card.png"
import gm3 from "@/public/raceing.png"
import gm4 from "@/public/crdwe.png"
import userImg from "@/public/USER.png"
import shareHand from "@/public/share-hand.png"
import { EarnIcon, GamePad, ViewIcon, CopyIcon , QrCode, Withdraw, ShareIcon, DepositeIcon } from "@/utils/icons";
import { fill } from "lodash";
import { Button } from "@/components/ui/button"
import { useSnackbar } from "notistack";
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
import Friend from "./friend";
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

declare global {
  interface Window {
      Telegram: any;  // or more specific type if you know the shape
  }
}
interface TeleUser {
  username: string;
  // other properties if needed
}

interface UserData {
  tele_id: number;      // Assuming `user.id` is a number
  first_name: string;   // Assuming `user.first_name` is a string
  last_name: string;    // Assuming `user.last_name` is a string
  username: string;     // `user.username` can be a string, or an empty string if not available
  photo_url?: string;   // `photo_url` can be a string or undefined if not available
}


const Index: React.FC<IndexProps> = ({ data }) => {

 
  const router = useRouter();


  const [teleUser, setTeleUser] = useState<TeleUser>();
  const [params, setParams] = useState<any>()
  const [telegram, setTelegram] = useState();
 

  const defaultOption = {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
 
  useEffect(() => {
    // Dynamically load the Telegram Web App script
    const loadTelegramScript = () => {
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-web-app.js";
        script.async = true;
        script.onload = initializeTelegram;
        script.onerror = () => {
            console.error("Failed to load Telegram Web App script.");
        };
        document.body.appendChild(script);
    };

    // Initialize Telegram Web App and fetch user info
    const initializeTelegram = () => {
        if (window?.Telegram) {
            const telegram = window?.Telegram?.WebApp;
            setTelegram(telegram)
            // Notify Telegram that the Mini App is ready
            telegram.ready();
            const user = telegram.initDataUnsafe?.user || null;
            setTeleUser(user);
            // Get user information
            const params = telegram.initDataUnsafe?.start_param || null;
            setParams(params)
          
            if(user){
           const userData =  {"tele_id":user.id,
              "first_name":user.first_name,
              "last_name":user.last_name,
              "username":user.username || "",
              "photo_url":user.photo_url}
            const sendUserData = async (userData:UserData) => {
              try {
                const response = await axios.post('https://app.mazzl.ae/api/telegram-user', userData);
                console.log('User data saved:', response.data);
              } catch (error) {
                console.error('Error saving user data:', error);
              }
            };
            sendUserData(userData);
          }
          if(params) {
            const userId = params.split("_")[0];

            const referrerId = params.split("_")[1];
            const setReffral = async () => {
              try {
                const response = await axios.post('https://app.mazzl.ae/api/referrals', {"userId" : userId , "referrerId" : referrerId});

                
                console.log('User data saved:', response.data);
              } catch (error) {
                console.error('Error saving user data:', error);
              }
            };

            const payload = {
              tele_id: user.id,
              referrerDetails: [
                {
                  tele_id: userId,
                  referId: referrerId
                }
              ]
            };
            
            axios.put('https://app.mazzl.ae/api/telegram-user/update-referrer-details', payload, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
              .then(response => console.log('Response:', response.data))
              .catch(error => {
                if (error.response) console.error('Error Response:', error.response.data);
                else if (error.request) console.error('Error Request:', error.request);
                else console.error('Error:', error.message);
              });
            setReffral()
          }
         
        } else {
            console.error("Telegram Web App is not available.");
        }
    };

    // Check if script is already loaded; if not, load it
    if (!window?.Telegram) {
        loadTelegramScript();
    } else {
        initializeTelegram();
    }
}, []);

  return (

    <>
       <Header/>
       <div className="flex justify-center flex-row py-4">
      <p className="w-[90%] overflow-scroll">  {params}</p>
      {teleUser?.username && ( <p className="w-[90%] m-auto text-center font-b">Hi!  {teleUser?.username}</p>)}
       </div>
   <div className="flex-row flex justify-around p-2 h-[6vh]">
    <p>  <Image className="h-[25px] w-[35px]" src={announcmnt} alt="Logo" /></p><p className="font-bold">mohit_sh earn        3,500 in Racing</p>
    <p>  <Image className="h-[25px] w-[35px] transform scale-x-[-1]" src={announcmnt} alt="Logo" /></p>
   </div>
<div className="h-[auto]">
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
        <Button className="deposit  !rounded-[10px] h-[50px] mt-4 ml-auto mr-auto w-[95%]  !bg-[#80b1fe] !flex items-center justify-center !font-bold !text-[20px] !p-4 leading-4"> <span className="text-[#ffffff] leading-4 !font-bold inline-block">Deposit / Withdraw</span></Button>
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
 
   <div className="flex justify-center fixed left-[00px] bottom-[0px] border z-[30] w-[calc(100%)]  bg-white py-3 px-0 border-t bg-[#f5f5f5] ">
        <div className="flex flex-row gap- items-center justify-around w-[100%] items-end ">
        <Link href={`/`} className="flex flex-col justify-center active-menu">
            <div
              className={
                "gamePad flex flex-col justify-between space-y-1 text-xs h-[55px] text-center rounded-xl items-center " +
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
              
            
             <div className={"text-center text-[13px] font-bold text-[#000000] m-0 " + (router.pathname === "/"
                  ? "text-[#ffa4d5]"
                  : "text-[#000000]")}>GAMES</div>
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
             <ShareIcon/>
              <div className={"text-center text-[13px] font-bold text-[#000000] m-0" + (router.pathname === "/"
                  ? "text-[#00B2FF]"
                  : "text-[#A4A4A4]")}>SHARE</div>
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
              <div className="text-center text-[13px] font-bold text-[#000000] m-0">LEADERBOARD</div>
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
          
              <div className="text-center text-[13px] font-bold text-[#000000] m-0"> 
              <Drawer>
     <DrawerTrigger className="text-left flex flex-col gap-0 p-0 items-center justify-center">
     <EarnIcon/>
     Earn
      </DrawerTrigger>
      <DrawerContent >
     <Friend tetegram={telegram} user={teleUser}/>
        </DrawerContent>
        </Drawer>
             </div>
            </div>
         
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

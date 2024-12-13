"use client";

import React, { useState, useEffect  } from "react";
import { GetStaticProps } from "next";
import { useGlobalContext } from "@/pages/_app";
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
import { EarnIcon, GamePad, ViewIcon, CopyIcon , QrCode, Withdraw, ShareIcon, DepositeIcon , Activity } from "@/utils/icons";
import _, { fill } from "lodash";
import { Button } from "@/components/ui/button"
import { useSnackbar } from "notistack";
import { sendUserData, updateReferralDetails, updateRefferedBy , fetchTelegramUser , updateRefferedUnlock, updateCredit } from "@/utils/api";
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
import SwiperSlider from "@/components/HomeBanner";
import HomeBanner from "@/components/HomeBanner";
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

interface HeaderProps {
  userData: any; // userData can be UserData or null
}


const Index: React.FC<IndexProps> = ({ data }) => {

  const { userData, setUserDate , setTeleUser, teleUser , setTelegram , telegram } = useGlobalContext();
  const router = useRouter();



  const [params, setParams] = useState<any>()

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
    const initializeTelegram = async () => {
        if (window?.Telegram) {
            const telegram = window?.Telegram?.WebApp;
            setTelegram(telegram)
            // Notify Telegram that the Mini App is ready
            telegram.ready();
           
            // Get user information
            const params = telegram.initDataUnsafe?.start_param || null;
            setParams(params);
            const user = telegram.initDataUnsafe?.user || null;
            const reciverTelegramId = user?.id;
            const data = await fetchTelegramUser(reciverTelegramId);
            if(data.message == "User not found") {
              const userData = {
                tele_id: user?.id,
                first_name: user?.first_name,
                last_name: user?.last_name,
                username: user?.username || "",
                photo_url: user?.photo_url,
                lastLogin:Date.now(),
                refferUnlock: false,
                credit : 0
              };
    
              sendUserData(userData)
                .then((response:any) => {
                  console.log("User data saved:", response);
                  setTeleUser(user);
                  setUserDate(response.user);

                  const newAccouCredit =async()=>{
                    const updatecredit = await updateCredit({
                      userId: userData?.tele_id,
                      credit: {
                          credit: 2, // Ensure correct spelling and structure of field names
                      },
                  });
                  }
                  newAccouCredit();
                })
                .catch((error:any) => {
                  console.error("Error saving user data:", error);
                });
                if(params) {
                  const userId = params.split("_")[0];
  
              const referrerId = params.split("_")[1];

                  updateReferralDetails({
                    tele_id: userId,
                    referrerDetails: [
                      {
                        tele_id: user?.id,
                        referId: referrerId,
                      },
                    ],
                  })
                    .then((response:any) => {
                      console.log("Referral details updated:", response);
                    })
                    .catch((error:any) => {
                      console.error("Error updating referral details:", error);
                    });

                    const refrls = async () => {
                      try {
                        // Update referredBy
                        const referredByResponse = await updateRefferedBy({
                          userId: user?.id,
                          refferedby: {
                            refferedby: userId, // Ensure correct spelling and structure of field names
                          },
                        });
                        console.log("Referral details updated:", referredByResponse);
                        setUserDate(referredByResponse.user);
                        // Update referralUnlock
                        const referralUnlockResponse = await updateRefferedUnlock({
                          userId: user.id,
                          refferUnlock: {
                            refferUnlock: false, // Ensure correct spelling and structure of field names
                          },
                        });
                        console.log("Referral unlock details updated:", referralUnlockResponse);
                      } catch (error) {
                        console.error("Error updating referral details:", error);
                      }
                    };
                    
                    // Call the function
                    refrls();
                }
               
            } else {
              setTeleUser(user);
              setUserDate(data);
              const has24HoursPassed = (lastTimestamp: any) => {
                if (!lastTimestamp) return true; // If no timestamp exists, treat it as expired
                const lastTime = new Date(lastTimestamp).getTime();
                const currentTime = new Date().getTime();
                return currentTime - lastTime >= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
                
            }
              if (has24HoursPassed(data.lastLogin)) {
                const updatecreditScroreofrefferedBy = await updateCredit({
                  userId: userData?.tele_id,
                  credit: {
                      credit: 3, // Ensure correct spelling and structure of field names
                  },
              });     
             
            }


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

       <Header userData={userData}/>
     
   <div className="flex-row flex justify-around p-2 h-[6vh]">
    <p>  <Image className="h-[25px] w-[35px]" src={announcmnt} alt="Logo" /></p><p className="font-bold">mohit_sh earn        3,500 in Racing</p>
    <p>  <Image className="h-[25px] w-[35px] transform scale-x-[-1]" src={announcmnt} alt="Logo" /></p>
   </div>

   {(telegram && teleUser) && <HomeBanner tetegram={telegram} user={teleUser}/> }
<div className="h-[auto] pb-[10vh]">
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
              
            
             <div className={"text-center text-[10px] font-bold text-[#000000] m-0 " + (router.pathname === "/"
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
              <div className={"text-center text-[10px] font-bold text-[#aeaeae] m-0" + (router.pathname === "/"
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
              <div className="text-center text-[10px] font-bold text-[#aeaeae] !m-0">Leaderboard</div>
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
              <div className="text-center text-[10px] font-bold text-[#aeaeae] !m-0">Activity</div>
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
          
              <div className="text-center text-[10px] font-bold text-[#aeaeae] m-0"> 
           
     <EarnIcon/>
     Earn
    
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

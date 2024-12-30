"use client";

import React, { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import { useGlobalContext } from "@/pages/_app";
import { useRouter } from "next/router";
import axios from "@/app/axios";

import fs from "fs";
import path from "path";
import Link from "next/link";
import Header from "@/components/Header";
import Image from "next/image";
import Catching from "@/public/catching.png"
import announcmnt from "@/public/announcment.png"
import funGames from "@/public/fungames.png"
import gm2 from "@/public/spinwheel.png"

import gm4 from "@/public/crdwe.png"
import coinFLip from "@/public/coin.png"


import HomeBanner from "@/components/HomeBanner";
import AppFooter from "@/components/AppFooter";

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
const [onlineUsers , setOnlineUsers] = useState<any>();
  const { userData, setUserDate, setTeleUser, teleUser, setTelegram, telegram , socket } = useGlobalContext();


useEffect(()=>{
  if(socket) {
  socket.on('onlineUserCount', (count: number) => {
    setOnlineUsers(count)
  });
}

})



  return (

    <>

      <Header userData={userData} />

      <div className="flex-row flex justify-around p-2 h-[6vh]">
        <p>  <Image className="h-[25px] w-[35px]" src={announcmnt} alt="Logo" /></p><p className="font-bold">mohit_sh earn        3,500 in Racing</p>
        <p>  <Image className="h-[25px] w-[35px] transform scale-x-[-1]" src={announcmnt} alt="Logo" /></p>
      </div>

      {(telegram && teleUser) && <HomeBanner tetegram={telegram} user={teleUser} />}
      <div className="h-[auto] pb-[10vh]">
        <div className="games gap-3 px-3 flex flex-row mt-3">

          <div className="w-[50%]">
            <Link href={`/spinwheel`} className="rounded-[10px] overflow-hidden block">  <Image className="h-[auto] w-[100%]" src={gm2} alt="Logo" /></Link>

          </div>
          <div className="w-[50%]">
            <Link href={`/coinflip`} className="rounded-[10px] overflow-hidden block">   <Image className="h-[auto] w-[100%]" src={coinFLip} alt="Logo" /></Link>

          </div>
        </div>
        <div className="games gap-3 px-3 flex flex-row mt-3">
          <div className="w-[50%]">
            <Link href={`/catching`} className="rounded-[10px] overflow-hidden block">   <Image className="h-[auto] w-[100%]" src={Catching} alt="Logo" /></Link>

          </div>
          <div className="w-[50%]">
            <Link href={`/lottry`} className="rounded-[10px] overflow-hidden block">   <Image className="h-[auto] w-[100%]" src={gm4} alt="Logo" />
            </Link>
          </div>
        </div>



        <div className="games gap-3 px-3 flex flex-row mt-3">
          <div className="w-[100%]">
            <Link href={`/fungame`} className="rounded-[10px] overflow-hidden block"> <Image className="h-[auto] w-[100%]" src={funGames} alt="Logo" /></Link>


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
                <p className="text-[#000000] font-bold ">Dicing</p>.<p className="text-[#358103] w-[90px] text-right">600</p>
              </div>
            </div>
            <hr />
            <div className="flex flex-row justify-between mb-0 py-1">
              <div className="flex flex-row items-center gap-2">
                😊
                <p className="text-[#000000] font-bold">Mohit_12345</p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <p className="text-[#000000] font-bold ">Dicing</p>.<p className="text-[#358103] w-[90px] text-right">6</p>
              </div>
            </div>
            <hr />
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
          {onlineUsers > 0 && <p className="font-bold py-3 text-center"> {onlineUsers} More user Online Now</p> }
        </div>
      </div>
      <AppFooter />


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

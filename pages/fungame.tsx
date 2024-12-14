"use client";

import React, { useState, useEffect  } from "react";
import { GetStaticProps } from "next";
import { useGlobalContext } from "@/pages/_app";
import Image from "next/image";
import fs from "fs";
import path from "path";
import Link from "next/link";
import Header from "@/components/Header";
import flappy from "@/public/flappy-bird.png"
import _, { fill } from "lodash";
import AppFooter from "@/components/AppFooter";
import gm2 from "@/public/gamebg-card.png"
import soon from "@/public/soon.png"
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



const Fungame: React.FC<IndexProps> = ({ data }) => {

  const { userData, setUserDate , setTeleUser, teleUser , setTelegram , telegram } = useGlobalContext();
  






  return (

    <>

       <Header userData={userData}/>
<div className="w-full px-[10px] py-3">
    <h2 className="font-bold text-center text-[28px]">FUN GAMES</h2>

    <div className="h-[auto] pb-[10vh]">
   <div className="games gap-3  flex flex-row mt-3">
    <div className="w-[50%]"  >
  <Link   href={`/flappygame`} className="rounded-[10px] overflow-hidden block"> <Image className="h-[auto] w-[100%]" src={flappy} alt="Logo" /></Link> 

    </div>
    <div className="w-[50%]">
    <Image className="h-[auto] w-[100%]" src={soon} alt="Logo" />

    </div>
   </div>

   <div className="games gap-3 flex flex-row mt-3">
    <div className="w-[50%]"  >
   <Image className="h-[auto] w-[100%]" src={soon} alt="Logo" />

    </div>
    <div className="w-[50%]">
    <Image className="h-[auto] w-[100%]" src={soon} alt="Logo" />

    </div>
   </div>




   
   </div>
</div>

     <AppFooter/>

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

export default Fungame;

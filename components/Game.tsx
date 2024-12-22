"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FlappyBird from "./FlappyBird";
import Image from "next/image";
import birdTemplet from "@/public/flappy.gif"
import animgif from "@/public/start_animation.gif";
import Footer from "./Footer";
import Background from "./Background";
import useGame from "@/hooks/useGame";
import Pipes from "./Pipes";
import useElementSize from "../hooks/useElementSize";
import NowScore from "./Nowscore";
import _ from "lodash";
import Header from "./Header";
import { useGlobalContext } from "@/pages/_app";
export default function Game() {
  const [splash, setSplash] = useState(true);
  const { handleWindowClick, startGame, isReady, rounds ,homeScreen } = useGame();
  const {gameStatus } = useGlobalContext();
  const [ref, window] = useElementSize();

  useEffect(() => {
    if (window.width > 0 && window.height > 0) {
      startGame(window);
    }
  }, [window, ref]);

  return (
    <motion.main
      layout
      className="relative overflow-x-hidden h-full bg-white select-none"
    >
      <Background />
     
      <motion.div
        ref={ref}
        key={_.last(rounds)?.key || "initial"}
        onTap={handleWindowClick}
        className="h-[calc(100%-184px)] z-10 flex relative overflow-hidden cursor-pointer"
      >
        {isReady && (
          <>
            <div >
           
           {(homeScreen) && <div className="h-[100vh] w-full object-cover fixed z-[100]"><Image src={birdTemplet}   alt="share image" /></div>}
              <NowScore />
              <Pipes />
              <FlappyBird />
            </div>
          </>
        )}
      </motion.div>
      <Footer />
    </motion.main>
  );
}

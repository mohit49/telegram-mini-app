import React from "react";
import useGame from "../hooks/useGame";
import _ from "lodash";

export default function NowScore() {
  const { rounds } = useGame();

  const score = _.last(rounds)?.score || 0;

  return (
    <section>
      <div className="flex justify-center font-extrabold text-white text-5xl w-full z-50 pt-6 absolute">
        <div>{score}</div>
      </div>
     
    </section>
  );
}

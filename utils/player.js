import React, { useState, useEffect } from "react";

export const useAudio = ({url, state}) => {
  const [audio] = useState(new Audio(url));




  useEffect(() => {
    state ? audio.play() : audio.pause();
      // setTimeout(()=>{
      //   audio.play();
      // }, 5000);
    },
    [state]
  );




};


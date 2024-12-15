import React, { useEffect , useState } from "react";

  
const PlinkoGame = () => {

 
  
    return (<div id="canvasHolder]" className="w-[100%] h-[100%] fixed  left-0 top-0 bg-[#450741]"> <canvas id="gameCanvas" width="100%" height="100%"></canvas></div> 
    );
  };
  

  
 

const Plinko: React.FC = () => {
  const [scrtipAdded , SetScrtipAdded] = useState(false);
useEffect(()=>{
  const loadScripts = async () => {
    const scripts = [
      "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js",
      "/plinko/vendor/modernizr-2.6.2.min.js",
      "/plinko/vendor/p2.min.js",
      "/plinko/vendor/detectmobilebrowser.js",
      "/plinko/vendor/createjs.min.js",
      "/plinko/vendor/TweenMax.min.js",
    
      "/plinko/plugins.js",
      "/plinko/sound.js",
      "/plinko/canvas.js",
      "/plinko/p2.js",
      "/plinko/game.js",
      "/plinko/mobile.js",
      "/plinko/loader.js",
      "/plinko/main.js",
    
      "/plinko/init.js",
    ];

    for (const script of scripts) {
      const scriptTag = document.createElement("script");
      scriptTag.src = script;
      scriptTag.async = true;
      document.body.appendChild(scriptTag);

      // Remove script after it's loaded
      scriptTag.onload = () => {
        console.log(`${script} loaded.`);
        SetScrtipAdded(true)
      };
      scriptTag.onerror = () => {
        console.error(`Failed to load ${script}.`);
      };
    }
  };

  loadScripts();

},[])
   
  

  return (
    <>



        <div id="mainLoader" className="w-full h-[100vh] bg-[#450741]  justify-center gap-3 items-center flex-col">
          <img src="/images/plinko/loader.png" alt="Loading..." />
          <br />
          <span className="font-bold">0</span>
        </div>

        {/* Main Content */}
        <div id="mainHolder">
          {/* Browser Not Supported Message */}
          <div id="notSupportHolder">
            <div className="notSupport">
              Your browser isn&apos;t supported.<br />
              Please update your browser in order to run the game.
            </div>
          </div>

          <PlinkoGame/>
        
        </div>
 
    </>
  );
};

export default Plinko;

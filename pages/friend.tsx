import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from "../app/axios";
import { getBonus } from "@/app/lib/api";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import shareHand from "@/public/share-hand.png"
import Topheader from "./Topheader";
import userImg from "@/public/USER.png"
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
interface Item {
  tgid: string;
  mount: number;
  avatar_url: string;
}

type Bonus = {
  friend_value: number;
  premium_value: number;
}

type LevelInfo = {
  text: string;
  number: number;
  image: string;
  lvlcoin: number;
};

function Friend() {
  const user = useSelector((x: any) => x.TaskReducer.user);
  const router = useRouter();
  const userFromQuery = router.query.user?.toString() || "";
  const [items, setItems] = useState<Item[]>([]);
  const [levelbonus, setLevelbonus] = useState<Bonus[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const count = useSelector((x: any) => x.TaskReducer.mount);

  const getLevelInfo = (count: number): LevelInfo => {
    switch (Math.floor(count / 20)) {
      case 0:
        return {
          text: "Rookie",
          number: 1,
          image: "/images/lvl-1-rookie.png",
          lvlcoin: 20,
        };
      case 1:
        return {
          text: "Bronze",
          number: 2,
          image: "/images/lvl-2-bronze.png",
          lvlcoin: 20,
        };
      case 2:
        return {
          text: "Silver",
          number: 3,
          image: "/images/lvl-3-silver.png",
          lvlcoin: 20,
        };
      case 3:
        return {
          text: "Gold",
          number: 4,
          image: "/images/lvl-4-gold.png",
          lvlcoin: 20,
        };
      case 4:
        return {
          text: "Platinum",
          number: 5,
          image: "/images/lvl-5-platinum.png",
          lvlcoin: 20,
        };
      case 5:
        return {
          text: "Diamond",
          number: 6,
          image: "/images/lvl-6-diamond.png",
          lvlcoin: 20,
        };
      case 6:
        return {
          text: "Master",
          number: 7,
          image: "/images/lvl-7-master.png",
          lvlcoin: 20,
        };
      case 7:
        return {
          text: "Grand Master",
          number: 8,
          image: "/images/lvl-8-grand-master.png",
          lvlcoin: 20,
        };
      case 8:
        return {
          text: "Lord",
          number: 9,
          image: "/images/lvl-9-lord.png",
          lvlcoin: 20,
        };
      default:
        return {
          text: "Legendary",
          number: 10,
          image: "/images/lvl-10-legendary.png",
          lvlcoin: 20,
        };
    }
  };

  const levelInfo = getLevelInfo(count);

  const fetchData = async () => {
    if (user) {
      const response = await axios.post("/friends", { user });
      if (response.data.items == undefined) setItems([]);
      else setItems(response.data.items);
    }
  };
  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    getBonus(levelInfo.number).then(res => {
      setLevelbonus(res);
    });
  }, [levelInfo.number]);
  
  const handleInviteClick = async () => {
    // Generate the invite link
    const inviteLink = `$DOODLE - The ONLY Telegram token you need. 🎮 👋
    \n
    Play our games, invite your friends and earn $DOODLE! 👏\n\n
    Got some degen friends? Let them join $DOODLE! Spread the word with us and stack your $DOODLE together.\n\n
    Start your journey to join the $DOODLE gang now 👇\n\n
    https://t.me/DoodleStudio_bot?start=${user}
    `;

    // Show the invite link in a snackbar or modal
    enqueueSnackbar("Invite link copied to clipboard!", { variant: "success" });

    // Copy the link to the clipboard
    const shareLink = `https://t.me/share/url?url=${encodeURIComponent(
      inviteLink
    )}`;

    // Open the share link in a new window
    window.open(shareLink, "_blank");
  };

  const handleMoreBonusesClick = () => {
    router.push({
      pathname: "/earn",
      query: { activeTabState: 1 },
    });
  };

  return (
    <>
 <Image src={shareHand} alt="share image"/>
 <div className="text-center px-3 pb-4 m-auto">
      

   {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="font-medium text-[14px] text-[#DD523A] mt-3 mb-[25px]">
              You haven&apos;t invited anyone yet
            </div>
            <button
           className="!rounded-[15px] !h-[auto]  w-[90%] !bg-[#ffa4d5] leading-5 !py-4 !text-[20px] !font-bold !text-[#000000] shadowtoonButton"
              onClick={handleInviteClick}
            >
              Invite a friend
            </button>
          </div>
        ) : (
          <div className="mb-[100px]">
            {items.map((item, index) => (
              <>
                <div
                  className="flex justify-between bg-white border border-[#E3E3E3] rounded-[10px] py-[10px] px-[15px] mb-[10px]"
                  key={index}
                >
                  <div className="flex items-center">
                    <img
                      src={item.avatar_url || "/images/DefaultAvatar.svg"}
                      className="w-10 h-10 rounded-full"
                      alt="friend-avatar"
                    ></img>
                    <p className="text-[#282828] text-[16px] font-semibold leading-4 ml-[10px]">
                      {item.tgid}
                    </p>
                    <img
                      src={getLevelInfo(item.mount).image}
                      className="w-6 h-6 ml-[10px]"
                      alt=""
                    />
                  </div>
                  <div className="flex items-center">
                    <img
                      src="/images/coin.png"
                      alt="dollar"
                      className="w-5 h-5"
                    ></img>
                    <div className="font-semibold text-[16px] text-[#282828] ml-1">
                      {item.mount}
                    </div>
                  </div>
                </div>
              </>
            ))}
            <div className="flex justify-center">
            <Button onClick={handleInviteClick} className="!rounded-[15px] !h-[auto]  w-[90%] !bg-[#ffa4d5] leading-5 !py-4 !text-[20px] !font-bold !text-[#000000] shadowtoonButton">Share Link</Button>
           
            </div>
          </div>
        )}
     
 

   <div className="rounded-[10px] p-4 bg-[#f0f0f0] w-[90%] mt-10 ml-auto mr-auto border border-[#cccccc] flex flex-row justify-between">
    <p className="font-bold">You earned</p><p className="font-bold">1500 $Doodle</p>
   </div>

   <div className="rounded-[10px] p-4 bg-[#f0f0f0] w-[90%] mt-5 ml-auto mr-auto border border-[#cccccc] flex flex-col justify-between">
    <div className="flex flex-row justify-between">
    <p className="font-bold">Referrals</p><p className="font-bold text-[#ffa4d5]">Show All</p>
    </div>
      <div className="flex flex-row items-center mt-5 gap-3 p-3 justify-between">
<div className="w-[27%] flex flex-col gap-2">
<Image className="h-[auto] w-[100%]" src={userImg} alt="Logo" />
<p className="font-bold leading-[100%] text-[13px]">Max
Suryavansh</p>
</div>

<div className="w-[27%] flex flex-col gap-2">
<Image className="h-[auto] w-[100%]" src={userImg} alt="Logo" />
<p className="font-bold leading-[100%] text-[13px]">Max
Suryavansh</p>
</div>
<div className="w-[27%] flex flex-col gap-2">
<Image className="h-[auto] w-[100%]" src={userImg} alt="Logo" />
<p className="font-bold leading-[100%] text-[13px]">Max
Suryavansh</p>
</div>
   </div>
   </div>
 
       </div>

       
     
  

      
     
      
    
    </>
  );
}

export default Friend;

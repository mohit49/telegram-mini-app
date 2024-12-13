import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import axios, { AxiosRequestConfig } from "axios";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import shareHand from "@/public/share-hand.png";
import ReferralCard from "@/components/cards";
import { Button } from "@/components/ui/button";
import { AnimatedDiamond } from "@/utils/icons";
import DimondIcon from "@/public/dimond.png";
interface Item {
  tgid: string;
  mount: number;
  avatar_url: string;
}

type Bonus = {
  friend_value: number;
  premium_value: number;
};

type ReferrerDetail = {
  tele_id: string;
};

type Referrals = {
  referrerDetails?: ReferrerDetail[];
};

interface FriendProps {
  tetegram: any;
  user: {
    id: string;
    first_name: string;
  };
}

function Friend({ tetegram, user }: FriendProps) {
  const router = useRouter();
  const userFromQuery = (router.query.user as string) || "";
  const [items, setItems] = useState<Item[]>([]);
  const [levelbonus, setLevelbonus] = useState<Bonus[]>([]);
  const { enqueueSnackbar } = useSnackbar();
 const [data , setData] = useState<any>();
  const [refrals, setRefrals] = useState<Referrals | null>(null);

  const fetchUser = async (userId: string): Promise<Referrals> => {
    try {
      const requestOptions: AxiosRequestConfig = {
        method: "GET",
        headers: {
          // Add any headers if required
        },
      };
      const response = await axios.get<Referrals>(
        `https://app.mazzl.ae/api/telegram-user/${userId}`,
        requestOptions
      );
      setData(response.data)
      return response.data;

    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    fetchUser(user.id)
      .then((data) => {
        setRefrals(data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []);

  const handleInviteClick = async () => {
    const generateReferralCode = () => {
      return Math.floor(1000 + Math.random() * 9000).toString();
    };

    const newCode = generateReferralCode();
    const inviteLink = `$DOODLE - The ONLY Telegram token you need. 🎮 👋\n\nPlay our games, invite your friends and earn $DOODLE! 👏\n\nGot some degen friends? Let them join $DOODLE! Spread the word with us and stack your $DOODLE together.\n\nStart your journey to join the $DOODLE gang now 👇\n\nhttps://t.me/DoodleStudio_bot/DoodleGameStudio/?startapp=${user.id}_${newCode}`;

    enqueueSnackbar("Invite link copied to clipboard!", { variant: "success" });

    const shareLink = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}`;

    tetegram?.openTelegramLink(shareLink);
  };

  return (
    <>
      <Image src={shareHand} alt="share image" />
      <div className="text-center px-3 pb-4 m-auto w-full">
        <div className="rounded-[10px] p-4 bg-[#f0f0f0] w-[90%] mt-10 ml-auto mr-auto mb-3 border border-[#cccccc] flex flex-row justify-between">
          <p className="font-bold">You earned</p>
          <p className="font-bold flex gap-2">{data?.credit}  <Image className="h-[35px] w-[35px] object-cover " src={DimondIcon} alt="Dimond" /></p>
        </div>

        {!refrals?.referrerDetails || refrals.referrerDetails.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="font-medium text-[14px] text-[#DD523A] mt-3 mb-[25px]">
              Hi {user.first_name}, you haven&apos;t invited anyone yet.
            </div>
            <button
              className="!rounded-[15px] !h-[auto]  w-[90%] !bg-[#ffa4d5] leading-5 !py-4 !text-[20px] !font-bold !text-[#000000] shadowtoonButton"
              onClick={handleInviteClick}
            >
              Invite a friend
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <Button
                onClick={handleInviteClick}
                className="!rounded-[15px] !h-[auto]  w-[90%] !bg-[#ffa4d5] leading-5 !py-4 !text-[20px] !font-bold !text-[#000000] shadowtoonButton"
              >
                Share Link
              </Button>
            </div>
            <div className="rounded-[10px] p-4 bg-[#f0f0f0] w-[90%] mt-5 ml-auto mr-auto border border-[#cccccc] flex flex-col justify-between">
              <div className="flex flex-row justify-between">
                <p className="font-bold">Referrals</p>
                <p className="font-bold text-[#ffa4d5]">Show All</p>
              </div>
              <div className="flex flex-row items-center mt-5 gap-3 p-3 justify-between">
                {refrals.referrerDetails?.map((ele, index) => (
                 (index < 4 && <div key={index}>
                  <ReferralCard telegramId={ele.tele_id} />
                </div>) 
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Friend;

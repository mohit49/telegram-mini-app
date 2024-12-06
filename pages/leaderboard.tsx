"use Client";

import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "@/app/axios";
import { setMountStore } from "@/redux/reducers/TaskReducer";

interface Leaderboarduser {
  id: number;
  tgid: string;
  mount: number;
  avatar_url: string | null;
}

function Leaderboard() {
  const dispatch = useDispatch();
  const user = useSelector((x: any) => x.TaskReducer.user);
  const router = useRouter();
  const userFromQuery = router.query.user?.toString() || "";
  const [leaderboard, setLeaderboard] = useState<Leaderboarduser[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "/images/DefaultAvatar.svg"
  );
  const [invitenumber, setInvite] = useState<number>(0);
  const [rank, setRank] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [counter, setCount] = useState<number>(0);
  const count = useSelector((x: any) => x.TaskReducer.mount);

  const getLevelInfo = () => {
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

  const levelInfo = getLevelInfo();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const { data } = await axios.get("/users");
          const item = data.find((item: any) => item.tgid === user);
          setAvatarUrl(item?.avatar_url || "/images/DefaultAvatar.svg");
          dispatch(setMountStore(item?.mount));
          setProfit(item?.profit | 0);
          setCount(item?.mount | 0);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("/leaderboard");
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const fetchInvite = async () => {
      if (user) {
        try {
          const { data } = await axios.post("/friendsnumber", { user });
          setInvite(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchInvite();
  }, [user]);

  useEffect(() => {
    const fetchRank = async () => {
      if (user) {
        try {
          const { data } = await axios.post("/globalrank", { user });
          setRank(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchRank();
  }, [user]);

  useEffect(() => {
    if (profit > 0) {
      const intervalTime = (3600 / profit) * 1000;

      const interval = setInterval(() => {
        setCount((prevCount) => {
          const newCount = prevCount + 1;
          dispatch(setMountStore(newCount)); // Update Redux store with the new count
          return newCount;
        });
      }, intervalTime);

      return () => clearInterval(interval);
    }
  }, [profit, dispatch]);

  return (
    <>
      <div className="flex-1 h-0">
        <div className="pt-[23px] pb-[150px] px-5 text-white border-t border-[#DFDCD5] bg-gradient-to-b from-[#FFF3D8] to-[#F8DFA6] h-full overflow-auto flex flex-col gap-4">
          <img
            src={avatarUrl}
            className="mx-auto rounded-full border-white border-[10px]"
            alt="User Avatar"
          />
          <p className="font-bold text-[42px] text-center text-[#282828]">
            {user}
          </p>
          <div className="flex gap-1 justify-center">
            <img src="/images/coin.png" alt="" />
            <p className="text-5xl bg-gradient-to-b from-[#FED953] to-[#FFC700] text-transparent bg-clip-text stroke-1 stroke-[#CF6100]">
              {count}
            </p>
          </div>
          <div className="flex px-[10px] py-[20px] justify-around bg-gradient-to-t from-[#EEEEEE] to-[#FFFFFF] rounded-[10px] shadow-[0px_4px_0px_0px_#CACACA]">
            <div className="text-center flex flex-col justify-between">
              <p className="text-[#DD523A] font-semibold text-sm">
                Global Rank
              </p>
              <p className="text-[#5B586A] font-semibold text-lg">{rank}</p>
            </div>
            <div className="w-[1px] h-full bg-[#CACACA]"></div>
            <div className="text-center flex flex-col justify-between">
              <p className="text-[#DD523A] font-semibold text-sm">
                Game Level {levelInfo.number}
              </p>
              <div className="flex gap-1 items-end">
                <img src={levelInfo.image} alt="" />
                <p className="text-[#5B586A] font-semibold text-lg">
                  {levelInfo.text}
                </p>
              </div>
            </div>
            <div className="w-[1px] h-full bg-[#CACACA]"></div>
            <div className="text-center flex flex-col justify-between">
              <p className="text-[#DD523A] font-semibold text-sm">Invite</p>
              <p className="text-[#5B586A] font-semibold text-lg">
                {invitenumber} Total
              </p>
            </div>
          </div>
          <p className="text-3xl text-center text-black font-semibold">
            Leaderboard
          </p>
          {leaderboard.map((item, index) => (
            <div
              key={item.id}
              className={`flex justify-between ${
                index === 0
                  ? "border-[#FF7C65] bg-gradient-to-b from-[#DD523A] to-[#C24934] shadow-[0px_4px_0px_0px_#AB402D]"
                  : index === 1
                  ? "border-[#FF8A00] bg-gradient-to-b from-[#FFAB07] to-[#E76116] shadow-[0px_4px_0px_0px_#DC6E09]"
                  : index === 2
                  ? "border-[#FFF965] bg-gradient-to-b from-[#FFD600] to-[#E8B500] shadow-[0px_4px_0px_0px_#E5B300]"
                  : "bg-white text-black"
              } border rounded-[10px] py-[10px] px-[16px]`}
            >
              <div className="flex gap-[10px] items-center">
                <p className="font-semibold">{index + 1}</p>
                <img
                  src={item.avatar_url || "/images/egg-with-bg.png"}
                  className="w-[50px] h-[50px] rounded-full"
                  alt=""
                />
                <p className="font-semibold">{item.tgid}</p>
              </div>
              <div className="flex items-center gap-1">
                <img src="./images/coin.png" className="w-5 h-5" alt="" />
                <p>+{item.mount.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center absolute left-[20px] bottom-[20px] z-[100] w-[calc(100%-40px)]">
        <div className="grid grid-cols-5 justify-center mt-auto shadow-[0px_4px_0px_0px_#CACACA] bg-white py-[10px] px-[9px] gap-[6px] w-full font-medium text-[12px] rounded-[25px]">
          <Link href={`/mine`}>
            <div
              className={
                "flex flex-col justify-center space-y-1 text-xs h-[64px] text-center rounded-xl items-center " +
                (router.pathname === "/mine"
                  ? "text-[#00B2FF]"
                  : "text-[#A4A4A4]")
              }
            >
              <img src="/images/footer-mine.png" />
              <div className="text-center">Mine</div>
            </div>
          </Link>
          <Link href={"/earn"}>
            <div
              className={
                "flex flex-col justify-center space-y-1 text-xs h-[64px] text-center rounded-xl items-center " +
                (router.pathname === "/earn"
                  ? "text-[#00B2FF]"
                  : "text-[#A4A4A4]")
              }
            >
              <img src="/images/footer-earn.png" />
              <div>Earn</div>
            </div>
          </Link>
          <Link href={`/?user=${user}`}>
            <div
              className={
                "flex flex-col justify-center space-y-1 text-xs h-[64px] text-center rounded-xl items-center " +
                (router.pathname === "/" ? "text-[#00B2FF]" : "text-[#A4A4A4]")
              }
            >
              <img
                src="/images/footer-game.png"
                className="mt-[-25px] w-[75px] h-[75px]"
              />
              <div>Game</div>
            </div>
          </Link>
          <Link href={"/friend"}>
            <div
              className={
                "flex flex-col justify-center space-y-1 text-xs h-[64px] text-center rounded-xl items-center " +
                (router.pathname === "/friend"
                  ? "text-[#00B2FF]"
                  : "text-[#A4A4A4]")
              }
            >
              <img src="/images/footer-friend.png" />
              <div>Friends</div>
            </div>
          </Link>
          <Link href={"/account"}>
            <div
              className={
                "flex flex-col justify-center space-y-1 text-xs h-[64px] text-center rounded-xl items-center " +
                (router.pathname === "/account"
                  ? "text-[#00B2FF]"
                  : "text-[#A4A4A4]")
              }
            >
              <img src="/images/footer-account.png" />
              <div>Account</div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  // Fetch or define your static props here
  return {
    props: {
      data: {}, // Example data
    },
  };
}

export default Leaderboard;

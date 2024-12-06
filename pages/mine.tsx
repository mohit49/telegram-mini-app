"use Client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import Topheader from "./Topheader";
import axios from "@/app/axios";

import Tabs from "@/app/components/tabs";
import { setMountStore } from "@/redux/reducers/TaskReducer";
import goods from "@/app/components/common/goods";
import Goods from "@/app/components/common/goods";

interface MarketItem {
  item_id: number;
  item_name: string;
  store_name: string;
  image_path: string;
  purchase_amount: number;
  payment_amount: number;
  required_user_level: number;
  product_level: number;
  purchase_date: string | null;
}

function Mine() {
  const router = useRouter();
  const dispatch = useDispatch();
  const allTasks = useSelector((x: any) => x.TaskReducer.tasks);
  const mainTasks = allTasks?.filter((x: any) => x.extra === false);
  const [reward, setReward] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawCount, setDrawCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState("");
  const [useCoins, setUseCoins] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showbuyModal, setShowbuyModal] = useState(false);
  const [showdrawModal, setShowdrawModal] = useState(false);
  const [activeBox, setActiveBox] = useState<number | null>(null);
  const [freeDrawsLeft, setFreeDrawsLeft] = useState<number>(3);
  const user = useSelector((x: any) => x.TaskReducer.user);
  const [userId, setuserId] = useState<number>(0);
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const count = useSelector((x: any) => x.TaskReducer.mount);
  const flg = useSelector((x: any) => x.TaskReducer.shopinfo);

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
        const { data } = await axios.get("/users");
        const item = data.find((item: any) => item.tgid === user);
        setuserId(item?.id || 0);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const { data } = await axios.post("/raffleinfo", { userId });
        if (data.stats === "success" && data.items.length > 0) {
          const lastDraw = data.items[0].last_draw;
          if (data.items[0].draw_count < 3) {
            const lastDrawTime = new Date();
            setTimeLeft(getTimeLeft(lastDrawTime));
          } else {
            setTimeLeft(getTimeLeft(lastDraw));
          }
          setDrawCount(data.items[0].draw_count);
          setFreeDrawsLeft(3 - data.items[0].draw_count);
        } else {
          setTimeLeft(getTimeLeft(new Date()));
          setDrawCount(0);
          setFreeDrawsLeft(3);
        }
      } catch (error) {
        console.error("Error fetching raffle info:", error);
      }
    };

    fetchRaffles();
  }, [userId, useCoins, freeDrawsLeft]);

  useEffect(() => {
    if (freeDrawsLeft === 0) {
      const intervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          const [h, m, s] = prevTimeLeft.split(":").map(Number);

          let totalSeconds = h * 3600 + m * 60 + s - 1;

          if (totalSeconds <= 0) {
            clearInterval(intervalId);
            setFreeDrawsLeft(3); // Reset free draws when time runs out
            return "00:00:00";
          }

          const newHours = Math.floor(totalSeconds / 3600);
          totalSeconds %= 3600;
          const newMinutes = Math.floor(totalSeconds / 60);
          const newSeconds = totalSeconds % 60;

          return `${newHours.toString().padStart(2, "0")}:${newMinutes
            .toString()
            .padStart(2, "0")}:${newSeconds.toString().padStart(2, "0")}`;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [freeDrawsLeft]);

  const getTimeLeft = (lastDraw: Date) => {
    const now = new Date();
    const hoursSinceLastDraw =
      Math.abs(now.getTime() - new Date(lastDraw).getTime()) / 36e5;
    if (hoursSinceLastDraw >= 24) {
      setDrawCount(0);
      setFreeDrawsLeft(3);
      return "00:00:00";
    } else if (hoursSinceLastDraw === 0) {
      return "00:00:00";
    }
    const hoursLeft = 24 - hoursSinceLastDraw;
    const h = Math.floor(hoursLeft);
    const m = Math.floor((hoursLeft - h) * 60);
    const s = Math.floor(((hoursLeft - h) * 60 - m) * 60);
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleDraw = async (boxNumber: number) => {
    setLoading(true);
    setActiveBox(boxNumber);
    try {
      const response = await axios.post("/raffle", { userId, useCoins });
      dispatch(setMountStore(response.data.updatemount));
      setReward(response.data.reward);
      setDrawCount((prev) => prev + 1);
      if (!useCoins) {
        setFreeDrawsLeft((prev) => prev - 1); // Decrease free draws count
      }
      setShowModal(true);
    } catch (error) {
      console.error("Error during raffle draw:", error);
    } finally {
      setLoading(false);
      setActiveBox(null);
    }
  };

  const handleusecoin = async () => {
    setUseCoins(true);
    const useCoins: Boolean = true;
    try {
      const response = await axios.post("/raffle", { userId, useCoins });
      dispatch(setMountStore(response.data.updatemount));
      if (
        response.data.message ===
        "No more draws available today or insufficient coins"
      ) {
        setShowbuyModal(true);
      } else if (response.data.message === "There are still free draws left.") {
        setShowdrawModal(true);
      }
    } catch (error) {
      console.error("Error during raffle draw:", error);
    } finally {
      setUseCoins(false);
    }
  };

  const isDisabled = freeDrawsLeft === 0;

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchMarketData = async () => {
      const storeId = activeTab + 1;
      const response = await axios.post("/storeitems", { user, storeId });
      setMarketItems(response.data);
    };

    fetchMarketData();
  }, [activeTab, flg]);

  const handleImageLoad = () => {};
  return (
    <>
      <div className="flex-1 h-0">
        <div className="pt-[23px] pb-[150px] px-5 text-white rounded-t-3xl border-t border-[#DFDCD5] bg-gradient-to-b from-[#FFF3D8] to-[#F8DFA6] h-full overflow-auto flex flex-col gap-5">
          <Topheader />
          <div className="flex justify-end gap-1">
            <p className="text-[#DD523A]">
              Time left : <span className="font-semibold">{timeLeft}</span>
            </p>
            <img
              src="/images/heroicons_information-circle-16-solid.png"
              className="w-5 h-5"
            />
          </div>
          <div className="flex justify-between items-center bg-white rounded-[10px] p-[10px]">
            <div className="flex gap-[10px] items-center">
              <p className="text-black font-semibold">Daily Combo</p>
              <div className="flex gap-[5px]">
                <img
                  src="/images/little-bird.png"
                  className={`w-5 h-5 ${freeDrawsLeft < 1 ? "opacity-30" : ""}`}
                />
                <img
                  src="/images/little-bird.png"
                  className={`w-5 h-5 ${freeDrawsLeft < 2 ? "opacity-30" : ""}`}
                />
                <img
                  src="/images/little-bird.png"
                  className={`w-5 h-5 ${freeDrawsLeft < 3 ? "opacity-30" : ""}`}
                />
              </div>
            </div>
            <div className="flex items-center gap-1 bg-gradient-to-b from-[#FFAB07] to-[#E76116] px-[7.5px] py-[5px] rounded-[5px] shadow-[0px_2px_0px_0px_#DC6E09] border border-[#FF8A00]">
              <img src="/images/coin.png" className="w-5 h-5" />
              <button
                className="font-semibold text-sm"
                onClick={() => handleusecoin()}
              >
                +5,000,000
              </button>
            </div>
          </div>
          <div className="flex gap-[10px]">
            {[1, 2, 3].map((box) => (
              <div
                key={box}
                className={`rounded-[10px] flex justify-center items-center py-5 pr-3 ${
                  activeBox === box && loading ? "animate-open-box" : ""
                } ${
                  isDisabled
                    ? "bg-gray-400 cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:shadow-lg bg-white"
                }`}
                onClick={() => !loading && !isDisabled && handleDraw(box)}
              >
                <img src="/images/box.png" alt="Box" />
                {activeBox === box && loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <p className="text-white">Opening...</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {showModal && reward && (
            <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-lg flex items-center justify-center z-50">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 rounded-xl shadow-xl transform transition-all duration-500 ease-out scale-95 hover:scale-100">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 opacity-50 rounded-xl animate-pulse"></div>
                  <div className="relative p-6 rounded-lg bg-black bg-opacity-80">
                    <h2 className="text-3xl text-white font-extrabold mb-4 animate-bounce">
                      🎉 Congratulations! 🎉
                    </h2>
                    <p className="text-xl text-yellow-300 mb-6 text-center">
                      You won: <span className="font-bold">{reward}</span>{" "}
                      coins!
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={() => setShowModal(false)}
                        className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showbuyModal && (
            <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-lg flex items-center justify-center z-50">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 rounded-xl shadow-xl transform transition-all duration-500 ease-out scale-95 hover:scale-100">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 opacity-50 rounded-xl animate-pulse"></div>
                  <div className="relative p-6 rounded-lg bg-black bg-opacity-80">
                    <h2 className="text-3xl text-white font-extrabold mb-4 animate-bounce">
                      <span className="flex justify-center">There are not</span>
                      <span className="flex justify-center">enough coins</span>
                    </h2>
                    <div className="flex justify-center">
                      <button
                        onClick={() => setShowbuyModal(false)}
                        className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showdrawModal && (
            <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-lg flex items-center justify-center z-50">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 rounded-xl shadow-xl transform transition-all duration-500 ease-out scale-95 hover:scale-100">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 opacity-50 rounded-xl animate-pulse"></div>
                  <div className="relative p-6 rounded-lg bg-black bg-opacity-80">
                    <h2 className="text-3xl text-white font-extrabold mb-4 animate-bounce">
                      <span className="flex justify-center">
                        There are still
                      </span>
                      <span className="flex justify-center">
                        free draws left
                      </span>
                    </h2>
                    <div className="flex justify-center">
                      <button
                        onClick={() => setShowdrawModal(false)}
                        className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Tabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabLabels={["Markets", "PR&Team", "Legals", "Special"]}
          />
          <div className="grid grid-cols-2 gap-[10px]">
            {marketItems.map((item) => (
              <div key={item.item_id}>
                <Goods
                  itemId={item.item_id}
                  title={item.item_name}
                  amount={item.purchase_amount}
                  price={item.payment_amount}
                  img={item.image_path}
                  level={item.product_level}
                  requirelevel={item.required_user_level}
                  nowlevel={levelInfo.number}
                  onLoad={handleImageLoad}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center absolute left-[20px] bottom-[20px] z-30 w-[calc(100%-40px)]">
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

export default Mine;

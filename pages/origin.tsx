import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "@/app/axios";

const Raffle = () => {
  const [reward, setReward] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawCount, setDrawCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState("");
  const [useCoins, setUseCoins] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeBox, setActiveBox] = useState<number | null>(null);
  const [freeDrawsLeft, setFreeDrawsLeft] = useState<number>(3);
  const user = useSelector((x: any) => x.TaskReducer.user);
  const [userId, setuserId] = useState<number>(0);

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
          }
          else {
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
  }, [userId]);

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
      setFreeDrawsLeft(3); // Reset free draws every 24 hours
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

  const isDisabled = freeDrawsLeft === 0 && !useCoins;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-yellow-300 to-yellow-500">
      <h1 className="text-2xl font-bold mb-4">Daily Raffle</h1>
      <p className="text-lg mb-4">Time left: {timeLeft}</p>
      <div className="flex gap-4 mb-6">
        {[1, 2, 3].map((box) => (
          <div
            key={box}
            className={`bg-white rounded-lg p-5 relative ${
              activeBox === box && loading ? "animate-open-box" : ""
            } ${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed opacity-75"
                : "cursor-pointer hover:shadow-lg"
            }`}
            onClick={() => !loading && !isDisabled && handleDraw(box)}
          >
            <img src="/images/box.png" alt="Box" className="w-16 h-16" />
            {activeBox === box && loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <p className="text-white">Opening...</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {showModal && reward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
            <p className="text-lg mb-4">You won: {reward} coins!</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <label className="flex items-center space-x-2 mt-4">
        <input
          type="checkbox"
          checked={useCoins}
          onChange={(e) => setUseCoins(e.target.checked)}
        />
        <span>Use Coins to Draw</span>
      </label>
      <button
        disabled={loading || isDisabled}
        className="bg-orange-500 text-white px-6 py-2 rounded-lg mt-4 disabled:bg-gray-400"
      >
        {loading
          ? "Drawing..."
          : useCoins
          ? "Draw with Coins"
          : "Use Free Draw"}
      </button>
    </div>
  );
};

export default Raffle;

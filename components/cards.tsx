import React, { useEffect, useState } from "react";
import Image from "next/image";
import userImg from "@/public/USER.png"; // Default user image
import axios from "axios";

interface ReferralCardProps {
  telegramId: string; // Telegram ID of the referral
}

const ReferralCard: React.FC<ReferralCardProps> = ({ telegramId }) => {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://app.mazzl.ae/api/telegram-user/${telegramId}`);
        setUserData(response.data);
      } catch (error) {
        console.error(`Error fetching data for telegram ID ${telegramId}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [telegramId]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="w-[50px] flex flex-col gap-2">
      <Image
        className="h-[auto] w-[100%] !rounded-[10px]"
        src={userData?.photo_url || userImg} // Use fetched image or default
        alt={userData?.first_name || "Referral Avatar"}
        width={100} // Adjust dimensions as needed
        height={100}
      />
      <p className="font-bold leading-[100%] text-[13px]">
        {userData?.first_name || "Unknown"} {userData?.last_name || ""}
      </p>
    </div>
  );
};

export default ReferralCard;

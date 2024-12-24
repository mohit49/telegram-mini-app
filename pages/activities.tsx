import AppFooter from '@/components/AppFooter';
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from "@/pages/_app";
import Image from 'next/image';
import Header from "@/components/Header";
import DimondIcon from "@/public/dimond.png";
import { sendUserData, updateReferralDetails, updateRefferedBy, fetchTelegramUser, updateRefferedUnlock, updateCredit, updateLastLogin } from "@/utils/api";

// Type for credit history
type CreditHistory = {
    date: string;
    amount: number;
    source: string; // Referral or other source
    transactionType: string; // e.g. "new_user", "gameplay", "referral", etc.
    timestamp?: string; // Optional, added timestamp
};

// Type for transaction history
type TransactionHistory = {
    date: string;
    amount: number;
    transactionType: string; // Loss, Profit, Topup
};

const ActivityPage: React.FC = () => {
    const { userData, setUserDate, setTeleUser, teleUser, setTelegram, telegram } = useGlobalContext();
    const [selectedTab, setSelectedTab] = useState(0);
    const [creditHistory, setCreditHistory] = useState<CreditHistory[]>([]);
    const [transactionHistory, setTransactionHistory] = useState<TransactionHistory[]>([]);

    // Handle tab change
    const handleTabChange = (tabIndex: number) => {
        setSelectedTab(tabIndex);
    };

    // Simulate fetching data for credit history
    useEffect(() => {
        if (userData?.creditTransactions) {
            setCreditHistory(userData?.creditTransactions);
        }

        // Simulated data fetch for transaction history
        const fetchedTransactionHistory: TransactionHistory[] = [
            { date: '2024-12-01', amount: -20, transactionType: 'Loss' },
            { date: '2024-12-05', amount: 50, transactionType: 'Topup' },
            { date: '2024-12-10', amount: 30, transactionType: 'Profit' },
        ];
        setTransactionHistory(fetchedTransactionHistory);
    }, [userData]);

    function formatTimestamp(timestamp: string): string {
        if (!timestamp) return ""; // Guard clause in case of undefined timestamp

        // Create a new Date object from the timestamp
        const date = new Date(timestamp);
      
        // Get the day of the week (e.g., 'Monday')
        const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
        const dayOfWeek = new Intl.DateTimeFormat('en-US', options).format(date);
      
        // Get the full date (e.g., 'December 24, 2024')
        const fullDate = date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      
        // Get the time (e.g., '8:03 PM')
        const time = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      
        // Return formatted string
        return `${fullDate} (${dayOfWeek}) at ${time}`;
    }

    return (
        <>
            <Header userData={userData} />
            <div className="container mx-auto px-[10px] py-[10px]">
              
                {/* Credit Tab */}
                {selectedTab === 0 && (
                    <div className='max-h-[70vh] overflow-y-auto pb-[30px]'>
                        <div className="space-y-4">
                            {creditHistory.map((entry, index) => (
                                <div key={index} className={`p-4 rounded-lg flex flex-col gap-[8px] 
                                    ${entry.transactionType === "new_user" ? "bg-[#48ef9d]" :
                                      entry.transactionType === "gameplay" ? "bg-[#80b1fe]" :
                                      entry.transactionType === "referral" ? "bg-[#ffa4d5]" : "bg-[#98e2ff]"}`}>
                                    <p className="text-sm text-black font-bold"> {formatTimestamp(entry.timestamp ?? '')}</p>

                                    <p className="text-lg font-semibold justify-between flex flex-row items-center gap-[20px] ">
                                        <span className='!text-white'> Credited:</span>
                                        <span className='flex-row flex gap-[5px] text-white'> 
                                            {entry.amount} <Image className='w-[30px]' src={DimondIcon} alt="" />
                                        </span>
                                    </p>
                                    {entry.transactionType === "new_user" && <p className="font-bold text-black">Welcome User Bonus</p>}
                                    {entry.transactionType === "gameplay" && <p className="font-bold text-black">Daily Game Play Bonus</p>}
                                    {entry.transactionType === "referral" && <p className="font-bold text-black">Referral Bonus</p>}
                                    {entry.transactionType === "dailylogin" && <p className="font-bold text-black">Daily Login Bonus</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Transaction Tab */}
                {selectedTab === 1 && (
                    <div>
                        <div className='max-h-[70vh] overflow-y-auto pb-[30px]'>
                            {transactionHistory.map((transaction, index) => (
                                <div key={index} className="p-4 border rounded-lg shadow-sm bg-white">
                                    <p className="text-sm text-gray-500">Date: {transaction.date}</p>
                                    <p className="text-lg font-semibold">Amount: {transaction.amount} Diamonds</p>
                                    <p className={`text-sm font-semibold ${transaction.transactionType === 'Loss' ? 'text-red-500' : 
                                      transaction.transactionType === 'Profit' ? 'text-green-500' : 'text-blue-500'}`}>
                                        Type: {transaction.transactionType}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-center mb-6 absolute bottom-[45px] left-0 w-full bg-[#f5f5f5]">
                    <div className="flex w-full flex-row justify-center gap-[0px]">
                        <button
                            className={`text-lg h-[55px] w-[50%] font-semibold ${selectedTab === 0 ? ' bg-[#ffa4d5]' : 'bg-[#f5f5f5]'}`}
                            onClick={() => handleTabChange(0)}
                        >
                            Credit
                        </button>
                        <button
                            className={`text-lg w-[50%] h-[55px] font-semibold ${selectedTab === 1 ? ' bg-[#ffa4d5]' : 'bg-[#f5f5f5]'}`}
                            onClick={() => handleTabChange(1)}
                        >
                            Transactions
                        </button>
                    </div>
                </div>

            </div>
            <AppFooter />
        </>
    );
};

export default ActivityPage;

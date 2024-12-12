import React, { useEffect } from 'react'
import { useGlobalContext } from "@/pages/_app";
import { updateRefferedUnlock, updateCredit, updateLastGamePlay } from "@/utils/api";
const gameStatus = () => {
    const { userData, gameStatus } = useGlobalContext();
    useEffect(() => {



        const referCheck = async () => {
            if (gameStatus == "end") {
                if (!userData.refferUnlock) {
                    const referralUnlockResponse = await updateRefferedUnlock({
                        userId: userData.tele_id,
                        refferUnlock: {
                            refferUnlock: true, // Ensure correct spelling and structure of field names
                        },
                    });
                    console.log("Referral unlock details updated:", referralUnlockResponse);

                    const updatecredit = await updateCredit({
                        userId: userData.tele_id,
                        credit: {
                            credit: 2, // Ensure correct spelling and structure of field names
                        },
                    });

                    const updatecreditScroreofrefferedBy = await updateCredit({
                        userId: referralUnlockResponse.user.refferedby,
                        credit: {
                            credit: 5, // Ensure correct spelling and structure of field names
                        },
                    });
                    console.log("Referral unlock details updated:", referralUnlockResponse);
                }

                // Function to check if 24 hours have passed
                const has24HoursPassed = (lastTimestamp: any) => {
                    if (!lastTimestamp) return true; // If no timestamp exists, treat it as expired
                    const lastTime = new Date(lastTimestamp).getTime();
                    const currentTime = new Date().getTime();
                    return currentTime - lastTime >= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
                }

                // Function to update the last game play time
                const lastPLay = async () => {
                    const userId = userData?.tele_id;
                    const updateTime = await updateLastGamePlay(userId);
                    const updatecreditScroreofrefferedBy = await updateCredit({
                        userId: userData?.tele_id,
                        credit: {
                            credit: 5, // Ensure correct spelling and structure of field names
                        },
                    });
                }
             
                if(!userData?.lastGamePlay) {
                    const userId = userData?.tele_id;
                    const updateTime = await updateLastGamePlay(userId);
                    userData.lastGamePlay = updateTime?.user?.lastGamePlay
                }
                    // Get the last game play timestamp from localStorage
                    const lastGamePlay = userData?.lastGamePlay || Date.now();

                    // Check if 24 hours have passed
                    if (has24HoursPassed(lastGamePlay)) {
                      
                        lastPLay(); // Update the last game play timestamp
                    }
                

            }






        }
        referCheck();
    }, [gameStatus])


}

export default gameStatus
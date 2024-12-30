import type { AppProps } from "next/app";
import "../app/globals.css";
import { SnackbarProvider } from "notistack";
import { persistor, store } from "../redux";
import { TonConnectUIProvider, THEME } from "@tonconnect/ui-react";
import { PersistGate } from "redux-persist/integration/react";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import gameStatus from "@/utils/gameStatus";
import { sendUserData, updateReferralDetails, updateRefferedBy, fetchTelegramUser, updateRefferedUnlock, updateCredit, updateLastLogin } from "@/utils/api";

import { io, Socket } from 'socket.io-client';

// Define the shape of your UserData interface
interface UserData {
  tele_id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url?: string;
  credit?: any;
  creditTransactions?:any
}

// Define the shape of your context state
interface GlobalState {
  telegram: any;
  teleUser: any;
  setTeleUser: React.Dispatch<React.SetStateAction<any>>;
  setTelegram: React.Dispatch<React.SetStateAction<any>>;
  userData: UserData | null;
  setUserDate: React.Dispatch<React.SetStateAction<UserData | null>>;
  setGameStatus: React.Dispatch<React.SetStateAction<any>>;
  gameStatus: any;
  socket: Socket;
}

// Create the Context
const GlobalContext = createContext<GlobalState | undefined>(undefined);

// Create a Provider component
const GlobalProvider = ({ children }: { children: ReactNode }) => {
  
  const socket = io('https://app.mazzl.ae/', {
    transports: ['websocket'], // Use WebSocket as the transport method
  });

  // Use appropriate types for state hooks
  const [userData, setUserDate] = useState<UserData | null>(null);
  const [teleUser, setTeleUser] = useState<any>(null);
  const [telegram, setTelegram] = useState<any>(null);
  const [gameStatusState, setGameStatus] = useState<any>(null);


  const [params, setParams] = useState<any>()

  useEffect(() => {
    // Dynamically load the Telegram Web App script
    const loadTelegramScript = () => {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.async = true;
      script.onload = initializeTelegram;
      script.onerror = () => {
        console.error("Failed to load Telegram Web App script.");
      };
      document.body.appendChild(script);
    };

    // Initialize Telegram Web App and fetch user info
    const initializeTelegram = async () => {
      if (window?.Telegram) {
        const telegram = window?.Telegram?.WebApp;
        setTelegram(telegram)
        // Notify Telegram that the Mini App is ready
        telegram.ready();

        // Get user information
        const params = telegram.initDataUnsafe?.start_param || null;
        setParams(params);
        const user = telegram.initDataUnsafe?.user || null;
        const reciverTelegramId = user?.id;
        const data = await fetchTelegramUser(reciverTelegramId);
        if (data.message == "User not found") {
          const userData = {
            tele_id: user?.id,
            first_name: user?.first_name,
            last_name: user?.last_name,
            username: user?.username || "",
            photo_url: user?.photo_url,
            lastLogin: Date.now(),
            refferUnlock: false,
            credit: 0
          };

          sendUserData(userData)
            .then((response: any) => {
              console.log("User data saved:", response);
              setTeleUser(user);
              setUserDate(response.user);

              const newAccouCredit = async () => {
                const updatecredit = await updateCredit({
                  userId: userData?.tele_id,
                  credit: {
                    credit: 2, // Ensure correct spelling and structure of field names
                    transactionType: "new_user",
                    reason: "New User Login"
                  },
                });
              }
              newAccouCredit();
            })
            .catch((error: any) => {
              console.error("Error saving user data:", error);
            });
          if (params) {
            const userId = params.split("_")[0];

            const referrerId = params.split("_")[1];

            updateReferralDetails({
              tele_id: userId,
              referrerDetails: [
                {
                  tele_id: user?.id,
                  referId: referrerId,
                },
              ],
            })
              .then((response: any) => {
                console.log("Referral details updated:", response);
              })
              .catch((error: any) => {
                console.error("Error updating referral details:", error);
              });

            const refrls = async () => {
              try {
                // Update referredBy
                const referredByResponse = await updateRefferedBy({
                  userId: user?.id,
                  refferedby: {
                    refferedby: userId, // Ensure correct spelling and structure of field names
                  },
                });
                console.log("Referral details updated:", referredByResponse);
                setUserDate(referredByResponse.user);
                // Update referralUnlock
                const referralUnlockResponse = await updateRefferedUnlock({
                  userId: user.id,
                  refferUnlock: {
                    refferUnlock: false, // Ensure correct spelling and structure of field names
                  },
                });
                console.log("Referral unlock details updated:", referralUnlockResponse);
              } catch (error) {
                console.error("Error updating referral details:", error);
              }
            };

            // Call the function
            refrls();
          }

        } else {
          setTeleUser(user);
          setUserDate(data);
          const has24HoursPassed = (lastTimestamp: any) => {
            if (!lastTimestamp) return true; // If no timestamp exists, treat it as expired
            const now = new Date();
            const twentyFourHoursAgo = now.getTime() - (24 * 60 * 60 * 1000);
            return lastTimestamp < twentyFourHoursAgo;

          }
          if (has24HoursPassed(data.lastLogin)) {
            var currenttime = new Date()
            const updatecreditScroreofrefferedBy = await updateCredit({
              userId: user?.id,
              credit: {
                credit: 3, // Ensure correct spelling and structure of field names
                transactionType: "dailylogin",
                reason: "Daily login reward"
              },
            });

            const lastLoginUpdate = await updateLastLogin({
              userId: user?.id,
              lastLogin: {
                lastLogin: currenttime.getTime().toString(), // Ensure correct spelling and structure of field names
              },
            });

          }


        }


      } else {
        console.error("Telegram Web App is not available.");
      }
    };

    // Check if script is already loaded; if not, load it
    if (!window?.Telegram) {
      loadTelegramScript();
    } else {
      initializeTelegram();
    }
  }, []);


useEffect(()=>{
  console.log(userData)
  socket.on('connect', () => {
    // Assuming you already have the userId available
    const userId = 'some_unique_user_id';
    socket.emit('authenticate', userData?.tele_id);
  
  });

},[userData])
  return (
    <GlobalContext.Provider value={{
      userData,
      socket,
      teleUser,
      setTeleUser,
      setUserDate,
      setTelegram,
      setGameStatus,
      gameStatus: gameStatusState,
      telegram
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook for accessing the context
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

const AppWrapper = ({ Component, pageProps }: any) => {
  // Handle gameStatus properly
  const status = gameStatus(); // Assuming gameStatus is a function that returns the current status
  return <Component {...pageProps} />;
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PersistGate loading={null} persistor={persistor}>
      <SnackbarProvider>
        <GlobalProvider>
          <AppWrapper Component={Component} pageProps={pageProps} />
        </GlobalProvider>
      </SnackbarProvider>
    </PersistGate>
  );
}

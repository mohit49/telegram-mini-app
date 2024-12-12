import type { AppProps } from "next/app";
import "../app/globals.css";
import { SnackbarProvider } from "notistack";
import { persistor, store } from "../redux";
import { TonConnectUIProvider, THEME } from "@tonconnect/ui-react";
import { PersistGate } from "redux-persist/integration/react";
import { createContext, useContext, useState, ReactNode } from "react";
import gameStatus from "@/utils/gameStatus";
interface UserData {
  tele_id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url?: string;
  credit?:any
}
// Define the shape of your context state
interface GlobalState {
  telegram: any;
  teleUser:any;
  setTeleUser: any;
  setTelegram: any;
  userData: any | null;
  setUserDate: any;
  setGameStatus: any;
  gameStatus:any;
}





// Create the Context
const GlobalContext = createContext<GlobalState | undefined>(undefined);

// Create a Provider component
const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserDate] = useState<UserData | null>(null);
  const [teleUser, setTeleUser] = useState<any>();
  const [telegram, setTelegram] = useState<any>();
  const [dailyPlay, setDailyPlay] = useState<any>();
  const[gameStatus, setGameStatus] = useState<any>();
  return (
    <GlobalContext.Provider value={{ userData, teleUser, setTeleUser, setUserDate , setTelegram , setGameStatus , gameStatus , telegram }}>
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
  const status = gameStatus();
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

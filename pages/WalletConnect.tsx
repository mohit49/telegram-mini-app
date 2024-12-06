import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useDispatch, useSelector } from "react-redux";
import axios from "@/app/axios";
import { removeKeyPairs, setKeyPairs } from "@/redux/reducers/TaskReducer";
import { forwardRef, useState } from "react";
import { X } from "lucide-react";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const WalletConnect = () => {
  const dispatch = useDispatch();
  const user = useSelector((x: any) => x.TaskReducer.user);
  const pubKey = useSelector((x: any) => x.TaskReducer.pubKey);
  const priKey = useSelector((x: any) => x.TaskReducer.priKey);
  const [open, setOpen] = useState(false);
  const [doing, setDoing] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const connect = async () => {
    if (!user) {
      alert("Unregistered user");
      return;
    }
    setDoing(true);
    const {
      data: { publicKey, privateKey },
    } = await axios.post("/connect", { user });
    dispatch(setKeyPairs({ publicKey, privateKey }));
    setDoing(false);
  };

  const disconnect = async () => {
    setOpen(false);
    dispatch(removeKeyPairs({}));
  };

  const copy = (txt: any) => {
    alert("Copied");
    if (navigator.clipboard && window.isSecureContext)
      navigator.clipboard.writeText(txt);
    else {
      let textArea = document.createElement("textarea");
      textArea.value = txt;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res: any, rej) => {
        document.execCommand("copy") ? res() : rej();
        textArea.remove();
      });
    }
  };

  return (
    <>
      {pubKey ? (
        <>
          <div className="text-black font-semibold">
            Connected your TON wallet
          </div>
          <div className="flex items-center gap-1 bg-gradient-to-b from-[#FFAB07] to-[#E76116] px-[7.5px] py-[5px] rounded-[5px] shadow-[0px_2px_0px_0px_#DC6E09] border border-[#FF8A00] text-white">
            <button
              className="font-semibold text-sm"
              onClick={() => setOpen(true)}
            >
              Connected
            </button>
          </div>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            sx={{ backdropFilter: "blur(19px)" }}
          >
            <DialogContent>
              <div
                id="alert-dialog-slide-description"
                style={{ color: "white" }}
              >
                <img
                  className="absolute top-[20px] right-[20px] cursor-pointer"
                  onClick={handleClose}
                  src="/images/close.png"
                />
                <span className="flex flex-col text-center mb-14">
                  <img
                    src="/images/wallet1.png"
                    alt="wallet"
                    className="w-[100px] h-[119px] self-center"
                  />
                  <div className="mt-5 font-semibold text-[30px] text-[#282828]">
                    Connect your TON wallet
                  </div>
                  <div className="my-[10px] text-[16px] text-[#6E6E6E] flex flex-col">
                    connect your crypto wallet. If you don’t have one, create
                    one in your Telegram account.
                  </div>
                  <div className="flex h-12 mt-5">
                    <img
                      src="/images/close1.png"
                      alt=""
                      className="cursor-pointer w-12 h-12 mr-[5px]"
                      onClick={disconnect}
                    />
                    <div className="flex items-center bg-[#F8DFA6] border border-[#FF8A00] font-semibold text-white rounded-[16px] disabled:opacity-40 disabled:cursor-not-allowed w-full">
                      <img
                        src="/images/small-wallet.png"
                        className="w-6 h-6 ml-[10px] mr-[7px]"
                        alt=""
                      />
                      <span className="text-black flex-1 w-0 truncate mr-[7px]">
                        {pubKey}
                      </span>
                      <button
                        className="flex justify-center items-center mr-[5px]"
                        onClick={() => copy(pubKey)}
                      >
                        <img src="/images/copy-button.png" />
                      </button>
                    </div>
                  </div>
                </span>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <>
          <div className="text-black font-semibold">
            Connect your TON wallet
          </div>
          <div className="flex items-center gap-1 bg-gradient-to-b from-[#FFAB07] to-[#E76116] px-[7.5px] py-[5px] rounded-[5px] shadow-[0px_2px_0px_0px_#DC6E09] border border-[#FF8A00] text-white">
            <button
              className="font-semibold text-sm"
              onClick={connect}
              disabled={doing}
            >
              Connect
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default WalletConnect;

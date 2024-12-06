"use Client";

import React, { Ref, forwardRef, useRef, useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import axios from "@/app/axios";
import { useSnackbar } from "notistack";
import { useSelector, useDispatch } from "react-redux";
import { setMountStore, setUpadteShop } from "@/redux/reducers/TaskReducer";
import "../../globals.css";

interface GoodsProps {
  itemId: number;
  title: string;
  amount: number;
  price: number;
  img: string;
  level: number;
  requirelevel: number;
  nowlevel: number;
  onLoad: () => void;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Goods({
  itemId,
  title,
  amount,
  price,
  img,
  level,
  requirelevel,
  nowlevel,
  onLoad,
}: GoodsProps) {
  const dispatch = useDispatch();
  const user = useSelector((x: any) => x.TaskReducer.user);
  const flg = useSelector((x: any) => x.TaskReducer.shopinfo);
  const snackbar = useSnackbar();
  const [open, setOpen] = useState(false);
  const [doing, setDoing] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleProfit = () => {
    setDoing(true);
    axios
      .post("/profit", { user, amount, price, itemId })
      .then((response: any) => {
        if(requirelevel > nowlevel) {
          snackbar.enqueueSnackbar("The usage level has not been reached.", {
            autoHideDuration: 2000,
          });
        }
        else if (response.data.stats === true) {
          dispatch(setMountStore(response.data.updatemount));
          if(flg === false) {
            dispatch(setUpadteShop(true));
          } else dispatch(setUpadteShop(false));
          snackbar.enqueueSnackbar("Purchased exactly.", {
            autoHideDuration: 2000,
          });
        } else {
          snackbar.enqueueSnackbar("There are not enough coins", {
            autoHideDuration: 2000,
          });
        }

        setOpen(false);
        setDoing(false);
      });
  };

  return (
    <>
      <div className="bg-white rounded-[10px] text-black">
        <div className="flex p-[10px] justify-between">
          <img
            src={nowlevel >= requirelevel ? img : "/images/fashion-lock.png"}
            className="w-[75px] h-[75px]"
            alt={title}
            onLoad={onLoad}
          />
          <div className="flex flex-col justify-between">
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs">Profit /Hour</p>
            <div className="flex gap-1 items-center">
              <img src="/images/coin.png" className="w-5 h-5" alt="Coin" />
              <p className="text-xs font-semibold">+{amount}</p>
            </div>
          </div>
        </div>
        <hr className="border-[#CACACA]" />
        <div className="flex justify-around">
          <p className="text-center font-semibold text-sm border-r border-[#CACACA] py-3 w-1/2">
            Level {level}
          </p>
          <div
            className="flex justify-center items-center gap-1 py-3 w-1/2 cursor-pointer"
            onClick={handleClickOpen}
          >
            <img src="/images/coin.png" className="w-5 h-5" alt="Coin" />
            <span className="font-semibold text-sm">{price}</span>
          </div>
        </div>
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
          <div id="alert-dialog-slide-description" style={{ color: "white" }}>
            <img
              className="absolute top-[20px] right-[20px] cursor-pointer"
              onClick={handleClose}
              src="/images/close.png"
            />
            <div className="flex flex-col text-center">
              <img
                src={img}
                alt={title}
                className="w-[114px] h-[114px] self-center"
              />
              <div className="mt-[10px] font-semibold text-[30px] text-[#282828]">
                {title}
              </div>
              <div className="my-[10px] text-[16px] text-[#6E6E6E] flex flex-col">
                <span className="self-center">
                  Trading pairs involving Ethereum and another
                </span>
                <span className="self-center">cryptocurrency</span>
              </div>
              <div className="text-[16] font-semibold text-[#6E6E6E]">
                Profit /Hour
              </div>
              <div className="mt-[10px] text-[16] font-semibold text-[#6E6E6E] flex justify-center">
                <img
                  src="/images/coin.png"
                  alt="dollar"
                  className="w-[20px] h-[20px] mr-1"
                />
                <span>+{amount}</span>
              </div>
              <div className="flex justify-center items-center space-x-[10.61px] mt-[18.5px] font-bold text-[29px] leading-[29px]">
                <img
                  src="/images/coin.png"
                  alt="dollar"
                  className="w-[50px] h-[50px]"
                />
                <span className="text-[#FFC700]">{price}</span>
              </div>
              <div className="flex justify-center mt-[29.08px]">
                <button
                  className="p-4 font-semibold text-[24px] bg-gradient-to-b from-[#FFAB07] to-[#E76116] shadow-[0px_4px_0px_0px_#DC6E09] border border-[#FF8A00] text-white rounded-[12px] transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed w-full"
                  onClick={handleProfit}
                  disabled={doing}
                >
                  Go ahead
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Goods;

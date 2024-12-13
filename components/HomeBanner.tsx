// components/SwiperSlider.js
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import boostBanner from "@/public/boost.png"
import reffer from "@/public/refer-friend.png"
import { useRouter } from "next/router";
import Friend from "@/pages/friend";
import Image from "next/image";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
const HomeBanner:any = ({telegram, user}:any) => {
  const router = useRouter();
  return (
    <Swiper className='w-full !py-1'
    autoHeight={true}
    spaceBetween={10}
    slidesPerView={1.2} // Show a portion of the next slide
    centeredSlides={false} // Centers the slides
    pagination={{ clickable: true }}
    slidesOffsetBefore={10}
    breakpoints={{
      640: { // Mobile breakpoint
        slidesPerView: 1.2, // Show more of the next slide on smaller screens
        spaceBetween: 20,
      },
      1024: { // Desktop breakpoint
        slidesPerView: 3, // Regular layout for larger screens
        spaceBetween: 30,
      },
    }}
    >
      <SwiperSlide className='h-auto w-full'>
        <div className='w-full rounded-lg overflow-hidden'> <Drawer>
        
     <DrawerTrigger className="text-left flex flex-col gap-0 p-0 items-center justify-center w-full">
     <Image className="w-full " src={reffer} alt="Logo" />
  
            
      </DrawerTrigger>
      <DrawerContent >
     <Friend tetegram={telegram} user={user}/>
        </DrawerContent>
        </Drawer></div>
      </SwiperSlide>
      <SwiperSlide className='h-auto w-full'>
      <div className='w-full rounded-lg overflow-hidden'><Image className="w-full " src={boostBanner} alt="Logo" /></div>
      </SwiperSlide>
      
    </Swiper>
  );
};

export default HomeBanner;

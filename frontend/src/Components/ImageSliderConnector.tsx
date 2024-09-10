"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import React from "react";
import { ImagesSlider } from "../Components/ImageSlider";
import { Link } from "react-router-dom";

export function ImagesSliderConnector() {
  const images = [
    "https://www.corebt.com/wp-content/uploads/2022/11/secure-payments.jpg",
    "https://th.bing.com/th/id/OIP.R0J6lGkkjPRzen_coAVZHAHaE7?rs=1&pid=ImgDetMain",
    "https://www.pr360.in/wp-content/uploads/2022/10/aster-1.jpg",
  ];

  const texts = [
    "Secure and Reliable Payments for Your Banking Needs",
    "Fast and Easy Transactions Anytime, Anywhere",
    "Manage Your Finances with Confidence and Ease",
  ];

  const [currentTextIndex, setCurrentTextIndex] = React.useState(0);

  // Refs for GSAP animations
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Trigger GSAP animation when text changes
  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      buttonRef.current,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.5,
      }
    );
  }, [currentTextIndex]); // Re-run animation on text change

  return (
    <ImagesSlider
      className="h-[40rem] top-[-28px] relative"
      images={images}
      onSlideChange={setCurrentTextIndex} // Update text when the image changes
    >
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        {/* Text to be animated */}
        <motion.p
          ref={textRef} // Ref for GSAP animation
          className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4"
        >
          {texts[currentTextIndex]}
        </motion.p>

        {/* Button to be animated */}
        <button
          ref={buttonRef} // Ref for GSAP animation
          className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4"
        >
          <span><Link className="text-white" to="http://localhost:5173/Registrations">Join Now →</Link></span>
          <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
        </button>
      </motion.div>
    </ImagesSlider>
  );
}

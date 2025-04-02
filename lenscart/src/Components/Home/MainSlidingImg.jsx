import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useThemeContext } from "../../context/ThemeContext";

export const ImgSlider = ({ onSlideClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);
  const slideDuration = 5000; // 5 seconds per slide
  const progressUpdateFrequency = 50; // Update progress every 50ms
  const { darkMode } = useThemeContext(); // Get Dark / Light Mode

  const ImgLink = [
    "https://static5.lenskart.com/media/uploads/Desktop-v1-topbanner-zodiacZodiac_21032025rat.png",
    "https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-wildgear.png",
    "https://static5.lenskart.com/media/uploads/NEW_AT_LK-Shapes_27032025rat.png",
    "https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-headspace.png",
    "https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-breaktheframe.png",
    "https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-twyst.png",
    "https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-hustlr.png",
    "https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-mavericks.png",
  ];

  // Handle automatic sliding
  useEffect(() => {
    if (!isPaused) {
      const slideTimer = setTimeout(() => {
        handleNext();
      }, slideDuration);

      return () => clearTimeout(slideTimer);
    }
  }, [currentIndex, isPaused]);

  // Handle progress bar
  useEffect(() => {
    if (isPaused) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      return;
    }

    setProgress(0);

    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress =
          prev + (progressUpdateFrequency / slideDuration) * 100;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, progressUpdateFrequency);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === ImgLink.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? ImgLink.length - 1 : prevIndex - 1
    );
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  // Preload images for smoother experience
  useEffect(() => {
    ImgLink.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Optimized image rendering with placeholder
  const renderImage = (src, index) => {
    const isActive = index === currentIndex;
    return (
      <div
        key={index}
        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
          isActive ? "opacity-100 z-10" : "opacity-0 z-0"
        }`}
      >
        <img
          src={src}
          alt={`Slide ${index + 1}`}
          className="w-full h-full object-cover object-center"
          loading={index <= currentIndex + 1 ? "eager" : "lazy"}
          onClick={onSlideClick}
        />
      </div>
    );
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg shadow-xl cursor-pointer ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px]`}
    >
      {/* Image container */}
      <div className="relative w-full h-full">
        {ImgLink.map((src, index) => renderImage(src, index))}
      </div>

      {/* Left arrow (middle left) */}
      <button
        onClick={handlePrev}
        className={`hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full 
          ${
            darkMode
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-white/70 text-gray-800 hover:bg-white/90"
          } 
          backdrop-blur-sm transition-colors shadow-md z-20 cursor-pointer`}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right arrow (middle right) */}
      <button
        onClick={handleNext}
        className={`hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full 
          ${
            darkMode
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-white/70 text-gray-800 hover:bg-white/90"
          } 
          backdrop-blur-sm transition-colors shadow-md z-20 cursor-pointer`}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Bottom center controls */}
      <div className="absolute bottom-1 lg:bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-20">
        {/* Progress bar */}
        <div
          className={`w-48 h-1 rounded-full overflow-hidden ${
            darkMode ? "bg-gray-700" : "bg-white/30"
          }`}
        >
          <div
            className={`h-full transition-all duration-200 ease-linear rounded-full ${
              darkMode ? "bg-white" : "bg-gray-800"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Play/Pause button */}
        <button
          onClick={togglePause}
          className={`p-1 lg:p-2 rounded-full backdrop-blur-sm shadow-md cursor-pointer transition-colors
            ${
              darkMode
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-white text-gray-800 hover:bg-white/90"
            }`}
          aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
        >
          {isPaused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>
    </div>
  );
};

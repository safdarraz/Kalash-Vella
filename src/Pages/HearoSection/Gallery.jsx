import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ImageSlider() {
  const images = [
    "/Gallery/Gallery3-min.jpg",
    "/Gallery/Gallery2-min.jpg",
    "/Gallery/Gallery1-min.jpg",
    "/Gallery/Galler-4-min.jpg",
    "/Gallery/Galler-5-min.jpg",
  ];

  const visibleCount = 3; // hamesha 3 images visible
  const gapPercent = 2; // images ke darmiyan gap
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const containerRef = useRef();

  // Infinite loop ke liye slides clone karte hain
  const slides = [...images, ...images, ...images]; // simple triple copy

  const nextSlide = () => setIndex((prev) => prev + 1);
  const prevSlide = () => setIndex((prev) => prev - 1);

  // Loop handling
  useEffect(() => {
    const node = containerRef.current;
    const handleTransitionEnd = () => {
      if (index >= images.length * 2) {
        setIndex(images.length);
        node.style.transition = "none";
        node.style.transform = `translateX(-${indexToTranslate(images.length)}%)`;
      } else if (index < images.length) {
        setIndex(images.length * 2 - 1);
        node.style.transition = "none";
        node.style.transform = `translateX(-${indexToTranslate(images.length * 2 - 1)}%)`;
      }
    };
    node.addEventListener("transitionend", handleTransitionEnd);
    return () => node.removeEventListener("transitionend", handleTransitionEnd);
  }, [index, images.length]);

  const indexToTranslate = (idx) => {
    // Total gap = 2% * (visibleCount - 1)
    const totalGap = (visibleCount - 1) * gapPercent;
    return (idx * (100 - totalGap)) / visibleCount + (idx * gapPercent);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const moveX = e.touches[0].clientX - touchStartX;
    setTranslateX(moveX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (translateX < -50) nextSlide();
    else if (translateX > 50) prevSlide();
    setTranslateX(0);
  };

  // Width of each slide with exact 3 images visible + 2% gaps
  const slideWidth = `calc((100% - ${(visibleCount - 1) * gapPercent}%) / ${visibleCount})`;

  return (
    <div className="w-full flex flex-col items-center gap-7 py-4 overflow-hidden">
      {/* Heading */}
      <div className="w-full flex items-center justify-center">
        <div className="w-[90px] md:w-[100px] lg:w-[150px] 2xl:w-[200px]">
          <div className="relative flex justify-center items-center w-[50%] rounded-sm h-[30px] md:h-[40px] lg:h-[50px] 2xl:h-[60px] border-2 border-transparent border-t-[#B36228] border-l-[#B36228] border-b-[#B36228]">
            <h1 className="cursor-pointer absolute left-2 text-[#4D2A11] text-xl md:text-2xl lg:text-4xl 2xl:text-5xl font-bold w-[160px] md:w-[350px] lg:w-[550px] 2xl:w-[700px]">
              <Link to="Gallery" onClick={() => setOpen (false)} >Gallery</Link>
            </h1>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative w-full flex items-center h-[170px] md:h-[200px] lg:h-[250px] xl:h-[330px] 2xl:h-[500px] overflow-hidden px-[1%]">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="hidden lg:block absolute z-20 top-1/2 -translate-y-1/2 left-2 xl:left-4 2xl:left-10"
        >
          {/* SVG arrow */}
        </button>

        {/* Images Container */}
        <div
          ref={containerRef}
          className="flex items-center gap-[2%] h-[170px] md:h-[200px] lg:h-[250px] xl:h-[330px] 2xl:h-[500px]"
          style={{
            transform: `translateX(calc(-${indexToTranslate(index)}% + ${translateX}px))`,
            transition: isDragging ? "none" : "transform 0.3s ease-in-out",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((img, i) => (
            <div
              key={i}
              className="h-[165px] md:h-[190px] lg:h-[240px] xl:h-[320px] 2xl:h-[490px] flex-shrink-0"
              style={{
                width: slideWidth,
              }}
            >
              <img
                src={img}
                alt={`Slide ${i}`}
                className="w-full h-full object-cover rounded-lg pointer-events-none"
                draggable="false"
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="hidden lg:block absolute z-20 top-1/2 -translate-y-1/2 right-2 xl:right-4 2xl:right-10"
        >
          {/* SVG arrow */}
        </button>
      </div>
    </div>
  );
}

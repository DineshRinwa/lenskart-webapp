import { EyeCheck } from "../Components/Home/EyeCheck";
import { Glass } from "../Components/Home/Glass";
import { HomeCheckUp } from "../Components/Home/HomeCheckUp";
import { ImgSlider } from "../Components/Home/MainSlidingImg";
import { ProductSlider } from "../Components/Home/ProductSlider";
import { PremiumEyewear } from "../Components/Home/PremiumEyewear";
import { SharkTank } from "../Components/Home/SharkTank";
import { TrendingSunGlasses } from "../Components/Home/TrendingSunGlasses";
import { ColorLens } from "../Components/Home/ColorLens";
import { Brand } from "../Components/Home/Brand";

import { useThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const { darkMode } = useThemeContext();
  const navigate = useNavigate();

  const productPage = () => {
    navigate("/all_products");
  };

  return (
    <div
      className={`shadow-md ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <ImgSlider onSlideClick={productPage} />
      <ProductSlider onSlideClick={productPage} />
      <Glass onSlideClick={productPage} />
      <HomeCheckUp onSlideClick={productPage} />
      <EyeCheck onSlideClick={productPage} />
      <PremiumEyewear onSlideClick={productPage} />
      <SharkTank onSlideClick={productPage} />
      <TrendingSunGlasses onSlideClick={productPage} />
      <ColorLens onSlideClick={productPage} />
      <Brand onSlideClick={productPage} />
    </div>
  );
};

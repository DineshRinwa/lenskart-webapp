import { SingleCom } from "../../Utils/SingleCom";

export const PremiumEyewear = ({onSlideClick}) => {
  const image =
    "https://static1.lenskart.com/media/desktop/img/16-sep-24/r1.jpeg";
  const heading = "Premium Eyewear";
  
  return <SingleCom image={image} heading={heading} onSlideClick={onSlideClick} />;
};

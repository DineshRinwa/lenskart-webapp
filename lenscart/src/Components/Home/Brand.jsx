import { SingleCom } from "../../Utils/SingleCom";

export const Brand = ({onSlideClick}) => {
  const image =
    "https://static1.lenskart.com/media/desktop/img/Aug21/Desktop/VC-Banner.jpg";
  const heading = "OUR BRANDS";

  return <SingleCom image={image} heading={heading} onSlideClick={onSlideClick} />;
};
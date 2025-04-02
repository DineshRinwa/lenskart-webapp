import { SingleCom } from "../../Utils/SingleCom";

export const TrendingSunGlasses = ({onSlideClick}) => {
  const image =
    "https://static1.lenskart.com/media/desktop/img/Jan23/sunglasses/Sun-Banner-web.gif";
  const heading = "Trending Sunglasses";

  return <SingleCom image={image} heading={heading} onSlideClick={onSlideClick} />;
};

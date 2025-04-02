import { SingleCom } from "../../Utils/SingleCom";

export const SharkTank = ({onSlideClick}) => {
  const image =
    "https://static1.lenskart.com/media/desktop/img/Dec22/1-Dec/Homepage-Banner-web.gif";
  const heading = "As Seen on Shark Tank";

  return <SingleCom image={image} heading={heading} onSlideClick={onSlideClick} />;
};

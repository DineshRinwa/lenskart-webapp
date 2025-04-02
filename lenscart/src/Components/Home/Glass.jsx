import { SingleCom } from "../../Utils/SingleCom";

export const Glass = ({onSlideClick}) => {
  const image =
    "https://static1.lenskart.com/media/desktop/img/16-Mar-25/desktop-free.png";
  const heading = "Free Lens Replacement at Stores";

  return <SingleCom image={image} heading={heading} onSlideClick={onSlideClick} />;
};

import { SingleCom } from "../../Utils/SingleCom";

export const EyeCheck = ({onSlideClick}) => {
  const image =
    "https://static1.lenskart.com/media/desktop/img/2024/jun/eyetest/Turban-DesktopBanner.jpg";
  const heading = "Free Online Eye Test";

  return <SingleCom image={image} heading={heading} onSlideClick={onSlideClick} />;
};
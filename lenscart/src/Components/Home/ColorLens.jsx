import { SingleCom } from "../../Utils/SingleCom";

export const ColorLens = ({onSlideClick}) => {
  const image =
    "https://static1.lenskart.com/media/desktop/img/Oct22/kiara/Refresh-Banner-Web.gif";
  const heading = "Aquacolor - Glam Up With Color Lenses";

  return <SingleCom image={image} heading={heading} onSlideClick={onSlideClick} />;
};

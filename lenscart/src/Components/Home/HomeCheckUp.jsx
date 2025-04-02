import { SingleCom } from "../../Utils/SingleCom";

export const HomeCheckUp = ({onSlideClick}) => {

    const image = "https://static5.lenskart.com/media/uploads/hechome11.png";
    const heading = "Book Eye Test at Home";

    return <SingleCom image={image} heading={heading} onSlideClick={onSlideClick} />;
}
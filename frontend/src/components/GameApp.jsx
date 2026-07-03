import NavBar from "./navbar/NavBar";
import Info from "./main-static/Info";
import ReviewsDisplay from "./reviews/display/ReviewDisplay";

export default function GameApp() {
  return (
    <>
    <NavBar />
    <Info />
    <ReviewsDisplay />
    </>
  );
}

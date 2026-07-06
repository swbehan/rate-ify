import Info from "../components/main-static/Info";
import ReviewsDisplay from "../components/reviews/display/ReviewDisplay";
import { useUser } from "../context/UserContext.jsx";

export default function GameApp() {
  const { user } = useUser();
  return (
    <>
      <Info />
      {user ? (
        <ReviewsDisplay />
      ) : (
        <p>
          Please <a href="/login"> Log in to manage your reviews</a>
        </p>
      )}
    </>
  );
}

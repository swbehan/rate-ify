import { Container, Row } from "react-bootstrap";
import { useState, useCallback, useEffect } from "react";
import ReviewsForm from "../form/ReviewsForm";
import ReviewsList from "../list/ReviewsList";
import "./reviewsdisplay.css";

export default function ReviewsDisplay() {
  const [reviews, setReviews] = useState([]);
  const [query, setQuery] = useState("");

  //use callback will remember the function that is given as function parameter and will only call the function if the second paramter, which in this case is query, changes
  const reloadReviews = useCallback(async () => {
    const res = await fetch(`/api/reviews?q=${query}`);
    if (!res.ok) {
      console.error("Failed to fetch reviews:", res.status, res.statusText);
      return;
    }
    const data = await res.json();
    setReviews(data.reviews);
  }, [query]);

  useEffect(() => {
    const timeout = setTimeout(reloadReviews, 300);
    return () => {
      console.log("Fetching effect cleanup");
      clearTimeout(timeout);
    };
  }, [reloadReviews, query]);

  return (
    <Container className="px-5">
      <h3 className="reviews-header">Create a Review</h3>
      <ReviewsForm reloadReviews={reloadReviews} />
      <h3 className="reviews-header">Reviews</h3>
      <Row className="justify-content-center gx-3">
        <ReviewsList reviews={reviews} query={query} setQuery={setQuery} />
      </Row>
    </Container>
  );
}

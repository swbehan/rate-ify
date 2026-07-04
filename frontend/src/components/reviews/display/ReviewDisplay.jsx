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

  // HANDLE METHOD FOR POSTING NEW REVIEWS PASSED TO FORM COMPONENT
  const handleCreate = async (reviewData) => {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    if (!res.ok) {
      console.error("failed to create review", res.statusText);
      return;
    } else {
      console.log("Created new review", reviewData);
      reloadReviews();
    }
  };

  // HANDLE METHOD FOR DELETING EXISTING POSTS PASSED INTO THE REVIEW LIST COMPONENT
  const handleDelete = async (reviewId) => {
    const req = await fetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });
    if (!req.ok) {
      console.error("Failed to delete review", req.status, req.statusText);
      return;
    }
    console.log("Deleted review", reviewId);
    reloadReviews();
  };

  // HANDLE METHOD FOR UPDATING EXISTING POSTS PASSED INTO THE REVIEW LIST COMPONENT
  const handleUpdate = async (reviewId, newReviewData) => {
    const req = await fetch(`/api/reviews/${reviewId}`, {
      method: "PUT",
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify(newReviewData),
    });
    if (!req.ok) {
      console.error("Failed to update review", req.status, req.statusText);
      return;
    }
    console.log("Updated review", reviewId, newReviewData);
    reloadReviews();
  }

  return (
    <Container className="px-5">
      <h3 className="reviews-header">Create a Review</h3>
      <ReviewsForm onCreate={handleCreate}/>
      <h3 className="reviews-header">Reviews</h3>
      <Row className="justify-content-center gx-3">
        <ReviewsList
          reviews={reviews}
          query={query}
          setQuery={setQuery}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </Row>
    </Container>
  );
}

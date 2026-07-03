import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./reviews-form.css";

import { useState } from "react";

export default function ReviewsForm({ reloadReviews }) {
  const [review, setReview] = useState({
    reviewType: "",
    reviewImage: "",
    reviewRating: 0,
    reasoning: "",
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log("onSubmit", review);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });

    if (!res.ok) {
      console.error("failed to create review", res.statusText);
      return;
    } else {
      const data = await res.json();
      console.log("Listing created successfully", data);
      // reset the form after submission
      setReview({
        reviewType: "",
        reviewImage: "",
        reviewRating: 0,
        reasoning: "",
      });

      reloadReviews();
    }
  };

  return (
    <>
      <h2>Create Game Review</h2>
      <Form onSubmit={onSubmit}>
        <FloatingLabel controlId="floatingInput" label="Title" className="mb-3">
          <Form.Control
            type="text"
            value={review.reviewType}
            onChange={(event) =>
              setReview({ ...review, reviewType: event.target.value })
            }
            placeholder="Enter title"
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingInput"
          label="Image URL (https://...)"
          className="mb-3"
        >
          <Form.Control
            type="text"
            value={review.reviewImage}
            onChange={(event) =>
              setReview({ ...review, reviewImage: event.target.value })
            }
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingInput"
          label="Rating (out of 10)"
          className="mb-3"
        >
          <Form.Control
            type="number"
            min={0}
            max={10}
            step={0.5}
            value={review.reviewRating}
            onChange={(event) =>
              setReview({ ...review, reviewRating: +event.target.value })
            }
            placeholder="Enter rating"
          />
        </FloatingLabel>
        <Form.Group className="mb-3" controlId="reasoningTextarea">
          <Form.Control
            as="textarea"
            rows={5}
            value={review.reasoning}
            onChange={(event) =>
              setReview({ ...review, reasoning: event.target.value })
            }
            placeholder="Enter reasoning"
          />
        </Form.Group>
        <Button className="submitt-btn" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}

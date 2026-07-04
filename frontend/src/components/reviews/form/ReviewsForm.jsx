import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./reviews-form.css";

import { useState } from "react";

export default function ReviewsForm({ onCreate, onUpdate, onCancel, initialReview }) {
  const [review, setReview] = useState(
    initialReview
      ? {
          reviewType: initialReview.reviewType,
          reviewImage: initialReview.reviewImage,
          reviewRating: initialReview.reviewRating,
          reasoning: initialReview.reasoning,
        }
      : { reviewType: "", reviewImage: "", reviewRating: 0, reasoning: "" }
  );

  const isEditing = Boolean(initialReview?._id);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (isEditing) {
      await onUpdate(initialReview._id, review);
    } else {
      await onCreate(review);
      setReview({
        reviewType: "",
        reviewImage: "",
        reviewRating: 0,
        reasoning: "",
      });
    }
  };

  return (
    <>
      <h2>{isEditing ? "Edit Review" : "Create Review"}</h2>
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
          {isEditing ? "Save Changes" : "Submit"}
        </Button>
        {isEditing && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </Form>
    </>
  );
}

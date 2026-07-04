import { useState } from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ReviewsForm from "../form/ReviewsForm";
import "./review.css";

export default function Review({ review, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  const { _id, reviewType, reviewImage, reviewRating, reasoning } = review;
  if (isEditing) {
    return (
      <ReviewsForm
        initialReview={review}
        onUpdate={async (id, data) => {
          await onUpdate(id, data);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  } else {
    return (
      <Card className="mb-4">
        <Card.Img
          variant="top"
          className="image-wrap"
          src={reviewImage}
          alt={reviewType}
        />
        <Card.Body>
          <Card.Title>{reviewType}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Rating: {reviewRating}/10
          </Card.Subtitle>
          <Card.Text className="reasoning">{reasoning}</Card.Text>
          <Button variant="danger" onClick={() => onDelete(_id)}>
            Delete
          </Button>
          <Button variant="info" onClick={() => setIsEditing(true)}>
            Update Review
          </Button>
        </Card.Body>
      </Card>
    );
  }
}

import Card from "react-bootstrap/Card";
import "./review.css";

export default function Review({
  reviewType,
  reviewImage,
  reviewRating,
  reasoning,
}) {
  return (
    <Card className="mb-4">
      <Card.Img variant="top" className="image-wrap" src={reviewImage} alt={reviewType} />
      <Card.Body>
        <Card.Title>{reviewType}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Rating: {reviewRating}/10
        </Card.Subtitle>
        <Card.Text className="reasoning">{reasoning}</Card.Text>
      </Card.Body>
    </Card>
  );
}

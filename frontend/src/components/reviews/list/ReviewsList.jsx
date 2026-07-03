import Review from "./Review.jsx";

import "./review-list.css"

export default function ReviewsList({ reviews, query, setQuery }) {
  //creating a controlled component

  function renderReview(review, index) {
    return (
      <Review
        key={index}
        reviewType={review.reviewType}
        reviewImage={review.reviewImage}
        reviewRating={review.reviewRating}
        reasoning={review.reasoning}
      />
    );
  }

  const onQuery = (event) => {
    console.log("onQuery Fired", event.target.value);
    setQuery(event.target.value);
  };
  // the input field below is a contolled component since the state of it is controlled by the parent component,
  // the input is treated as its own component even though it is HTML
  // need to have a value prop and an onChange prop to controlled components
  return (
    <>
      <input value={query} className="input-review" onChange={onQuery} placeholder="Filter Reviews..." />
      {!reviews?.length ? (
        <div>Loading Reviews....</div>
      ) : (
        reviews.map((review, index) => renderReview(review, index))
      )}
    </>
  );
}
import { connect } from "./config.js";
import mongodb from "mongodb";

const { ObjectId } = mongodb;

function ReviewsCollection({ collectionName = "reviews" } = {}) {
  const me = {};

  const reviews = connect(collectionName);

  me.getReviews = async ({ query = {}, pageSize = 20, page = 0 } = {}) => {
    try {
      const data = await reviews
        .find(query)
        .limit(pageSize)
        .skip(pageSize * page)
        .toArray();
      return data;
    } catch (error) {
      console.error("Error fetching reviews from MongoDB", error);
      throw error;
    }
  };

  me.postReviewToDb = async (reviewData) => {
    try {
      const newReviewData = {
        ...reviewData,
        createdAt: new Date(),
      };
      const result = await reviews.insertOne(newReviewData);
      console.log("Posted review to MongoDB 📝");
      return result;
    } catch (error) {
      console.error("Error posting new review to MongoDB", error);
      throw error;
    }
  };

  me.deleteReview = async (id) => {
    try {
      // return null if the id is not vaild, malformed or non-existent
      if (!ObjectId.isValid(id)) return null;

      const result = await reviews.deleteOne({ _id: new ObjectId(id) });
      console.log("Deleted review from MongoDB ❌");
      return result;
    } catch (error) {
      console.error("Error review from MongoDB", error);
      throw error;
    }
  };

  me.updateReview = async (id, newReview) => {
    try {
      // return null if the id is not vaild, malformed or non-existent
      if (!ObjectId.isValid(id)) return null;

      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          reviewType: newReview.reviewType,
          reviewImage: newReview.reviewImage,
          reviewRating: newReview.reviewRating,
          reasoning: newReview.reasoning,
        },
      };
      const result = await reviews.updateOne(filter, updatedDoc);
      console.log("Updated review to MongoDB ⬆️");
      return result;
    } catch (error) {
      console.error("Error review from MongoDB", error);
      throw error;
    }
  };

  return me;
}

const reviewsCollection = ReviewsCollection();
export default reviewsCollection;

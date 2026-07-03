import { Router } from "express";
import reviewsCollection from "../db/review-db.js";

const reviewsRouter = Router();

reviewsRouter.get("/reviews", async (req, res) => {
  try {
    const search = req.query.q;
    const query = search
      ? { reasoning: { $regex: search.toString(), $options: "i" } }
      : {};

    const reviews = await reviewsCollection.getReviews({ query });
    res.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews", error);
    res.status(500).json({ error: "Internal Server Error", reviews: [] });
  }
});

reviewsRouter.post("/reviews", async (req, res) => {
  try {
    const result = await reviewsCollection.postReviewToDb(req.body);
    res.status(201).json({ message: "Successfully posted review", result });
  } catch (error) {
    console.error("Error posting data to the DB", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default reviewsRouter;

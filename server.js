import express from "express";
import reviewsRouter from "./routes/reviews.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("./frontend/dist"));

app.use("/api", reviewsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

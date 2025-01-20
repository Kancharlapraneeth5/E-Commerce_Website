import mongoose, { Schema } from "mongoose";
import { IReview } from "./reviewModel";

const reviewSchema = new Schema<IReview>({
  date: {
    type: Date,
    required: [true, "Review date is required"],
  },
  title: {
    type: String,
    required: [true, "Review title is required"],
  },
  comment: {
    type: String,
    required: [true, "Review comment is required"],
  },
  rating: {
    type: Number,
    required: [true, "Review rating is required"],
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Review productID is required"],
  },
});

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;

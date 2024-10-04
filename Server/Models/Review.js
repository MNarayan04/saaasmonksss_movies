import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  MovieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movies",
    required: true,
  },
  ReviewerName: {
    type: String,
    default: "Anonymous"
  },
  Rating: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },
  ReviewComment: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default:
      "https://w7.pngwing.com/pngs/364/361/png-transparent-account-avatar-profile-user-avatars-icon-thumbnail.png",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Reviews", reviewSchema);

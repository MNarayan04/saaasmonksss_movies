import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Desc: {
    type: String,
    default: "Not much about it!!!",
  },
  ReleaseDate: {
    type: Date,
    default: Date.now,
  },
  AvgRating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  AllRatings: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
    default: [],
  },
  moviePic: {
    type: String,
    default:
      "https://www.newsclick.in/sites/default/files/styles/responsive_885/public/2023-03/cinema.PNG?itok=biSh0x0Z",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Movies", movieSchema);

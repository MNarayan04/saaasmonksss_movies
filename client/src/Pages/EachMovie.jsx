import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";

const EachMovie = () => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");
  const [deleted, setDeleted] = useState("");

  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const respone = await axios.get(
          `https://saasmonk-moviecritic.vercel.app/api/v1/moviecritic/all-movies/${id}`
        );

        if (respone.status === 200) {
          console.log(respone.data);
          setMovieDetails(respone.data);
        } else {
          console.log("Something went wrong");
          setError("Error fethcing movie details");
        }
      } catch (error) {
        console.log("Something went wrong");
        setError("Error fethcing movie details");
      }
    };

    fetchMovieDetails();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
        try {
            const response = await axios.get(`https://saasmonk-moviecritic.vercel.app/api/v1/moviecritic/all-movies/reviews/${id}`);

            if(response.status===200) {
                setReviews(response.data);
                console.log(response.data);
            } else {
                console.log("Something went wrong");
                setError2("Error fethcing movie details");
              }
        } catch(error) {
            console.log("Something went wrong");
            setError2("Error fethcing review details");
        }
    }
    fetchReviews();
  }, [])

  const deleteReview = async (id) => {
    try{
        const response = await axios.delete(`https://saasmonk-moviecritic.vercel.app/api/v1/moviecritic/reviews/delete/${id}`);

        if(response.status===200) {
            console.log("Movie deleted successfully!!!");
            setReviews((prevReviews) => prevReviews.filter((review) => review._id !== id));
            setDeleted("Review deleted successfully!!!")
        }
    } catch (error) {
        console.log("Error deleting review");
        setDeleted("Error deleting review!!!")
    }
}

  return (
    <div>
      <Navbar />
      <div className="max-w-screen-2xl my-10 mx-10 flex items-center justify-between">
        <h2 className="flex flex-wrap text-5xl text-gray-700 font-semibold">
          {movieDetails?.Name}
        </h2>
        <h2 className="text-5xl text-indigo-400 font-semibold">
          {movieDetails?.AvgRating}/10
        </h2>
      </div>
      {deleted? (<h2 className="text-indigo-600 text-4xl text-center font-semibold">{deleted}</h2>) : ""}
      <div className="max-w-screen-2xl mx-10">
        {reviews.map((review) => (
            <div className="h-32 mt-3 w-auto rounded-sm bg-gray-50 border-2 border-gray-600">
            <div className="mx-5 py-4 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between w-auto">
                <p className="text-lg text-gray-700 flex flex-wrap">{review?.ReviewComment}</p>
                <p className="text-lg text-indigo-500">{review?.Rating}/10</p>
              </div>
              <div className="flex items-center justify-between w-auto">
                <p className="text-lg text-gray-700 flex flex-wrap italic">By {review?.ReviewerName}</p>
                <div className="flex items-center justify-between gap-4">
                  <Link to={`/edit-review-details/${review?._id}`}><BorderColorIcon className="text-gray-500 hover:text-gray-700" /></Link>
                  <Link onClick={() => deleteReview(review?._id)}><DeleteIcon className="text-gray-500 hover:text-gray-700" /></Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EachMovie;

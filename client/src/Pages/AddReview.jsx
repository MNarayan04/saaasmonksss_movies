import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddReview = () => {
    const [id, setId] = useState("");
    const [ReviewerName, setReviewerName] = useState("");
    const [Rating, setRating] = useState(0);
    const [ReviewComment, setReviewComment] = useState("");
    const [allMovies, setAllMovies] = useState([]);

    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllMovies = async () => {
            try {
                const response = await axios.get("https://saasmonk-moviecritic.vercel.app/api/v1/moviecritic/all-movies");
                console.log(response.data);
                if(response.status===200) {
                    setAllMovies(response.data);
                } else {
                    console.log("Something went wrong!!!");
                }
            } catch(error) {
                console.log("Error fetching movies:", error);
            }
        }

        fetchAllMovies();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const respone = await axios.post("https://saasmonk-moviecritic.vercel.app/api/v1/moviecritic/add-review", 
            {
                id,
                ReviewerName,
                Rating,
                ReviewComment
            })

            if(respone.status===201) {
                console.log("Review added successfully!!!");
                navigate('/')
            } else {
                console.log("Failed");
                setError("Error adding review");
                // Handle login error
              }
        } catch (error) {
            console.error("Error adding review", error);
            setError("Error adding review");
            // Handle error
          }
    } 
  return (
    <div>
    <Navbar />
    <form
     onSubmit={handleSubmit}
      className="mb-0 mt-6 max-mx-64 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 bg-gray-50"
    >
      <p className="text-center text-lg font-medium">
        Add new review
      </p>

      <div>
        <label htmlFor="Name" className="sr-only">
          Movie name
        </label>

        <div className="relative">
        <select
            id="Name"
            name="Name"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
          >
            <option value="">Movie Name</option>
            {allMovies.map((movie) => (
              <option key={movie?._id} value={movie?._id}>
                {movie?.Name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="ReviewerName" className="sr-only">
        ReviewerName (Optional)
        </label>
        <div className="relative">
          <input
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            type="text"
            placeholder="Reviewer Name (Optional)"
            value={ReviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="Rating" className="sr-only">
          Rating (Out of 10)
        </label>
        <div className="relative">
          <input
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            type="Number"
            placeholder="Rating"
            value={Rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="ReviewComment" className="sr-only">
          Review Comment
        </label>
        <div className="relative">
          <textarea
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
            type="text"
            placeholder="Add your views..."
            value={ReviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
      >
        Add a review
      </button>
    </form>
    {error && (
        <div className="flex items-center justify-center bg-red-300 p-4 rounded-md">
          <p className="text-center text-sm text-red-500">{error}</p>
        </div>
      )}
  </div>
  )
}

export default AddReview
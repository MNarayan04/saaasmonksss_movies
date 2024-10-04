import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";

const EditReviewDetails = () => {
  const [reviewDetails, setReviewDetails] = useState(null);
  const [ReviewerName, setReviewerName] = useState("");
  const [Rating, setRating] = useState(0);
  const [ReviewComment, setReviewComment] = useState("");

  const { id } = useParams();
  console.log(id);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviewDetails = async () => {
      try {
        const respone = await axios.get(
          `https://saasmonk-moviecritic.vercel.app/api/v1/moviecritic/all-reviews/${id}`
        );
        console.log(respone.data);

        if (respone.status === 200) {
          console.log(respone.data);
          setReviewDetails(respone.data);
        }
      } catch (error) {
        console.log("Something went wrong", error);
      }
    };

    fetchReviewDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const respone = await axios.put(
        `https://saasmonk-moviecritic.vercel.app/api/v1/moviecritic/edit-review-details/${id}`,
        {
          ReviewerName,
          Rating,
          ReviewComment,
        }
      );

      if (respone.status === 200) {
        console.log("Review updated successfully!!!");
        navigate("/");
      } else {
        console.log("Failed");
        setError("Error updating review");
        // Handle login error
      }
    } catch (error) {
      console.error("Error updating review", error);
      setError("Error updating review");
      // Handle error
    }
  };

  return (
    <div>
      <Navbar />
      <form
        onSubmit={handleSubmit}
        className="mb-0 mt-6 max-mx-64 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 bg-gray-50"
      >
        <p className="text-center text-lg font-medium">Edit a review</p>
        <p className="text-center mt-5 text-lg font-medium">(You can edit all the fields)</p>

        <div>
          <label htmlFor="ReviewerName" className="sr-only">
            ReviewerName (Optional)
          </label>
          <div className="relative">
            <input
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              type="text"
              placeholder={reviewDetails?.ReviewerName}
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
              placeholder={reviewDetails?.Rating}
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
              placeholder={reviewDetails?.ReviewComment}
              value={ReviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
        >
          Edit a review
        </button>
      </form>
    </div>
  );
};

export default EditReviewDetails;

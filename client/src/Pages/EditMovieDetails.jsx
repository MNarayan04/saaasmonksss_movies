import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { useNavigate, useParams } from "react-router-dom";

const EditMovieDetails = () => {
    const [movieDetails, setMovieDetails] = useState(null);
    const [Name, setName] = useState("");
    const [Desc, setDesc] = useState("");
    const [ReleaseDate, setReleaseDate] = useState("");
    const [error, setError] = useState("");

    const {id} = useParams();
    console.log(id);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovieDetails = async () => {
          try {
            const respone = await axios.get(
              `https://saasmonk-moviecritic.vercel.app/api/v1/moviecritic/all-movies/${id}`
            );
            console.log(respone.data);
    
            if (respone.status === 200) {
              console.log(respone.data);
              setMovieDetails(respone.data);
            } 
          } catch (error) {
            console.log("Something went wrong", error);
           
          }
        };
    
        fetchMovieDetails();
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const respone = await axios.put(`https://saasmonk-moviecritic.vercel.app/api/v1/moviecritic/edit-movie-details/${id}`, 
            {
                Name,
                Desc,
                ReleaseDate
            })

            if(respone.status===200) {
                console.log("Movie updated successfully!!!");
                navigate('/')
            } else {
                console.log("Failed");
                setError("Error updating movie");
                // Handle login error
              }
        } catch (error) {
            console.error("Error updating movie", error);
            setError("Error updating movie");
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
        <p className="text-center text-lg font-medium">Edit Movie Details</p>
        <p className="text-center mt-5 text-lg font-medium">(You can edit all the fields)</p>

        <div>
          <label htmlFor="Name" className="sr-only">
            Movie name
          </label>

          <div className="relative">
            <input
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              type="text"
              placeholder={movieDetails?.Name}
              value={Name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="Desc" className="sr-only">
            Description (Optional)
          </label>
          <div className="relative">
            <textarea
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              type="text"
              placeholder={movieDetails?.Desc}
              value={Desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="ReleaseDate" className="sr-only">
            Release Date
          </label>
          <div className="relative">
            <input
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              type="text"
              placeholder="YYYY-MM-DD"
              value={ReleaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
        >
          Update Movie Details
        </button>
      </form>
      {error && (
        <div className="flex items-center justify-center bg-red-300 p-4 rounded-md">
          <p className="text-center text-sm text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
};

export default EditMovieDetails;

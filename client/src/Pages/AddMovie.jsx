import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddMovie = () => {
    const [Name, setName] = useState("");
    const [Desc, setDesc] = useState("");
    const [ReleaseDate, setReleaseDate] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const respone = await axios.post("https://saasmonk-moviecritic.vercel.app/api/v1/moviecritic/add-movie", 
            {
                Name,
                Desc,
                ReleaseDate
            })

            if(respone.status===201) {
                console.log("Movie added successfully!!!");
                navigate('/')
            } else {
                console.log("Failed");
                setError("Error adding movie");
                // Handle login error
              }
        } catch (error) {
            console.error("Error adding movie", error);
            setError("Login Details Are Wrong!!");
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
          Add new movie
        </p>

        <div>
          <label htmlFor="Name" className="sr-only">
            Movie name
          </label>

          <div className="relative">
            <input
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              type="text"
              placeholder="Movie name"
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
              placeholder="Add Description (Optional)"
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
          Add a movie
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

export default AddMovie;

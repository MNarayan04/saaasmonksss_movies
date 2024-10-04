import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
    const [allMovies, setAllMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleted, setDeleted] = useState("");


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

    const deleteMovie = async (id) => {
        try{
            const response = await axios.delete(`https://saasmonk-moviecritic.vercel.app/api/v1/moviecritic/movies/delete/${id}`);

            if(response.status===200) {
                console.log("Movie deleted successfully!!!");
                setAllMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== id));
                setDeleted("Movie deleted successfully!!!")
            }
        } catch (error) {
            console.log("Error deleting movie");
            setDeleted("Error deleting movie!!!")
        }
    }

    const filteredMovies = allMovies.filter(movie =>
        movie.Name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div>
      <Navbar />
      <div className="max-w-screen-sm mx-10 my-12 flex flex-col justify-between gap-8 items-left">
        <h2 className="text-gray-600 text-4xl font-semibold">
          The best movie reviews site!
        </h2>
        <div className="w-auto">
          <div className="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-indigo-300 rounded-sm bg-gray-50 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search movies..."
              required
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

        {deleted? (<h2 className="text-indigo-600 text-4xl text-center font-semibold">{deleted}</h2>) : ""}

      <div>
        <div class="bg-white py-6 sm:py-8 lg:py-12">
          <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
            <div class="grid gap-4 sm:grid-cols-2 md:gap-8 xl:grid-cols-3">
                {filteredMovies.map((movie) => (
                    <Link to={`/each-movie/${movie?._id}`} key={movie._id} class="flex flex-col rounded-sm bg-gray-300 border p-4 md:p-6">
                    <h3 class="mb-2 text-xl font-medium md:text-2xl">{movie.Name}</h3>
                    <h3 class="mb-2 text-lg font-medium italic md:text-xl">Released: {new Date(movie?.ReleaseDate).toLocaleDateString('en-GB')}</h3>
                    <h3 class="mb-2 text-lg font-bold md:text-xl">Rating: {movie?.AvgRating}</h3>
                    <div className="flex justify-end items-center gap-4">
                        <Link to={`/edit-movie-details/${movie?._id}`}><BorderColorIcon className="text-gray-500 hover:text-gray-700" /></Link>
                        <Link onClick={() => deleteMovie(movie._id)} ><DeleteIcon className="text-gray-500 hover:text-gray-700" /></Link>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

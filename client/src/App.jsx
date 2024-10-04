import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import AddMovie from "./Pages/AddMovie";
import AddReview from "./Pages/AddReview";
import EditMovieDetails from "./Pages/EditMovieDetails";
import EditReviewDetails from "./Pages/EditReviewDetails";
import EachMovie from "./Pages/EachMovie";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="/add-movie" element={<AddMovie />} />
          <Route path="/add-review" element={<AddReview />} />
          <Route path="/each-movie/:id" element={<EachMovie />} />
          <Route path="/edit-movie-details/:id" element={<EditMovieDetails />} />
          <Route path="/edit-review-details/:id" element={<EditReviewDetails />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

import express from "express";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import Movies from "../Models/Movie.js";
import Reviews from "../Models/Review.js";

dotenv.config();

const router = express.Router();

const credentials = {
    accessKeyId: process.env.ACCESS_KEY_MOVIEPICS,
    secretAccessKey: process.env.SECRET_KEY_MOVIEPICS
};

const s3Client = new S3Client({
    endpoint: "https://s3.tebi.io",
    credentials: credentials,
    region: "global"
});

// Handle Image file upload
router.post('/upload-movie-pic', async (req, res) => {
    try {
        const file = req.files && req.files.myFile; // Change 'myFile' to match the key name in Postman
        
        if (!file) {
            return res.status(400).send('No file uploaded');
        }

        // Generate a unique identifier
        const uniqueIdentifier = uuidv4();

        // Get the file extension from the original file name
        const fileExtension = file.name.split('.').pop();

        // Create a unique filename by appending the unique identifier to the original filename
        const uniqueFileName = `${uniqueIdentifier}.${fileExtension}`;

        // Convert file to base64
        const base64Data = file.data.toString('base64');

        // Create a buffer from the base64 data
        const fileBuffer = Buffer.from(base64Data, 'base64');

        const uploadData = await s3Client.send(
            new PutObjectCommand({
                Bucket: "moviepics",
                Key: uniqueFileName, // Use the unique filename for the S3 object key
                Body: fileBuffer // Provide the file buffer as the Body
            })
        );

        // Generate a public URL for the uploaded file
        const getObjectCommand = new GetObjectCommand({
            Bucket: "moviepics",
            Key: uniqueFileName
        });

        const signedUrl = await getSignedUrl(s3Client, getObjectCommand); // Generate URL valid for 1 hour

        // Parse the signed URL to extract the base URL
        const parsedUrl = new URL(signedUrl);
        const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.pathname}`;

        // Send the URL as a response
        res.status(200).send(baseUrl);

        // Log the URL in the console
        console.log("File uploaded. URL:", baseUrl);
    } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(500).send('Error uploading file');
    }
});

// ADD MOVIE
router.post('/add-movie', async (req, res) => {
    try {
        const {Name, Desc, ReleaseDate, moviePic} = req.body;

        if(!Name) {
            return res.status(401).send("Movie name is mandatory!!!");
        }

        const newMovie = new Movies({
            Name,
            Desc,
            ReleaseDate,
            moviePic
        });

        await newMovie.save();

        if(newMovie) {
            return res.status(201).json({message: "Movie added successfully!!!"});
        } else {
            return res.status(402).send("Something went wrong!!!");
        }

    } catch(error) {
        console.error("Error adding movie:", error);
        return res.status(500).send('Error adding movie: ', error);
    }
})

// ADD REVIEW
router.post('/add-review', async (req, res) => {
    try {

        const { id, ReviewerName, Rating, ReviewComment } = req.body;

        if(!Rating) {
            return res.status(402).json("Rating is mandatory!!!");
        }

        if(!ReviewComment) {
            return res.status(402).json("Review Comment is mandatory!!!");
        }

        const newReview = new Reviews({
            MovieId: id,
            ReviewerName,
            Rating,
            ReviewComment,
        });

        await newReview.save();

        await Movies.findByIdAndUpdate({_id: id}, {
            $push: {AllRatings: newReview.id}
        })

        const allRatings = await Reviews.find({ MovieId: id });
        const totalRatings = allRatings.reduce((sum, review) => sum + review.Rating, 0);
        const avgRating = totalRatings / allRatings.length;

        const MovieReviewUpdate = await Movies.findByIdAndUpdate(id, { AvgRating: avgRating });

        console.log(MovieReviewUpdate);

        if(newReview && MovieReviewUpdate) {
            return res.status(201).json({message: "Review added successfully!!!"});
        } else {
            return res.status(403).json("Something went wrong!!!");
        }

    } catch(error) {
        console.error("Error adding review:", error);
        return res.status(500).send('Error adding review: ', error);
    }
})

// GET ALL MOVIES
router.get('/all-movies', async (req, res) => {
    try {
        const allMovies = await Movies.find({});

        console.log(allMovies);

        if(allMovies) {
            return res.status(200).json(allMovies);
        } else {
            return res.status(401).json("Something went wrong!!!");
        }

    } catch (error) {
        console.log("Error fetching all movies.", error);
        return res.status(500).json("Error fetching all movies!!!", error);
    }
});

router.get('/all-movies/:id', async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) {
            return res.status(401).json("Movie id is mandatory!!!");
        }

        const movie = await Movies.findById({_id: id});
        if(movie) {
            return res.status(200).json(movie);
        } else {
            return res.status(402).json("Something went wrong!!!");
        }

    } catch(error) {
        console.log("Error fetching movie information", error);
        return res.status(500).json("Error fetching movie information", error);
    }
});

router.get('/all-movies/reviews/:id', async (req, res) => {
    try {
        const {id} = req.params;

        const reviews = await Reviews.find({MovieId: id});
        console.log(reviews);
        return res.status(200).json(reviews);
    } catch(error) {
        console.log("Error fetching reviews of the movie", error);
        return res.status(500).json("EError fetching reviews of the movie", error);
    }
});

router.get('/all-reviews', async (req, res) => {
    try {
        const allReviews = await Reviews.find({});

        console.log(allReviews);

        if(allReviews) {
            return res.status(200).json(allReviews);
        } else {
            return res.status(401).json("Something went wrong!!!");
        }
    } catch (error) {
        console.log("Error fetching all reviews.", error);
        return res.status(500).json("Error fetching all reviews!!!", error);
    }
});

router.get('/all-reviews/:id', async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) {
            return res.status(401).json("Review id is mandatory!!!");
        }

        const review = await Reviews.findById({_id: id});
        if(review) {
            return res.status(200).json(review);
        } else {
            return res.status(402).json("Something went wrong!!!");
        }

    } catch(error) {
        console.log("Error fetching review information", error);
        return res.status(500).json("Error fetching review information", error);
    }
})

router.put('/edit-movie-details/:id', async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) {
            return res.status(401).json({message:"Movie id is mandatory!!!"});
        }
        const {Name, Desc, ReleaseDate, moviePic} = req.body;

        const movie = await Movies.findById({_id: id});
        if(!movie) {
            return res.status(402).json({message: "No movie found!!!"});
        }

        if(Name) {
            movie.Name = Name;
            await movie.save();
        } else {
            movie.Name = movie.Name;
            await movie.save();
        }

        if(Desc) {
            movie.Desc = Desc;
            await movie.save();
        } else {
            movie.Desc = movie.Desc;
            await movie.save();
        }

        if(ReleaseDate) {
            movie.ReleaseDate = ReleaseDate;
            await movie.save();
        } else {
            movie.ReleaseDate = movie.ReleaseDate;
            await movie.save();
        }

        if(moviePic) {
            movie.moviePic = moviePic;
            await movie.save();
        } else {
            movie.moviePic = movie.moviePic;
            await movie.save();
        }

        return res.status(200).json({message: "Movie details are updated successfully!!!", movie})
    } catch(error) {
        console.log("Error editing movie details", error);
        return res.status(500).json("Error editing movie details!!!", error);
    }
});

router.put('/edit-review-details/:id', async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) {
            return res.status(401).json({message:"Review id is mandatory!!!"}); 
        }

        const {ReviewerName, Rating, ReviewComment, profilePic} = req.body;

        const review = await Reviews.findById({_id: id});
        if(!review) {
            return res.status(402).json({message: "No review found!!!"});
        }

        if(ReviewerName) {
            review.ReviewerName = ReviewerName;
            await review.save();
        } else {
            review.ReviewerName = review.ReviewerName;
            await review.save();
        }

        if(Rating) {
            review.Rating = Rating;

            await review.save();

            // const reviewNew = await Reviews.findById(id);

            // const movie = reviewNew.MovieId;
            // console.log(movie);

            const allRatings = await Reviews.find({ MovieId: review.MovieId });
            const totalRatings = allRatings.reduce((sum, review) => sum + review.Rating, 0);
            const avgRating = totalRatings / allRatings.length;
    
            const MovieReviewUpdate = await Movies.findByIdAndUpdate(review.MovieId, { AvgRating: avgRating });
           
        } else {
            review.Rating = review.Rating;
            await review.save();
        }

        if(ReviewComment) {
            review.ReviewComment = ReviewComment;
            await review.save();
        } else {
            review.ReviewComment = review.ReviewComment;
            await review.save();
        }

        if(profilePic) {
            review.profilePic = profilePic;
            await review.save();
        } else {
            review.profilePic = review.profilePic;
            await review.save();
        }


        return res.status(200).json({message: "Review details are updated successfully!!!", review})

    } catch(error) {
        console.log("Error editing movie details", error);
        return res.status(500).json({message: "Error editing movie details!!!", error});
    }
});

router.delete('/movies/delete/:id', async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) {
            return res.status(401).json("Movie id is mandatory!!!");
        }

        const reviews = await Reviews.deleteMany({ MovieId: id });

        const deleteMovie = await Movies.findByIdAndDelete({_id: id});

        if (!deleteMovie) {
            return res.status(404).json("Movie not found!");
        }

        return res.status(200).json("Movie deleted successfully!");


    } catch(error) {
        console.log("Error deleting movie information", error);
        return res.status(500).json("Error deleting movie information", error);
    }
})

router.delete('/reviews/delete/:id', async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) {
            return res.status(401).json("review id is mandatory!!!");
        }

        const review = await Reviews.findById(id);

        await Movies.findOneAndUpdate(
            { _id: review.MovieId }, // Replace 'movieId' with the actual field in your Movies schema where you store review IDs
            { $pull: { reviews: id } }
          );

        const deleteReview = await Reviews.findByIdAndDelete({_id: id});

        if (!deleteReview) {
            return res.status(404).json("Review not found!");
        }

        return res.status(200).json("Review deleted successfully!");


    } catch(error) {
        console.log("Error deleting review information", error);
        return res.status(500).json("Error deleting review information", error);
    }
})
export default router;
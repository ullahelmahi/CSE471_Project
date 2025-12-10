import React, { useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles

const Reviews = () => {
    const [reviews, setReviews] = React.useState([]);

    useEffect(() => {
        fetch('/reviews.json') // Adjust the path if necessary
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(error => console.error('Error fetching reviews:', error));
    }, []);

    return (
        <div className="my-10">
            <h1 className="text-4xl text-center font-bold mb-6">What Our Clients Say</h1>
            <p className="text-center mb-10">We are proud to have served thousands of satisfied customers. Here are some of their testimonials:</p>

            <Carousel
                showArrows={true}
                infiniteLoop={true}
                showThumbs={false}
                showStatus={false}
                autoPlay={true}
                interval={5000}
                className="w-3/4 mx-auto"
            >
                {reviews.map(review => (
                    <div key={review._id.$oid} className="p-6">
                        <div className="card w-full bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-xl font-bold">{review.userName}</h2>
                                <p className="text-sm text-gray-500">Plan: {review.planId}</p>
                                <p className="text-sm text-gray-500">Rating: {review.rating} / 5</p>
                                <p className="mt-4">{review.comment}</p>
                                <div className="mt-4">
                                    <span className="text-sm font-semibold">Tags:</span>
                                    <ul className=" list-inside text-sm text-gray-600">
                                        {review.tags.map((tag, index) => (
                                            <li key={index}>{tag}</li>
                                        ))}
                                    </ul>
                                </div>
                                <p className="text-xs text-gray-400 mt-4">
                                    Reviewed on: {new Date(review.createdAt.$date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default Reviews;
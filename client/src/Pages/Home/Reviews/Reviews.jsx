import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import API from "../../../services/api";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    API.get("/reviews").then(res => {
      setReviews(res.data || []);

      if (res.data?.length) {
        const avg =
          res.data.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
          res.data.length;
        setAvgRating(avg.toFixed(1));
      }
    });
  }, []);

  return (
    <section className="bg-black py-16">
      <h2 className="text-4xl font-bold text-center text-purple-500">
        What Our Clients Say
      </h2>

      <p className="text-center text-white mt-2">
        Honest feedback from our valued customers
      </p>

      <p className="text-center text-yellow-400 mt-4 text-lg">
        ⭐ Average Rating: {avgRating} / 5
      </p>

      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        stopOnHover
        interval={5000}
        className="max-w-3xl mx-auto mt-10"
      >
        {reviews.map(r => (
          <div key={r._id} className="p-6">
            <div className="bg-gray-100 p-6 rounded-lg text-black">

              {/* HEADER */}
              <div className="flex justify-between text-sm text-gray-600">
                <span className="font-semibold">
                  {r.userName || "Anonymous"}
                </span>
                <span>
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* PLAN */}
              <h3 className="text-lg font-semibold mt-2">
                {r.planName}
              </h3>

              {/* RATING */}
              <p className="text-yellow-500 mt-1">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </p>

              {/* MESSAGE BOX (RECTANGLE) */}
              <div
                className="border border-purple-400 mt-4 p-4 bg-white"
                style={{ borderRadius: "4px" }}
              >
                {r.message}
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default Reviews;
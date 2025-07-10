import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axiosClient from "../../../api/axiosClient";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Copy y hệt TourCard cách resolve ảnh
  const getImageUrl = (path) => {
    if (!path) return "/default-image.jpg";
    return path.startsWith("http")
        ? path
        : `http://localhost:8084/assets/${path}`;
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1) Lấy feedback
        const { data: feedbacks } = await axiosClient.get("/feedbacks");

        // 2) Unique tourId
        const tourIds = [...new Set(feedbacks.map((f) => f.tourId))];

        // 3) Gọi song song /api/tours/{id}
        const tourPromises = tourIds.map((id) =>
            axiosClient.get(`/tours/${id}`)
        );
        const tourResponses = await Promise.all(tourPromises);

        // 4) Build map tourId -> tourObj
        const toursMap = {};
        for (const res of tourResponses) {
          const tour = res.data;
          // backend TourController trả về JSON có trường tourId:
          toursMap[tour.tourId] = tour;
        }

        // 5) Map feedbacks -> comments đầy đủ
        const mapped = feedbacks.map((fb) => {
          const tour = toursMap[fb.tourId] || {};
          return {
            id: fb.id,
            name: fb.userFullName,
            text: fb.content,
            img: getImageUrl(tour.imagePath),
            tourName: tour.tourName || fb.tourName,
          };
        });

        setComments(mapped);
      } catch (err) {
        console.error("Lỗi fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Loading skeleton đơn giản
  if (loading) {
    return (
        <div className="py-20 text-center text-gray-400">
          Đang tải bình luận...
        </div>
    );
  }

  const count = comments.length;
  const carouselSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const renderCard = (c) => (
      <div key={c.id} className="px-4 my-6">
        <div className="relative bg-primary/10 dark:bg-gray-800 shadow-lg rounded-xl py-8 px-6 flex flex-col items-center text-center">
          {/* Cố định kích thước để tránh layout shift */}
          <div className="w-20 h-20 mb-4 relative">
            <img
                src={c.img}
                alt={c.name}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => (e.currentTarget.src = "/default-image.jpg")}
            />
          </div>
          <p className="text-xs text-gray-500">{c.text}</p>
          <h3 className="mt-3 text-xl font-bold text-black/80 dark:text-light">
            {c.name}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            <strong>Tour:</strong> {c.tourName}
          </p>
          <span className="absolute top-2 right-4 text-6xl font-serif text-black/10 dark:text-white/10">
          “”
        </span>
        </div>
      </div>
  );

  if (count === 0) {
    return (
        <div className="py-10 mb-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 max-w-[600px] mx-auto">
              <p className="text-sm text-primary">
                Những đánh giá thú vị về trải nghiệm của khách hàng
              </p>
              <h1 className="text-3xl font-bold">Bình luận</h1>
            </div>
            <div className="text-center text-gray-500 py-20">
              Không có bình luận nào.
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="py-10 mb-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 max-w-[600px] mx-auto">
            <p className="text-sm text-primary">
              Những đánh giá thú vị về trải nghiệm của khách hàng
            </p>
            <h1 className="text-3xl font-bold">Bình luận</h1>
          </div>

          <div className="mb-12">
            {count >= 4 ? (
                <Slider {...carouselSettings}>{comments.map(renderCard)}</Slider>
            ) : count === 3 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {comments.map(renderCard)}
                </div>
            ) : count === 2 ? (
                <div className="flex justify-center space-x-6">
                  {comments.map((c) => (
                      <div key={c.id} className="w-full md:w-1/2">
                        {renderCard(c)}
                      </div>
                  ))}
                </div>
            ) : (
                <div className="flex justify-center">
                  <div className="w-full md:w-1/3">{renderCard(comments[0])}</div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Comments;

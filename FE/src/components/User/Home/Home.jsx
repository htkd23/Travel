import React from "react";
import Slider from "react-slick";
import {useT} from "../../translate.js";

// Import ảnh cho Hero
import Babylon from "../../assets/7KyQuan/Babylon.jpg";
import DauTruongLaMa from "../../assets/7KyQuan/DauTruongLaMa.jpg";
import KheopsPyramid from "../../assets/7KyQuan/Kheops-Pyramid.jpg";
import Mexico from "../../assets/7KyQuan/Mexico.JPG";
import Peru from "../../assets/7KyQuan/Peru.jpg";
import Petra from "../../assets/7KyQuan/Petra.jpg";
import TajMahal from "../../assets/7KyQuan/TajMahal.jpg";
import VanLyTruongThanh from "../../assets/7KyQuan/VanLyTruongThanh.jpg";

const t = useT();

const ImageList = [
  { id: 1, img: Babylon, title: "Chúa Kitô Cứu Thế - Brazil", description: "Một trong bảy kỳ quan thế giới hiện đại, nằm trên đỉnh núi Corcovado." },
  { id: 2, img: DauTruongLaMa, title: "Đấu Trường La Mã - Italy", description: "Biểu tượng lịch sử của Đế chế La Mã, nơi diễn ra các trận đấu võ sĩ giác đấu." },
  { id: 3, img: KheopsPyramid, title: "Kim Tự Tháp Giza - Ai Cập", description: "Kỳ quan thế giới cổ đại duy nhất còn tồn tại đến ngày nay." },
  { id: 4, img: Mexico, title: "Chichén Itzá - Mexico", description: "Di tích của nền văn minh Maya với kim tự tháp El Castillo nổi tiếng." },
  { id: 5, img: Peru, title: "Machu Picchu - Peru", description: "Thành phố cổ bí ẩn của người Inca, nằm trên dãy Andes." },
  { id: 6, img: Petra, title: "Petra - Jordan", description: "Thành phố cổ được khắc vào đá, còn được gọi là 'Thành phố Hoa Hồng'." },
  { id: 7, img: TajMahal, title: "Taj Mahal - Ấn Độ", description: "Biểu tượng tình yêu vĩnh cửu, một tuyệt tác kiến trúc Mô-gôn." },
  { id: 8, img: VanLyTruongThanh, title: "Vạn Lý Trường Thành - Trung Quốc", description: "Công trình phòng thủ vĩ đại kéo dài hàng nghìn km." },
];

// Dữ liệu đánh giá khách hàng
const CommentsData = [
  { id: 1, name: "Victor", text: "Trải nghiệm tuyệt vời! Tôi sẽ quay lại.", img: "https://picsum.photos/101/101" },
  { id: 2, name: "Satya Nadella", text: "Hướng dẫn viên rất nhiệt tình, chuyến đi đáng nhớ.", img: "https://picsum.photos/102/102" },
  { id: 3, name: "Virat Kohli", text: "Dịch vụ rất tốt, đáng giá từng xu!", img: "https://picsum.photos/104/104" },
  { id: 4, name: "Sachin Tendulkar", text: "Rất hài lòng, chắc chắn sẽ giới thiệu cho bạn bè.", img: "https://picsum.photos/103/103" },
];

const HeroWithComments = ({ handleOrderPopup }) => {
  // Cài đặt slider cho Hero
  const heroSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
  };

  // Cài đặt slider cho Comments
  const commentsSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] flex justify-center items-center duration-200">
        <div className="container mx-auto px-6 pb-8 sm:pb-0">
          <Slider {...heroSettings}>
            {ImageList.map((data) => (
              <div key={data.id} className="relative min-h-[550px] sm:min-h-[650px] flex items-center justify-center overflow-hidden rounded-3xl">
                <img src={data.img} alt={data.title} className="absolute inset-0 w-full h-full object-cover rounded-3xl" />
                <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>
                <div className="relative z-10 text-center sm:text-left text-white px-8 sm:px-16">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">{data.title}</h1>
                  <p className="mt-4 text-lg sm:text-xl">{data.description}</p>
                  <button onClick={handleOrderPopup} className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 duration-200 text-white py-3 px-6 rounded-full">
                    Tìm Hiểu Thêm
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Comments Section */}
      <div className="py-10 mb-10">
        <div className="container">
          <div className="text-center mb-10 max-w-[600px] mx-auto">
            <p data-aos="fade-up" className="text-sm text-primary">Những đánh giá thú vị về trải nghiệm của khách hàng</p>
            <h1 data-aos="fade-up" className="text-3xl font-bold">Đánh Giá Của Khách Hàng</h1>
          </div>
          <div data-aos="zoom-in">
            <Slider {...commentsSettings}>
              {CommentsData.map((data) => (
                <div key={data.id} className="my-6 px-4">
                  <div className="flex flex-col gap-4 shadow-lg py-8 px-6 rounded-xl dark:bg-gray-800 bg-primary/10 relative">
                    <div className="mb-4 flex justify-center">
                      <img src={data.img} alt={data.name} className="rounded-full w-20 h-20" />
                    </div>
                    <div className="text-center space-y-3">
                      <p className="text-xs text-gray-500">{data.text}</p>
                      <h1 className="text-xl font-bold text-black/80 dark:text-light">{data.name}</h1>
                    </div>
                    <p className="text-black/20 text-9xl font-serif absolute top-0 right-0">,,</p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroWithComments;

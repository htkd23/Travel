import React from 'react';
import Slider from 'react-slick';

import Babylon from "../../../assets/7KyQuan/Babylon.jpg";
import DauTruongLaMa from "../../../assets/7KyQuan/DauTruongLaMa.jpg";
import KheopsPyramid from "../../../assets/7KyQuan/Kheops-Pyramid.jpg";
import Mexico from "../../../assets/7KyQuan/Mexico.JPG";
import Peru from "../../../assets/7KyQuan/Peru.jpg";
import Petra from "../../../assets/7KyQuan/Petra.jpg";
import TajMahal from "../../../assets/7KyQuan/TajMahal.jpg";
import VanLyTruongThanh from "../../../assets/7KyQuan/VanLyTruongThanh.jpg";

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

const Hero = ({ handleOrderPopup }) => {
    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 800,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        cssEase: "ease-in-out",
        pauseOnHover: false,
        pauseOnFocus: false,
    };

    return (
        <div className="relative mt-[80px] flex justify-center items-center">
            <div className="w-[85%] max-w-[1200px]">
                <Slider {...settings} className="w-full">
                    {ImageList.map((data) => (
                        <div key={data.id} className="relative w-full rounded-3xl overflow-hidden bg-gray-200">
                            <img
                                src={data.img}
                                alt={data.title}
                                className="w-full h-[500px] object-cover rounded-3xl"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>
                            <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center text-white px-4 sm:px-8">
                                <h1 className="text-3xl sm:text-4xl font-bold">{data.title}</h1>
                                <p className="mt-2 text-base sm:text-lg">{data.description}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>




    );
};

export default Hero;

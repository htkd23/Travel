import React, { useState } from "react";
import vid from "../../../assets/sea.mp4";
import HeroChoice from "./HeroChoice";
import ResultSearch from "./ResultSearch";

const Choice = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [tourData, setTourData] = useState([]);
    const [hotelData, setHotelData] = useState([]);
    const [topTourNames, setTopTourNames] = useState([]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Video nhỏ lại */}
      <div className="w-full h-[500px] relative">
        <video autoPlay loop muted className="w-full h-full object-cover">
          <source src={vid} />
        </video>
        {/* Form tìm kiếm full chiều rộng */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4">
          <div className="w-full max-w-[1200px] mx-auto">
              <HeroChoice
                  setWeatherData={setWeatherData}
                  setDestination={setDestination}
                  setDate={setDate}
                  setTourData={setTourData}
                  setHotelData={setHotelData}
                  setTopTourNames={setTopTourNames} // ✅
              />
          </div>
        </div>
      </div>

      {/* Kết quả tìm kiếm nằm dưới */}
      <div className="w-full bg-white py-10">
          <ResultSearch
              weatherData={weatherData}
              selectedDate={date}
              tourData={tourData}
              hotelData={hotelData}
              topTourNames={topTourNames} // ✅
          />
      </div>
    </div>
  );
};

export default Choice;

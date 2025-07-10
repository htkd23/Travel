package com.travel5.be.service;

import com.travel5.be.config.VietnameseNormalizer;
import com.travel5.be.entity.Hotel;
import com.travel5.be.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public Hotel getHotelById(Integer id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách sạn với ID: " + id));
    }

    public Hotel createHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public Hotel updateHotel(Integer id, Hotel newHotel) {
        Hotel existing = getHotelById(id);
        existing.setHotelName(newHotel.getHotelName());
        existing.setAddress(newHotel.getAddress());
        existing.setRating(newHotel.getRating());
        existing.setDescription(newHotel.getDescription());
        existing.setHighlight(newHotel.getHighlight());
        existing.setFacilities(newHotel.getFacilities());
        existing.setHotelType(newHotel.getHotelType());
        existing.setSuitableFor(newHotel.getSuitableFor());
        existing.setPriceStart(newHotel.getPriceStart());
        existing.setImagePath(newHotel.getImagePath());

        return hotelRepository.save(existing);
    }

    public void deleteHotel(Integer id) {
        hotelRepository.deleteById(id);
    }
    public List<Hotel> searchHotels(String keyword) {
        String normalizedKeyword = VietnameseNormalizer.normalize(keyword);
        return hotelRepository.findByHotelNameLikeOrAddressLikeOrDescriptionLike(
                "%" + normalizedKeyword + "%", "%" + normalizedKeyword + "%", "%" + normalizedKeyword + "%");
    }
}

package com.travel5.be.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travel5.be.dto.HotelDTO;
import com.travel5.be.entity.Hotel;
import com.travel5.be.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.nio.file.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin("*")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    // ✅ USER + ADMIN được phép xem danh sách
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllHotels());
    }

    // ✅ USER + ADMIN được phép xem chi tiết
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Integer id) {
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }

    // ✅ CHỈ ADMIN được phép thêm
    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Hotel> createHotel(
            @RequestPart("hotelDTO") String hotelDTOJson,
            @RequestPart("image") MultipartFile imageFile) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            HotelDTO dto = objectMapper.readValue(hotelDTOJson, HotelDTO.class);

            // Lưu ảnh
            String filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            Path imagePath = Paths.get("src/main/resources/static/assets/hotel/", filename);
            Files.createDirectories(imagePath.getParent());
            Files.copy(imageFile.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

            // Tạo hotel từ DTO
            Hotel hotel = new Hotel();
            hotel.setHotelName(dto.getHotelName());
            hotel.setAddress(dto.getAddress());
            hotel.setRating(dto.getRating());
            hotel.setDescription(dto.getDescription());
            hotel.setHighlight(dto.getHighlight());
            hotel.setFacilities(dto.getFacilities());
            hotel.setHotelType(dto.getHotelType());
            hotel.setSuitableFor(dto.getSuitableFor());
            hotel.setPriceStart(dto.getPriceStart());
            hotel.setImagePath("/assets/hotel/" + filename);

            return ResponseEntity.ok(hotelService.createHotel(hotel));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ✅ CHỈ ADMIN được phép cập nhật
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Hotel> updateHotel(
            @PathVariable Integer id,
            @RequestPart("hotelDTO") String hotelDTOJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            HotelDTO dto = objectMapper.readValue(hotelDTOJson, HotelDTO.class);

            String filename = null;
            if (imageFile != null && !imageFile.isEmpty()) {
                filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
                Path imagePath = Paths.get("src/main/resources/static/assets/hotel/", filename);
                Files.createDirectories(imagePath.getParent());
                Files.copy(imageFile.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
            }

            // Tạo hotel từ DTO
            Hotel hotel = new Hotel();
            hotel.setHotelName(dto.getHotelName());
            hotel.setAddress(dto.getAddress());
            hotel.setRating(dto.getRating());
            hotel.setDescription(dto.getDescription());
            hotel.setHighlight(dto.getHighlight());
            hotel.setFacilities(dto.getFacilities());
            hotel.setHotelType(dto.getHotelType());
            hotel.setSuitableFor(dto.getSuitableFor());
            hotel.setPriceStart(dto.getPriceStart());
            if (filename != null) {
                hotel.setImagePath("/assets/hotel/" + filename);
            }

            return ResponseEntity.ok(hotelService.updateHotel(id, hotel));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }



    // ✅ CHỈ ADMIN được phép xoá
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteHotel(@PathVariable Integer id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.ok("Đã xoá khách sạn ID = " + id);
    }
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Hotel>> searchHotels(@RequestParam String q) {
        return ResponseEntity.ok(hotelService.searchHotels(q));
    }


}


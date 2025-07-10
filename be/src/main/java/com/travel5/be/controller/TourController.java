package com.travel5.be.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import com.travel5.be.dto.TourDetailDTO;
import com.travel5.be.entity.TourDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travel5.be.dto.TourDTO;
import com.travel5.be.entity.Tour;
import com.travel5.be.service.TourService;

@RestController
@RequestMapping("/api/tours")
@CrossOrigin(origins = "*")
public class TourController {

    @Autowired
    private TourService tourService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public List<Tour> getAllTours() {
        return tourService.getAllTours();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tour> getTourById(@PathVariable Integer id) {
        Optional<Tour> tourOpt = tourService.getTourById(id);
        if (tourOpt.isEmpty()) return ResponseEntity.notFound().build();

        Tour tour = tourOpt.get();

        // Chỉ nối nếu chưa phải URL
        if (tour.getImagePath() != null && !tour.getImagePath().startsWith("http")) {
            tour.setImagePath("http://localhost:8084/assets/" + tour.getImagePath());
        }

        TourDetail detail = tourService.getTourDetailByTourId(id);
        if (detail != null) {
            tour.setTourDetail(detail);
        }

        tourService.checkAndUpdateTourStatus(tour);
        return ResponseEntity.ok(tour);
    }


    @GetMapping("/discounted")
    public ResponseEntity<List<TourDTO>> getToursWithDiscountedPrices() {
        List<TourDTO> toursWithDiscountedPrices = tourService.getToursWithDiscountedPrices();
        return ResponseEntity.ok(toursWithDiscountedPrices);
    }

    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Tour> addTour(
            @RequestPart("tourDTO") String tourDTOJson,
            @RequestPart("imagePath") MultipartFile image
    ) {
        try {
            TourDTO tourDTO = objectMapper.readValue(tourDTOJson, TourDTO.class);
            LocalDate start = LocalDate.parse(tourDTO.getStartDate(), DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            LocalDate end = LocalDate.parse(tourDTO.getEndDate(), DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            String imagePath = uploadImage(image);

            Tour tour = new Tour(
                    tourDTO.getTourName(),
                    tourDTO.getLocation(),
                    tourDTO.getDescription(),
                    tourDTO.getPrice(),
                    start,
                    end,
                    imagePath,
                    tourDTO.getTourType()
            );

            // Kiểm tra và cập nhật trạng thái tour khi thêm mới
            tourService.checkAndUpdateTourStatus(tour);

            return ResponseEntity.status(HttpStatus.CREATED).body(tourService.addTour(tour));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping(value = "/with-detail", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createTourWithDetail(
            @RequestPart("tour") String tourJson,
            @RequestPart("tourDetail") String tourDetailJson
    ) {
        try {
            Tour tour = objectMapper.readValue(tourJson, Tour.class);
            TourDetail tourDetail = objectMapper.readValue(tourDetailJson, TourDetail.class);
            Tour saved = tourService.addTourWithDetail(tour, tourDetail);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateTourWithImage(
            @PathVariable Integer id,
            @RequestPart("tourDTO") String tourDTOJson,
            @RequestPart(value = "imagePath", required = false) MultipartFile image
    ) {
        try {
            TourDTO tourDTO = objectMapper.readValue(tourDTOJson, TourDTO.class);
            Optional<Tour> existingTourOpt = tourService.getTourById(id);
            if (!existingTourOpt.isPresent()) return ResponseEntity.notFound().build();

            Tour existingTour = existingTourOpt.get();
            String imagePath = (image != null && !image.isEmpty()) ? uploadImage(image) : existingTour.getImagePath();

            LocalDate start = LocalDate.parse(tourDTO.getStartDate(), DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            LocalDate end = LocalDate.parse(tourDTO.getEndDate(), DateTimeFormatter.ofPattern("dd/MM/yyyy"));

            Tour updatedTour = new Tour(
                    tourDTO.getTourName(),
                    tourDTO.getLocation(),
                    tourDTO.getDescription(),
                    tourDTO.getPrice(),
                    start,
                    end,
                    imagePath,
                    tourDTO.getTourType()
            );

            // Kiểm tra và cập nhật trạng thái tour khi cập nhật
            tourService.checkAndUpdateTourStatus(updatedTour);

            return ResponseEntity.ok(tourService.updateTour(id, updatedTour));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @PutMapping(value = "/with-detail/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateTourWithDetail(
            @PathVariable Integer id,
            @RequestPart("tour") String tourJson,
            @RequestPart("tourDetail") String tourDetailJson
    ) {
        try {
            Tour tour = objectMapper.readValue(tourJson, Tour.class);
            TourDetail tourDetail = objectMapper.readValue(tourDetailJson, TourDetail.class);

            Tour updated = tourService.updateTourWithDetail(id, tour, tourDetail);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{tourId}/update-detail")
    public ResponseEntity<?> updateTourDetail(
            @PathVariable Integer tourId,
            @RequestBody TourDetailDTO detailDTO
    ) {
        try {
            // Kiểm tra nếu TourDetail đã tồn tại
            TourDetail existing = tourService.getTourDetailByTourId(tourId);
            if (existing == null) {
                return ResponseEntity.notFound().build();  // Không tìm thấy chi tiết tour
            }

            // Cập nhật chi tiết tour
            existing.setIntroduction(detailDTO.getIntroduction());
            existing.setItinerary(detailDTO.getItinerary());
            existing.setReviews(detailDTO.getReviews());
            existing.setPolicy(detailDTO.getPolicy());

            // Lưu lại chi tiết tour đã cập nhật
            tourService.saveTourDetail(existing);

            return ResponseEntity.ok("Cập nhật chi tiết tour thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    public String deleteTour(@PathVariable Integer id) {
        tourService.deleteTour(id);
        return "Tour ID " + id + " đã được xóa!";
    }

    @GetMapping("/image/{imagePath}")
    public ResponseEntity<String> getImage(@PathVariable String imagePath) {
        String fullImageUrl = "http://localhost:8084/assets/" + imagePath;
        return ResponseEntity.ok(fullImageUrl);
    }

    @GetMapping("/{id}/detail-dto")
    public ResponseEntity<TourDetailDTO> getTourDetailDTOByTourId(@PathVariable Integer id) {
        TourDetail detail = tourService.getTourDetailByTourId(id);
        if (detail == null) return ResponseEntity.notFound().build();

        TourDetailDTO detailDTO = new TourDetailDTO(
                detail.getId(),
                detail.getIntroduction(),
                detail.getItinerary(),
                detail.getReviews(),
                detail.getPolicy()
        );
        return ResponseEntity.ok(detailDTO);
    }

    @GetMapping("/search")
    public List<Tour> searchTours(
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) String departureDate,
            @RequestParam(required = false) String price,
            @RequestParam(required = false) String tourType
    ) {
        LocalDate date = (departureDate != null) ?
                LocalDate.parse(departureDate, DateTimeFormatter.ofPattern("dd/MM/yyyy")) : null;
        return tourService.searchTours(destination, date, price, tourType);
    }

    @PostMapping("/{id}/add-detail")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> addTourDetailToExistingTour(@PathVariable Integer id, @RequestBody TourDetail tourDetail) {
        try {
            // Kiểm tra nếu tour chưa có detail thì thêm mới
            Tour updatedTour = tourService.addDetailToTour(id, tourDetail);
            return ResponseEntity.ok(updatedTour);  // Trả về tour đã được cập nhật chi tiết
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @PutMapping("/{tourId}/apply-voucher/{voucherId}")
    public ResponseEntity<?> applyVoucherToTour(
            @PathVariable Integer tourId,
            @PathVariable Integer voucherId
    ) {
        try {
            Tour updatedTour = tourService.applyVoucherToTour(tourId, voucherId);
            return ResponseEntity.ok(updatedTour);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // ----------- HELPER METHOD -----------
    private String uploadImage(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new RuntimeException("Image không được để trống!");
        }
        return "vn/" + image.getOriginalFilename();
    }

    private MediaType getMediaTypeForFileName(String fileName) {
        if (fileName.endsWith(".webp")) return MediaType.valueOf("image/webp");
        if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) return MediaType.IMAGE_JPEG;
        if (fileName.endsWith(".png")) return MediaType.IMAGE_PNG;
        return MediaType.APPLICATION_OCTET_STREAM;
    }
}

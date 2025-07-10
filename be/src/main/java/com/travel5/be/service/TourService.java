package com.travel5.be.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.travel5.be.config.VietnameseNormalizer;
import com.travel5.be.dto.TourDTO;
import com.travel5.be.entity.*;
import com.travel5.be.repository.TourDetailRepository;
import com.travel5.be.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travel5.be.repository.TourRepository;

@Service
public class TourService {

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    // Lấy danh sách tất cả các tour
    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }

    // Lấy tour theo ID
    public Optional<Tour> getTourById(Integer id) {
        return tourRepository.findById(id);
    }

    // Lấy tất cả các tour với giá đã giảm nếu có voucher
    public List<TourDTO> getToursWithDiscountedPrices() {
        List<Tour> tours = tourRepository.findAll();
        List<TourDTO> tourDTOs = new ArrayList<>();

        for (Tour tour : tours) {
            TourDTO tourDTO = new TourDTO();
            tourDTO.setTourId(tour.getTourId());
            tourDTO.setTourName(tour.getTourName());
            tourDTO.setDescription(tour.getDescription());
            tourDTO.setLocation(tour.getLocation());
            tourDTO.setStartDate(tour.getStartDate().toString());
            tourDTO.setEndDate(tour.getEndDate().toString());
            tourDTO.setImagePath(tour.getImagePath());
            tourDTO.setTourType(tour.getTourType());

            // Tính giá sau khi áp dụng voucher nếu có
            BigDecimal originalPrice = tour.getPrice();
            BigDecimal discountedPrice = originalPrice;

            if (tour.getVoucher() != null && tour.getVoucher().getStatus() == VoucherStatus.ACTIVE) {
                Voucher voucher = tour.getVoucher();
                if (LocalDate.now().isAfter(voucher.getValidFrom()) && LocalDate.now().isBefore(voucher.getValidTo())) {
                    // Áp dụng giảm giá
                    discountedPrice = originalPrice.multiply(BigDecimal.valueOf(1 - voucher.getDiscountPercentage().doubleValue() / 100));
                }
            }

            // Cập nhật giá đã giảm vào DTO
            tourDTO.setPrice(discountedPrice);
            tourDTOs.add(tourDTO);
        }

        return tourDTOs;
    }

    // Thêm mới một tour, nhận TourDTO thay vì Tour
    public Tour addTour(Tour tour) {
        LocalDateTime now = LocalDateTime.now();
        tour.setCreatedAt(now);
        tour.setUpdatedAt(now);
        return tourRepository.save(tour);
    }

    // Cập nhật tour
    public Tour updateTour(Integer id, Tour newTour) {
        return tourRepository.findById(id).map(tour -> {
            tour.setTourName(newTour.getTourName());
            tour.setDescription(newTour.getDescription());
            tour.setLocation(newTour.getLocation());
            tour.setPrice(newTour.getPrice());
            tour.setStartDate(newTour.getStartDate());
            tour.setEndDate(newTour.getEndDate());
            tour.setImagePath(newTour.getImagePath());
            tour.setTourType(newTour.getTourType());
            tour.setUpdatedAt(LocalDateTime.now());
            return tourRepository.save(tour);
        }).orElseThrow(() -> new RuntimeException("Tour ID " + id + " không tồn tại!"));
    }

    // Xóa tour theo ID
    public void deleteTour(Integer id) {
        tourRepository.deleteById(id);
    }

    @Autowired
    private TourDetailRepository tourDetailRepository;

    public TourDetail getTourDetailByTourId(Integer tourId) {
        return tourDetailRepository.findByTour_TourId(tourId);
    }


    public List<Tour> searchTours(String destination, LocalDate departureDate, String price, String tourTypeStr) {
        String normalizedDestination = VietnameseNormalizer.normalize(destination);

        TourType tourType = null;
        if (tourTypeStr != null && !tourTypeStr.isEmpty()) {
            tourType = TourType.fromString(tourTypeStr);
        }

        List<Tour> filtered = tourRepository.findByDatePriceAndType(departureDate, price, tourType);

        // Lọc tiếp theo location đã normalize
        return filtered.stream()
                .filter(tour -> {
                    String normalizedLoc = VietnameseNormalizer.normalize(tour.getLocation());
                    return normalizedLoc.contains(normalizedDestination);
                })
                .toList();
    }

    public Tour addTourWithDetail(Tour tour, TourDetail tourDetail) {
        // Lưu tour trước
        Tour savedTour = tourRepository.save(tour);

        // Liên kết TourDetail với Tour và lưu
        tourDetail.setTour(savedTour);
        tourDetailRepository.save(tourDetail);

        return savedTour;
    }

    public Tour updateTourWithDetail(Integer id, Tour newTour, TourDetail newDetail) {
        return tourRepository.findById(id).map(tour -> {
            // Cập nhật thông tin Tour
            tour.setTourName(newTour.getTourName());
            tour.setDescription(newTour.getDescription());
            tour.setLocation(newTour.getLocation());
            tour.setPrice(newTour.getPrice());
            tour.setStartDate(newTour.getStartDate());
            tour.setEndDate(newTour.getEndDate());
            tour.setImagePath(newTour.getImagePath());
            tour.setTourType(newTour.getTourType());
            Tour updatedTour = tourRepository.save(tour);

            // Cập nhật TourDetail
            TourDetail detail = tourDetailRepository.findByTour_TourId(id);
            if (detail != null) {
                detail.setIntroduction(newDetail.getIntroduction());
                detail.setItinerary(newDetail.getItinerary());
                detail.setPolicy(newDetail.getPolicy());
                detail.setReviews(newDetail.getReviews());
                tourDetailRepository.save(detail);
            }

            return updatedTour;
        }).orElseThrow(() -> new RuntimeException("Tour ID " + id + " không tồn tại!"));
    }
    public Tour addDetailToTour(Integer tourId, TourDetail tourDetail) {
        Optional<Tour> tourOpt = tourRepository.findById(tourId);
        if (tourOpt.isEmpty()) {
            throw new RuntimeException("Tour ID " + tourId + " không tồn tại!");
        }

        Tour tour = tourOpt.get();

        // Gán tour cho tourDetail rồi lưu
        tourDetail.setTour(tour);
        tourDetailRepository.save(tourDetail);

        // Cập nhật lại tour (nếu bạn dùng @OneToOne(mappedBy = ...) thì không cần gọi save lại tour)
        return tour;
    }
    public TourDetail saveTourDetail(TourDetail detail) {
        return tourDetailRepository.save(detail);
    }
    public Tour applyVoucherToTour(Integer tourId, Integer voucherId) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Tour ID " + tourId + " không tồn tại!"));

        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new RuntimeException("Voucher ID " + voucherId + " không tồn tại!"));

        // Gán voucher cho tour
        tour.setVoucher(voucher);
        tour.setUpdatedAt(LocalDateTime.now());
        return tourRepository.save(tour);
    }
    // Phương thức kiểm tra và cập nhật trạng thái tour
    public void updateTourStatus() {
        List<Tour> tours = tourRepository.findAll();
        for (Tour tour : tours) {
            // Kiểm tra và cập nhật trạng thái tour trước khi lưu vào DB
            tour.checkTourStatus();  // Gọi phương thức kiểm tra trạng thái tour

            tourRepository.save(tour); // Lưu cập nhật trạng thái vào DB
        }
    }

    public void checkAndUpdateTourStatus(Tour tour) {
        if (tour.getStartDate() != null && LocalDate.now().isAfter(tour.getStartDate())) {
            // Nếu ngày bắt đầu tour nhỏ hơn ngày hiện tại, set trạng thái INACTIVE
            tour.setStatus(TourActivityStatus.INACTIVE);
        } else {
            // Nếu ngày bắt đầu tour lớn hơn hoặc bằng ngày hiện tại, set trạng thái ACTIVE
            tour.setStatus(TourActivityStatus.ACTIVE);
        }
        tourRepository.save(tour); // Lưu cập nhật trạng thái vào DB
    }
}


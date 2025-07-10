package com.travel5.be.service;

import com.travel5.be.config.VietnameseNormalizer;
import com.travel5.be.dto.request.FeedbackRequest;
import com.travel5.be.dto.request.FeedbackSearchRequest;
import com.travel5.be.dto.response.FeedbackResponse;
import com.travel5.be.entity.Booking;
import com.travel5.be.entity.BookingStatus;
import com.travel5.be.entity.Feedback;
import com.travel5.be.entity.PaymentStatus;
import com.travel5.be.repository.BookingRepository;
import com.travel5.be.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepo;

    @Autowired
    private BookingRepository bookingRepo;

    public Feedback createFeedback(FeedbackRequest request) {
        Booking booking = bookingRepo.findByIdWithTour(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

        if (booking.getStatus() != BookingStatus.CONFIRMED ||
                booking.getPaymentStatus() != PaymentStatus.PAID) {
            throw new RuntimeException("Chỉ phản hồi sau khi tour đã xác nhận và thanh toán");
        }

        Feedback feedback = new Feedback();
        feedback.setBooking(booking);
        feedback.setUser(booking.getUser());
        feedback.setTour(booking.getTour());
        feedback.setContent(request.getContent());

        booking.setHasFeedback(true);
        bookingRepo.save(booking);

        return feedbackRepo.save(feedback);
    }

    public List<FeedbackResponse> getFeedbacksByTour(Integer tourId) {
        return feedbackRepo.findByTour_TourId(tourId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<FeedbackResponse> getAllFeedbacks() {
        return feedbackRepo.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public FeedbackResponse updateFeedback(Integer id, String newContent) {
        Feedback feedback = feedbackRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback không tồn tại"));
        feedback.setContent(newContent);
        Feedback updated = feedbackRepo.save(feedback);
        return mapToResponse(updated);
    }

    public void deleteFeedback(Integer id) {
        Feedback feedback = feedbackRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback không tồn tại"));
        feedbackRepo.delete(feedback);
    }

    public List<FeedbackResponse> searchFeedbacks(FeedbackSearchRequest req) {
        String normalizedTourName = StringUtils.hasText(req.getTourName())
                ? VietnameseNormalizer.normalize(req.getTourName())
                : "";

        String normalizedUserName = StringUtils.hasText(req.getUserName())
                ? VietnameseNormalizer.normalize(req.getUserName())
                : "";

        return feedbackRepo.findAll().stream()
                .filter(f -> {
                    boolean matches = true;

                    if (!normalizedTourName.isEmpty()) {
                        String tourNameInDb = f.getTour() != null
                                ? VietnameseNormalizer.normalize(f.getTour().getTourName())
                                : "";
                        matches = matches && tourNameInDb.contains(normalizedTourName);
                    }

                    if (!normalizedUserName.isEmpty()) {
                        String userNameInDb = f.getUser() != null
                                ? VietnameseNormalizer.normalize(f.getUser().getFirstName() + " " + f.getUser().getLastName())
                                : "";
                        matches = matches && userNameInDb.contains(normalizedUserName);
                    }

                    if (req.getCreatedDateFrom() != null) {
                        matches = matches && !f.getCreatedAt().toLocalDate()
                                .isBefore(req.getCreatedDateFrom());
                    }

                    if (req.getCreatedDateTo() != null) {
                        matches = matches && !f.getCreatedAt().toLocalDate()
                                .isAfter(req.getCreatedDateTo());
                    }

                    return matches;
                })
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private FeedbackResponse mapToResponse(Feedback f) {
        return new FeedbackResponse(
                f.getId(),
                f.getBooking() != null ? f.getBooking().getBookingId() : null,
                f.getUser() != null ? f.getUser().getId() : null,
                f.getUser() != null
                        ? f.getUser().getFirstName() + " " + f.getUser().getLastName()
                        : null,
                f.getTour() != null ? f.getTour().getTourId() : null,
                f.getTour() != null ? f.getTour().getTourName() : null,
                f.getContent(),
                f.getCreatedAt()
        );
    }
}

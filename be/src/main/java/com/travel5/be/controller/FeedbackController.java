package com.travel5.be.controller;

import com.travel5.be.dto.request.FeedbackRequest;
import com.travel5.be.dto.request.FeedbackSearchRequest;
import com.travel5.be.dto.response.FeedbackResponse;
import com.travel5.be.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@CrossOrigin("*")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<FeedbackResponse> createFeedback(@RequestBody FeedbackRequest request) {
        var feedback = feedbackService.createFeedback(request);
        // convert to DTO
        FeedbackResponse response = feedbackService.getAllFeedbacks().stream()
                .filter(f -> f.getBookingId() != null && f.getBookingId().equals(request.getBookingId()))
                .findFirst()
                .orElse(null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<FeedbackResponse>> getFeedbacksByTour(@PathVariable Integer tourId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksByTour(tourId));
    }

    @GetMapping
    public ResponseEntity<List<FeedbackResponse>> getAllFeedbacks() {
        return ResponseEntity.ok(feedbackService.getAllFeedbacks());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<FeedbackResponse> updateFeedback(@PathVariable Integer id,
                                                           @RequestBody FeedbackRequest request) {
        FeedbackResponse updated = feedbackService.updateFeedback(id, request.getContent());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteFeedback(@PathVariable Integer id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.ok("Xóa phản hồi thành công");
    }

    @PostMapping("/search")
    public ResponseEntity<List<FeedbackResponse>> searchFeedbacks(@RequestBody FeedbackSearchRequest request) {
        return ResponseEntity.ok(feedbackService.searchFeedbacks(request));
    }
}

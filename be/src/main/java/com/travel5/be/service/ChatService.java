package com.travel5.be.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.travel5.be.config.VietnameseNormalizer;
import com.travel5.be.dto.request.ChatRequest;
import com.travel5.be.dto.response.ChatResponse;
import com.travel5.be.entity.ChatHistory;
import com.travel5.be.entity.Tour;
import com.travel5.be.entity.Hotel;
import com.travel5.be.repository.ChatHistoryRepository;
import com.travel5.be.repository.TourRepository;
import com.travel5.be.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final TourRepository tourRepository;
    private final HotelRepository hotelRepository;
    private final ChatHistoryRepository chatHistoryRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String GEMINI_API_KEY;

    public ChatResponse handleUserMessage(ChatRequest request) {
        String userMessage = VietnameseNormalizer.normalize(request.getMessage());

        String normalizedUserMessage = VietnameseNormalizer.normalize(userMessage);
        String[] keywords = normalizedUserMessage.split("\\s+");

        List<Tour> matchedTours = tourRepository.findAll().stream()
                .filter(t -> {
                    String tourName = VietnameseNormalizer.normalize(t.getTourName());
                    String location = VietnameseNormalizer.normalize(t.getLocation());
                    String description = t.getDescription() != null
                            ? VietnameseNormalizer.normalize(t.getDescription())
                            : "";

                    return Arrays.stream(keywords).anyMatch(word ->
                            tourName.contains(word) ||
                                    location.contains(word) ||
                                    description.contains(word));
                })
                .toList();


        List<Hotel> matchedHotels = hotelRepository.findAll().stream()
                .filter(h -> VietnameseNormalizer.normalize(h.getHotelName()).contains(userMessage)
                        || (h.getAddress() != null && VietnameseNormalizer.normalize(h.getAddress()).contains(userMessage))
                        || (h.getDescription() != null && VietnameseNormalizer.normalize(h.getDescription()).contains(userMessage)))
                .toList();

        StringBuilder contextBuilder = new StringBuilder();

        if (!matchedTours.isEmpty()) {
            contextBuilder.append("Tôi tìm thấy các tour phù hợp:\n");
            for (Tour tour : matchedTours) {
                contextBuilder.append("- ")
                        .append(tour.getTourName())
                        .append(" (")
                        .append(tour.getLocation())
                        .append("), giá: ")
                        .append(tour.getPrice())
                        .append(" VNĐ. Mô tả: ")
                        .append(tour.getDescription() != null ? tour.getDescription() : "")
                        .append("\n");
            }
        }

        if (!matchedHotels.isEmpty()) {
            contextBuilder.append("Tôi tìm thấy các khách sạn phù hợp:\n");
            for (Hotel hotel : matchedHotels) {
                contextBuilder.append("- ")
                        .append(hotel.getHotelName())
                        .append(" (")
                        .append(hotel.getAddress())
                        .append("), giá từ: ")
                        .append(hotel.getPriceStart())
                        .append(" VNĐ. Mô tả: ")
                        .append(hotel.getDescription() != null ? hotel.getDescription() : "")
                        .append("\n");
            }
        }

        if (contextBuilder.length() == 0) {
            contextBuilder.append("Không tìm thấy dữ liệu trong hệ thống.");
        }

        String prompt = """
Bạn là chatbot tư vấn du lịch. Đây là dữ liệu hệ thống tìm thấy:
%s

Người dùng hỏi:
"%s"

Hãy trả lời bằng tiếng Việt, tự nhiên, dễ hiểu. Nếu không tìm thấy dữ liệu thì tự tạo câu trả lời phù hợp.
""".formatted(contextBuilder.toString(), request.getMessage());

        String geminiAnswer = callGeminiApi(prompt);

        ChatHistory history = ChatHistory.builder()
                .userId(request.getUserId())
                .userMessage(request.getMessage())
                .botResponse(geminiAnswer)
                .isFromGemini(true)
                .build();

        chatHistoryRepository.save(history);

        return new ChatResponse(geminiAnswer, true);
    }

    private String callGeminiApi(String userMessage) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // Escape ký tự đặc biệt trong câu hỏi người dùng
            String escapedMessage = escapeJsonSpecialCharacters(userMessage);

            // Cấu trúc JSON payload
            String payload = String.format("""
        {
          "contents": [
            {
              "parts": [
                { "text": "%s" }
              ]
            }
          ]
        }
        """, escapedMessage); // Chú ý việc dùng escapedMessage ở đây

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> requestEntity = new HttpEntity<>(payload, headers);

            // Gửi request
            ResponseEntity<String> response = restTemplate.exchange(
                    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            // Lấy dữ liệu từ Gemini
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            String answer = jsonNode
                    .path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text")
                    .asText();

            return answer.isEmpty() ? "Bot không có phản hồi." : answer;

        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi gọi Gemini: " + e.getMessage();
        }
    }

    // Helper method to escape JSON special characters
    private String escapeJsonSpecialCharacters(String input) {
        if (input == null) {
            return "";
        }

        // Escape characters for JSON compatibility
        return input.replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

}
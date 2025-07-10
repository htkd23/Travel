package com.travel5.be.config;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class RequestNormalizer {

    // Chuẩn hóa câu hỏi người dùng
    public static String normalizeRequest(String input) {
        if (input == null || input.isBlank()) return ""; // Tránh null hoặc chuỗi trống

        // 1. Chuẩn hóa thành chữ thường
        String result = input.toLowerCase();

        // 2. Loại bỏ dấu câu (dấu chấm, dấu phẩy, dấu chấm hỏi, ...)
        result = result.replaceAll("[.,!?;]", "");

        // 3. Loại bỏ những từ không cần thiết (chẳng hạn như "ở", "tại", "và", "cho", ...)
        result = result.replaceAll("\\b(ở|tại|và|cho|của)\\b", "");

        // 4. Chuẩn hóa khoảng trắng (đảm bảo không có khoảng trắng thừa)
        result = result.replaceAll("\\s+", " ").trim();

        if (result.contains("khách sạn")) {
            result = result.replaceAll("khách sạn", "hotel");
        }else{
            result = result.replaceAll("du lịch", "tour");
            result = result.replaceAll("tour ở", "tour");
            result = result.replaceAll("tour", "");
                };
//        log.debug("haha", result);
        System.out.print("tour");
        return result;
    }
}

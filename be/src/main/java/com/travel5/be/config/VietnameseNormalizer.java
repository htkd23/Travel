package com.travel5.be.config;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class VietnameseNormalizer {

    public static String normalize(String input) {
        if (input == null || input.isBlank()) return ""; // 👈 tránh null

        // 1. Chuẩn hóa Unicode
        String result = Normalizer.normalize(input.trim().toLowerCase(), Normalizer.Form.NFD);

        // 2. Loại bỏ dấu
        result = Pattern.compile("\\p{InCombiningDiacriticalMarks}+").matcher(result).replaceAll("");

        // 3. Đ -> d
        result = result.replace("đ", "d");

        // 4. Loại bỏ ký tự đặc biệt ngoài chữ và số
        result = result.replaceAll("[^a-z0-9\\s]", "");

        // 5. Chuẩn hóa khoảng trắng
        result = result.replaceAll("\\s+", " ").trim();

        // 6. Ánh xạ các địa danh
        switch (result) {
            case "hanoi": return "ha noi";
            case "tphcm":
            case "tp hcm": return "ho chi minh";
            case "danang": return "da nang";
            case "nhatrang": return "nha trang";
            case "phuyen": return "phu yen";
            case "vungtau": return "vung tau";
            default: return result;
        }
    }
}

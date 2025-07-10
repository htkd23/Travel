package com.travel5.be.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TourType {
    domestic, international;

    @JsonCreator
    public static TourType fromString(String value) {
        for (TourType type : TourType.values()) {
            if (type.name().equalsIgnoreCase(value)) { // Không phân biệt hoa thường
                return type;
            }
        }
        throw new IllegalArgumentException("Loại tour không hợp lệ: " + value);
    }

    @JsonValue
    public String toLowerCase() {
        return this.name().toLowerCase(); // Đảm bảo lưu vào DB dạng chữ thường
    }
}


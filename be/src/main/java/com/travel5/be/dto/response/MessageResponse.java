package com.travel5.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MessageResponse {
    private Integer userId;
    private String message;
    private boolean fromAdmin;
}

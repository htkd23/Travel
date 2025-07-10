package com.travel5.be.dto.request;

import lombok.Data;

@Data
public class MessageRequest {
    private Integer userId;
    private String message;
    private Integer chatId; // dùng cho admin reply
    private boolean fromAdmin;
}

package com.travel5.be.dto.request;


import lombok.Data;

@Data
public class ChatRequest {
    private Integer userId;
    private String message;
}

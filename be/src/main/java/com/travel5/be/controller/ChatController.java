package com.travel5.be.controller;

import com.travel5.be.dto.response.ChatResponse;
import com.travel5.be.dto.request.ChatRequest;
import com.travel5.be.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        ChatResponse response = chatService.handleUserMessage(request);
        return ResponseEntity.ok(response);
    }
}
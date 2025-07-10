package com.travel5.be.repository;

import com.travel5.be.entity.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Integer> {
}

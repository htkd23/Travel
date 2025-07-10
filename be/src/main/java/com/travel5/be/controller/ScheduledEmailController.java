package com.travel5.be.controller;

import com.travel5.be.dto.ScheduledEmailDTO;
import com.travel5.be.service.ScheduledEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/scheduled-emails")
@CrossOrigin("*")
public class ScheduledEmailController {

    @Autowired
    private ScheduledEmailService scheduledEmailService;

    @GetMapping("/all-reminders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ScheduledEmailDTO>> getAllReminders() {
        List<ScheduledEmailDTO> list = scheduledEmailService.getAllReminders();
        return ResponseEntity.ok(list);
    }
}

package com.example.social.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record PostRequest(
        @NotBlank @Size(max = 1000) String content,
        String platform,
        LocalDateTime scheduledAt) {
}
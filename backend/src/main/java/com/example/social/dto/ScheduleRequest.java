package com.example.social.dto;

import java.time.LocalDateTime;

public record ScheduleRequest(LocalDateTime scheduledAt) {
}
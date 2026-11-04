package com.example.social.dto;

import java.util.List;

public record AnalyticsSummary(
        long totalPosts,
        long drafts,
        long scheduled,
        long published,
        long totalLikes,
        long totalShares,
        long totalReach,
        double engagementRate,
        List<PlatformStats> byPlatform) {
}
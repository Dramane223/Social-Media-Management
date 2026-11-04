package com.example.social.controller;

import com.example.social.dto.AnalyticsSummary;
import com.example.social.model.Post;
import com.example.social.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public AnalyticsSummary summary(Principal principal) {
        return analyticsService.summary(principal.getName());
    }

    @GetMapping("/top-posts")
    public List<Post> topPosts(@RequestParam(defaultValue = "5") int limit, Principal principal) {
        return analyticsService.topPosts(principal.getName(), limit);
    }
}
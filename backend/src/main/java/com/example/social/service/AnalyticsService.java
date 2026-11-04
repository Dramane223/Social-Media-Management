package com.example.social.service;

import com.example.social.dto.AnalyticsSummary;
import com.example.social.dto.PlatformStats;
import com.example.social.model.Post;
import com.example.social.model.PostStatus;
import com.example.social.model.User;
import com.example.social.repository.PostRepository;
import com.example.social.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public AnalyticsService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public AnalyticsSummary summary(String username) {
        List<Post> posts = userPosts(username);

        long likes = posts.stream().mapToLong(Post::getLikes).sum();
        long shares = posts.stream().mapToLong(Post::getShares).sum();
        long reach = posts.stream().mapToLong(Post::getReach).sum();
        double engagement = reach == 0 ? 0.0 : Math.round(((likes + shares) * 100.0 / reach) * 100.0) / 100.0;

        Map<String, List<Post>> grouped = posts.stream()
                .collect(Collectors.groupingBy(
                        p -> (p.getPlatform() == null || p.getPlatform().isBlank()) ? "Unspecified" : p.getPlatform(),
                        TreeMap::new,
                        Collectors.toList()));

        List<PlatformStats> byPlatform = grouped.entrySet().stream()
                .map(e -> new PlatformStats(
                        e.getKey(),
                        e.getValue().size(),
                        e.getValue().stream().mapToLong(Post::getLikes).sum(),
                        e.getValue().stream().mapToLong(Post::getShares).sum(),
                        e.getValue().stream().mapToLong(Post::getReach).sum()))
                .toList();

        return new AnalyticsSummary(
                posts.size(),
                countByStatus(posts, PostStatus.DRAFT),
                countByStatus(posts, PostStatus.SCHEDULED),
                countByStatus(posts, PostStatus.PUBLISHED),
                likes, shares, reach, engagement, byPlatform);
    }

    public List<Post> topPosts(String username, int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 50));
        return userPosts(username).stream()
                .filter(p -> p.getStatus() == PostStatus.PUBLISHED)
                .sorted(Comparator.comparingInt(Post::getLikes).reversed())
                .limit(safeLimit)
                .toList();
    }

    private long countByStatus(List<Post> posts, PostStatus status) {
        return posts.stream().filter(p -> p.getStatus() == status).count();
    }

    private List<Post> userPosts(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        return postRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }
}
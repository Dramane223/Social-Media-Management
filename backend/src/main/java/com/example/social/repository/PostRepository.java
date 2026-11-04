package com.example.social.repository;

import com.example.social.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Post> findByUserIdAndScheduledAtBetweenOrderByScheduledAtAsc(
            Long userId, LocalDateTime from, LocalDateTime to);
}
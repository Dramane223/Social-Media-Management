package com.example.social.service;

import com.example.social.dto.PostRequest;
import com.example.social.model.Post;
import com.example.social.model.PostStatus;
import com.example.social.model.User;
import com.example.social.repository.PostRepository;
import com.example.social.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public Post create(String username, PostRequest req) {
        Post post = new Post();
        post.setUser(currentUser(username));
        post.setContent(req.content());
        post.setPlatform(req.platform());
        applySchedule(post, req.scheduledAt());
        return postRepository.save(post);
    }

    public List<Post> list(String username) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(currentUser(username).getId());
    }

    public Post get(String username, Long id) {
        return owned(username, id);
    }

    public Post update(String username, Long id, PostRequest req) {
        Post post = owned(username, id);
        ensureNotPublished(post);
        post.setContent(req.content());
        post.setPlatform(req.platform());
        applySchedule(post, req.scheduledAt());
        return postRepository.save(post);
    }

    public void delete(String username, Long id) {
        postRepository.delete(owned(username, id));
    }

    public Post schedule(String username, Long id, LocalDateTime when) {
        Post post = owned(username, id);
        ensureNotPublished(post);
        if (when == null) {
            throw bad("scheduledAt is required");
        }
        applySchedule(post, when);
        return postRepository.save(post);
    }

    // Simulated publishing: marks as PUBLISHED and generates demo analytics numbers
    public Post publish(String username, Long id) {
        Post post = owned(username, id);
        ensureNotPublished(post);
        post.setStatus(PostStatus.PUBLISHED);
        ThreadLocalRandom r = ThreadLocalRandom.current();
        post.setLikes(r.nextInt(10, 500));
        post.setShares(r.nextInt(1, 100));
        post.setReach(r.nextInt(100, 5000));
        return postRepository.save(post);
    }

    public List<Post> calendar(String username, LocalDateTime from, LocalDateTime to) {
        return postRepository.findByUserIdAndScheduledAtBetweenOrderByScheduledAtAsc(
                currentUser(username).getId(), from, to);
    }

    // ---------- helpers ----------

    private User currentUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private Post owned(String username, Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        if (!post.getUser().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }
        return post;
    }

    private void applySchedule(Post post, LocalDateTime when) {
        if (when == null) {
            post.setScheduledAt(null);
            post.setStatus(PostStatus.DRAFT);
            return;
        }
        if (when.isBefore(LocalDateTime.now())) {
            throw bad("scheduledAt must be in the future");
        }
        post.setScheduledAt(when);
        post.setStatus(PostStatus.SCHEDULED);
    }

    private void ensureNotPublished(Post post) {
        if (post.getStatus() == PostStatus.PUBLISHED) {
            throw bad("Published posts cannot be modified");
        }
    }

    private ResponseStatusException bad(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
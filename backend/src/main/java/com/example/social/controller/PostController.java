package com.example.social.controller;

import com.example.social.dto.PostRequest;
import com.example.social.dto.ScheduleRequest;
import com.example.social.model.Post;
import com.example.social.service.PostService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<Post> create(@Valid @RequestBody PostRequest req, Principal principal) {
        return ResponseEntity.status(201).body(postService.create(principal.getName(), req));
    }

    @GetMapping
    public List<Post> list(Principal principal) {
        return postService.list(principal.getName());
    }

    @GetMapping("/calendar")
    public List<Post> calendar(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            Principal principal) {
        return postService.calendar(principal.getName(), from, to);
    }

    @GetMapping("/{id}")
    public Post get(@PathVariable Long id, Principal principal) {
        return postService.get(principal.getName(), id);
    }

    @PutMapping("/{id}")
    public Post update(@PathVariable Long id, @Valid @RequestBody PostRequest req, Principal principal) {
        return postService.update(principal.getName(), id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Principal principal) {
        postService.delete(principal.getName(), id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/schedule")
    public Post schedule(@PathVariable Long id, @RequestBody ScheduleRequest req, Principal principal) {
        return postService.schedule(principal.getName(), id, req.scheduledAt());
    }

    @PostMapping("/{id}/publish")
    public Post publish(@PathVariable Long id, Principal principal) {
        return postService.publish(principal.getName(), id);
    }
}
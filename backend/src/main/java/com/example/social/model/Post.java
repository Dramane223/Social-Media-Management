package com.example.social.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String content;

    private String platform; // e.g. Twitter, Instagram, LinkedIn

    @Enumerated(EnumType.STRING)
    private PostStatus status = PostStatus.DRAFT;

    private LocalDateTime scheduledAt;
    private LocalDateTime createdAt = LocalDateTime.now();

    // Analytics numbers
    private int likes;
    private int shares;
    private int reach;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    public Post() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }
    public PostStatus getStatus() { return status; }
    public void setStatus(PostStatus status) { this.status = status; }
    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }
    public int getShares() { return shares; }
    public void setShares(int shares) { this.shares = shares; }
    public int getReach() { return reach; }
    public void setReach(int reach) { this.reach = reach; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
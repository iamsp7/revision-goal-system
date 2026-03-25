package com.ai.revisiongoal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "topic_revision_state",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "topic"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicRevisionState {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    private String topic;

    // ✅ FIXED: Use relationship instead of String
    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    // 🔁 Spaced repetition
    private int repetitions = 0;
    private double easeFactor = 2.5;
    private int intervalDays = 1;

    private LocalDateTime lastReview;
    private LocalDateTime nextReview;

    // 🎯 Performance tracking
    private double lastAccuracy = 0;

    private int correctStreak = 0;
    private boolean mastered = false;
}
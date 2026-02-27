package com.ai.revisiongoal.entity;



import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "topic_revision_state",
    uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "topic"})
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

    private Long userId;

    private String topic;

    private int repetitions = 0;

    private double easeFactor = 2.5;

    private int intervalDays = 1;

    private LocalDateTime lastReview;

    private LocalDateTime nextReview;

    private double lastAccuracy = 0;
}
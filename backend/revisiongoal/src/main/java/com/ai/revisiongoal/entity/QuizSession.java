package com.ai.revisiongoal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id")
    private Subject subject;

    private int totalQuestions;
    private int correctAnswers;
    private double totalScore;

    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;
    @OneToMany(mappedBy = "quizSession", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<QuizAttempt> attempts;
}
package com.ai.revisiongoal.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private String createdBy;

    // MCQs linked to subject
    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<MCQQuestion> mcqs;

    // Quiz sessions linked to subject
    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<QuizSession> quizSessions;

    // 🔥 ADD THIS (IMPORTANT FOR YOUR FIX)
    @OneToMany(mappedBy = "subject")
    @JsonIgnore
    private List<TopicRevisionState> topicRevisionStates;
}
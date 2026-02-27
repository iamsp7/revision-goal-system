package com.ai.revisiongoal.dto;

import lombok.*;

@Getter
@Setter
public class SpacedRepetitionResponse {

    private int repetitions;
    private double easeFactor;
    private int intervalDays;
    private String nextReview;
}
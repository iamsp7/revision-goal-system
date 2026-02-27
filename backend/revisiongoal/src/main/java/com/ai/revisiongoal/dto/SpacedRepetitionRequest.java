package com.ai.revisiongoal.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SpacedRepetitionRequest {

    private double accuracy;
    private int repetitions;
    private double easeFactor;
    private int intervalDays;
}
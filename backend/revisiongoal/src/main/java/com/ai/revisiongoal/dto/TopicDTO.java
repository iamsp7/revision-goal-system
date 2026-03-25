package com.ai.revisiongoal.dto;

public class TopicDTO {

    private String topic;
    private String subject;

    public TopicDTO(String topic, String subject) {
        this.topic = topic;
        this.subject = subject;
    }

    public String getTopic() { return topic; }
    public String getSubject() { return subject; }
}
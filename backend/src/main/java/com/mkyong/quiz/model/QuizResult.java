package com.mkyong.quiz.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class QuizResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userIp;

    private LocalDateTime createdDateTime;

    @Column(columnDefinition = "TEXT")
    private String quizJson; // snapshot of quiz, question, options at attempt

    @Column(columnDefinition = "TEXT")
    private String userAnswersJson; // array/object: {questionIndex: answerIndex,...}

    // Optional for audit/comparison:
    @Column(columnDefinition = "TEXT")
    private String correctAnswersJson;

    private int score;

    private int totalQuestions;

    // For sharing
    private String shareCode; // unique code for public sharing (optional, for clean URL)
}

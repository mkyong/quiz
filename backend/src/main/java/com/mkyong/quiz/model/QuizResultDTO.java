package com.mkyong.quiz.model;

import lombok.Data;

@Data
public class QuizResultDTO {
    private String quizJson;
    private String userAnswersJson;
    private int score;
    private int totalQuestions;
    private String correctAnswersJson;
}


package com.mkyong.quiz.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quiz {
    @Id
    @GeneratedValue
    private Long id;

    private String title;

    private String description;

    // When sending entities directly via REST APIs, infinite loops may occur. Fix this using annotations or DTOs:
    @JsonManagedReference
    // mappedBy = "quiz" indicates Question is responsible for the foreign key
    // orphanRemoval = true ensures removing a question from the quiz automatically deletes it.
    @OneToMany(mappedBy = "quiz",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    private List<Question> questions = new ArrayList<>();

    // Helper methods ensure bidirectional relationships are always synchronized.
    // Helper method to add a question
    public void addQuestion(Question question) {
        questions.add(question);
        question.setQuiz(this);
    }

    // Helper method to remove a question
    public void removeQuestion(Question question) {
        questions.remove(question);
        question.setQuiz(null);
    }
}



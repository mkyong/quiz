package com.mkyong.quiz.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    @Id
    @GeneratedValue
    private Long id;

    // @Column(length = 2000) limit size to 2000
    // TEXT type in databases like PostgreSQL or MySQL supports large strings.
    @Column(columnDefinition = "TEXT")
    private String text;

    @Column(columnDefinition = "TEXT")
    private String correctOptionExplain;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "question_options",
            joinColumns = @JoinColumn(name = "question_id")
    )
    // fixed to limit 1000
    // @Column(name = "options", length = 1000)
    @Column(name = "options", columnDefinition = "TEXT")
    private List<String> options;

    private int correctOptionIndex;

    // When sending entities directly via REST APIs, infinite loops may occur. Fix this using annotations or DTOs:
    @JsonBackReference
    // Question explicitly manages this relationship—thus, it's the owning side.
    // @JoinColumn(name = "quiz_id") explicitly defines the foreign key column in your database.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;
}



package com.mkyong.quiz.repository;

import com.mkyong.quiz.model.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    Optional<QuizResult> findByShareCode(String shareCode);
}


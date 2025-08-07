package com.mkyong.quiz.controller;

import com.mkyong.quiz.model.QuizResult;
import com.mkyong.quiz.model.QuizResultDTO;
import com.mkyong.quiz.repository.QuizResultRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/quiz-results")
public class QuizResultController {
    @Autowired
    private QuizResultRepository repo;

    @PostMapping
    public QuizResult saveResult(@RequestBody QuizResultDTO dto, HttpServletRequest request) {
        QuizResult qr = new QuizResult();
        qr.setUserIp(request.getRemoteAddr());
        qr.setCreatedDateTime(LocalDateTime.now());
        qr.setQuizJson(dto.getQuizJson());
        qr.setUserAnswersJson(dto.getUserAnswersJson());
        qr.setScore(dto.getScore());
        qr.setTotalQuestions(dto.getTotalQuestions());
        qr.setCorrectAnswersJson(dto.getCorrectAnswersJson());
        qr.setShareCode(UUID.randomUUID().toString().replace("-", "")); // Or any unique strategy
        return repo.save(qr);
    }

    @GetMapping("/{shareCode}")
    public ResponseEntity<QuizResult> getResult(@PathVariable String shareCode) {
        return repo.findByShareCode(shareCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}


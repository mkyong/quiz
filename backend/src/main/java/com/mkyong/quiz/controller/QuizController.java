package com.mkyong.quiz.controller;

import com.mkyong.quiz.model.Question;
import com.mkyong.quiz.model.Quiz;
import com.mkyong.quiz.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {
    @Autowired
    private QuizRepository quizRepository;

    @PostMapping
    public Quiz createQuiz(@RequestBody Quiz quiz) {
        return quizRepository.save(quiz);
    }

    @GetMapping
    public List<Quiz> getQuizzes() {
        return quizRepository.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable Long id, @RequestBody Quiz quiz) {
        // 1. Find the quiz by id
        Optional<Quiz> existingQuizOpt = quizRepository.findById(id);
        if (existingQuizOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Quiz existingQuiz = existingQuizOpt.get();

        // 2. Update basic fields
        existingQuiz.setTitle(quiz.getTitle());
        existingQuiz.setDescription(quiz.getDescription());

        // 3. Handle questions (replace existing questions)
        existingQuiz.getQuestions().clear();
        if (quiz.getQuestions() != null) {
            for (Question q : quiz.getQuestions()) {
                // Ensure bi-directional link
                q.setQuiz(existingQuiz);
                existingQuiz.getQuestions().add(q);
            }
        }

        // 4. Save and return
        Quiz savedQuiz = quizRepository.save(existingQuiz);
        return ResponseEntity.ok(savedQuiz);
    }


    /*@GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuiz(@PathVariable Long id) {
        return quizRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }*/

    // Cached expired after 1 day
    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuiz(@PathVariable Long id) {
        return quizRepository.findById(id)
                .map(quiz -> ResponseEntity.ok()
                        .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                        .body(quiz))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void deleteQuiz(@PathVariable Long id) {
        quizRepository.deleteById(id);
    }
}


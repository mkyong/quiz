package com.mkyong.quiz.imports;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mkyong.quiz.model.Question;
import com.mkyong.quiz.model.Quiz;
import com.mkyong.quiz.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.InputStream;

@Component
public class QuizJsonImporter implements CommandLineRunner {

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private QuizRepository quizRepository;

    @Override
    public void run(String... args) throws Exception {

        String quizTitle = "Maven Beginner Quiz";
        boolean exists = quizRepository.existsByTitle(quizTitle);
        if (exists) {
            System.out.println("Quiz already imported. Skipping import.");
            return;
        }

        // Path to your JSON file
        Resource resource = resourceLoader.getResource("classpath:quiz/maven-beginner.json");
        try (InputStream is = resource.getInputStream()) {

            // Parse JSON
            ObjectMapper mapper = new ObjectMapper();
            QuizImportDTO quizDto = mapper.readValue(is, QuizImportDTO.class);
            //QuizImportDTO quizDto = mapper.readValue(Paths.get(path).toFile(), QuizImportDTO.class);

            // Convert to Entity
            Quiz quiz = new Quiz();
            quiz.setTitle(quizDto.title);
            quiz.setDescription(quizDto.description);

            for (QuestionImportDTO qdto : quizDto.questions) {
                Question q = new Question();
                q.setText(qdto.text);
                q.setCorrectOptionExplain(qdto.correctOptionExplain);
                q.setOptions(qdto.options);
                q.setCorrectOptionIndex(qdto.correctOptionIndex);

                quiz.addQuestion(q); // sets both sides of relationship
            }

            quizRepository.save(quiz);
            System.out.println("Quiz imported: " + quiz.getTitle());

        }

    }
}
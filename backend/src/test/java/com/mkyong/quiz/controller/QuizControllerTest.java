package com.mkyong.quiz.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mkyong.quiz.model.Question;
import com.mkyong.quiz.model.Quiz;
import com.mkyong.quiz.repository.QuizRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class QuizControllerTest {

    private MockMvc mockMvc;

    @Mock
    private QuizRepository quizRepository;

    @InjectMocks
    private QuizController quizController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void createQuizTest() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(quizController).build();

        Quiz quiz = new Quiz();
        quiz.setId(1L);
        quiz.setTitle("Java Fundamentals Quiz");

        Question question = new Question();
        question.setId(1L);
        question.setText("What is JVM?");
        question.setOptions(List.of(
                "Java Virtual Machine, which runs Java bytecode.",
                "JavaScript Virtual Machine.",
                "Java Verification Module."
        ));
        question.setCorrectOptionIndex(0);

        // Using helper method explicitly
        quiz.addQuestion(question);

        when(quizRepository.save(any(Quiz.class))).thenReturn(quiz);

        mockMvc.perform(post("/api/quizzes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(quiz)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Java Fundamentals Quiz")))
                .andExpect(jsonPath("$.questions[0].text", is("What is JVM?")))
                .andExpect(jsonPath("$.questions[0].options", hasSize(3)))
                .andExpect(jsonPath("$.questions[0].options[0]", containsString("Java Virtual Machine")));

        verify(quizRepository, times(1)).save(any(Quiz.class));
    }

    @Test
    void getQuizByIdTest() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(quizController).build();

        Quiz quiz = new Quiz();
        quiz.setId(1L);
        quiz.setTitle("Advanced Java Quiz");

        Question question = new Question();
        question.setId(1L);
        question.setText("Describe Java Streams API?");
        question.setOptions(List.of(
                "Streams API processes data in Java 8+.",
                "API for handling file streams."
        ));
        question.setCorrectOptionIndex(0);

        // Using helper method explicitly
        quiz.addQuestion(question);

        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));

        mockMvc.perform(get("/api/quizzes/{id}", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Advanced Java Quiz")))
                .andExpect(jsonPath("$.questions[0].text", is("Describe Java Streams API?")));

        verify(quizRepository, times(1)).findById(1L);
    }

    @Test
    void deleteQuizTest() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(quizController).build();

        doNothing().when(quizRepository).deleteById(1L);

        mockMvc.perform(delete("/api/quizzes/{id}", 1))
                .andExpect(status().isOk());

        verify(quizRepository, times(1)).deleteById(1L);
    }

    @Test
    void getQuizByIdNotFoundTest() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(quizController).build();

        when(quizRepository.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/quizzes/{id}", 999))
                .andExpect(status().isNotFound());

        verify(quizRepository, times(1)).findById(999L);
    }

    @Test
    void getAllQuizzesTest() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(quizController).build();

        Quiz quiz1 = new Quiz(1L, "Quiz 1", List.of());
        Quiz quiz2 = new Quiz(2L, "Quiz 2", List.of());

        when(quizRepository.findAll()).thenReturn(List.of(quiz1, quiz2));

        mockMvc.perform(get("/api/quizzes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title", is("Quiz 1")))
                .andExpect(jsonPath("$[1].title", is("Quiz 2")));

        verify(quizRepository, times(1)).findAll();
    }
}


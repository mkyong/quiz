package com.mkyong.quiz.imports;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data // Generates getters, setters, toString, equals, hashCode
@NoArgsConstructor // No-args constructor
@AllArgsConstructor // All-args constructor
public class QuestionImportDTO {
    public String text;
    public String correctOptionExplain;
    public List<String> options;
    public int correctOptionIndex;
}

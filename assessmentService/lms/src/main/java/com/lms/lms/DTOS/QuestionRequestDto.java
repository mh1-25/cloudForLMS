package com.lms.lms.DTOS;

import java.util.List;

import com.lms.lms.Entity.Answer;
import com.lms.lms.Entity.CourseExam;
import com.lms.lms.Entity.Question.QuestionType;
import com.lms.lms.Entity.Quiz;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;


public record QuestionRequestDto( 
    String questionText,
    
    String questionType ,

    Integer questionOrder,
    Integer points,
    List<AnswerRequestDto> answers
){}

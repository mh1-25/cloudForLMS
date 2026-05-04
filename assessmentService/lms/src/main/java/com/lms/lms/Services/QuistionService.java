package com.lms.lms.Services;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.lms.lms.DTOS.AnswerOptionResponse;
import com.lms.lms.DTOS.AnswerRequestDto;
import com.lms.lms.DTOS.QuestionRequestDto;
import com.lms.lms.DTOS.QuestionResponse;
import com.lms.lms.Entity.Answer;
import com.lms.lms.Entity.CourseExam;
import com.lms.lms.Entity.Question;
import com.lms.lms.Entity.Quiz;
import com.lms.lms.Entity.User;
import com.lms.lms.Repo.AnswerRepository;
import com.lms.lms.Repo.CourseExamRepository;
import com.lms.lms.Repo.QuestionRepository;
import com.lms.lms.Repo.QuizRepository;
import com.lms.lms.Repo.UserRepository;

import lombok.RequiredArgsConstructor;
@RequiredArgsConstructor

@Service
public class QuistionService {
    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final CourseExamRepository courseExamRepository;
    private final AnswerRepository answerRepository;
    public  QuestionResponse addQuestionQuiz(Long quizId, QuestionRequestDto dto) {
        User instructor = getLoggedInInstructor();
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (!quiz.getLesson().getCourse().getInstructor().getId().equals(instructor.getId())) {
                throw new RuntimeException("You don't own this quiz");
        }
        if(quiz.getTotalQuestions() != null && quiz.getQuestions().size() >= quiz.getTotalQuestions()) {
                throw new RuntimeException("Quiz already has the maximum number of questions");
        }
         boolean exists = questionRepository.findByQuizIdOrderByQuestionOrder(quizId)
                .stream()
                .anyMatch(q -> q.getQuestionText().equalsIgnoreCase(dto.questionText()));

        if (exists && quiz.getId().equals(quizId)) {
                throw new RuntimeException("This question already exists in this exam");
        }
        Question question = buildQuestion(dto);
        question.setQuiz(quiz);
        Question saved = questionRepository.save(question);
        return QuestionResponse.fromEntity(saved);
        }
        

        //Exam
    public QuestionResponse addQuestionToExam(Long ExamId,QuestionRequestDto dto) {
        User instructor = getLoggedInInstructor();

        CourseExam exam = courseExamRepository.findById(ExamId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        if (!exam.getCourse().getInstructor().getId().equals(instructor.getId())) {
                throw new RuntimeException("You don't own this exam");
        }
        if(exam.getTotalQuestions() != null && exam.getQuestions().size() >= exam.getTotalQuestions()) {
                throw new RuntimeException("Exam already has the maximum number of questions");
        }
        boolean exists = questionRepository.findByCourseExamIdOrderByQuestionOrder(ExamId)
                .stream()
                .anyMatch(q -> q.getQuestionText().equalsIgnoreCase(dto.questionText()));

    if (exists && exam.getId().equals(ExamId)) {
        throw new RuntimeException("This question already exists in this exam");
    }
        Question question = buildQuestion(dto);
        question.setCourseExam(exam);

        Question saved = questionRepository.save(question);
        return QuestionResponse.fromEntity(saved);
}
    
    public void deleteQuestionForExam(Long questionId,Long examId) {
        User instructor = getLoggedInInstructor();

        CourseExam exam = courseExamRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        if (!exam.getCourse().getInstructor().getId().equals(instructor.getId())) {
                throw new RuntimeException("You don't own this exam");
        }

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (question.getCourseExam() == null || !question.getCourseExam().getId().equals(examId)) {
                throw new RuntimeException("Question does not belong to this exam");
        }

        questionRepository.delete(question);

}
    
    public AnswerOptionResponse updateAnswer(Long questionId, Long answerId, AnswerRequestDto dto) {
                User instructor = getLoggedInInstructor();

                Question question = questionRepository.findById(questionId)
                        .orElseThrow(() -> new RuntimeException("Question not found"));

                validateInstructorOwnsQuestion(instructor, question);

                Answer answer = answerRepository.findById(answerId)
                        .orElseThrow(() -> new RuntimeException("Answer not found"));

                if (!answer.getQuestion().getId().equals(questionId)) {
                        throw new RuntimeException("Answer does not belong to this question");
                }

                answer.setAnswerText(dto.answerText());
                answer.setCorrect(dto.correct());
                answer.setAnswerOrder(dto.answerOrder());

                Answer saved = answerRepository.save(answer);
                return AnswerOptionResponse.fromEntity(saved);
        }

    public void deleteAnswer(Long questionId, Long answerId) {
                User instructor = getLoggedInInstructor();

                Question question = questionRepository.findById(questionId)
                        .orElseThrow(() -> new RuntimeException("Question not found"));

                validateInstructorOwnsQuestion(instructor, question);

                Answer answer = answerRepository.findById(answerId)
                        .orElseThrow(() -> new RuntimeException("Answer not found"));

                if (!answer.getQuestion().getId().equals(questionId)) {
                        throw new RuntimeException("Answer does not belong to this question");
                }

                answerRepository.delete(answer);
        }

    public List<AnswerOptionResponse> getAnswersByQuestion(Long questionId) {
                User instructor = getLoggedInInstructor();

                Question question = questionRepository.findById(questionId)
                        .orElseThrow(() -> new RuntimeException("Question not found"));

        validateInstructorOwnsQuestion(instructor, question);

        return answerRepository.findByQuestionIdOrderByAnswerOrder(questionId)
            .stream()
            .map(AnswerOptionResponse::fromEntity)
            .toList();
        }

    public void deleteQuestionFromQuiz(Long quizId, Long questionId) {
                User instructor = getLoggedInInstructor();

                Quiz quiz = quizRepository.findById(quizId)
                        .orElseThrow(() -> new RuntimeException("Quiz not found"));

                if (!quiz.getLesson().getCourse().getInstructor().getId().equals(instructor.getId())) {
                        throw new RuntimeException("You don't own this quiz");
                }

                Question question = questionRepository.findById(questionId)
                        .orElseThrow(() -> new RuntimeException("Question not found"));

                if (question.getQuiz() == null || !question.getQuiz().getId().equals(quizId)) {
                        throw new RuntimeException("Question does not belong to this quiz");
                }
                
                questionRepository.delete(question);
        }
     
    public AnswerOptionResponse addAnswerToQuestion(Long questionId, AnswerRequestDto dto) {
                User instructor = getLoggedInInstructor();

                Question question = questionRepository.findById(questionId)
                        .orElseThrow(() -> new RuntimeException("Question not found"));

                validateInstructorOwnsQuestion(instructor, question);

                Answer answer = new Answer();
                answer.setAnswerText(dto.answerText());
                answer.setCorrect(dto.correct());
                answer.setAnswerOrder(dto.answerOrder());
                answer.setQuestion(question);

                Answer saved = answerRepository.save(answer);
                return AnswerOptionResponse.fromEntity(saved);
        }

        // Helper method to build a Question entity from the DTO
    private User getLoggedInInstructor() {
    var auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth == null || !auth.isAuthenticated()) {
        throw new RuntimeException("User not authenticated");
    }

    
    boolean isInstructor = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_INSTRUCTOR"));

    if (!isInstructor) {
        throw new RuntimeException("Access denied: Not an instructor");
    }

    String email = auth.getName();

    return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Instructor not found"));
}

    private Question buildQuestion(QuestionRequestDto dto) {
    Question question = new Question();
    question.setQuestionText(dto.questionText());
    question.setQuestionType(Question.QuestionType.valueOf(dto.questionType()));
    question.setQuestionOrder(dto.questionOrder());
    question.setPoints(dto.points() != null ? dto.points() : 1);

    if (dto.answers() != null && !dto.answers().isEmpty()) {
        List<Answer> answers = dto.answers().stream().map(a -> {
            Answer answer = new Answer();
            answer.setAnswerText(a.answerText());
            answer.setCorrect(a.correct());
            answer.setAnswerOrder(a.answerOrder());
            answer.setQuestion(question);
            return answer;
        }).toList();
        question.setAnswers(answers);
    }

    return question;
}
    private void validateInstructorOwnsQuestion(User instructor, Question question) {
                // Question belongs to a quiz
                if (question.getQuiz() != null) {
                if (!question.getQuiz().getLesson().getCourse().getInstructor().getId()
                .equals(instructor.getId())) {
                        throw new RuntimeException("You don't own this question");
                }
                return;
        }
    // Question belongs to an exam
                if (question.getCourseExam() != null) {
                if (!question.getCourseExam().getCourse().getInstructor().getId()
                        .equals(instructor.getId())) {
                        throw new RuntimeException("You don't own this question");
                }
                return;
                }
                throw new RuntimeException("Question is not linked to any quiz or exam");
        }
}

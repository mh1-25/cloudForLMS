package service;

import com.lms.lms.DTO.CourseDTO;
import com.lms.lms.DTO.CourseRequestDto;
import com.lms.lms.DTO.CourseResponseDto;
import com.lms.lms.DTO.CourseDetailsResponse;
import com.lms.lms.DTO.LessonResponseDto;
import com.lms.lms.DTO.ExamScoreResponse;
import com.lms.lms.DTO.QuizScoreResponse;
import com.lms.lms.DTO.StudentProgressResponse;
import com.lms.lms.repo.CourseProgressRepository;
import com.lms.lms.repo.EnrollmentRepository;
import com.lms.lms.repo.ExamAttemptRepository;
import com.lms.lms.entity.Category;
import com.lms.lms.entity.Course;
import com.lms.lms.repo.QuizAttemptRepository;
import com.lms.lms.entity.User;
import com.lms.lms.repo.CategoryRepository;
import com.lms.lms.repo.CourseRepository;
import com.lms.lms.repo.LessonRepository;
import com.lms.lms.repo.UserRepository;
import com.lms.lms.ServiceAbstraction.ICourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;

@Service
@RequiredArgsConstructor

public class CourseService implements ICourseService {
    @Autowired
    private CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final ExamAttemptRepository examAttemptRepository;
    private final CourseProgressRepository courseProgressRepository;
    private final CategoryRepository categoryRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserServiceClient userServiceClient;

    @Override
    public CourseResponseDto createCourse(CourseRequestDto dto) {
//<<<<<<< HEAD
    User instructor = getLoggedInInstructor(); 
    Category category = categoryRepository.findById(dto.getCategoryId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

    Course course = new Course();
    course.setTitle(dto.getTitle());
    course.setDescription(dto.getDescription());
    course.setThumbnailUrl(dto.getThumbnailUrl());
    course.setFree(dto.getFree());
    course.setPublished(dto.getPublished());
    course.setTotalLessons(dto.getTotalLessons());
    course.setTotalDuration(dto.getTotalDuration());
    course.setInstructor(instructor);
    course.setCategory(category);
    Course saved = courseRepository.save(course);

    CourseResponseDto response = new CourseResponseDto();
    response.setId(saved.getId());
    response.setTitle(saved.getTitle());
    response.setDescription(saved.getDescription());
    response.setThumbnailUrl(saved.getThumbnailUrl());
    response.setTotalLessons(saved.getTotalLessons());
    response.setFree(saved.isFree());
    response.setPublished(saved.isPublished());
    response.setTotalDuration(saved.getTotalDuration());
    response.setInstructorId(saved.getInstructor().getId());
    response.setInstructorName(saved.getInstructor().getFirstName());
    response.setCategoryId(saved.getCategory().getId());
    response.setCreatedAt(saved.getCreatedAt());

    return response;
}
    @Override
    public CourseResponseDto updateCourse(Long courseId ,CourseRequestDto dto) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Course not found"));
        User instructor = getLoggedInInstructor();


        if (!course.getInstructor().getId().equals(instructor.getId())) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't own this course");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Category not found"));

        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setThumbnailUrl(dto.getThumbnailUrl());
        course.setFree(dto.getFree());

        course.setTotalLessons(dto.getTotalLessons());
        course.setTotalDuration(dto.getTotalDuration());
        course.setInstructor(instructor);
        course.setCategory(category);

        Course saved = courseRepository.save(course);

        // ── inline mapping ──
        CourseResponseDto response = new CourseResponseDto();
        response.setId(saved.getId());
        response.setTitle(saved.getTitle());
        response.setDescription(saved.getDescription());
        response.setThumbnailUrl(saved.getThumbnailUrl());
        response.setFree(saved.isFree());
        response.setPublished(saved.isPublished());
        response.setLessons(course.getLessons().stream().map(lesson -> {
                LessonResponseDto lessonDto = new LessonResponseDto();
                lessonDto.setId(lesson.getId());
                lessonDto.setTitle(lesson.getTitle());
                lessonDto.setDescription(lesson.getDescription());
                lessonDto.setVideoUrl(lesson.getVideoUrl());
                lessonDto.setThumbnailUrl(lesson.getThumbnailUrl());
                lessonDto.setDuration(lesson.getDuration());
                lessonDto.setLessonOrder(lesson.getLessonOrder());
                lessonDto.setPreview(lesson.isPreview());
                lessonDto.setCourseId(course.getId());
                lessonDto.setCreatedAt(lesson.getCreatedAt());
                return lessonDto;
        }).collect(Collectors.toList()));        response.setTotalDuration(saved.getTotalDuration());
        response.setInstructorId(saved.getInstructor().getId());
        response.setInstructorName(saved.getInstructor().getFirstName());
        response.setCategoryId(saved.getCategory().getId());
        response.setCreatedAt(saved.getCreatedAt());
        // response.setUpdatedAt(saved.getUpdatedAt());
        return response;
    }

    @Override
    public void deleteCourse(Long courseId, Long instructorId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Course not found"));

        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't own this course");
        }

        courseRepository.delete(course);
    }

    @Override
    public List<CourseResponseDto> getInstructorCourses(Long instructorId) {
        List<Course> courses = userRepository.findByRole(User.Role.INSTRUCTOR).stream()
                .filter(user -> user.getId().equals(instructorId))
                .flatMap(user -> user.getCourses().stream())
                .collect(Collectors.toList());

        return courses.stream().map(c -> {
            CourseResponseDto response = new CourseResponseDto();
            response.setId(c.getId());
            response.setTitle(c.getTitle());
            response.setDescription(c.getDescription());
            response.setThumbnailUrl(c.getThumbnailUrl());
            // response.setIsFree(c.getFree());
            // response.setIsPublished(c.getIsPublished());
            response.setTotalLessons(c.getTotalLessons());
            response.setTotalDuration(c.getTotalDuration());
            response.setInstructorId(c.getInstructor().getId());
            response.setCategoryId(c.getCategory().getId());
            response.setCreatedAt(c.getCreatedAt());
            // response.setUpdatedAt(c.getUpdatedAt());
            return response;
        }).collect(Collectors.toList());
    }

    @Override
    public CourseResponseDto getCourseById(Long courseId) {
        Course c = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Course not found"));

        CourseResponseDto response = new CourseResponseDto();
        response.setId(c.getId());
        response.setInstructorId(c.getInstructor().getId());
        response.setInstructorName(c.getInstructor().getFirstName()+" "+c.getInstructor().getLastName());
        response.setTitle(c.getTitle());
        response.setDescription(c.getDescription());
        response.setThumbnailUrl(c.getThumbnailUrl());
        response.setFree(c.isFree());
        response.setPublished(c.isPublished());
        response.setTotalLessons(c.getTotalLessons());
        response.setTotalDuration(c.getTotalDuration());
        response.setCategoryId(c.getCategory().getId());
        response.setCreatedAt(c.getCreatedAt());
        response.setLessons(c.getLessons().stream().map(lesson -> {
                LessonResponseDto lessonDto = new LessonResponseDto();
                lessonDto.setId(lesson.getId());
                lessonDto.setTitle(lesson.getTitle());
                lessonDto.setDescription(lesson.getDescription());
                lessonDto.setVideoUrl(lesson.getVideoUrl());
                lessonDto.setThumbnailUrl(lesson.getThumbnailUrl());
                lessonDto.setDuration(lesson.getDuration());
                lessonDto.setLessonOrder(lesson.getLessonOrder());
                lessonDto.setPreview(lesson.isPreview());
                lessonDto.setCourseId(c.getId());
                lessonDto.setCreatedAt(lesson.getCreatedAt());
                return lessonDto;
        }).collect(Collectors.toList()));
        return response;
    }
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
    return userServiceClient.getUserByEmail(email);
}

    // Browse all available courses
    public List<CourseDTO> browseAvailableCourses() {
        return courseRepository.findAll()
                .stream()
                .filter(Course::isPublished)
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // Search courses by name / category
    public List<CourseDTO> searchCourses(String keyword, Long categoryId) {
        if (keyword != null && !keyword.isBlank()) {
            List<Course> byTitle = courseRepository
                    .findByTitleContainingIgnoreCaseAndPublishedTrue(keyword);
            if (categoryId != null) {
                byTitle = byTitle.stream()
                        .filter(c -> c.getCategory().getId().equals(categoryId))
                        .collect(Collectors.toList());
            }
            return byTitle.stream().map(CourseDTO::fromEntity).collect(Collectors.toList());
        }
        if (categoryId != null) {
            return courseRepository.findByCategory_IdAndPublishedTrue(categoryId)
                    .stream().map(CourseDTO::fromEntity).collect(Collectors.toList());
        }
        return List.of();
    }

    // Watch video lectures
    public String watchLesson(Long courseId, Long lessonId) {
        User student = getLoggedInStudent();

        enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new RuntimeException("You are not enrolled in this course"));

        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"))
                .getVideoUrl();
    }


    // View grades and progress
    public StudentProgressResponse getStudentProgress(Long courseId) {
        User student = getLoggedInStudent();

        enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new RuntimeException("You are not enrolled in this course"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        List<QuizScoreResponse> quizScores = quizAttemptRepository
                .findByStudentAndQuizLessonIdOrderBySubmittedAtDesc(student, courseId)
                .stream().map(QuizScoreResponse::fromEntity).collect(Collectors.toList());

        Double averageQuizScore = quizAttemptRepository
                .getAverageQuizScoreByStudentAndCourse(student.getId(), courseId);

        List<ExamScoreResponse> examAttempts = examAttemptRepository
                .findByStudentAndCourseIdOrderByAttemptNumberDesc(student, courseId)
                .stream().map(ExamScoreResponse::fromEntity).collect(Collectors.toList());

        Double overallProgress = courseProgressRepository
                .getCourseProgressAverage(student.getId(), courseId);

        return new StudentProgressResponse(
                course.getTitle(),
                overallProgress != null ? overallProgress : 0.0,
                averageQuizScore != null ? averageQuizScore : 0.0,
                quizScores,
                examAttempts
        );
    }

    // get full course details
    public CourseDetailsResponse getCourseDetails(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return CourseDetailsResponse.fromEntity(course);
        }

    private  User getLoggedInStudent() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }
    
}

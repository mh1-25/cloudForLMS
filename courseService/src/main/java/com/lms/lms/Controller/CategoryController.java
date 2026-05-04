package com.lms.lms.Controller;

import org.springframework.web.bind.annotation.*;
import com.lms.lms.DTO.CategoryRequest;
import com.lms.lms.DTO.CategoryResponse;
import com.lms.lms.entity.Category;
import com.lms.lms.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import com.lms.lms.entity.User;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;


    
   @GetMapping("/all")
   @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR') ")
public ResponseEntity<List<CategoryResponse>> getAllCategories() {
    return ResponseEntity.ok(categoryService.getAllCategories());
}

   
    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> createCategory(
            @Valid @RequestBody CategoryRequest request) {

        Category category = categoryService.create(request);

        return ResponseEntity
                .status(201) // CREATED
                .body(category);
    }
    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {

        Category updatedCategory = categoryService.update(id, request);

        return ResponseEntity.ok(updatedCategory);
    }
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

   
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<List<Category>> searchCategories(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                categoryService.searchCategories(keyword)
        );
    }
}
package com.lms.lms.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lms.lms.DTO.CategoryRequest;
import com.lms.lms.DTO.CategoryResponse;
import com.lms.lms.service.CategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;


    
   @GetMapping("/all")
   @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR') ") // Only Admins and Instructors can access this endpoint OCL 
public ResponseEntity<List<CategoryResponse>> getAllCategories() {
    return ResponseEntity.ok(categoryService.getAllCategories());
}

   
    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')") // Only Admins can access this endpoint OCL
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryRequest request) {

        CategoryResponse category = categoryService.create(request);

        return ResponseEntity
                .status(201) // CREATED
                .body(category);
    }
    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only Admins can access this endpoint OCL
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {

        CategoryResponse updatedCategory = categoryService.update(id, request);

        return ResponseEntity.ok(updatedCategory);
    }
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only Admins can access this endpoint OCL
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

   
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')") // Only Admins can access this endpoint OCL
    public ResponseEntity<List<CategoryResponse>> searchCategories(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                categoryService.searchCategories(keyword)
        );
    }
}
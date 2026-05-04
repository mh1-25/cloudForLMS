package com.lms.lms.service;

import com.lms.lms.DTO.CategoryRequest;
import com.lms.lms.DTO.CategoryResponse;
import com.lms.lms.entity.Category;
import com.lms.lms.repo.*;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
   public List<CategoryResponse> getAllCategories() {

    return categoryRepository.findAll()
            .stream()
            .map(category -> new CategoryResponse(
                    category.getId(),
                    category.getName()
            ))
            .toList();
}
    public Category create(CategoryRequest request) {


        if (categoryRepository.findByName(request.name()) .isPresent()) {
            throw new RuntimeException("Category already exists");
        }
        categoryRepository.findByName(request.name()).ifPresent(category -> {
            throw new RuntimeException("Category already exists");
        });
        Category category = new Category();
        category.setName(request.name());
        category.setDescription(request.description());
        category.setIcon(request.icon());
    

        return categoryRepository.save(category);
    }

 public Category update(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setName(request.name());
        category.setDescription(request.description());
        category.setIcon(request.icon());
        return categoryRepository.save(category);
    }
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }
        categoryRepository.deleteById(id);
    }
    public List<Category> searchCategories(String keyword) {
        return categoryRepository.findByNameContainingIgnoreCase(keyword);
    }
}
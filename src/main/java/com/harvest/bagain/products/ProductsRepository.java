package com.harvest.bagain.products;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.harvest.bagain.category.Category;

@Repository
public interface ProductsRepository extends JpaRepository<Products, Integer> {
    List<Products> findByCategory(Category category); 
}

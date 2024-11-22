package com.harvest.bagain.products;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.harvest.bagain.category.Category;
import com.harvest.bagain.users.Users;

@Repository
public interface ProductsRepository extends JpaRepository<Products, Integer> {
    Optional<Products> findProductByCategoryAndPcode(Category category, Integer pcode);
    List<Products> findByCategory(Category category);
    List<Products> findBySeller(Users seller);
    List<Products> findByNameContainingIgnoreCaseOrCommentContainingIgnoreCase(String nameKeyword, String commentKeyword);;
}

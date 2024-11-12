package com.harvest.bagain.products;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductsRepository extends JpaRepository<Products, String> {
	List<Products> findByCategoryCode(String category_code);
	
}

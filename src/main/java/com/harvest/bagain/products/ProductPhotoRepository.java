package com.harvest.bagain.products;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ProductPhotoRepository extends JpaRepository<ProductPhoto, Long> {
	
}

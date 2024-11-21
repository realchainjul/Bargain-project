package com.harvest.bagain.bucket;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.harvest.bagain.products.Products;
import com.harvest.bagain.users.Users;

@Repository
public interface BucketRepository extends JpaRepository<Bucket, Integer> {
	Optional<Bucket> findByUserAndProduct(Users user, Products product);
	List<Bucket> findAllByUser(Users user);
}

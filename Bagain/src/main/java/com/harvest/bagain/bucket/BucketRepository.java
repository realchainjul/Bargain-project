package com.harvest.bagain.bucket;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BucketRepository extends JpaRepository<Bucket, Integer> {
	
}

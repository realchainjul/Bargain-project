package com.harvest.bagain.liked;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikedRepository extends JpaRepository<Liked, Integer> {
}

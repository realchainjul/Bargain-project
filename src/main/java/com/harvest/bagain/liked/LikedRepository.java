package com.harvest.bagain.liked;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.harvest.bagain.products.Products;
import com.harvest.bagain.users.Users;

import java.util.Optional;

@Repository
public interface LikedRepository extends JpaRepository<Liked, Integer> {
    Optional<Liked> findByUserAndProduct(Users user, Products product);
}

package com.harvest.bagain.users;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends CrudRepository<Users, Integer> {
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);
}

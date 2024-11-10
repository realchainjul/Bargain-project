package com.harvest.bagain.users;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends CrudRepository<Users, Integer> {
	// 이메일 중복확인
    boolean existsByEmail(String email);
    // 닉네임 중복확인
    boolean existsByNickname(String nickname);
    // 로그인시 이메일 찾기
    Optional<Users> findByEmail(String email);
}

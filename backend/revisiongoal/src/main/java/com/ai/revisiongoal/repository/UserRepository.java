package com.ai.revisiongoal.repository;



import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ai.revisiongoal.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	 Optional<User> findByEmail(String email);

}


package com.harvest.bagain.users;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsersDAO {
	private BCryptPasswordEncoder bcpe;

	public UsersDAO() {
		bcpe = new BCryptPasswordEncoder();
	}
	
}

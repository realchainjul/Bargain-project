package com.harvest.bagain.users;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsersDAO {
	private BCryptPasswordEncoder bcpe;

	public UsersDAO() {
		bcpe = new BCryptPasswordEncoder();
	}
	
	public void login(Users u) {
		System.out.println(u.getName());
		System.out.println(u.getPassword());
		System.out.println(bcpe.encode(u.getPassword()));
	}
}

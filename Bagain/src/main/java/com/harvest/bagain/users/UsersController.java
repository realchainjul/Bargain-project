package com.harvest.bagain.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UsersController {
	
	@Autowired
	private UsersDAO uDAO;
}

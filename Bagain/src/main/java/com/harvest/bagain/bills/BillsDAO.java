package com.harvest.bagain.bills;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BillsDAO {
	
	@Autowired
	private BillsRepository br;
	
}

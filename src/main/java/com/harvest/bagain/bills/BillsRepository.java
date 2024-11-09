package com.harvest.bagain.bills;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillsRepository extends JpaRepository<Bills, Integer> {

	public abstract List<Bills> findAll();
}

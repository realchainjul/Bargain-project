package com.harvest.bagain.bills;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.harvest.bagain.payments.Payments;

@Repository
public interface BillsRepository extends JpaRepository<Bills, Integer> {
	List<Bills> findAllByPayment(Payments payment);
	Optional<Bills> findByCode(Integer code);
}
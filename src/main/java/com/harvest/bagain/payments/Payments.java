package com.harvest.bagain.payments;

import java.sql.Timestamp;
import java.util.List;

import com.harvest.bagain.bills.Bills;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity(name = "payments")
public class Payments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;

    @OneToMany(mappedBy = "payment")
    private List<Bills> bills;

    @Column(name = "imp_uid")
    private String impUid;

    @Column(name = "merchant_uid")
    private String merchantUid;

    @Column(name = "payment_status")
    private String paymentStatus;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "amount")
    private Integer amount;

    @Column(name = "payment_date")
    private Timestamp paymentDate;

    @Column(name = "error_message")
    private String errorMessage;
}

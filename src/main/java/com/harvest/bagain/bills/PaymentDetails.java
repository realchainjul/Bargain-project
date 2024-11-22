package com.harvest.bagain.bills;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaymentDetails {
    private Integer billCode;
    private String paymentMethod;
    private Integer count;
    private Integer totalPrice;
}
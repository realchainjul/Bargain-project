package com.harvest.bagain.bills;

import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;

import com.harvest.bagain.users.Users;
import com.harvest.bagain.products.Products;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity(name = "bills")
public class Bills {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bills_code")
    private Integer code;
    
    @ManyToOne
    @JoinColumn(name = "users_code")
    private Users user;

    @ManyToOne
    @JoinColumn(name = "products_code")
    private Products product;

    @Column(name = "bills_address")
    private String address;

    @Column(name = "bills_payment")
    private String payment;

    @Column(name = "bills_count")
    private Integer count;

    @Column(name = "bills_price")
    private Integer price;
    
    @Column(name = "bills_total_price")
    private Integer totalPrice;
    
    @CreationTimestamp
    @Column(name = "bills_buydate")
    private Timestamp buyDate;
    
    
}
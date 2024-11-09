package com.harvest.bagain.reviews;

import java.math.BigDecimal;

import com.harvest.bagain.products.Products;
import com.harvest.bagain.users.Users;

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
@Entity(name = "reviews")
public class Reviews {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reviews_code")
    private Integer code;

    @ManyToOne
    @JoinColumn(name = "users_code")
    private Users user;

    @ManyToOne
    @JoinColumn(name = "products_code")
    private Products product;

    @Column(name = "reviews_starRate")
    private BigDecimal starRate;

    @Column(name = "reviews_review")
    private String review;
}

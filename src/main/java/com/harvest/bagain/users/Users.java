package com.harvest.bagain.users;

import java.sql.Timestamp;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.harvest.bagain.bills.Bills;
import com.harvest.bagain.bucket.Bucket;
import com.harvest.bagain.liked.Liked;
import com.harvest.bagain.products.Products;
import com.harvest.bagain.reviews.Reviews;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity(name = "users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "users_code")
    private Integer code;

    @Column(name = "users_email")
    private String email;

    @Column(name = "users_pw")
    private String password;

    @Column(name = "users_name")
    private String name;

    @Column(name = "users_nickname")
    private String nickname;

    @Column(name = "users_address")
    private String address;

    @Column(name = "users_phonenum")
    private String phoneNumber;

    @Column(name = "users_photo")
    private String photo;

    @CreationTimestamp
    @Column(name = "users_createat", updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "users_updateat")
    private Timestamp updatedAt;

    @OneToMany(mappedBy = "user")
    @JsonBackReference
    private List<Bills> bills;

    @OneToMany(mappedBy = "user")
    @JsonBackReference
    private List<Bucket> buckets;

    @OneToMany(mappedBy = "user")
    @JsonBackReference 
    private List<Liked> likedProducts;

    @OneToMany(mappedBy = "user")
    @JsonBackReference 
    private List<Reviews> reviews;

    @OneToMany(mappedBy = "seller")
    @JsonManagedReference // 순환 참조 방지
    private List<Products> products;
}

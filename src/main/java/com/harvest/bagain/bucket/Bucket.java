// Bucket.java
package com.harvest.bagain.bucket;

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
@Entity(name = "bucket")
public class Bucket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bucket_no")
    private Integer bucketNo;

    @ManyToOne
    @JoinColumn(name = "products_code")
    private Products product;

    @ManyToOne
    @JoinColumn(name = "users_code")
    private Users user;

    @Column(name = "bucket_count")
    private Integer bucketCount;
}

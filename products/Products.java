package com.harvest.bagain.products;

import java.util.List;

import com.harvest.bagain.bucket.Bucket;
import com.harvest.bagain.liked.Liked;
import com.harvest.bagain.reviews.Reviews;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity(name = "products")
public class Products {
    @Id
    @Column(name = "products_code")
    private String code;

    @Column(name = "products_name")
    private String name;

    @Column(name = "products_price")
    private Integer price;

    @Column(name = "products_comment")
    private String comment;

    @Column(name = "products_inventory")
    private Integer inventory;

    @Column(name = "products_flag")
    private Byte flag;

    @Column(name = "products_likes_count")
    private Integer likesCount;

    @OneToMany(mappedBy = "product")
    private List<Bucket> buckets;

    @OneToMany(mappedBy = "product")
    private List<Liked> likedUsers;

    @OneToMany(mappedBy = "product")
    private List<Reviews> reviews;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductPhoto> photos;
}

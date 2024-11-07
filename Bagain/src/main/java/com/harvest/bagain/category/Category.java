package com.harvest.bagain.category;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity(name = "category")
public class Category {
    @Id
    @Column(name = "category_code")
    private String code;

    @Column(name = "category_name")
    private String name;
}

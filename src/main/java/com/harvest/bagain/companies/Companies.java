package com.harvest.bagain.companies;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity(name = "companies")
public class Companies {
    @Id
    @Column(name = "companies_name")
    private String name;

    @Column(name = "companies_users_name")
    private String userName;

    @Column(name = "companies_comment")
    private String comment;

    @Column(name = "companies_tax_id")
    private String taxId;
}
package com.genspark.backend.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import static javax.persistence.GenerationType.AUTO;

@Entity
@Data /*getters and setters*/ @NoArgsConstructor
@AllArgsConstructor
public class AppUserCrypto {
    @Id
    @GeneratedValue(strategy = AUTO)
    int id;
    private String slug;
    private int quantity;
}


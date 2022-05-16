package com.genspark.backend.Entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import static javax.persistence.GenerationType.AUTO;

/**
 * DB Entity for storing a crypto present in a user's portfolio
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class AppUserCrypto {
    @Id
    @GeneratedValue(strategy = AUTO)
    int id;
    private String slug;
    private float quantity;
}


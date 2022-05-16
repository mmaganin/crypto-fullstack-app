package com.genspark.backend.Entity;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;

import static javax.persistence.GenerationType.AUTO;

/**
 * DB Entity for storing user information AppUser
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class AppUser {
    @Id
    @GeneratedValue(strategy = AUTO)
    private int id;
    private String username;
    private String password;
    private String email;
    private String bio;
    private String name;
    private int age;
    @ManyToMany(cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE
    })
    private Collection<AppUserCrypto> crypto_in_portfolio = new ArrayList<>();
    @ManyToMany(fetch = FetchType.EAGER)
    private Collection<AppRole> roles = new ArrayList<>();
}


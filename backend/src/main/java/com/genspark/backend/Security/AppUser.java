package com.genspark.backend.Security;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import java.util.ArrayList;
import java.util.Collection;

import static javax.persistence.GenerationType.AUTO;

@Entity @Data /*getters and setters*/ @NoArgsConstructor @AllArgsConstructor
public class AppUser {
    @Id @GeneratedValue(strategy = AUTO)
    private int id;
    private String username;
    private String password;
    private String email;
    private String bio;
    private String name;
    private int age;

    //load user and at same time load roles from DB
    @ManyToMany(fetch = FetchType.EAGER)
    private Collection<AppRole> roles = new ArrayList<>();

}

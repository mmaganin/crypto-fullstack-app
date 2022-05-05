package com.genspark.backend.Security;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import static javax.persistence.GenerationType.AUTO;

@Entity @Data /*getters and setters*/ @NoArgsConstructor @AllArgsConstructor
public class AppRole {
    @Id
    @GeneratedValue(strategy = AUTO)
    int id;
    String name;
}

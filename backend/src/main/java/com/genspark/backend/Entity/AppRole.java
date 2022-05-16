package com.genspark.backend.Entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import static javax.persistence.GenerationType.AUTO;

/**
 * DB Entity for storing authorization roles AppRole
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class AppRole {
    @Id
    @GeneratedValue(strategy = AUTO)
    int id;
    String name;


}

package com.genspark.backend.Dao;

import com.genspark.backend.Entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * DAO for storing AppUser users data in DB
 */
@Repository
public interface AppUserDao extends JpaRepository<AppUser, Integer> {
    AppUser findByUsername(String username);
}

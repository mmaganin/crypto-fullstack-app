package com.genspark.backend.Dao;

import com.genspark.backend.Entity.AppRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * DAO for storing authorization roles AppRole in DB
 */
@Repository
public interface AppRoleDao extends JpaRepository<AppRole, Integer> {
    AppRole findByName(String name);
}

package com.genspark.backend.Dao;

import com.genspark.backend.Security.AppRole;
import com.genspark.backend.Security.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//JpaRepository<x, y> (x=table, y=primary key) has a bunch of methods for interacting with DB
@Repository
public interface AppRoleDao extends JpaRepository<AppRole, Integer> {
    AppRole findByName(String name);
}

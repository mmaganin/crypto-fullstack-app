package com.genspark.backend.Dao;

import com.genspark.backend.Entity.AppRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppUserCryptoDao extends JpaRepository<AppRole, Integer> {
}

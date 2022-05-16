package com.genspark.backend.Dao;

import com.genspark.backend.Entity.CryptoObj;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * DAO for storing fetched CryptoObj individual cryptocurrency data in DB
 */
@Repository
public interface CryptoObjDao extends JpaRepository<CryptoObj, String> {
}

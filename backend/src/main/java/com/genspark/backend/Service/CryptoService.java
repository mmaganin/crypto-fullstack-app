package com.genspark.backend.Service;

import com.genspark.backend.Entity.CryptoObj;

import java.util.List;

/**
 * implemented in service classes that handle crypto market data
 */
public interface CryptoService {
    List<CryptoObj> getRefreshedMarkets();

    List<CryptoObj> getMarkets();
}

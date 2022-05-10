package com.genspark.backend.Service;

import com.genspark.backend.Entity.CryptoObj;

import java.util.List;

public interface CryptoService {
    List<CryptoObj> getRefreshedMarkets();
    List<CryptoObj> getMarkets();
}

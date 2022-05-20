package com.genspark.backend.Service;

import com.genspark.backend.CryptoAPI;
import com.genspark.backend.Dao.CryptoObjDao;
import com.genspark.backend.Entity.CryptoObj;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Gets crypto market data from API call or from data stored in DB
 */
@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class CryptoServiceImpl implements CryptoService {
    private final CryptoObjDao cryptoObjDao;
    private final CryptoAPI cryptoAPI;

    /**
     * @return list of CryptoObj individual cryptos market data
     */
    public List<CryptoObj> getRefreshedMarkets() {
        List<CryptoObj> cryptoObjList = cryptoAPI.generateListFromApi(CryptoAPI.slugsToRequest);

        cryptoObjDao.deleteAll();
        for (CryptoObj entry : cryptoObjList) {
            cryptoObjDao.save(entry);
        }

        return cryptoObjList;
    }

    /**
     * @return list of CryptoObj individual cryptos market data
     */
    public List<CryptoObj> getMarkets() {
        return cryptoObjDao.findAll();
    }
}

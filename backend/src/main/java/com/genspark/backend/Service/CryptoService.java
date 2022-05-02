package com.genspark.backend.Service;

import com.genspark.backend.Dao.CryptoObjDao;
import com.genspark.backend.Entity.CryptoObj;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CryptoService {
    @Autowired
    CryptoObjDao cryptoObjDao;

    public List<CryptoObj> getRefreshedMarkets(){
        List<CryptoObj> cryptoObjList = CryptoObj.generateListFromApi();

        for(CryptoObj entry : cryptoObjList){
            cryptoObjDao.save(entry);
        }

        return cryptoObjList;
    }

    public List<CryptoObj> getMarkets(){
        return cryptoObjDao.findAll();
    }

}

package com.genspark.backend.Service;

import com.genspark.backend.Dao.CryptoObjDao;
import com.genspark.backend.Entity.CryptoObj;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class CryptoServiceImpl implements CryptoService{
    private final CryptoObjDao cryptoObjDao;

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

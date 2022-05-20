package com.genspark.backend.Service;

import com.genspark.backend.CryptoAPI;
import com.genspark.backend.Dao.AppRoleDao;
import com.genspark.backend.Dao.AppUserDao;
import com.genspark.backend.Dao.CryptoObjDao;
import com.genspark.backend.Entity.CryptoObj;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CryptoServiceTest {
    @Mock
    private CryptoObjDao cryptoObjDao;
    @Mock
    private CryptoAPI cryptoAPI;
    private CryptoService cryptoService;

    @BeforeEach
    void setUp() {
        cryptoService = new CryptoServiceImpl(cryptoObjDao, cryptoAPI);
    }

    @Test
    void getRefreshedMarkets() {
        List<CryptoObj> cryptoObjList = new ArrayList<>();
        CryptoObj testCryptoObj;

        int minDaoCalls = 50;
        for(int i = 0; i < minDaoCalls; i++){
            testCryptoObj = new CryptoObj("name", "symbol", "slug1",
                    "circulating_supply", "", "", "",
                    "", "", "", "", "", "");
            cryptoObjList.add(testCryptoObj);
        }

        given(cryptoAPI.generateListFromApi(anyString())).willReturn(cryptoObjList);
        cryptoService.getRefreshedMarkets();

        verify(cryptoObjDao).deleteAll();
        verify(cryptoObjDao, atLeast(minDaoCalls)).save(any(CryptoObj.class));
    }

    @Test
    void getMarkets() {
        cryptoService.getMarkets();
        verify(cryptoObjDao).findAll();
    }
}
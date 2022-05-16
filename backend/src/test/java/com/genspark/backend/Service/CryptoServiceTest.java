package com.genspark.backend.Service;

import com.genspark.backend.Dao.AppRoleDao;
import com.genspark.backend.Dao.AppUserDao;
import com.genspark.backend.Dao.CryptoObjDao;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class CryptoServiceTest {
    @Mock
    private CryptoObjDao cryptoObjDao;
//    @Mock
//    private AppUserDao appUserDao;
//    @Mock
//    private AppRoleDao appRoleDao;
//    private AutoCloseable cryptoObjDaoCloseable;
//    private AutoCloseable appUserDaoCloseable;
//    private AutoCloseable appRoleDaoCloseable;

    private CryptoService cryptoService;

    @BeforeEach
    void setUp() {
//        cryptoObjDaoCloseable = MockitoAnnotations.openMocks(cryptoObjDao);

//        appUserDaoCloseable = MockitoAnnotations.openMocks(appUserDao);
//        appRoleDaoCloseable = MockitoAnnotations.openMocks(appRoleDao);

        cryptoService = new CryptoServiceImpl(cryptoObjDao);
    }

//    @AfterEach
//    void tearDown() throws Exception {
//        cryptoObjDaoCloseable.close();
//        appUserDaoCloseable.close();
//        appRoleDaoCloseable.close();
//    }

    @Test
    void getRefreshedMarkets() {
        //cryptoService.getRefreshedMarkets();
    }

    @Test
    void getMarkets() {
        cryptoService.getMarkets();
        verify(cryptoObjDao).findAll();
    }
}
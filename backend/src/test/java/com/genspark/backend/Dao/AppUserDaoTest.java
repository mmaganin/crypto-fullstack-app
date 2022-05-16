package com.genspark.backend.Dao;

import com.genspark.backend.Entity.AppUser;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.ArrayList;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class AppUserDaoTest {
    @Autowired
    private AppUserDao appUserDao;

    @AfterEach
    void tearDown() {
        appUserDao.deleteAll();
    }

    @Test
    void findByUsername() {
        AppUser expected = new AppUser(1, "testUsername", "testPassword", "testEmail",
                "testBio", "testName", 12, new ArrayList<>(), new ArrayList<>());
        appUserDao.save(expected);
        AppUser actual = appUserDao.findByUsername(expected.getUsername());

        assertThat(actual.toString()).isEqualTo(expected.toString());
    }
}
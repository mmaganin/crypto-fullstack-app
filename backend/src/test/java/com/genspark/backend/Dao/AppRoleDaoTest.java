package com.genspark.backend.Dao;

import com.genspark.backend.Entity.AppRole;
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
class AppRoleDaoTest {
    @Autowired
    private AppRoleDao appRoleDao;

    @AfterEach
    void tearDown() {
        appRoleDao.deleteAll();
    }

    @Test
    void findByName() {
        AppRole expected = new AppRole(1, "ROLE_USER");
        appRoleDao.save(expected);
        AppRole actual = appRoleDao.findByName(expected.getName());

        assertThat(actual.toString()).isEqualTo(expected.toString());
    }
}
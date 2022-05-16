package com.genspark.backend.Service;

import com.genspark.backend.Dao.AppRoleDao;
import com.genspark.backend.Dao.AppUserDao;
import com.genspark.backend.Entity.AppRole;
import com.genspark.backend.Entity.AppUser;
import com.genspark.backend.Entity.AppUserCrypto;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.Collection;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AppUserServiceTest {
    @Mock
    private AppUserDao appUserDao;
    @Mock
    private AppRoleDao appRoleDao;
    @Mock
    private PasswordEncoder passwordEncoder;
    private AppUserService appUserService;

    @BeforeEach
    void setUp() {
        appUserService = new AppUserServiceImpl(appUserDao, appRoleDao, passwordEncoder);
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void saveUser() {
        AppUser appUser = new AppUser(1, "testUsername", "testPassword", "testEmail",
                "testBio", "testName", 12, new ArrayList<>(), new ArrayList<>());

        appUserService.saveUser(appUser);
        ArgumentCaptor<AppUser> appUserArgumentCaptor = ArgumentCaptor.forClass(AppUser.class);
        verify(appUserDao).save(appUserArgumentCaptor.capture());
        AppUser capturedUser = appUserArgumentCaptor.getValue();

        assertThat(capturedUser).isEqualTo(appUser);
    }

    @Test
    void getUser() {
        AppUser appUser = new AppUser(1, "testUsername", "testPassword", "testEmail",
                "testBio", "testName", 12, new ArrayList<>(), new ArrayList<>());
        appUserService.getUser("testUsername");
        ArgumentCaptor<String> appUserArgumentCaptor = ArgumentCaptor.forClass(String.class);
        verify(appUserDao).findByUsername(appUserArgumentCaptor.capture());
        String capturedUsername = appUserArgumentCaptor.getValue();

        assertThat(capturedUsername).isEqualTo(appUser.getUsername());
    }

    @Test
    void getUsers() {
        appUserService.getUsers();
        verify(appUserDao).findAll();
    }

    @Test
    void saveRole() {
        AppRole appRole = new AppRole(1, "ROLE_USER");
        appUserService.saveRole(appRole);
        ArgumentCaptor<AppRole> appUserArgumentCaptor = ArgumentCaptor.forClass(AppRole.class);
        verify(appRoleDao).save(appUserArgumentCaptor.capture());
        AppRole capturedRole = appUserArgumentCaptor.getValue();

        assertThat(capturedRole).isEqualTo(appRole);
    }

    @Test
    void getRoles() {
        appUserService.getRoles();
        verify(appRoleDao).findAll();
    }

    @Test
    void addRoleToUser() {
    }

    @Test
    void editPortfolio() {
    }

    @Test
    void createUser_UserRoleDoesNotExist_ShouldCreateUserRole() {
        appUserService.createUser("testUser", "testPass");


//        given(appRoleDao.findByName(anyString())).willReturn(null);

        ArgumentCaptor<AppRole> appUserArgumentCaptor = ArgumentCaptor.forClass(AppRole.class);
        verify(appRoleDao).save(appUserArgumentCaptor.capture());
        AppRole capturedRole = appUserArgumentCaptor.getValue();

        assertThat(capturedRole.toString()).isEqualTo((new AppRole(0, "ROLE_USER")).toString());

    }

    @Test
    void createUser() {
        appUserService.createUser("testUser", "testPass");
        //given(appRoleDao.findByName(anyString())).willReturn(new AppRole(0, "ROLE_USER"));


    }


}
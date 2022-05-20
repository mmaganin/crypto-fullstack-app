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
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.Collection;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppUserServiceTest {
    @Mock
    private AppUserDao appUserDao;
    @Mock
    private AppRoleDao appRoleDao;
    @Mock
    private PasswordEncoder passwordEncoder;
    private AppUserServiceImpl appUserService;

    @BeforeEach
    void setUp() {
        appUserService = new AppUserServiceImpl(appUserDao, appRoleDao, passwordEncoder);
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void loadUserByUsername_UserExists() {
        AppRole appRole = new AppRole(1, "ROLE_USER");
        ArrayList<AppRole> roles = new ArrayList<>();
        roles.add(appRole);
        AppUser appUser = new AppUser(1, "testUsername", "testPassword", "testEmail",
                "testBio", "testName", 12, new ArrayList<>(), roles);

        given(appUserDao.findByUsername(anyString())).willReturn(appUser);
        UserDetails userDetails = appUserService.loadUserByUsername("username");

        assertThat(userDetails.getUsername()).isEqualTo("testUsername");
        assertThat(userDetails.getAuthorities().size()).isEqualTo(1);
    }

    @Test
    void loadUserByUsername_UserNotExists_WillThrowException() {
        assertThatThrownBy(() -> appUserService.loadUserByUsername("username"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessage("User not found in the database");
    }

    @Test
    void saveUser() {
        AppUser appUser = new AppUser(1, "testUsername", "testPassword", "testEmail",
                "testBio", "testName", 12, new ArrayList<>(), new ArrayList<>());
        appUserService.saveUser(appUser);

        ArgumentCaptor<String> passwordCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<AppUser> appUserArgumentCaptor = ArgumentCaptor.forClass(AppUser.class);

        verify(appUserDao).save(appUserArgumentCaptor.capture());
        verify(passwordEncoder).encode(passwordCaptor.capture());
        AppUser capturedUser = appUserArgumentCaptor.getValue();
        String capturedPassword = passwordCaptor.getValue();

        assertThat(capturedPassword).isEqualTo("testPassword");
        assertThat(capturedUser.toString()).isEqualTo(appUser.toString());
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
        AppRole appRole = new AppRole(1, "ROLE_USER");
        AppUser appUser = new AppUser(1, "testUsername", "testPassword", "testEmail",
                "testBio", "testName", 12, new ArrayList<>(), new ArrayList<>());
        given(appUserDao.findByUsername(anyString())).willReturn(appUser);
        given(appRoleDao.findByName(anyString())).willReturn(appRole);

        appUserService.addRoleToUser("testUsername", "ROLE_USER");

        assertThat(appUser.getRoles().contains(appRole)).isTrue();
    }

    @Test
    void editPortfolio_addNewCrypto() {
        AppUserCrypto appUserCrypto = new AppUserCrypto(0, "test", 1);
        ArrayList<AppUserCrypto> existingCryptos = new ArrayList<>();
        existingCryptos.add(appUserCrypto);

        AppUser appUser = new AppUser(1, "testUsername", "testPassword", "testEmail",
                "testBio", "testName", 12, existingCryptos, new ArrayList<>());
        given(appUserDao.findByUsername(anyString())).willReturn(appUser);
        AppUserCrypto expected = new AppUserCrypto(1, "test1", 1);
        appUserService.editPortfolio("testUsername", "testPassword", expected);

        ArgumentCaptor<AppUser> appUserArgumentCaptor = ArgumentCaptor.forClass(AppUser.class);
        verify(appUserDao).save(appUserArgumentCaptor.capture());
        AppUser capturedUser = appUserArgumentCaptor.getValue();
        assertThat(capturedUser.getCrypto_in_portfolio().contains(expected)).isEqualTo(true);
    }

    @Test
    void editPortfolio_modifyExistingCrypto() {
        AppUserCrypto appUserCrypto = new AppUserCrypto(0, "test", 1);
        ArrayList<AppUserCrypto> existingCryptos = new ArrayList<>();
        existingCryptos.add(appUserCrypto);

        AppUser appUser = new AppUser(1, "testUsername", "testPassword", "testEmail",
                "testBio", "testName", 12, existingCryptos, new ArrayList<>());
        given(appUserDao.findByUsername(anyString())).willReturn(appUser);
        AppUser expected = appUserService.editPortfolio("testUsername", "testPassword", new AppUserCrypto(0, "test", -3));

        ArgumentCaptor<AppUser> appUserArgumentCaptor = ArgumentCaptor.forClass(AppUser.class);
        verify(appUserDao).save(appUserArgumentCaptor.capture());
        AppUser capturedUser = appUserArgumentCaptor.getValue();
        assertThat(capturedUser.getCrypto_in_portfolio().contains(appUserCrypto) && appUserCrypto.getQuantity() == 0).isEqualTo(true);
    }

    @Test
    void createUser() {
        appUserService.createUser("testUser", "testPass");

        ArgumentCaptor<String> passwordCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<AppUser> appUserArgumentCaptor = ArgumentCaptor.forClass(AppUser.class);
        ArgumentCaptor<AppRole> appRoleArgumentCaptor = ArgumentCaptor.forClass(AppRole.class);

        verify(appRoleDao).save(appRoleArgumentCaptor.capture());
        verify(appUserDao).save(appUserArgumentCaptor.capture());
        verify(passwordEncoder).encode(passwordCaptor.capture());

        AppUser capturedUser = appUserArgumentCaptor.getValue();
        String capturedPassword = passwordCaptor.getValue();
        AppRole capturedRole = appRoleArgumentCaptor.getValue();

        assertThat(capturedRole.toString()).isEqualTo((new AppRole(0, "ROLE_USER")).toString());
        assertThat(capturedPassword).isEqualTo("testPass");
        assertThat(capturedUser.getUsername()).isEqualTo("testUser");
    }



}
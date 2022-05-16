package com.genspark.backend.Service;

import com.genspark.backend.Entity.AppRole;
import com.genspark.backend.Entity.AppUser;
import com.genspark.backend.Entity.AppUserCrypto;

import java.util.List;

/**
 * implemented in classes that do business logic for AppUser user accounts
 */
public interface AppUserService {
    AppUser saveUser(AppUser appUser);

    AppUser getUser(String username);

    List<AppUser> getUsers();

    AppRole saveRole(AppRole role);

    List<AppRole> getRoles();

    void addRoleToUser(String username, String roleName);

    AppUser editPortfolio(String username, String password, AppUserCrypto newCryptoToAdd);

    AppUser createUser(String username, String password);
}

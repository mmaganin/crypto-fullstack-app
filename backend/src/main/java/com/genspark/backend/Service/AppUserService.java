package com.genspark.backend.Service;

import com.genspark.backend.Security.AppRole;
import com.genspark.backend.Security.AppUser;

import java.util.List;

public interface AppUserService {
    AppUser saveUser(AppUser appUser);
    AppUser getUser(String username);
    List<AppUser> getUsers();
    AppRole saveRole(AppRole role);
    List<AppRole> getRoles();
    void addRoleToUser(String username, String roleName);
}

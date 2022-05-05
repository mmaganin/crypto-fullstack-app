package com.genspark.backend.Service;

import com.genspark.backend.Security.AppUser;

import java.util.List;

public interface AppUserService {
    AppUser saveUser(AppUser appUser);
    AppUser getUser(String username);
    List<AppUser> getUsers();
}

package com.genspark.backend.Service;

import com.genspark.backend.Dao.AppRoleDao;
import com.genspark.backend.Dao.AppUserDao;
import com.genspark.backend.Security.AppRole;
import com.genspark.backend.Security.AppUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class AppUserServiceImpl implements AppUserService, UserDetailsService {
    private final AppUserDao appUserDao;
    private final AppRoleDao appRoleDao;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = appUserDao.findByUsername(username);
        if(user == null){
            log.error("User not found in the database");
            throw new UsernameNotFoundException("User not found in the database");
        } else {
            log.info("User found in the database: {}", username);
        }

        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        user.getRoles().forEach(role -> {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        });
        return new User(user.getUsername(), user.getPassword(), authorities);
    }

    @Override
    public AppUser saveUser(AppUser appUser) {
        log.info("Saving new user {} to database", appUser.getUsername());
        appUser.setPassword(passwordEncoder.encode(appUser.getPassword()));
        return appUserDao.save(appUser);
    }

    @Override
    public AppRole saveRole(AppRole role) {
        log.info("Saving new role {} to database", role.getName());
        return appRoleDao.save(role);
    }

    @Override
    public List<AppRole> getRoles() {
        log.info("Returning all roles");
        return appRoleDao.findAll();
    }

    @Override
    public void addRoleToUser(String username, String roleName) {
        log.info("Adding role {} to user {}", roleName, username);

        AppUser user = appUserDao.findByUsername(username);
        AppRole role = appRoleDao.findByName(roleName);
        //transactional annotation saves to DB
        user.getRoles().add(role);
    }

    @Override
    public AppUser getUser(String username) {
        log.info("Fetching user {}", username);

        return appUserDao.findByUsername(username);
    }

    @Override
    public List<AppUser> getUsers() {
        log.info("Fetching all users");

        return appUserDao.findAll();
    }


}

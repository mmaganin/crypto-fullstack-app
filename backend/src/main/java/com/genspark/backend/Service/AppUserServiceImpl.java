package com.genspark.backend.Service;

import com.genspark.backend.Dao.AppRoleDao;
import com.genspark.backend.Dao.AppUserDao;
import com.genspark.backend.Entity.AppRole;
import com.genspark.backend.Entity.AppUser;
import com.genspark.backend.Entity.AppUserCrypto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

/**
 * Performs business logic for AppUser user account operations
 */
@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class AppUserServiceImpl implements AppUserService, UserDetailsService {
    private final AppUserDao appUserDao;
    private final AppRoleDao appRoleDao;
    private final PasswordEncoder passwordEncoder;

    /**
     * Custom UserDetailsService config method for loading a user from DB by username and adding proper authorities
     *
     * @param username user's username
     * @return Spring Security object containing user's details
     * @throws UsernameNotFoundException
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = appUserDao.findByUsername(username);
        if (user == null) {
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

    /**
     * saves new user to database
     *
     * @param appUser user account
     * @return new AppUser user
     */
    @Override
    public AppUser saveUser(AppUser appUser) {
        log.info("Saving new user {} to database", appUser.getUsername());
        appUser.setPassword(passwordEncoder.encode(appUser.getPassword()));
        return appUserDao.save(appUser);
    }

    /**
     * saves new role to DB
     *
     * @param role user's auth role
     * @return new AppRole auth role
     */
    @Override
    public AppRole saveRole(AppRole role) {
        log.info("Saving new role {} to database", role.getName());
        return appRoleDao.save(role);
    }

    /**
     * gets all roles present in DB
     *
     * @return list of AppRole auth roles
     */
    @Override
    public List<AppRole> getRoles() {
        log.info("Returning all roles");
        return appRoleDao.findAll();
    }

    /**
     * adds auth role to user
     *
     * @param username user's username
     * @param roleName role to add to user
     */
    @Override
    public void addRoleToUser(String username, String roleName) {
        log.info("Adding role {} to user {}", roleName, username);
        AppUser user = appUserDao.findByUsername(username);
        AppRole role = appRoleDao.findByName(roleName);
        user.getRoles().add(role);
    }

    /**
     * edits a user's portfolio after buy or sell
     *
     * @param username       user's username
     * @param password       user's password
     * @param newCryptoToAdd crypto to buy or sell
     * @return AppUser with altered crypto_in_portfolio portfolio
     */
    @Override
    public AppUser editPortfolio(String username, String password, AppUserCrypto newCryptoToAdd) {
        AppUser appUser = getUser(username);
        Collection<AppUserCrypto> appUserCryptos = appUser.getCrypto_in_portfolio();
        boolean addNewCrypto = true;
        float newQuantity = 0;
        AppUserCrypto placeholder = new AppUserCrypto();
        //adds or subtracts from quantity of crypto already in portfolio
        for (AppUserCrypto appUserCrypto : appUserCryptos) {
            if (appUserCrypto.getSlug().equals(newCryptoToAdd.getSlug())) {
                if ((newQuantity = newCryptoToAdd.getQuantity() + appUserCrypto.getQuantity()) < 0) {
                    newQuantity = 0;
                }
                placeholder = appUserCrypto;
                addNewCrypto = false;
                break;
            }
        }
        //creates new entry in portfolio with its quantity
        if (addNewCrypto) {
            if (newCryptoToAdd.getQuantity() > 0) {
                appUserCryptos.add(newCryptoToAdd);
            }
        } else {
            appUserCryptos.remove(placeholder);
            placeholder.setQuantity(newQuantity);
            appUserCryptos.add(placeholder);
        }
        appUser.setPassword(password);
        appUser.setCrypto_in_portfolio(appUserCryptos);

        return saveUser(appUser);
    }

    /**
     * creates a new user with ROLE_USER role
     *
     * @param username user's username
     * @param password user's password
     * @return new AppUser user with default ROLE_USER role
     */
    @Override
    public AppUser createUser(String username, String password) {
        Collection<AppRole> roles = new ArrayList<>();
        AppRole userRole;
        if ((userRole = appRoleDao.findByName("ROLE_USER")) == null) {
            appRoleDao.save((userRole = new AppRole(0, "ROLE_USER")));
        }
        roles.add(userRole);
        AppUser appUser = new AppUser(0, username, password, "",
                "", "", -1, new ArrayList<>(), roles);

        return saveUser(appUser);
    }

    /**
     * gets User from DB by username
     *
     * @param username user's username
     * @return AppUser user
     */
    @Override
    public AppUser getUser(String username) {
        log.info("Fetching user {}", username);
        return appUserDao.findByUsername(username);
    }

    /**
     * gets all users from DB
     *
     * @return list of AppUser users
     */
    @Override
    public List<AppUser> getUsers() {
        log.info("Fetching all users");
        return appUserDao.findAll();
    }
}

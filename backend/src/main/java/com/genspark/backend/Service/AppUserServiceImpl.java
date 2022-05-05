package com.genspark.backend.Service;

import com.genspark.backend.Dao.AppUserDao;
import com.genspark.backend.Security.AppUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AppUserServiceImpl implements AppUserService{
    @Autowired
    private AppUserDao appUserDao;

    @Override
    public AppUser saveUser(AppUser appUser) {
        return appUserDao.save(appUser);
    }

    @Override
    public AppUser getUser(String username) {
        return appUserDao.findByUsername(username);
    }

    @Override
    public List<AppUser> getUsers() {
        return appUserDao.findAll();
    }
}

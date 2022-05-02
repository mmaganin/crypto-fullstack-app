package com.genspark.backend.Controller;

import com.genspark.backend.Entity.CryptoObj;
import com.genspark.backend.Service.CryptoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
public class CryptoController {
    @Autowired
    CryptoService cryptoService;

    @PutMapping("/markets")
    @CrossOrigin(origins = "http://localhost:3000")
    public List<CryptoObj> getRefreshedMarkets() {
        return cryptoService.getRefreshedMarkets();
    }

    @GetMapping("/markets")
    @CrossOrigin(origins = "http://localhost:3000")
    public List<CryptoObj> getMarkets() {
        return cryptoService.getMarkets();
    }
}

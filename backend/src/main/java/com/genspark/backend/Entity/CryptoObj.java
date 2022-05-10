package com.genspark.backend.Entity;
import com.genspark.backend.CryptoAPI;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity @Data @NoArgsConstructor @AllArgsConstructor
@Table(name="tbl_crypto_objs")
public class CryptoObj {
    private String name;
    private String symbol;
    @Id
    private String slug;
    private String circulating_supply;
    private String total_supply;
    private String cmc_rank;
    private String price;
    private String percent_change_1h;
    private String percent_change_24h;
    private String percent_change_7d;
    private String percent_change_30d;
    private String market_cap;
    private String last_updated;

    public static List<CryptoObj> generateListFromApi(){
        String apiCallStr = CryptoAPI.fetchMarketData();
        List<CryptoObj> cryptoObjList = new ArrayList<>();
        if (!apiCallStr.contains("\"data\"")) {
            return cryptoObjList;
        }

        for (String entry : apiCallStr.split("\"id\"")) {
            if(!(entry.contains("\"slug\"") )){
                continue;
            }
            cryptoObjList.add(new CryptoObj(
                    parseApiCall("name", entry),
                    parseApiCall("symbol", entry),
                    parseApiCall("slug", entry),
                    parseApiCall("circulating_supply", entry),
                    parseApiCall("total_supply", entry),
                    parseApiCall("cmc_rank", entry),
                    parseApiCall("price", entry),
                    parseApiCall("percent_change_1h", entry),
                    parseApiCall("percent_change_24h", entry),
                    parseApiCall("percent_change_7d", entry),
                    parseApiCall("percent_change_30d", entry),
                    parseApiCall("market_cap", entry),
                    parseApiCall("last_updated", entry)
            ));
        }

        return cryptoObjList;
    }

    public static String parseApiCall(String field, String apiCallStr) {
        if(!apiCallStr.contains("\"" + field + "\"")){
            return "";
        }
        String jsonLine = apiCallStr
                .substring(apiCallStr.indexOf("\"" + field + "\""), apiCallStr.indexOf(",", apiCallStr.indexOf("\"" + field + "\"")));
        String data = jsonLine.substring(jsonLine.indexOf(":") + 1);
        if(data.indexOf("\"", data.indexOf(":")) != -1){
            data = jsonLine.substring(jsonLine.indexOf(":") + 2, jsonLine.lastIndexOf("\""));
        }

        return data;
    }

    @Override
    public String toString() {
        return "CryptoObj{" +
                "name='" + name + '\'' +
                ", symbol='" + symbol + '\'' +
                ", slug='" + slug + '\'' +
                ", circulating_supply='" + circulating_supply + '\'' +
                ", total_supply='" + total_supply + '\'' +
                ", cmc_rank='" + cmc_rank + '\'' +
                ", price='" + price + '\'' +
                ", percent_change_1h='" + percent_change_1h + '\'' +
                ", percent_change_24h='" + percent_change_24h + '\'' +
                ", percent_change_7d='" + percent_change_7d + '\'' +
                ", percent_change_30d='" + percent_change_30d + '\'' +
                ", market_cap='" + market_cap + '\'' +
                ", last_updated='" + last_updated + '\'' +
                '}';
    }
}

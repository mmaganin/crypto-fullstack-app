package com.genspark.backend.Entity;
import com.genspark.backend.CryptoAPI;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
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
    private String percent_change_7d;
    private String percent_change_30d;
    private String market_cap;
    private String last_updated;

    public CryptoObj() {
    }

    public CryptoObj(String name, String symbol, String slug, String circulating_supply, String total_supply, String cmc_rank,
                     String price, String percent_change_7d, String percent_change_30d, String market_cap, String last_updated) {
        this.name = name;
        this.symbol = symbol;
        this.slug = slug;
        this.circulating_supply = circulating_supply;
        this.total_supply = total_supply;
        this.cmc_rank = cmc_rank;
        this.price = price;
        this.percent_change_7d = percent_change_7d;
        this.percent_change_30d = percent_change_30d;
        this.market_cap = market_cap;
        this.last_updated = last_updated;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getCirculating_supply() {
        return circulating_supply;
    }

    public void setCirculating_supply(String circulating_supply) {
        this.circulating_supply = circulating_supply;
    }

    public String getTotal_supply() {
        return total_supply;
    }

    public void setTotal_supply(String total_supply) {
        this.total_supply = total_supply;
    }

    public String getCmc_rank() {
        return cmc_rank;
    }

    public void setCmc_rank(String cmc_rank) {
        this.cmc_rank = cmc_rank;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getPercent_change_7d() {
        return percent_change_7d;
    }

    public void setPercent_change_7d(String percent_change_7d) {
        this.percent_change_7d = percent_change_7d;
    }

    public String getPercent_change_30d() {
        return percent_change_30d;
    }

    public void setPercent_change_30d(String percent_change_30d) {
        this.percent_change_30d = percent_change_30d;
    }

    public String getMarket_cap() {
        return market_cap;
    }

    public void setMarket_cap(String market_cap) {
        this.market_cap = market_cap;
    }

    public String getLast_updated() {
        return last_updated;
    }

    public void setLast_updated(String last_updated) {
        this.last_updated = last_updated;
    }

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
                ", percent_change_7d='" + percent_change_7d + '\'' +
                ", percent_change_30d='" + percent_change_30d + '\'' +
                ", market_cap='" + market_cap + '\'' +
                ", last_updated='" + last_updated + '\'' +
                '}';
    }
}

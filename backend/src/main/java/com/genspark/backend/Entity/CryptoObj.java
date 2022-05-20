package com.genspark.backend.Entity;

import lombok.*;

import javax.persistence.*;

/**
 * DB Entity for storing a specific cryptocurrency's market data
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
@Table(name = "tbl_crypto_objs")
public class CryptoObj {
    private String name;
    private String symbol;
    @Id //name of the cryptocurrency but unique
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

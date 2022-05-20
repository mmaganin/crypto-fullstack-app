package com.genspark.backend;

import com.genspark.backend.Entity.CryptoObj;
import lombok.NoArgsConstructor;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.NameValuePair;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.springframework.context.annotation.Bean;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

/**
 * Makes API calls to coinmarketcap.com's market data API at https://pro-api.coinmarketcap.com
 */
@NoArgsConstructor
public class CryptoAPI {
    //coinmarketcap API URI all requests are made to
    private static String uri = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest";
    //API key required to access crypto market data
    private static String apiKey = "";
    //slugs associated with specific cryptocurrencies used in HTTP request
    public static String slugsToRequest =
            "algorand,cardano,vechain,cosmos,avalanche," +
                    "bitcoin-cash,bnb,bitcoin,dogecoin,monero," +
                    "polkadot-new,ethereum,litecoin,terra-luna,polygon," +
                    "near-protocol,solana,tron,stellar,xrp";

    /**
     * fetches market data based on slugsToRequest
     *
     * @return market data as String
     */
    public String fetchMarketData(String slugsToRequest) {
        List<NameValuePair> parameters = new ArrayList<NameValuePair>();
        parameters.add(new BasicNameValuePair("slug", slugsToRequest));
        String result = "";
        try {
            result = makeAPICall(uri, parameters);
            System.out.println(result);
        } catch (IOException e) {
            System.out.println("Error: cannot access content - " + e.toString());
        } catch (URISyntaxException e) {
            System.out.println("Error: Invalid URL " + e.toString());
        }

        return result;
    }

    /**
     * @param uri        fetch from URI
     * @param parameters list: slugs of cryptos to request
     * @return market data as String
     * @throws URISyntaxException
     * @throws IOException
     */
    public String makeAPICall(String uri, List<NameValuePair> parameters)
            throws URISyntaxException, IOException {
        String response_content = "";
        URIBuilder query = new URIBuilder(uri);
        query.addParameters(parameters);
        CloseableHttpClient client = HttpClients.createDefault();
        HttpGet request = new HttpGet(query.build());
        request.setHeader(HttpHeaders.ACCEPT, "application/json");
        request.addHeader("X-CMC_PRO_API_KEY", apiKey);
        CloseableHttpResponse response = client.execute(request);
        try {
            System.out.println(response.getStatusLine());
            HttpEntity entity = response.getEntity();
            response_content = EntityUtils.toString(entity);
            EntityUtils.consume(entity);
        } finally {
            response.close();
        }

        return response_content;
    }

    /**
     * Generates a list containing CryptoObj objects of all cryptos fetched from API
     *
     * @return list containing CryptoObj objects
     */
    public List<CryptoObj> generateListFromApi(String slugsToRequest) {
        String apiCallStr = fetchMarketData(slugsToRequest);
        List<CryptoObj> cryptoObjList = new ArrayList<>();
        if (!apiCallStr.contains("\"data\"")) {
            return cryptoObjList;
        }
        for (String entry : apiCallStr.split("\"id\"")) {
            if (!(entry.contains("\"slug\""))) {
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

    /**
     * @param field      name of the CryptoObj attribute to parse for
     * @param apiCallStr individual crypto's API call string to parse
     * @return String data associated with the desired CryptoObj attribute
     */
    public String parseApiCall(String field, String apiCallStr) {
        if (!apiCallStr.contains("\"" + field + "\"")) {
            return "";
        }
        String jsonLine = apiCallStr
                .substring(apiCallStr.indexOf("\"" + field + "\""), apiCallStr.indexOf(",", apiCallStr.indexOf("\"" + field + "\"")));
        String data = jsonLine.substring(jsonLine.indexOf(":") + 1);
        if (data.indexOf("\"", data.indexOf(":")) != -1) {
            data = jsonLine.substring(jsonLine.indexOf(":") + 2, jsonLine.lastIndexOf("\""));
        }

        return data;
    }
}
package com.genspark.backend;

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

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

/**
 * Makes API calls to coinmarketcap.com's market data API at https://pro-api.coinmarketcap.com
 */
public class CryptoAPI {
    //coinmarketcap API URI all requests are made to
    private static String uri = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest";
    //API key required to access crypto market data
    private static String apiKey = "";
    //slugs associated with specific cryptocurrencies used in HTTP request
    private static String slugsToRequest =
            "algorand,cardano,vechain,cosmos,avalanche," +
                    "bitcoin-cash,bnb,bitcoin,dogecoin,monero," +
                    "polkadot-new,ethereum,litecoin,terra-luna,polygon," +
                    "near-protocol,solana,tron,stellar,xrp";

    /**
     * fetches market data based on slugsToRequest
     *
     * @return market data as String
     */
    public static String fetchMarketData() {
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
    public static String makeAPICall(String uri, List<NameValuePair> parameters)
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
}
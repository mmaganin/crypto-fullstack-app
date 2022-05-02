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

public class CryptoAPI {

    private static String apiKey = "";
//    private static String apiKey = "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c";  //test key
//    private static String symbolsToRequest =
//        "USDT,BTC,ETH,BNB,SOL," +
//        "XRP,LUNA,ADA,DOGE,AVAX," +
//                "DOT,SHIB,MATIC,NEAR,CRO," +
//                "TRX,LTC,BCH,FTT,LEO," +
//                "LINK,ATOM,UNI,APE,XLM," +
//                "ALGO,XMR,ETC,VET,FIL";

        private static String slugsToRequest =
        "algorand,cardano,vechain,cosmos,avalanche," +
                "bitcoin-cash,bnb,bitcoin,dogecoin,monero," +
                "polkadot-new,ethereum,litecoin,terra-luna,polygon," +
                "near-protocol,solana,tron,stellar,xrp";


    public static String fetchMarketData() {
//        String uri = "https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"; //test URI
        String uri = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest";
        List<NameValuePair> paratmers = new ArrayList<NameValuePair>();
        paratmers.add(new BasicNameValuePair("slug",slugsToRequest));
        String result = "";

        try {
            result = makeAPICall(uri, paratmers);
            System.out.println(result);
        } catch (IOException e) {
            System.out.println("Error: cannont access content - " + e.toString());
        } catch (URISyntaxException e) {
            System.out.println("Error: Invalid URL " + e.toString());
        }

        return result;
    }

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
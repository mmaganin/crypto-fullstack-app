import React, { useEffect, useState } from 'react'
import { Container, Stack, Card, CardContent, CardActionArea, CardMedia, Typography, CardActions, Button, Box, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const titleStyle = {
  fontSize: 48,
  fontWeight: 'regular',
  padding: 2,
}


const CryptoPrices = () => {
  const [data, setData] = useState(null);
  const [fetchData, setFetch] = useState(true);

  useEffect(() => {
    if (!fetchData) return;
    const fetchLoad = marketsLoad();

    fetch(fetchLoad.fetchFrom, fetchLoad.payload)
      .then(response => response.json())
      .then(data => setData(data))

  }, [fetchData]);

  function handleRefresh() {
    const payload = {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
    }
    fetch('http://localhost:8080/markets', payload)
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(data => {
        setData(data)
        console.log("successful market data refresh fetch")
        window.alert("Market data refreshed from coinmarketcap.com, DO NOT refresh too often... There is a limited number of API calls!")
        window.location.reload()
      })
      .catch((error) => {
        console.log("market data refresh fetch failed: " + error)
      })
  }

  const rows = data === null ? null :
    Array.from(data.map((dataIdx) =>
      createData(dataIdx.name, dataIdx.symbol, dataIdx.price, dataIdx.percent_change_1h,
        dataIdx.percent_change_24h, dataIdx.percent_change_7d, dataIdx.percent_change_30d,
        dataIdx.market_cap, dataIdx.circulating_supply, dataIdx.cmc_rank)))


  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', margin: 3 }}
    >
      <Paper elevation={5} sx={titleStyle}>
        Crypto Markets
      </Paper>  {/*title of page*/}

      {data === null ? "Loading Markets" :
        <Box sx={{ height: 700, width: '100%', margin: 3 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Box> /*Table of market data with its container*/
      }

      <Button variant="outlined" onClick={handleRefresh}>
        Refresh Market Data
      </Button> {/*button to fetch new market data*/}

      <Box sx={{ fontWeight: 'light' }}>
        Last Refreshed (UTC): {data === null ? "loading..." : data[0].last_updated} from <a href="https://coinmarketcap.com/">https://coinmarketcap.com/</a> API
      </Box> {/*timestamp for last data refresh*/}
    </Box>
  );
}

const columns = [
  { field: 'name', headerName: 'Name', width: 100 },
  { field: 'symbol', headerName: 'Symbol', width: 75 },
  { field: 'price', headerName: 'Price ($)', width: 130 },
  { field: 'percent_change_1h', headerName: '% Change 1H (%)', width: 175 },
  { field: 'percent_change_24h', headerName: '% Change 24H (%)', width: 175 },
  { field: 'percent_change_7d', headerName: '% Change 7D (%)', width: 175 },
  { field: 'percent_change_30d', headerName: '% Change 30D (%)', width: 175 },
  { field: 'market_cap', headerName: 'Market Cap ($)', width: 175 },
  { field: 'circulating_supply', headerName: 'Circulating Supply', width: 175 },
  { field: 'id', headerName: 'Market Cap Rank', width: 150 },
];

function createData(name, symbol, price, percent_change_1h, percent_change_24h, percent_change_7d, percent_change_30d, market_cap, circulating_supply, id) {
  function roundAndParse(data) {
    const roundWith = 100;
    return parseFloat(Math.round(data * roundWith) / roundWith);
  }

  var displayPrice = roundAndParse(price)
  var displayPercent_change_1h = roundAndParse(percent_change_1h)
  var displayPercent_change_24h = roundAndParse(percent_change_24h)
  var displayPercent_change_7d = roundAndParse(percent_change_7d)
  var displayPercent_change_30d = roundAndParse(percent_change_30d)
  var displayMarket_cap = roundAndParse(market_cap)
  var displayCirculating_supply = roundAndParse(circulating_supply)
  var displayId = parseInt(id)

  return {
    name: name,
    symbol: symbol,
    price: displayPrice,
    percent_change_1h: displayPercent_change_1h,
    percent_change_24h: displayPercent_change_24h,
    percent_change_7d: displayPercent_change_7d,
    percent_change_30d: displayPercent_change_30d,
    market_cap: displayMarket_cap,
    circulating_supply: displayCirculating_supply,
    id: displayId
  };
}

export function marketsLoad() {
  var fetchLoad = {
    fetchFrom: 'http://localhost:8080/markets',
    payload: {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }
  }

  return fetchLoad;
}

export default CryptoPrices;
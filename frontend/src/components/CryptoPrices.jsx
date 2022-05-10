import React, { useEffect, useState } from 'react'
import { Container, Stack, Card, CardContent, CardActionArea, CardMedia, Typography, CardActions, Button, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'name', headerName: 'Name', width: 100 },
  { field: 'symbol', headerName: 'Symbol', width: 75 },
  { field: 'price_rounded', headerName: 'Price ($)', width: 130 },
  { field: 'percent_change_1h_rounded', headerName: '% Change 1H (%)', width: 175 },
  { field: 'percent_change_24h_rounded', headerName: '% Change 24H (%)', width: 175 },
  { field: 'percent_change_7d_rounded', headerName: '% Change 7D (%)', width: 175 },
  { field: 'percent_change_30d_rounded', headerName: '% Change 30D (%)', width: 175 },
  { field: 'market_cap_rounded', headerName: 'Market Cap ($)', width: 175 },
  { field: 'circulating_supply_rounded', headerName: 'Circulating Supply', width: 175 },
  { field: 'id', headerName: 'Market Cap Rank', width: 150 },
];

function createData(name, symbol, price, percent_change_1h, percent_change_24h, percent_change_7d, percent_change_30d, market_cap, circulating_supply, id) {
  var price_rounded = Math.round(price * 100) / 100
  var percent_change_1h_rounded = Math.round(percent_change_1h * 100) / 100
  var percent_change_24h_rounded = Math.round(percent_change_24h * 100) / 100
  var percent_change_7d_rounded = Math.round(percent_change_7d * 100) / 100
  var percent_change_30d_rounded = Math.round(percent_change_30d * 100) / 100
  var market_cap_rounded = Math.round(market_cap * 100) / 100
  var circulating_supply_rounded = Math.round(circulating_supply * 100) / 100

  return {
    name,
    symbol,
    price_rounded,
    percent_change_1h_rounded,
    percent_change_24h_rounded,
    percent_change_7d_rounded,
    percent_change_30d_rounded,
    market_cap_rounded,
    circulating_supply_rounded,
    id
  };
}

const sideBarStyle = {
  maxWidth: '500px',
  minWidth: '250px',

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
      .then(response => response.json())
      .then(data => setData(data))

    setFetch(false);

    window.alert("Market data refreshed from coinmarketcap.com, DO NOT refresh too often... There is a limited number of API calls!")
  }

  console.log(data)

  const rows = data === null ? null :
    Array.from(data.map((dataIdx) =>
      createData(dataIdx.name, dataIdx.symbol, dataIdx.price, dataIdx.percent_change_1h,
        dataIdx.percent_change_24h, dataIdx.percent_change_7d, dataIdx.percent_change_30d,
        dataIdx.market_cap, dataIdx.circulating_supply, parseInt(dataIdx.cmc_rank))))


  return (
    <div>
      <Stack direction="row" >
        <Box sx={sideBarStyle} />
        <Container maxWidth="xl">
          <p></p>
          {data === null ? "Loading Markets" :
            <div style={{ height: 700, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
              />

            </div>}
          <Stack direction="row" spacing={1} >
            <Button variant="outlined" onClick={handleRefresh}>
              Refresh Market Data
            </Button>

          </Stack>
          <p>Last Refreshed (UTC): {data === null ? "loading..." : data[0].last_updated} from coinmarketcap.com</p>

        </Container>
        <Box sx={sideBarStyle} />
      </Stack>
    </div>

  );
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
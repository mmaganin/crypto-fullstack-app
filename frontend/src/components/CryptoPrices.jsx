import React, { useEffect, useState } from 'react'
import { Container, Stack, Card, CardContent, CardActionArea, CardMedia, Typography, CardActions, Button, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';


const columns = [
  { field: 'name', headerName: 'Name', width: 100 },
  { field: 'symbol', headerName: 'Symbol', width: 75 },
  { field: 'price_rounded', headerName: 'Price ($)', width: 130 },
  { field: 'percent_change_30d_rounded', headerName: '% Change 30D (%)', width: 175 },
  { field: 'market_cap_rounded', headerName: 'Market Cap ($)', width: 175 },
  { field: 'circulating_supply_rounded', headerName: 'Circulating Supply', width: 175 },
  { field: 'id', headerName: 'Market Cap Rank', width: 150 },
];

function createData(id, name, symbol, price, percent_change_30d, market_cap, circulating_supply) {
  var price_rounded = Math.round(price * 100) / 100
  var percent_change_30d_rounded = Math.round(percent_change_30d * 100) / 100
  var market_cap_rounded = Math.round(market_cap * 100) / 100
  var circulating_supply_rounded = Math.round(circulating_supply * 100) / 100

  return {
    id,
    name,
    symbol,
    price_rounded,
    percent_change_30d_rounded,
    market_cap_rounded,
    circulating_supply_rounded
  };
}

const sideBarStyle = {
  width: 500,
  backgroundColor: 'white',

}

const CryptoPrices = () => {
  const [data, setData] = useState(null);
  const [fetchData, setFetch] = useState(true);

  useEffect(() => {
    if (fetchData) {
      const payload = {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
      }
      fetch('http://localhost:8080/markets', payload)
        .then(response => response.json())
        .then(data => setData(data))
    }
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

  const rows = data === null ? null : Array.from(data.map((dataIdx) =>
    createData(parseInt(dataIdx.cmc_rank), dataIdx.name, dataIdx.symbol, dataIdx.price, dataIdx.percent_change_30d, dataIdx.market_cap, dataIdx.circulating_supply)))

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
                checkboxSelection
              />

            </div>}
          <Stack direction="row" spacing={1} >
            <Button variant="outlined" onClick={handleRefresh}>
              Refresh Market Data
            </Button>
            <p>Last Refreshed (UTC): {data === null ? "loading..." : data[0].last_updated} from coinmarketcap.com</p>

          </Stack>

        </Container>
        <Box sx={sideBarStyle} />
      </Stack>
    </div>

  );
}




export default CryptoPrices;
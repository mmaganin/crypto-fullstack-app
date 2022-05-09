import React, { useEffect, useState } from 'react'
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Box, Stack, Grid, Divider } from '@mui/material'
import CryptoCard from "./CryptoCard";


const sideBarStyle = {
  maxWidth: '500px',
  minWidth: '250px',

}
const imgStyle = {
  width: '100%',
  height: 'auto',
}

const Welcome = () => {
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

  return (
    <Stack direction="row" >
      <Box sx={sideBarStyle} />
      <Grid container
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center" >
        {data === null ? "loading" : data
          .sort((a, b) => parseFloat(b.market_cap) - parseFloat(a.market_cap))
          .map((dataIdx) => <CryptoCard {...dataIdx} />)}
      </Grid>
      <Box sx={sideBarStyle} />
    </Stack>
  );
}



export default Welcome;
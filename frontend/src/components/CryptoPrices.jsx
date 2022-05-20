import React from 'react'
import { Button, Box, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useGetMarkets } from "../utility/CustomHooks";
import { refreshMarketsLoad } from "../utility/HelpfulMethods";

const titleStyle = {
  fontSize: 48,
  fontWeight: 'regular',
  padding: 2,
}

/**
 * @author Michael Maganini
 * @returns Cryptocurrency Markets page
 */
const CryptoPrices = () => {
  //HOOKS
  var data = useGetMarkets();
  //HANDLERS
  //handles refreshing market data and reloading page to update on grid
  function handleRefresh() {
    var fetchLoad = refreshMarketsLoad()
    fetch(fetchLoad.fetchFrom, fetchLoad.payload)
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(data => {
        console.log("successful market data refresh fetch")
        window.alert("Market data refreshed from coinmarketcap.com, DO NOT refresh too often... There is a limited number of API calls!")
        window.location.reload()
      })
      .catch((error) => {
        console.log("market data refresh fetch failed: " + error)
      })
  }
  var rowId = 0;
  //puts market data into a rows array to be mapped into the DataGrid
  const rows = data === null ? null :
    Array.from(data.map((dataIdx) => {
      rowId++;
      return createData(dataIdx.name, dataIdx.symbol, dataIdx.price, dataIdx.percent_change_1h,
        dataIdx.percent_change_24h, dataIdx.percent_change_7d, dataIdx.percent_change_30d,
        dataIdx.market_cap, dataIdx.circulating_supply, rowId);
    }))
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
            sx={{ bgcolor: 'white' }}
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Box> /*Table of market data with its container*/
      }
      <Button variant="outlined" sx={{ bgcolor: 'white' }} onClick={handleRefresh}>
        Refresh Market Data
      </Button> {/*button to fetch new market data*/}
      <Box sx={{ fontWeight: 'regular' }}>
        Last Refreshed (UTC): {data === null ? "loading..." : data[0].last_updated} from <a href="https://coinmarketcap.com/">coinmarketcap.com</a> API
      </Box> {/*timestamp for last data refresh*/}
    </Box>/*Page container that centers elements and stacks as column*/
  );
}
//column header information for DataGrid
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
  { field: 'id', headerName: 'Row ID', width: 150 },
];
/**
 * creates data for row in DataGrid, parses and rounds floats to be sortable in DataGrid
 * @param {String} name 
 * @param {String} symbol 
 * @param {String} price 
 * @param {String} percent_change_1h 
 * @param {String} percent_change_24h 
 * @param {String} percent_change_7d 
 * @param {String} percent_change_30d 
 * @param {String} market_cap 
 * @param {String} circulating_supply 
 * @param {String} id 
 * @returns Object containing data for single row to be displayed in DataGrid
 */
function createData(name, symbol, price, percent_change_1h, percent_change_24h, percent_change_7d, percent_change_30d, market_cap, circulating_supply, id) {
  /**
   * parses string and rounds float 2 decimal places
   * @param {String} data 
   * @returns parsed and rounded data 2 decimal places
   */
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

export default CryptoPrices;
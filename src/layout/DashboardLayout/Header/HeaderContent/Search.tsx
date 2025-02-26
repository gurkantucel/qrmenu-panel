// material-ui
import Box from '@mui/material/Box';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

export default function Search() {
  return (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 2 } }}>
      {/*<FormControl sx={{ width: { xs: '100%', md: 224 } }}>
        <OutlinedInput
          id="header-search"
          startAdornment={
            <InputAdornment position="start" sx={{ mr: -0.5 }}>
              <SearchNormal1 size={16} />
            </InputAdornment>
          }
          aria-describedby="header-search-text"
          inputProps={{
            'aria-label': 'weight'
          }}
          placeholder="Ctrl + K"
          sx={{ '& .MuiOutlinedInput-input': { p: 1.5 } }}
        />
      </FormControl>*/}
    </Box>
  );
}

import PropTypes from 'prop-types'
// @mui
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material'
// components
import Iconify from '../../../../components/Iconify'

// ----------------------------------------------------------------------

BorrowTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
}

export default function BorrowTableToolbar({ filterName, onFilterName }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2.5, px: 3 }}>
      <TextField
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Tìm kiếm phiếu mượn..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon={'eva:search-fill'}
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
      />

      <Tooltip title="Lọc">
        <IconButton>
          <Iconify icon={'ic:round-filter-list'} />
        </IconButton>
      </Tooltip>
    </Stack>
  )
}

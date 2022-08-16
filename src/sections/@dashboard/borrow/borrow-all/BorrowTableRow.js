import PropTypes from 'prop-types'
import { useState } from 'react'
// @mui
import {
  Checkbox,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
// utils
import { fDate } from '../../../../utils/formatTime'
// components
import Iconify from '../../../../components/Iconify'
import Image from '../../../../components/Image'
import Label from '../../../../components/Label'
import { TableMoreMenu } from '../../../../components/table'
// ----------------------------------------------------------------------

BorrowTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
}

export default function BorrowTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}) {
  const theme = useTheme()

  const { from, to, book, user } = row

  const [openMenu, setOpenMenuActions] = useState(null)

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpenMenuActions(null)
  }

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Image
          disabledEffect
          alt={user.fullName}
          src={user.image}
          sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
        />
        <Typography variant="subtitle2" noWrap>
          {user.fullName}
        </Typography>
      </TableCell>

      <TableCell>{book.name}</TableCell>
      <TableCell>{fDate(from)}</TableCell>
      <TableCell>{fDate(to)}</TableCell>

      <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (new Date().getTime() > new Date(to).getTime() && 'error') ||
            'success'
          }
          sx={{ textTransform: 'capitalize' }}>
          {new Date().getTime() > new Date(to).getTime()
            ? 'Đã đến hạn'
            : 'Chưa đến hạn'}
        </Label>
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onEditRow()
                  handleCloseMenu()
                }}>
                <Iconify icon={'eva:edit-fill'} />
                Chỉnh sửa
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDeleteRow()
                  handleCloseMenu()
                }}
                sx={{ color: 'error.main' }}>
                <Iconify icon={'eva:trash-2-outline'} />
                Xóa
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  )
}

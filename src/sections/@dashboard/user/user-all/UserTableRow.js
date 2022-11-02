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
// components
import Iconify from '../../../../components/Iconify'
import Image from '../../../../components/Image'
import Label from '../../../../components/Label'
import { TableMoreMenu } from '../../../../components/table'
//

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
}

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}) {
  const theme = useTheme()

  let { name, image, author, status, publishingCompany } = row

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
          alt={name}
          src={`${process.env.REACT_APP_API_ENDPOINT}/uploads/${image[0]}`}
          sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
        />
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell>{author}</TableCell>

      <TableCell align="center">{publishingCompany}</TableCell>

      <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(status !== 'true' && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}>
          {status === 'true' || status === true ? 'Nguyên vẹn' : 'Hỏng'}
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
                Xoá
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  )
}

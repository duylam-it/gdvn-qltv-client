import { paramCase } from 'change-case'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
// @mui
import {
  Box,
  Button,
  Card,
  Container,
  FormControlLabel,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tooltip,
} from '@mui/material'
// redux
import { getBorrows } from '../../redux/slices/borrow'
import { useDispatch, useSelector } from '../../redux/store'
// routes
import { PATH_DASHBOARD } from '../../routes/paths'
// hooks
import useSettings from '../../hooks/useSettings'
import useTable, { emptyRows, getComparator } from '../../hooks/useTable'
// components
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs'
import Iconify from '../../components/Iconify'
import Page from '../../components/Page'
import Scrollbar from '../../components/Scrollbar'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
  TableSkeleton,
} from '../../components/table'
// sections
import {
  BorrowTableRow,
  BorrowTableToolbar,
} from '../../sections/@dashboard/borrow/borrow-all'
// axios
import axios from 'src/utils/axios'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'user', label: 'Người mượn', align: 'left' },
  { id: 'book', label: 'Tên sách', align: 'left' },
  { id: 'from', label: 'Ngày mượn', align: 'left' },
  { id: 'to', label: 'Ngày đến hạn', align: 'left' },
  { id: 'status', label: 'Tình trạng', align: 'center', width: 180 },
  { id: '' },
]

// ----------------------------------------------------------------------

export default function BorrowAll() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  })

  const { themeStretch } = useSettings()

  const navigate = useNavigate()

  const { enqueueSnackbar } = useSnackbar()

  const dispatch = useDispatch()

  const { borrows, isLoading } = useSelector((state) => state.borrow)

  const [tableData, setTableData] = useState([])

  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    dispatch(getBorrows())
  }, [dispatch])

  useEffect(() => {
    if (borrows.length) {
      setTableData(borrows)
    } else setTableData([])
  }, [borrows])

  const handleFilterName = (filterName) => {
    setFilterName(filterName)
    setPage(0)
  }

  const handleDeleteRow = async (_id) => {
    const response = await axios.post('/borrow/deleteOne', {
      _id,
    })
    if (response.data.success) {
      enqueueSnackbar('Xoá thành công!')
      dispatch(getBorrows())
    } else
      enqueueSnackbar('Đã xảy ra lỗi, vui lòng thử lại sau!', {
        variant: 'error',
      })
  }

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id))
    setSelected([])
    setTableData(deleteRows)
  }

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.borrow.edit(paramCase(id)))
  }

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  })

  const denseHeight = dense ? 60 : 80

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!isLoading && !dataFiltered.length)

  return (
    <Page title="Phiếu mượn: Danh sách">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách phiếu mượn"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            {
              name: 'Phiếu mượn',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'Danh sách phiếu mượn' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              component={RouterLink}
              to={PATH_DASHBOARD.borrow.new}>
              Lập phiếu mượn
            </Button>
          }
        />

        <Card>
          <BorrowTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 960, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row._id)
                    )
                  }
                  actions={
                    <Tooltip title="Xoá">
                      <IconButton
                        color="primary"
                        onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <BorrowTableRow
                          key={row._id}
                          row={row}
                          selected={selected.includes(row._id)}
                          onSelectRow={() => onSelectRow(row._id)}
                          onDeleteRow={() => handleDeleteRow(row._id)}
                          onEditRow={() => handleEditRow(row._id)}
                        />
                      ) : (
                        !isNotFound && (
                          <TableSkeleton
                            key={index}
                            sx={{ height: denseHeight }}
                          />
                        )
                      )
                    )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Chật"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  )
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index])

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  tableData = stabilizedThis.map((el) => el[0])

  if (filterName) {
    tableData = tableData.filter(
      (item) =>
        item.user.fullName.toLowerCase().indexOf(filterName.toLowerCase()) !==
        -1
    )
  }

  return tableData
}

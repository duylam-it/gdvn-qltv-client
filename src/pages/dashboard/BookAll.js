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
// axios
import axios from 'src/utils/axios'
// redux
import { getBooks } from '../../redux/slices/book'
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
  BookTableRow,
  BookTableToolbar,
} from '../../sections/@dashboard/book/book-all'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Sách', align: 'left' },
  { id: 'author', label: 'Tác giả', align: 'left' },
  { id: 'publishingCompany', label: 'NXB', align: 'center' },
  { id: 'status', label: 'Trạng thái', align: 'center', width: 180 },
  { id: '' },
]

// ----------------------------------------------------------------------

export default function BookAll() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
    onChangeDense,
  } = useTable({
    defaultOrderBy: 'createdAt',
  })

  const { themeStretch } = useSettings()

  const navigate = useNavigate()

  const { enqueueSnackbar } = useSnackbar()

  const dispatch = useDispatch()

  const { books, isLoading } = useSelector((state) => state.book)

  const [tableData, setTableData] = useState([])

  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    dispatch(getBooks())
  }, [dispatch])

  useEffect(() => {
    if (books.length) {
      setTableData(books)
    } else setTableData([])
  }, [books])

  const handleFilterName = (filterName) => {
    setFilterName(filterName)
    setPage(0)
  }

  const handleDeleteRows = (selected) => {
    console.log(selected)
  }

  const handleDeleteRow = async (code) => {
    const response = await axios.post('book/deleteOne', {
      code,
    })
    if (response.data.success) {
      enqueueSnackbar('Xoá thành công!')
      dispatch(getBooks())
    } else
      enqueueSnackbar('Đã xảy ra lỗi, vui lòng thử lại sau!', {
        variant: 'error',
      })
  }

  const handleEditRow = (code) => {
    navigate(PATH_DASHBOARD.book.edit(paramCase(code)))
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
    <Page title="Sách: Tất cả">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Quản lý sách"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: 'Sách', href: PATH_DASHBOARD.book.root },
            { name: 'Tất cả', href: PATH_DASHBOARD.book.all },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              component={RouterLink}
              to={PATH_DASHBOARD.book.new}>
              Sách mới
            </Button>
          }
        />
        <Card>
          <BookTableToolbar
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
                      tableData.map((row) => row.code)
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
                      tableData.map((row) => row.code)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <BookTableRow
                          key={row.code}
                          row={row}
                          selected={selected.includes(row.code)}
                          onSelectRow={() => onSelectRow(row.code)}
                          onDeleteRow={() => handleDeleteRow(row.code)}
                          onEditRow={() => handleEditRow(row.code)}
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
      (item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    )
  }

  return tableData
}

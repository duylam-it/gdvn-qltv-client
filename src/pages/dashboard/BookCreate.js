import { paramCase } from 'change-case'
import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
// utils
// import axios from 'src/utils/axios'
// @mui
import { Container } from '@mui/material'
// redux
import { getBooks } from '../../redux/slices/book'
import { useDispatch, useSelector } from '../../redux/store'
// routes
import { PATH_DASHBOARD } from '../../routes/paths'
// hooks
import useSettings from '../../hooks/useSettings'
// components
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs'
import Page from '../../components/Page'
import BookNewEditForm from '../../sections/@dashboard/book/BookNewEditForm'

// ----------------------------------------------------------------------

export default function BookCreate() {
  const { themeStretch } = useSettings()
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const { code } = useParams()
  const { books } = useSelector((state) => state.book)
  const isEdit = pathname.includes('edit')

  useEffect(() => {
    dispatch(getBooks())
  }, [dispatch])

  const currentBook = books.find((book) => paramCase(book.code) === code)

  return (
    <Page title={!isEdit ? 'Sách: Tạo mới' : 'Sách: Chỉnh sửa'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Sách mới' : 'Chỉnh sửa sách'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            {
              name: 'Sách',
              href: PATH_DASHBOARD.book.root,
            },
            { name: !isEdit ? 'Sách mới' : code },
          ]}
        />

        <BookNewEditForm isEdit={isEdit} currentBook={currentBook} />
      </Container>
    </Page>
  )
}

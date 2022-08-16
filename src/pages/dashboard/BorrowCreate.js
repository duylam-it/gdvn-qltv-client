import { paramCase } from 'change-case'
import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
// @mui
import { Container } from '@mui/material'
// redux
import { getBorrows } from '../../redux/slices/borrow'
import { useDispatch, useSelector } from '../../redux/store'
// routes
import { PATH_DASHBOARD } from '../../routes/paths'
// hooks
import useSettings from '../../hooks/useSettings'
// components
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs'
import Page from '../../components/Page'
import BorrowNewEditForm from '../../sections/@dashboard/borrow/BorrowNewEditForm'

// -------------------------------------------------------------------------------

export default function BorrowCreate() {
  const { themeStretch } = useSettings()
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const { _id } = useParams()
  const { borrows } = useSelector((state) => state.borrow)
  const isEdit = pathname.includes('edit')
  const currentBorrow = borrows.find((borrow) => paramCase(borrow._id) === _id)

  useEffect(() => {
    dispatch(getBorrows())
  }, [dispatch])

  return (
    <Page
      title={
        !isEdit
          ? 'Phiếu mượn: Lập phiếu mượn'
          : 'Phiếu mượn: Chỉnh sửa phiếu mượn'
      }>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Lập phiếu mượn' : 'Chỉnh sửa phiếu mượn'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            {
              name: 'Phiếu mượn',
              href: PATH_DASHBOARD.borrow.root,
            },
            { name: !isEdit ? 'Lập phiếu mượn' : _id },
          ]}
        />

        <BorrowNewEditForm isEdit={isEdit} currentBorrow={currentBorrow} />
      </Container>
    </Page>
  )
}

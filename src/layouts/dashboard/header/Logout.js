import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
// routes
import { PATH_AUTH } from '../../../routes/paths'
// hooks
import useAuth from '../../../hooks/useAuth'

import LogoutIcon from '@mui/icons-material/Logout'
import Button from '@mui/material/Button'

export default function Logout() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const handleLogout = async () => {
    try {
      await logout()
      navigate(PATH_AUTH.login, { replace: true })
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Unable to logout!', { variant: 'error' })
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<LogoutIcon />}
        color="error"
        onClick={handleLogout}>
        Đăng xuất
      </Button>
    </>
  )
}

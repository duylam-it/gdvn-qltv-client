import { Link as RouterLink } from 'react-router-dom'
// @mui
import { Button, Container, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout'
// routes
import { PATH_AUTH } from '../../routes/paths'
// components
import Page from '../../components/Page'
// sections
import { ResetPasswordForm } from '../../sections/auth/reset-password'

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}))

// ----------------------------------------------------------------------

export default function ResetPassword() {
  return (
    <Page title="Reset Password">
      <LogoOnlyLayout />

      <Container>
        <ContentStyle sx={{ textAlign: 'center' }}>
          <Typography variant="h3" paragraph>
            Quên mật khẩu?
          </Typography>

          <Typography sx={{ color: 'text.secondary', mb: 5 }}>
            Vui lòng nhập địa chỉ email được liên kết với tài khoản của bạn.
            Chúng tôi sẽ gửi email cho bạn một liên kết để đặt lại mật khẩu của
            bạn.
          </Typography>

          <ResetPasswordForm />

          <Button
            fullWidth
            size="large"
            component={RouterLink}
            to={PATH_AUTH.login}
            sx={{ mt: 1 }}>
            Quay lại
          </Button>
        </ContentStyle>
      </Container>
    </Page>
  )
}

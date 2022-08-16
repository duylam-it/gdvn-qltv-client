import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import * as Yup from 'yup'
// form
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
// @mui
import { LoadingButton } from '@mui/lab'
import { Alert, IconButton, InputAdornment, Link, Stack } from '@mui/material'
// routes
import { PATH_AUTH } from '../../../routes/paths'
// hooks
import useAuth from '../../../hooks/useAuth'
import useIsMountedRef from '../../../hooks/useIsMountedRef'
// components
import {
  FormProvider,
  RHFCheckbox,
  RHFTextField,
} from '../../../components/hook-form'
import Iconify from '../../../components/Iconify'

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { login } = useAuth()

  const isMountedRef = useIsMountedRef()

  const [showPassword, setShowPassword] = useState(false)

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Vui lòng nhập địa chỉ email hợp lệ')
      .required('Không được để trống email'),
    password: Yup.string().required('Không được để trống mật khẩu'),
  })

  const defaultValues = {
    email: '',
    password: '',
    remember: true,
  }

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  })

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password)
    } catch (error) {
      console.error(error)

      reset()

      let message =
        'Tìm thấy lỗi trong quá trình đăng nhập, vui lòng kiểm tra và thử lại'
      if (error === 'Unauthorized') message = 'Email hoặc mật khẩu không đúng'
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message })
      }
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}

        <RHFTextField name="email" label="Địa chỉ email" />

        <RHFTextField
          name="password"
          label="Mật khẩu"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end">
                  <Iconify
                    icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Nhớ tài khoản" />
        <Link
          component={RouterLink}
          variant="subtitle2"
          to={PATH_AUTH.resetPassword}>
          Quên mật khẩu?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}>
        Đăng nhập
      </LoadingButton>
    </FormProvider>
  )
}

import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
// form
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
// @mui
import { LoadingButton } from '@mui/lab'
import { Stack } from '@mui/material'
// routes
import { PATH_AUTH } from '../../../routes/paths'
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form'
//
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
// ----------------------------------------------------------------------

export default function ResetPasswordForm() {
  const auth = getAuth()

  const triggerResetEmail = async (email) => {
    await sendPasswordResetEmail(auth, email)
    console.log('Password reset email sent')
  }

  const navigate = useNavigate()

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email('Vui lòng nhập địa chỉ email hợp lệ')
      .required('Email không được để trống'),
  })

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: '' },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      sessionStorage.setItem('email-recovery', data.email)
      await triggerResetEmail(data.email)

      navigate(PATH_AUTH.login)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email" />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}>
          Gửi yêu cầu
        </LoadingButton>
      </Stack>
    </FormProvider>
  )
}

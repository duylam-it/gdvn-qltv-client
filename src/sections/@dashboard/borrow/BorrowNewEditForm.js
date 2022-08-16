import { useSnackbar } from 'notistack'
import PropTypes from 'prop-types'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
// form
import { Controller, useForm } from 'react-hook-form'
// @mui
import { LoadingButton } from '@mui/lab'
import DatePicker from '@mui/lab/DatePicker'
import {
  Autocomplete,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
// redux
import { getBooks } from 'src/redux/slices/book'
import { getUsers } from 'src/redux/slices/user'
import { useDispatch, useSelector } from 'src/redux/store'
// routes
import { PATH_DASHBOARD } from '../../../routes/paths'
// components
import { FormProvider, RHFEditor } from '../../../components/hook-form'
// untils
import axios from 'src/utils/axios'

// ----------------------------------------------------------------------

const now = new Date()
now.setHours(0)
now.setMinutes(0)
now.setSeconds(0)
now.setMilliseconds(0)

const tomorrow = new Date()
tomorrow.setHours(0)
tomorrow.setMinutes(0)
tomorrow.setSeconds(0)
tomorrow.setMilliseconds(0)
tomorrow.setDate(tomorrow.getDate() + 1)

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}))

// ----------------------------------------------------------------------

BorrowNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentBorrow: PropTypes.object,
}

export default function BorrowNewEditForm({ isEdit, currentBorrow }) {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { enqueueSnackbar } = useSnackbar()

  const { users } = useSelector((state) => state.user)
  const { books } = useSelector((state) => state.book)

  useEffect(() => {
    dispatch(getUsers())
    dispatch(getBooks())
  }, [dispatch])

  const defaultValues = useMemo(
    () => ({
      user: currentBorrow?.user || '',
      book: currentBorrow?.book || '',
      from: currentBorrow?.from || now,
      to: currentBorrow?.to || tomorrow,
      description: currentBorrow?.description || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentBorrow]
  )

  const methods = useForm({
    defaultValues,
  })

  const {
    reset,
    // watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  // const values = watch()

  useEffect(() => {
    if (isEdit && currentBorrow) {
      reset(defaultValues)
    }
    if (!isEdit) {
      reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentBorrow])

  const handleOnChangeFrom = (newValue, field) => {
    if (!isEdit) {
      if (newValue.getTime() < getValues('to').getTime()) {
        if (newValue.getTime() >= now.getTime()) {
          field.onChange(newValue)
        } else
          enqueueSnackbar('Không thể mượn ở quá khứ', {
            variant: 'error',
          })
      } else
        enqueueSnackbar('Ngày trả phải sau ngày mượn', {
          variant: 'error',
        })
    } else
      enqueueSnackbar('Bạn không được phép sửa đổi ngày mượn', {
        variant: 'error',
      })
  }

  const handleOnChangeTo = (newValue, field) => {
    if (newValue.getTime() > new Date(getValues('from')).getTime()) {
      field.onChange(newValue)
    } else
      enqueueSnackbar('Ngày trả phải sau ngày mượn', {
        variant: 'error',
      })
  }

  const onSubmit = async (data) => {
    try {
      let response
      data.userID = data.user
      data.bookID = data.book
      delete data.user
      delete data.book
      if (!isEdit) {
        response = await axios.post('borrow/create', data)
      }
      reset()
      if (response.data.success) {
        enqueueSnackbar(!isEdit ? 'Tạo thành công!' : 'Cập nhật thành công!')
        navigate(PATH_DASHBOARD.borrow.root)
      } else
        enqueueSnackbar('Đã xảy ra lỗi, vui lòng liên hệ admin!', {
          variant: 'error',
        })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <Autocomplete
                  onChange={(e, data) => setValue('user', data._id)}
                  options={users}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  getOptionLabel={(option) => option.fullName}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option._id}>
                        {`${option.fullName} - ${option.email}`}
                      </li>
                    )
                  }}
                  renderInput={(params) => (
                    <TextField required {...params} label="Người mượn" />
                  )}
                />

                <Autocomplete
                  onChange={(e, data) => setValue('book', data._id)}
                  options={books}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option._id}>
                        {`${option.name} - ${option.code}`}
                      </li>
                    )
                  }}
                  renderInput={(params) => (
                    <TextField required {...params} label="Sách" />
                  )}
                />
              </Stack>
            </Card>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <Controller
                  name="from"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Ngày mượn"
                      value={field.value}
                      onChange={(newValue) =>
                        handleOnChangeFrom(newValue, field)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="to"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Ngày trả"
                      value={field.value}
                      onChange={(newValue) => handleOnChangeTo(newValue, field)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                />
              </Stack>
            </Card>
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}>
              {!isEdit ? 'Lập phiếu mượn' : 'Cập nhật'}
            </LoadingButton>
          </Stack>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <div>
                <LabelStyle>Ghi chú</LabelStyle>
                <RHFEditor simple name="description" />
              </div>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

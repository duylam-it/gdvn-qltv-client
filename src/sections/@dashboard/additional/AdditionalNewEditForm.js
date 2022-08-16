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
import { getAdditionals } from 'src/redux/slices/Additional'
import { getUsers } from 'src/redux/slices/user'
import { useDispatch, useSelector } from 'src/redux/store'
// routes
import { PATH_DASHBOARD } from '../../../routes/paths'
// components
import { FormProvider } from '../../../components/hook-form'

// ----------------------------------------------------------------------

const USERS_OPTION = [{ value: 'all', label: 'All users' }]

const GENDER_OPTION = [
  { labela: 'Men', value: 'MenV' },
  { labela: 'Women', value: 'WomenV' },
  { labela: 'Kids', value: 'KidsV' },
]

const CATEGORY_OPTION = [
  { group: 'Clothing', classify: ['Shirts', 'T-shirts', 'Jeans', 'Leather'] },
  {
    group: 'Tailored',
    classify: ['Suits', 'Blazers', 'Trousers', 'Waistcoats'],
  },
  {
    group: 'Accessories',
    classify: ['Shoes', 'Backpacks and bags', 'Bracelets', 'Face masks'],
  },
]

const TAGS_OPTION = [
  'Toy Story 3',
  'Logan',
  'Full Metal Jacket',
  'Dangal',
  'The Sting',
  '2001: A Space Odyssey',
  "Singin' in the Rain",
  'Toy Story',
  'Bicycle Thieves',
  'The Kid',
  'Inglourious Basterds',
  'Snatch',
  '3 Idiots',
]

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
  const { Additionals } = useSelector((state) => state.Additional)

  useEffect(() => {
    dispatch(getUsers())
    dispatch(getAdditionals())
  }, [dispatch])

  const defaultValues = useMemo(
    () => ({
      name: currentBorrow?.name || '',
      user: currentBorrow?.user || '',
      Additional: currentBorrow?.Additional || '',
      from: currentBorrow?.from || new Date(),
      to: currentBorrow?.to || new Date(),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentBorrow]
  )

  const methods = useForm({
    defaultValues,
  })

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const values = watch()

  useEffect(() => {
    if (isEdit && currentBorrow) {
      reset(defaultValues)
    }
    if (!isEdit) {
      reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentBorrow])

  const onSubmit = async (data) => {
    console.log(data)
    console.log(users)
    try {
      if (0) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        reset()
        enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!')
        navigate(PATH_DASHBOARD.eCommerce.list)
      }
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
                  onChange={(e, data) => console.log(data)}
                  options={users.map((user) => ({
                    label: user.fullName,
                    _id: user._id,
                  }))}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  renderInput={(params) => (
                    <TextField required {...params} label="Người mượn" />
                  )}
                />

                <Autocomplete
                  onChange={(e, data) => console.log(data)}
                  options={Additionals.map((Additional) => ({
                    label: Additional.name,
                    _id: Additional._id,
                  }))}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
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
                      label="Từ ngày"
                      value={field.value}
                      onChange={(newValue) => {
                        field.onChange(newValue)
                      }}
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
                      label="Đến ngày"
                      value={field.value}
                      onChange={(newValue) => {
                        field.onChange(newValue)
                      }}
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
      </Grid>
    </FormProvider>
  )
}

import { useSnackbar } from 'notistack'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
// utils
import axios from 'src/utils/axios'
// redux
import { useDispatch, useSelector } from 'react-redux'
import { getCategories } from 'src/redux/slices/category'
import { getTopics } from 'src/redux/slices/topic'
// form
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
// @mui
import { LoadingButton } from '@mui/lab'
import { Card, Grid, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
// routes
import { PATH_DASHBOARD } from 'src/routes/paths'
// components
import {
  FormProvider,
  RHFEditor,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadMultiFile,
} from '../../../components/hook-form'

// ----------------------------------------------------------------------

let CATEGORY_OPTION = []
let TOPIC_OPTION = []

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}))

// ----------------------------------------------------------------------

BookNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentBook: PropTypes.object,
}

export default function BookNewEditForm({ isEdit, currentBook }) {
  const dispatch = useDispatch()
  const { topics } = useSelector((state) => state.topic)
  const { categories } = useSelector((state) => state.category)

  useEffect(() => {
    dispatch(getTopics())
    dispatch(getCategories())
  }, [dispatch])

  TOPIC_OPTION = Array.from(topics, ({ name }) => name)
  CATEGORY_OPTION = Array.from(categories, ({ name }) => name)

  const navigate = useNavigate()

  const { enqueueSnackbar } = useSnackbar()

  const NewBookSchema = Yup.object().shape({
    name: Yup.string().required('Tên là bắt buộc'),
    description: Yup.string().required('Mô tả là bắt buộc'),
    images: Yup.array().min(1, 'Hình ảnh là bắt buộc'),
    author: Yup.string().required('Tác giả là bắt buộc'),
    language: Yup.string().required('Ngôn ngữ là bắt buộc'),
    publishingCompany: Yup.string().required('NXB là bắt buộc'),
    numberOfPages: Yup.string().required('Số trang là bắt buộc'),
  })

  const defaultValues = useMemo(
    () => ({
      name: currentBook?.name || '',
      author: currentBook?.author || '',
      description: currentBook?.description || '',
      publishingCompany: currentBook?.publishingCompany || '',
      numberOfPages: currentBook?.numberOfPages || '',
      releaseDate: currentBook?.releaseDate || '',
      images: currentBook?.images || [],
      imagesName: currentBook?.image || [],
      code: currentBook?.code || '',
      status: currentBook?.status === 'true' || true,
      category: currentBook?.category || CATEGORY_OPTION[0] || '',
      topic: currentBook?.topic || TOPIC_OPTION[0] || '',
      location: currentBook?.location || '',
      language: currentBook?.language || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentBook]
  )

  const methods = useForm({
    resolver: yupResolver(NewBookSchema),
    defaultValues,
  })

  const {
    reset,
    watch,
    // control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const values = watch()

  useEffect(() => {
    if (isEdit && currentBook) {
      reset(defaultValues)
    }
    if (!isEdit) {
      reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentBook])

  useEffect(() => {
    if (TOPIC_OPTION.length > 0) setValue('topic', TOPIC_OPTION[0])
    if (CATEGORY_OPTION.length > 0) setValue('category', CATEGORY_OPTION[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TOPIC_OPTION[0], CATEGORY_OPTION[0]])

  const onSubmit = async () => {
    try {
      const responseUploadImage = await handleUploadImages()
      const pathImage = responseUploadImage.data.data.split(',')
      let response
      console.log(pathImage)
      if (!isEdit) {
        response = await axios.post('/book/create', {
          code: getValues('code'),
          topicName: values.topic,
          categoryName: getValues('category'),
          name: getValues('name'),
          image: pathImage,
          author: getValues('author'),
          language: getValues('language'),
          publishingCompany: getValues('publishingCompany'),
          releaseDate: getValues('releaseDate'),
          numberOfPages: getValues('numberOfPages'),
          location: getValues('location'),
          status: getValues('status'),
          description: getValues('description'),
        })
      } else {
        response = await axios.post('/book/update', {
          code: getValues('code'),
          topicName: getValues('topic'),
          categoryName: getValues('category'),
          name: getValues('name'),
          image: pathImage,
          author: getValues('author'),
          language: getValues('language'),
          publishingCompany: getValues('publishingCompany'),
          releaseDate: getValues('releaseDate'),
          numberOfPages: getValues('numberOfPages'),
          location: getValues('location'),
          status: getValues('status'),
          description: getValues('description'),
        })
      }
      reset()
      if (response.data.success) {
        enqueueSnackbar(!isEdit ? 'Tạo thành công!' : 'Cập nhật thành công!')
        navigate(PATH_DASHBOARD.book.root)
      } else if (response.data.message.includes('already exists'))
        enqueueSnackbar('Mã sách đã tồn tại!', { variant: 'error' })
      else
        enqueueSnackbar('Đã xảy ra lỗi, vui lòng liên hệ admin!', {
          variant: 'error',
        })
    } catch (error) {
      console.error(error)
    }
  }

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const images = values.images || []

      setValue('images', [
        ...images,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ])
    },
    [setValue, values.images]
  )

  const handleRemoveAll = () => {
    setValue('images', [])
  }

  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file)
    setValue('images', filteredItems)
  }

  const handleUploadImages = async () => {
    const images = getValues('images')
    let formData = new FormData()
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append('book', image, image.name)
      })

      const response = await axios.post('/file/upload/bookImages', formData)
      return response
    }
  }

  const handleTest = () => {
    console.log(getValues('images'))
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Tên sách" />

              <div>
                <LabelStyle onClick={handleTest}>Mô tả</LabelStyle>
                <RHFEditor simple name="description" />
              </div>

              <div>
                <LabelStyle>Hình ảnh</LabelStyle>
                <RHFUploadMultiFile
                  showPreview
                  name="images"
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <RHFSwitch name="status" label="Nguyên vẹn" />

              <Stack spacing={3} mt={2}>
                {isEdit === false && (
                  <RHFTextField name="code" label="Mã sách" />
                )}

                <RHFTextField name="author" label="Tác giả" />

                <RHFTextField name="publishingCompany" label="NXB" />

                {CATEGORY_OPTION.length > 0 && (
                  <RHFSelect name="category" label="Chủ đề">
                    {CATEGORY_OPTION.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </RHFSelect>
                )}

                {TOPIC_OPTION.length > 0 && (
                  <RHFSelect name="topic" label="Chủ đề">
                    {TOPIC_OPTION.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="releaseDate" label="Ngày phát hành" />

                <RHFTextField name="numberOfPages" label="Số trang" />

                <RHFTextField name="language" label="Ngôn ngữ" />

                <RHFTextField name="location" label="Vị trí" />
              </Stack>
            </Card>

            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}>
              {!isEdit ? 'Tạo' : 'Lưu thay đổi'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

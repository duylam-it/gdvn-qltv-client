// @mui
import { Box, Stack, Typography } from '@mui/material'
// assets
import { UploadIllustration } from '../../assets'

// ----------------------------------------------------------------------

export default function BlockContent() {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}>
      <UploadIllustration sx={{ width: 220 }} />

      <Box sx={{ p: 3 }}>
        <Typography gutterBottom variant="h5">
          Kéo hoặc chọn file
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Kéo ảnh vào đây hoặc nhấn để chọn ảnh tải lên
        </Typography>
      </Box>
    </Stack>
  )
}

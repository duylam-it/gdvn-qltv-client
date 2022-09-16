// hooks
import useAuth from '../hooks/useAuth'
// utils
import createAvatar from '../utils/createAvatar'
//
import Avatar from './Avatar'

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { user } = useAuth()

  return (
    <Avatar
      src={user.data?.data.image}
      alt={user.data?.data.fullName}
      color={
        user.data?.data.image
          ? 'default'
          : createAvatar(user.data?.data.fullName).color
      }
      {...other}>
      {createAvatar(user.data?.data.fullName).name}
    </Avatar>
  )
}

import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import LogoutIcon from '@mui/icons-material/Logout'
import { logoutUser } from '../store/authSlice'
import { useLoginState } from '../hooks/useLoginState'

function UserProfile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useLoginState()

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/login')
  }

  if (!isAuthenticated || !user) {
    return (
      <Button color="inherit" variant="outlined" size="small" onClick={() => navigate('/login')}>
        Войти
      </Button>
    )
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: '0.9rem' }}>
        {user.name ? user.name[0].toUpperCase() : '?'}
      </Avatar>
      <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
        {user.name}
      </Typography>
      <Tooltip title="Выйти">
        <IconButton color="inherit" size="small" onClick={handleLogout}>
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default UserProfile

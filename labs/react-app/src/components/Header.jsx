import React from 'react'
import { Link } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuIcon from '@mui/icons-material/Menu'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useThemeContext } from '../context/ThemeContext'
import UserProfile from './UserProfile'

function Header({ onMenuOpen }) {
  const { mode, toggleTheme } = useThemeContext()

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuOpen}
          sx={{ mr: 1 }}
          aria-label="Открыть меню"
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          Web Labs
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Button color="inherit" component={Link} to="/" size="small">
            Главная
          </Button>
          <Button color="inherit" component={Link} to="/about" size="small">
            О себе
          </Button>

          <Tooltip title={mode === 'dark' ? 'Светлая тема' : 'Тёмная тема'}>
            <IconButton color="inherit" onClick={toggleTheme} size="small">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          <UserProfile />
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header

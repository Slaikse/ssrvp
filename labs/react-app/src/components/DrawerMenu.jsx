import React from 'react'
import { useNavigate } from 'react-router-dom'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import Code from '@mui/icons-material/Code'
import LayersIcon from '@mui/icons-material/Layers'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import TuneIcon from '@mui/icons-material/Tune'
import LoginIcon from '@mui/icons-material/Login'
import StorageIcon from '@mui/icons-material/Storage'
import PaletteIcon from '@mui/icons-material/Palette'
import TableChartIcon from '@mui/icons-material/TableChart'
import ScienceIcon from '@mui/icons-material/Science'
import { useLoginState } from '../hooks/useLoginState'

const labItems = [
  { label: 'Лаб. 1 — Vanilla JS', path: '/lab/1', icon: <Code fontSize="small" /> },
  { label: 'Лаб. 2 — React компоненты', path: '/lab/2', icon: <LayersIcon fontSize="small" /> },
  { label: 'Лаб. 3 — Макет приложения', path: '/lab/3', icon: <AccountTreeIcon fontSize="small" /> },
  { label: 'Лаб. 4 — Хуки и Redux', path: '/lab/4', icon: <TuneIcon fontSize="small" /> },
  { label: 'Лаб. 5 — Формы и контекст', path: '/lab/5', icon: <LoginIcon fontSize="small" /> },
  { label: 'Лаб. 6 — API и Axios', path: '/lab/6', icon: <StorageIcon fontSize="small" /> },
  { label: 'Лаб. 7 — MUI и темы', path: '/lab/7', icon: <PaletteIcon fontSize="small" /> },
  { label: 'Лаб. 8 — Таблицы и роли', path: '/lab/8', icon: <TableChartIcon fontSize="small" /> },
  { label: 'Лаб. 9 — RTK Query и тесты', path: '/lab/9', icon: <ScienceIcon fontSize="small" /> },
]

function DrawerMenu({ open, onClose }) {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useLoginState()

  const handleNav = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 280 }} role="presentation">
        <Box sx={{ p: 2, bgcolor: 'primary.main' }}>
          <Typography variant="h6" color="white" fontWeight={700}>
            Web Labs
          </Typography>
          <Typography variant="caption" color="rgba(255,255,255,0.7)">
            Навигация по лабораторным
          </Typography>
        </Box>

        <List dense>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNav('/')}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Главная" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNav('/about')}>
              <ListItemIcon><InfoIcon /></ListItemIcon>
              <ListItemText primary="О приложении" />
            </ListItemButton>
          </ListItem>
          {isAuthenticated && user?.role === 'admin' && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNav('/admin')}>
                <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
                <ListItemText primary="Панель администратора" />
              </ListItemButton>
            </ListItem>
          )}
        </List>

        <Divider />

        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="overline" color="text.secondary" fontWeight={700}>
            Лабораторные работы
          </Typography>
        </Box>

        <List dense>
          {labItems.map((item) => (
            <ListItem disablePadding key={item.path}>
              <ListItemButton onClick={() => handleNav(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default DrawerMenu

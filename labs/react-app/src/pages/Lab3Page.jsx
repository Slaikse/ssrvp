import React from 'react'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'

const labList = [
  { num: 1, title: 'Vanilla JS', path: '/lab/1', color: '#f59e0b' },
  { num: 2, title: 'React компоненты', path: '/lab/2', color: '#3b82f6' },
  { num: 3, title: 'Макет приложения', path: '/lab/3', color: '#8b5cf6' },
  { num: 4, title: 'Хуки и Redux', path: '/lab/4', color: '#10b981' },
  { num: 5, title: 'Формы и авторизация', path: '/lab/5', color: '#ef4444' },
  { num: 6, title: 'REST API (Axios)', path: '/lab/6', color: '#06b6d4' },
  { num: 7, title: 'MUI и темы', path: '/lab/7', color: '#ec4899' },
  { num: 8, title: 'Таблицы и роли', path: '/lab/8', color: '#f97316' },
  { num: 9, title: 'RTK Query и тесты', path: '/lab/9', color: '#84cc16' },
]

const layoutParts = [
  { name: 'Header', file: 'src/components/Header.jsx', desc: 'AppBar с навигацией, темой и профилем' },
  { name: 'DrawerMenu', file: 'src/components/DrawerMenu.jsx', desc: 'Боковое меню со списком лабораторных' },
  { name: 'Footer', file: 'src/components/Footer.jsx', desc: 'Нижний колонтитул с быстрыми ссылками' },
  { name: 'ProtectedRoute', file: 'src/components/ProtectedRoute.jsx', desc: 'HOC для защищённых маршрутов' },
  { name: 'App.jsx', file: 'src/App.jsx', desc: 'Корневой компонент: Router + Store + Theme' },
]

function Lab3Page() {
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: 2, py: 4 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Лабораторная работа № 3</strong> — Макет приложения: Header, Footer, Drawer, React Router
      </Alert>

      <Typography variant="h4" fontWeight={700} gutterBottom>
        Структура приложения
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        В рамках Лаб. 3 реализован полный макет SPA-приложения с навигацией, боковым меню,
        шапкой и подвалом.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* Layout breakdown */}
      <Typography variant="h6" gutterBottom>
        Компоненты макета
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {layoutParts.map((part) => (
          <Grid item xs={12} sm={6} key={part.name}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Chip label={part.name} color="primary" size="small" sx={{ mb: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {part.desc}
                </Typography>
                <Typography variant="caption" color="text.disabled" fontFamily="monospace">
                  {part.file}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* Lab grid */}
      <Typography variant="h6" gutterBottom>
        Список лабораторных работ
      </Typography>
      <Grid container spacing={2}>
        {labList.map((lab) => (
          <Grid item xs={12} sm={6} md={4} key={lab.num}>
            <Card
              elevation={2}
              sx={{
                borderTop: `3px solid ${lab.color}`,
                transition: 'transform 0.15s',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              <CardActionArea component={Link} to={lab.path} sx={{ p: 2 }}>
                <Typography variant="overline" sx={{ color: lab.color }}>
                  Лаб. {lab.num}
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {lab.title}
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Lab3Page

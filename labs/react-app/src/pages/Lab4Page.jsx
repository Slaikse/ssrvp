import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Chip from '@mui/material/Chip'
import { increment, decrement, reset } from '../store/counterSlice'
import { ThemeContext } from '../context/ThemeContext'

function MountUnmountDemo({ show }) {
  useEffect(() => {
    console.log('Компонент MountUnmountDemo смонтирован')
    return () => {
      console.log('Компонент MountUnmountDemo размонтирован')
    }
  }, [])

  return (
    <Alert severity="success" icon={false}>
      Компонент смонтирован. Откройте консоль браузера и переключите видимость — увидите сообщения
      о монтировании/размонтировании.
    </Alert>
  )
}

function Lab4Page() {
  const dispatch = useDispatch()
  const count = useSelector((state) => state.counter.value)
  const { mode, toggleTheme } = useContext(ThemeContext)

  const [controlledText, setControlledText] = useState('')
  const [showChild, setShowChild] = useState(true)

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: 2, py: 4 }}>
      <Alert severity="warning" sx={{ mb: 3 }}>
        <strong>Лабораторная работа № 4</strong> — Хуки (useState, useEffect, useContext), Redux,
        React Router
      </Alert>

      {/* ThemeContext demo */}
      <Card sx={{ mb: 3 }} elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            useContext — тема приложения
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            ThemeContext хранит текущую тему (<code>light</code> | <code>dark</code>). Значение
            сохраняется в localStorage и применяется через MUI ThemeProvider.
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="contained" onClick={toggleTheme}>
              Переключить тему
            </Button>
            <Chip
              label={`Текущая тема: ${mode}`}
              color={mode === 'dark' ? 'default' : 'warning'}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* useState demo */}
      <Card sx={{ mb: 3 }} elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            useState — управляемый ввод
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Каждое нажатие клавиши вызывает <code>setControlledText</code> — компонент
            перерисовывается и отражает актуальное состояние.
          </Typography>
          <TextField
            label="Введите текст"
            value={controlledText}
            onChange={(e) => setControlledText(e.target.value)}
            size="small"
            sx={{ mr: 2 }}
          />
          {controlledText && (
            <Typography component="span" color="primary">
              Вы ввели: <strong>{controlledText}</strong>
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* useEffect mount/unmount */}
      <Card sx={{ mb: 3 }} elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            useEffect — монтирование и размонтирование
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            useEffect с пустым массивом зависимостей выполняется один раз при монтировании.
            Функция-очиститель вызывается при размонтировании.
          </Typography>
          <FormControlLabel
            control={
              <Switch checked={showChild} onChange={(e) => setShowChild(e.target.checked)} />
            }
            label="Показать/скрыть компонент"
            sx={{ mb: 1 }}
          />
          {showChild && <MountUnmountDemo />}
        </CardContent>
      </Card>

      {/* Redux counter */}
      <Card sx={{ mb: 3 }} elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Redux Toolkit — глобальный счётчик
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <code>useSelector</code> читает <code>state.counter.value</code>,{' '}
            <code>useDispatch</code> отправляет actions <em>increment</em>, <em>decrement</em>,{' '}
            <em>reset</em>.
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography variant="h3" color="primary" fontWeight={700} sx={{ minWidth: 60 }}>
              {count}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={() => dispatch(increment())}>+</Button>
              <Button variant="outlined" onClick={() => dispatch(decrement())}>−</Button>
              <Button variant="text" color="error" onClick={() => dispatch(reset())}>Сброс</Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* React Router */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            React Router — навигация
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Компонент <code>Link</code> из react-router-dom обеспечивает навигацию без перезагрузки
            страницы.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button component={Link} to="/" variant="outlined" size="small">Главная</Button>
            <Button component={Link} to="/about" variant="outlined" size="small">О приложении</Button>
            <Button component={Link} to="/lab/5" variant="outlined" size="small">Лаб. 5</Button>
            <Button component={Link} to="/login" variant="outlined" size="small">Войти</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Lab4Page

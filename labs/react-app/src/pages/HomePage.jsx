import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import { increment, decrement, reset } from '../store/counterSlice'
import { useLoginState } from '../hooks/useLoginState'

function AutoCounter() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return () => {
      clearInterval(timer)
      console.log('AutoCounter размонтирован — таймер очищен')
    }
  }, [])

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="h4" color="primary" fontWeight={700}>
        {seconds}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        секунд с момента монтирования
      </Typography>
    </Box>
  )
}

function HomePage() {
  const dispatch = useDispatch()
  const { user } = useLoginState()
  const count = useSelector((state) => state.counter.value)
  const [inputValue, setInputValue] = useState('')

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: 2, py: 4 }}>
      <Alert severity="success" sx={{ mb: 3 }}>
        <strong>Лаб. 3 &amp; 4</strong> — Хуки React (useState, useEffect), Redux, управляемые формы
      </Alert>

      {/* Welcome */}
      <Card sx={{ mb: 3 }} elevation={3}>
        <CardContent>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Добро пожаловать
            {user ? `, ${user.name}` : ''}!
          </Typography>
          <Typography color="text.secondary">
            Это учебное React-приложение, демонстрирующее лабораторные работы 2–9 по
            Web-программированию. Выберите лабораторную работу в меню слева или перейдите
            по вкладкам в шапке.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Chip label="React 18" color="primary" size="small" />
            <Chip label="Redux Toolkit" color="secondary" size="small" />
            <Chip label="MUI v5" size="small" />
            <Chip label="React Router v6" size="small" />
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
            Значение поля синхронизируется со state через обработчик onChange.
          </Typography>
          <TextField
            label="Введите что-нибудь"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            size="small"
            sx={{ mr: 2 }}
          />
          {inputValue && (
            <Typography component="span" color="primary">
              Вы ввели: <strong>{inputValue}</strong>
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* useEffect demo */}
      <Card sx={{ mb: 3 }} elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            useEffect — автосчётчик с очисткой (cleanup)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            setInterval запускается при монтировании, clearInterval вызывается при размонтировании.
          </Typography>
          <AutoCounter />
        </CardContent>
      </Card>

      {/* Redux counter */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Redux — глобальный счётчик
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            useSelector читает состояние, useDispatch отправляет action.
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography variant="h3" color="primary" fontWeight={700} sx={{ minWidth: 60 }}>
              {count}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={() => dispatch(increment())}>
                +
              </Button>
              <Button variant="outlined" onClick={() => dispatch(decrement())}>
                −
              </Button>
              <Button variant="text" color="error" onClick={() => dispatch(reset())}>
                Сброс
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default HomePage

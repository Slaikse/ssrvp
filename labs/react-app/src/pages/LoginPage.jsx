import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import { loginUser } from '../store/authSlice'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setServerError('')
    setLoading(true)
    try {
      const response = await axios.get('/api/users')
      const users = response.data
      const found = users.find(
        (u) => u.login === data.login && u.password === data.password
      )
      if (found) {
        if (found.blocked) {
          setServerError('Учётная запись заблокирована.')
        } else {
          dispatch(
            loginUser({
              id: found.id,
              login: found.login,
              name: found.name,
              role: found.role,
              email: found.email,
            })
          )
          navigate(from, { replace: true })
        }
      } else {
        setServerError('Неверный логин или пароль.')
      }
    } catch {
      setServerError('Ошибка соединения с сервером.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Card sx={{ maxWidth: 420, width: '100%' }} elevation={6}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mb: 1 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" fontWeight={700}>
              Авторизация
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Лабораторная работа № 5
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Логин"
              fullWidth
              margin="normal"
              autoComplete="username"
              error={Boolean(errors.login)}
              helperText={errors.login?.message}
              {...register('login', { required: 'Логин обязателен' })}
            />
            <TextField
              label="Пароль"
              type="password"
              fullWidth
              margin="normal"
              autoComplete="current-password"
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              {...register('password', {
                required: 'Пароль обязателен',
                minLength: { value: 3, message: 'Минимум 3 символа' },
              })}
            />

            {serverError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {serverError}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {loading ? 'Проверка...' : 'Войти'}
            </Button>
          </form>

          <Divider sx={{ my: 2 }} />

          <Alert severity="info" icon={false}>
            <Typography variant="caption" display="block">
              <strong>Тестовые данные:</strong>
            </Typography>
            <Typography variant="caption" display="block">
              Администратор: <code>admin</code> / <code>admin</code>
            </Typography>
            <Typography variant="caption" display="block">
              Пользователь: <code>user</code> / <code>user</code>
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginPage

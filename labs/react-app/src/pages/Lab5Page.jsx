import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import DeleteIcon from '@mui/icons-material/Delete'
import { addFeedback, deleteFeedback } from '../store/feedbackSlice'
import { useLoginState } from '../hooks/useLoginState'

function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  const onSubmit = useCallback(
    (data) => {
      console.log('Регистрация:', data)
      setSubmitted(true)
      reset()
    },
    [reset]
  )

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Форма регистрации (react-hook-form)
        </Typography>
        {submitted && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSubmitted(false)}>
            Пользователь зарегистрирован!
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Имя"
              size="small"
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              {...register('name', { required: 'Имя обязательно' })}
            />
            <TextField
              label="Email"
              size="small"
              type="email"
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              {...register('email', {
                required: 'Email обязателен',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Некорректный email' },
              })}
            />
            <TextField
              label="Пароль"
              size="small"
              type="password"
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              {...register('password', {
                required: 'Пароль обязателен',
                minLength: { value: 6, message: 'Минимум 6 символов' },
              })}
            />
            <TextField
              label="Повторите пароль"
              size="small"
              type="password"
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Подтверждение обязательно',
                validate: (val) => val === password || 'Пароли не совпадают',
              })}
            />
            <Button type="submit" variant="contained" size="small">
              Зарегистрироваться
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
}

function FeedbackSection() {
  const dispatch = useDispatch()
  const feedbackItems = useSelector((state) => state.feedback.items)
  const [nextId, setNextId] = useState(100)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmitFeedback = useCallback(
    (data) => {
      dispatch(
        addFeedback({
          id: nextId,
          author: data.author,
          text: data.feedbackText,
          date: new Date().toISOString().split('T')[0],
        })
      )
      setNextId((id) => id + 1)
      reset()
    },
    [dispatch, nextId, reset]
  )

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Отзывы (Redux feedbackSlice)
        </Typography>

        <form onSubmit={handleSubmit(onSubmitFeedback)} noValidate>
          <Stack spacing={1.5} sx={{ mb: 2 }}>
            <TextField
              label="Ваше имя"
              size="small"
              error={Boolean(errors.author)}
              helperText={errors.author?.message}
              {...register('author', { required: 'Введите имя' })}
            />
            <TextField
              label="Отзыв"
              size="small"
              multiline
              rows={2}
              error={Boolean(errors.feedbackText)}
              helperText={errors.feedbackText?.message}
              {...register('feedbackText', { required: 'Введите текст отзыва' })}
            />
            <Button type="submit" variant="outlined" size="small">
              Добавить отзыв
            </Button>
          </Stack>
        </form>

        <Divider sx={{ mb: 1 }} />

        {feedbackItems.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Отзывов пока нет. Добавьте первый!
          </Typography>
        ) : (
          <List dense>
            {feedbackItems.map((item) => (
              <ListItem key={item.id} divider>
                <ListItemText
                  primary={item.text}
                  secondary={`${item.author} · ${item.date}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    size="small"
                    color="error"
                    onClick={() => dispatch(deleteFeedback(item.id))}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}

function Lab5Page() {
  const { isAuthenticated, user } = useLoginState()

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: 2, py: 4 }}>
      <Alert severity="success" sx={{ mb: 3 }}>
        <strong>Лабораторная работа № 5</strong> — Формы (react-hook-form), валидация, useCallback,
        Redux, кастомный хук useLoginState
      </Alert>

      {/* useLoginState hook demo */}
      <Card sx={{ mb: 3 }} elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Кастомный хук useLoginState
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Хук <code>useLoginState()</code> инкапсулирует выборку auth-состояния из Redux store.
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label={isAuthenticated ? 'Авторизован' : 'Не авторизован'}
              color={isAuthenticated ? 'success' : 'default'}
            />
            {isAuthenticated && user && (
              <Chip label={`${user.name} (${user.role})`} color="primary" variant="outlined" />
            )}
          </Stack>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={3}>
        <RegistrationForm />
        <FeedbackSection />
      </Stack>
    </Box>
  )
}

export default Lab5Page

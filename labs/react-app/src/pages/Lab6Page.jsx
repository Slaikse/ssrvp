import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import CircularProgress from '@mui/material/CircularProgress'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'
import { setFeedback, addFeedback, deleteFeedback } from '../store/feedbackSlice'
import { useLoginState } from '../hooks/useLoginState'
import { updateUser } from '../store/authSlice'

function Lab6Page() {
  const dispatch = useDispatch()
  const { user } = useLoginState()
  const feedbackItems = useSelector((state) => state.feedback.items)

  const [loadingFeedback, setLoadingFeedback] = useState(false)
  const [feedbackError, setFeedbackError] = useState('')
  const [feedbackLoaded, setFeedbackLoaded] = useState(false)

  const [addingFeedback, setAddingFeedback] = useState(false)
  const [addError, setAddError] = useState('')
  const [addSuccess, setAddSuccess] = useState(false)

  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  const { register: registerFeedback, handleSubmit: handleFeedbackSubmit, reset: resetFeedback, formState: { errors: feedbackErrors } } = useForm()
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  })

  const loadFeedback = async () => {
    setLoadingFeedback(true)
    setFeedbackError('')
    try {
      const res = await axios.get('/api/feedback')
      dispatch(setFeedback(res.data))
      setFeedbackLoaded(true)
    } catch (err) {
      setFeedbackError('Ошибка загрузки отзывов: ' + (err.message || ''))
    } finally {
      setLoadingFeedback(false)
    }
  }

  const onAddFeedback = async (data) => {
    setAddingFeedback(true)
    setAddError('')
    setAddSuccess(false)
    try {
      const newItem = {
        author: data.author,
        text: data.text,
        date: new Date().toISOString().split('T')[0],
      }
      const res = await axios.post('/api/feedback', newItem)
      dispatch(addFeedback(res.data))
      setAddSuccess(true)
      resetFeedback()
    } catch (err) {
      setAddError('Ошибка добавления: ' + (err.message || ''))
    } finally {
      setAddingFeedback(false)
    }
  }

  const handleDeleteFeedback = async (id) => {
    try {
      await axios.delete(`/api/feedback/${id}`)
      dispatch(deleteFeedback(id))
    } catch (err) {
      console.error('Ошибка удаления:', err)
    }
  }

  const onUpdateProfile = async (data) => {
    if (!user) return
    setSavingProfile(true)
    setProfileError('')
    setProfileSuccess(false)
    try {
      await axios.patch(`/api/users/${user.id}`, { name: data.name, email: data.email })
      dispatch(updateUser({ name: data.name, email: data.email }))
      setProfileSuccess(true)
    } catch (err) {
      setProfileError('Ошибка сохранения: ' + (err.message || ''))
    } finally {
      setSavingProfile(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: 2, py: 4 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Лабораторная работа № 6</strong> — REST API: Axios, GET/POST/PATCH/DELETE,
        async/await, json-server
      </Alert>

      {/* Load feedback */}
      <Card sx={{ mb: 3 }} elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            GET /api/feedback — загрузить отзывы
          </Typography>
          {feedbackError && <Alert severity="error" sx={{ mb: 2 }}>{feedbackError}</Alert>}
          <Button
            variant="contained"
            onClick={loadFeedback}
            disabled={loadingFeedback}
            startIcon={loadingFeedback ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
            sx={{ mb: 2 }}
          >
            {loadingFeedback ? 'Загрузка...' : 'Загрузить отзывы с сервера'}
          </Button>

          {feedbackLoaded && feedbackItems.length > 0 && (
            <List dense>
              {feedbackItems.map((item) => (
                <ListItem key={item.id} divider secondaryAction={
                  <IconButton edge="end" size="small" color="error" onClick={() => handleDeleteFeedback(item.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }>
                  <ListItemText
                    primary={item.text}
                    secondary={`${item.author} · ${item.date}`}
                  />
                </ListItem>
              ))}
            </List>
          )}

          {feedbackLoaded && feedbackItems.length === 0 && (
            <Typography variant="body2" color="text.secondary">Отзывов нет.</Typography>
          )}
        </CardContent>
      </Card>

      <Divider sx={{ mb: 3 }} />

      {/* Add feedback POST */}
      <Card sx={{ mb: 3 }} elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            POST /api/feedback — добавить отзыв
          </Typography>
          {addError && <Alert severity="error" sx={{ mb: 2 }}>{addError}</Alert>}
          {addSuccess && <Alert severity="success" sx={{ mb: 2 }}>Отзыв добавлен!</Alert>}
          <form onSubmit={handleFeedbackSubmit(onAddFeedback)} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Автор"
                size="small"
                error={Boolean(feedbackErrors.author)}
                helperText={feedbackErrors.author?.message}
                {...registerFeedback('author', { required: 'Введите имя' })}
              />
              <TextField
                label="Текст отзыва"
                size="small"
                multiline
                rows={2}
                error={Boolean(feedbackErrors.text)}
                helperText={feedbackErrors.text?.message}
                {...registerFeedback('text', { required: 'Введите текст' })}
              />
              <Button
                type="submit"
                variant="outlined"
                disabled={addingFeedback}
                startIcon={addingFeedback ? <CircularProgress size={16} color="inherit" /> : null}
              >
                Отправить отзыв (POST)
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 3 }} />

      {/* Edit profile PATCH */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            PATCH /api/users/:id — редактировать профиль
          </Typography>
          {!user && (
            <Alert severity="warning">Необходимо войти, чтобы редактировать профиль.</Alert>
          )}
          {user && (
            <>
              {profileError && <Alert severity="error" sx={{ mb: 2 }}>{profileError}</Alert>}
              {profileSuccess && <Alert severity="success" sx={{ mb: 2 }}>Профиль обновлён!</Alert>}
              <form onSubmit={handleProfileSubmit(onUpdateProfile)} noValidate>
                <Stack spacing={2}>
                  <TextField
                    label="Имя"
                    size="small"
                    error={Boolean(profileErrors.name)}
                    helperText={profileErrors.name?.message}
                    {...registerProfile('name', { required: 'Имя обязательно' })}
                  />
                  <TextField
                    label="Email"
                    size="small"
                    type="email"
                    error={Boolean(profileErrors.email)}
                    helperText={profileErrors.email?.message}
                    {...registerProfile('email', { required: 'Email обязателен' })}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={savingProfile}
                    startIcon={savingProfile ? <CircularProgress size={16} color="inherit" /> : null}
                  >
                    Сохранить профиль (PATCH)
                  </Button>
                </Stack>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default Lab6Page

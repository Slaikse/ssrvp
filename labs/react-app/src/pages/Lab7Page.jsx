import React, { useContext } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import LinearProgress from '@mui/material/LinearProgress'
import Slider from '@mui/material/Slider'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import NotificationsIcon from '@mui/icons-material/Notifications'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import { ThemeContext } from '../context/ThemeContext'

function Lab7Page() {
  const { mode, toggleTheme } = useContext(ThemeContext)
  const [sliderVal, setSliderVal] = React.useState(30)
  const [selectVal, setSelectVal] = React.useState('option1')

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: 2, py: 4 }}>
      <Alert severity="secondary" sx={{ mb: 3 }} icon={false}>
        <strong>Лабораторная работа № 7</strong> — Material UI: компоненты, темизация, адаптивная
        сетка, иконки
      </Alert>

      {/* Theme toggle */}
      <Card sx={{ mb: 3 }} elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Переключение темы (ThemeContext + MUI ThemeProvider)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Состояние темы хранится в <code>ThemeContext</code> и передаётся в <code>createTheme</code>.
            MUI автоматически применяет цвета ко всем компонентам.
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              startIcon={mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              onClick={toggleTheme}
            >
              {mode === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            </Button>
            <Chip
              icon={mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
              label={`Тема: ${mode}`}
              variant="outlined"
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Responsive grid */}
      <Card sx={{ mb: 3 }} elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Адаптивная сетка (MUI Grid)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Grid с breakpoint-пропсами <code>xs=12 sm=6 md=4</code> — на мобильных 1 колонка,
            планшет 2, десктоп 3.
          </Typography>
          <Grid container spacing={2}>
            {['Синий', 'Зелёный', 'Оранжевый', 'Красный', 'Фиолетовый', 'Жёлтый'].map(
              (label, i) => (
                <Grid item xs={12} sm={6} md={4} key={label}>
                  <Box
                    sx={{
                      bgcolor: ['primary.main', 'success.main', 'warning.main', 'error.main', 'secondary.main', 'info.main'][i],
                      borderRadius: 2,
                      p: 2,
                      color: 'white',
                      textAlign: 'center',
                      fontWeight: 600,
                    }}
                  >
                    {label}
                  </Box>
                </Grid>
              )
            )}
          </Grid>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 3 }} />

      {/* MUI component showcase */}
      <Typography variant="h6" gutterBottom>
        Витрина MUI-компонентов
      </Typography>
      <Grid container spacing={2}>
        {/* Buttons */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Кнопки</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Button variant="contained">Contained</Button>
                <Button variant="outlined">Outlined</Button>
                <Button variant="text">Text</Button>
                <Button variant="contained" color="secondary">Secondary</Button>
                <Button variant="contained" color="error" size="small">Error</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Chips */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Chips</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip label="Default" />
                <Chip label="Primary" color="primary" />
                <Chip label="Success" color="success" />
                <Chip label="Warning" color="warning" />
                <Chip label="Error" color="error" onDelete={() => {}} />
                <Chip label="Outlined" variant="outlined" color="primary" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* TextField */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>TextField</Typography>
              <Stack spacing={1.5}>
                <TextField label="Стандартное" size="small" />
                <TextField label="Заполненное" variant="filled" size="small" />
                <TextField label="Без рамки" variant="standard" size="small" />
                <FormControl size="small" fullWidth>
                  <InputLabel>Выберите</InputLabel>
                  <Select
                    value={selectVal}
                    label="Выберите"
                    onChange={(e) => setSelectVal(e.target.value)}
                  >
                    <MenuItem value="option1">Вариант 1</MenuItem>
                    <MenuItem value="option2">Вариант 2</MenuItem>
                    <MenuItem value="option3">Вариант 3</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Misc */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Badge, Avatar, Tooltip, Switch</Typography>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Badge badgeContent={4} color="error">
                    <IconButton color="inherit"><NotificationsIcon /></IconButton>
                  </Badge>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>А</Avatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>Б</Avatar>
                  <Tooltip title="Нравится">
                    <IconButton color="error"><FavoriteIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Поделиться">
                    <IconButton><ShareIcon /></IconButton>
                  </Tooltip>
                </Stack>
                <FormControlLabel
                  control={<Switch defaultChecked color="primary" />}
                  label="Switch включён"
                />
                <Box>
                  <Typography variant="caption">LinearProgress: {sliderVal}%</Typography>
                  <LinearProgress variant="determinate" value={sliderVal} sx={{ mt: 0.5, mb: 1 }} />
                  <Slider
                    value={sliderVal}
                    onChange={(_, v) => setSliderVal(v)}
                    min={0}
                    max={100}
                    size="small"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Alert variants */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Alert</Typography>
              <Stack spacing={1}>
                <Alert severity="success">Успех — операция выполнена</Alert>
                <Alert severity="info">Информация — полезное сообщение</Alert>
                <Alert severity="warning">Предупреждение — обратите внимание</Alert>
                <Alert severity="error">Ошибка — что-то пошло не так</Alert>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Lab7Page

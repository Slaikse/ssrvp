import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import RefreshIcon from '@mui/icons-material/Refresh'
import ScienceIcon from '@mui/icons-material/Science'
import { useGetFeedbackQuery } from '../store/apiSlice'

function FeedbackWithRTKQuery() {
  const { data, isLoading, isError, error, refetch, isFetching } = useGetFeedbackQuery()

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Отзывы — RTK Query
          </Typography>
          <Button
            size="small"
            startIcon={isFetching ? <CircularProgress size={14} color="inherit" /> : <RefreshIcon />}
            onClick={() => refetch()}
            disabled={isFetching}
            variant="outlined"
          >
            Обновить
          </Button>
        </Stack>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Alert severity="error">
            Ошибка загрузки: {error?.status} — убедитесь, что json-server запущен на порту 3001.
          </Alert>
        )}

        {!isLoading && !isError && data && (
          <>
            <Alert severity="success" icon={false} sx={{ mb: 1 }}>
              Загружено {data.length} отзывов из /api/feedback
            </Alert>
            <List dense>
              {data.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemText
                    primary={item.text}
                    secondary={`${item.author} · ${item.date}`}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function Lab9Page() {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: 2, py: 4 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Лабораторная работа № 9</strong> — RTK Query (кэширование, хуки), тестирование
        (Vitest + Testing Library)
      </Alert>

      {/* RTK Query section */}
      <Card sx={{ mb: 3 }} elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            RTK Query — декларативный data fetching
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            RTK Query автоматически управляет состоянием загрузки, кэшированием и инвалидацией.
            Хуки <code>useGetFeedbackQuery()</code>, <code>useAddFeedbackMutation()</code> и т.д.
            генерируются из <code>createApi</code>.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
            <Chip label="isLoading" size="small" variant="outlined" color="primary" />
            <Chip label="isError" size="small" variant="outlined" color="error" />
            <Chip label="data" size="small" variant="outlined" color="success" />
            <Chip label="refetch()" size="small" variant="outlined" />
            <Chip label="isFetching" size="small" variant="outlined" />
          </Stack>
          <FeedbackWithRTKQuery />
        </CardContent>
      </Card>

      <Divider sx={{ mb: 3 }} />

      {/* Testing section */}
      <Card elevation={2}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <ScienceIcon color="primary" />
            <Typography variant="h6">
              Тестирование — Vitest + Testing Library
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Тесты компонента <code>AppButton</code> находятся в{' '}
            <code>src/components/AppButton.test.jsx</code>. Запуск:
          </Typography>

          <Box
            sx={{
              bgcolor: 'background.default',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              mb: 2,
            }}
          >
            npm run test
          </Box>

          <Stack spacing={1}>
            {[
              { test: 'renders button with correct text', desc: 'Проверяет, что кнопка рендерится с нужным текстом' },
              { test: 'calls onClick when clicked', desc: 'Проверяет вызов обработчика onClick через vi.fn()' },
              { test: 'renders with custom variant and color props', desc: 'Проверяет CSS-класс MuiButton-outlined' },
              { test: 'does not throw when onClick is not provided', desc: 'Проверяет устойчивость при отсутствии обработчика' },
            ].map((item) => (
              <Alert key={item.test} severity="success" icon={false} sx={{ py: 0.5 }}>
                <Typography variant="body2">
                  <code>{item.test}</code> — {item.desc}
                </Typography>
              </Alert>
            ))}
          </Stack>

          <Alert severity="info" sx={{ mt: 2 }}>
            Vitest настроен через <code>vite.config.js</code>: среда jsdom, глобальные API,
            setup-файл подключает <code>@testing-library/jest-dom</code>.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Lab9Page

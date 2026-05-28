import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import AppButton from '../components/AppButton'

function ContainerDemo({ title, children }) {
  return (
    <Box
      sx={{
        border: '2px dashed',
        borderColor: 'primary.main',
        borderRadius: 2,
        p: 2,
        mt: 1,
      }}
    >
      <Typography variant="overline" color="primary" display="block" gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  )
}

function Lab2Page() {
  const [clickCount, setClickCount] = useState(0)

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: 2, py: 4 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Лабораторная работа № 2</strong> — Компоненты React: JSX, props, переиспользуемые
        компоненты
      </Alert>

      <Typography variant="h4" fontWeight={700} gutterBottom>
        Hello World from React
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Демонстрация базовых возможностей React: компоненты, props, локальное состояние.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* AppButton demo */}
      <Card sx={{ mb: 3 }} elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Компонент AppButton
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            AppButton — это обёртка над MUI Button. Демонстрирует передачу props (variant, color,
            onClick) и переиспользование компонентов.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <AppButton onClick={() => setClickCount((c) => c + 1)}>
              Кнопка нажата: {clickCount}
            </AppButton>
            <AppButton variant="outlined" onClick={() => setClickCount(0)}>
              Сброс
            </AppButton>
            <AppButton variant="text" color="secondary">
              Текстовая кнопка
            </AppButton>
          </Box>

          {clickCount > 0 && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Вы нажали кнопку {clickCount} {clickCount === 1 ? 'раз' : 'раз(а)'}!
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Container component demo */}
      <Card sx={{ mb: 3 }} elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Компонент-контейнер (children prop)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Компонент ContainerDemo принимает children через props и оборачивает их в стилизованный
            блок — классический паттерн компонента-обёртки.
          </Typography>
          <ContainerDemo title="Контейнер A">
            <Typography>Содержимое контейнера A передано через prop children.</Typography>
          </ContainerDemo>
          <ContainerDemo title="Контейнер B">
            <Stack direction="row" spacing={1}>
              <AppButton size="small">Кнопка 1</AppButton>
              <AppButton size="small" variant="outlined">
                Кнопка 2
              </AppButton>
            </Stack>
          </ContainerDemo>
        </CardContent>
      </Card>

      {/* Props explanation */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Ключевые концепции Lab 2
          </Typography>
          <Stack spacing={1}>
            {[
              'JSX — синтаксический сахар над React.createElement()',
              'Компоненты — функции, возвращающие JSX',
              'Props — аргументы компонента (только для чтения)',
              'children — специальный prop для вложенных элементов',
              'Локальное состояние — useState для счётчика кликов',
            ].map((text, i) => (
              <Alert key={i} severity="info" icon={false} sx={{ py: 0.5 }}>
                {text}
              </Alert>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Lab2Page

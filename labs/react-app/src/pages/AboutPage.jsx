import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'

const labs = [
  { num: 1, title: 'Vanilla JS', desc: 'Events, DOM, localStorage, формы' },
  { num: 2, title: 'React компоненты', desc: 'JSX, props, базовые компоненты' },
  { num: 3, title: 'Макет приложения', desc: 'Header, Footer, Drawer, маршруты' },
  { num: 4, title: 'Хуки и состояние', desc: 'useState, useEffect, useContext, Redux' },
  { num: 5, title: 'Формы и авторизация', desc: 'react-hook-form, валидация, защищённые маршруты' },
  { num: 6, title: 'REST API', desc: 'Axios, CRUD, json-server' },
  { num: 7, title: 'MUI и темы', desc: 'Material UI, темёмный/светлый режим, адаптивность' },
  { num: 8, title: 'Таблицы и роли', desc: '@tanstack/react-table, ролевой доступ' },
  { num: 9, title: 'RTK Query и тесты', desc: 'RTK Query, Vitest, Testing Library' },
]

function AboutPage() {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: 2, py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        О приложении
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Учебный проект, объединяющий 9 лабораторных работ по дисциплине
        «Web-программирование». Каждая лабораторная демонстрирует конкретный
        набор технологий или подходов.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" gutterBottom>
        Технологический стек
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 4 }}>
        {[
          'React 18', 'Vite', 'Redux Toolkit', 'RTK Query',
          'React Router v6', 'MUI v5', 'react-hook-form',
          'Axios', '@tanstack/react-table', 'Vitest',
          'Testing Library', 'json-server',
        ].map((tech) => (
          <Chip key={tech} label={tech} variant="outlined" size="small" color="primary" />
        ))}
      </Stack>

      <Typography variant="h6" gutterBottom>
        Список лабораторных работ
      </Typography>

      <Stack spacing={2}>
        {labs.map((lab) => (
          <Card key={lab.num} variant="outlined">
            <CardContent sx={{ py: '12px !important', display: 'flex', gap: 2, alignItems: 'center' }}>
              <Chip
                label={`Лаб. ${lab.num}`}
                color="primary"
                size="small"
                sx={{ minWidth: 60, fontWeight: 700 }}
              />
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {lab.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {lab.desc}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}

export default AboutPage

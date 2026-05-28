import React, { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import BlockIcon from '@mui/icons-material/Block'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetFeedbackQuery,
  useDeleteFeedbackMutation,
} from '../store/apiSlice'
import { useLoginState } from '../hooks/useLoginState'

function SortIcon({ column }) {
  if (!column.getCanSort()) return null
  const sorted = column.getIsSorted()
  if (sorted === 'asc') return <ArrowUpwardIcon fontSize="inherit" sx={{ ml: 0.5, fontSize: '0.85rem' }} />
  if (sorted === 'desc') return <ArrowDownwardIcon fontSize="inherit" sx={{ ml: 0.5, fontSize: '0.85rem' }} />
  return <Box component="span" sx={{ ml: 0.5, color: 'text.disabled', fontSize: '0.75rem' }}>⇅</Box>
}

function UsersTable() {
  const { data: users, isLoading, isError } = useGetUsersQuery()
  const [deleteUser] = useDeleteUserMutation()
  const [updateUser] = useUpdateUserMutation()

  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID', size: 50, enableSorting: true },
      { accessorKey: 'name', header: 'Имя', enableSorting: true },
      { accessorKey: 'email', header: 'Email', enableSorting: true },
      {
        accessorKey: 'role',
        header: 'Роль',
        enableSorting: true,
        cell: ({ getValue }) => (
          <Chip
            label={getValue()}
            size="small"
            color={getValue() === 'admin' ? 'primary' : 'default'}
          />
        ),
      },
      {
        accessorKey: 'blocked',
        header: 'Статус',
        enableSorting: true,
        cell: ({ getValue }) => (
          <Chip
            label={getValue() ? 'Заблокирован' : 'Активен'}
            size="small"
            color={getValue() ? 'error' : 'success'}
          />
        ),
      },
      {
        id: 'actions',
        header: 'Действия',
        enableSorting: false,
        cell: ({ row }) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Удалить пользователя">
              <IconButton size="small" color="error" onClick={() => deleteUser(row.original.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={row.original.blocked ? 'Разблокировать' : 'Заблокировать'}>
              <IconButton
                size="small"
                color={row.original.blocked ? 'success' : 'warning'}
                onClick={() => updateUser({ id: row.original.id, blocked: !row.original.blocked })}
              >
                <BlockIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [deleteUser, updateUser]
  )

  const table = useReactTable({
    data: users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (isLoading) return <CircularProgress size={24} />
  if (isError) return <Alert severity="error">Ошибка загрузки пользователей</Alert>

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableCell
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  sx={{ cursor: header.column.getCanSort() ? 'pointer' : 'default', fontWeight: 700, userSelect: 'none' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <SortIcon column={header.column} />
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} hover>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function FeedbackAdminTable() {
  const { data: feedback, isLoading, isError } = useGetFeedbackQuery()
  const [deleteFeedbackItem] = useDeleteFeedbackMutation()

  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID', size: 50, enableSorting: true },
      { accessorKey: 'author', header: 'Автор', enableSorting: true },
      { accessorKey: 'text', header: 'Текст', enableSorting: false },
      { accessorKey: 'date', header: 'Дата', enableSorting: true },
      {
        id: 'actions',
        header: 'Действия',
        enableSorting: false,
        cell: ({ row }) => (
          <Tooltip title="Удалить отзыв">
            <IconButton size="small" color="error" onClick={() => deleteFeedbackItem(row.original.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [deleteFeedbackItem]
  )

  const table = useReactTable({
    data: feedback ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (isLoading) return <CircularProgress size={24} />
  if (isError) return <Alert severity="error">Ошибка загрузки отзывов</Alert>

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableCell
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  sx={{ cursor: header.column.getCanSort() ? 'pointer' : 'default', fontWeight: 700, userSelect: 'none' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <SortIcon column={header.column} />
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} hover>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function ReadOnlyFeedback() {
  const { data: feedback, isLoading, isError } = useGetFeedbackQuery()

  if (isLoading) return <CircularProgress size={24} />
  if (isError) return <Alert severity="error">Ошибка загрузки</Alert>

  return (
    <Stack spacing={1}>
      {(feedback ?? []).map((item) => (
        <Card key={item.id} variant="outlined">
          <CardContent sx={{ py: '10px !important' }}>
            <Typography variant="body1">{item.text}</Typography>
            <Typography variant="caption" color="text.secondary">
              {item.author} · {item.date}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}

function Lab8Page() {
  const { user } = useLoginState()
  const isAdmin = user?.role === 'admin'

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: 2, py: 4 }}>
      <Alert severity={isAdmin ? 'warning' : 'info'} sx={{ mb: 3 }}>
        <strong>Лабораторная работа № 8</strong> — Таблицы (@tanstack/react-table), ролевой доступ,
        сортировка, CRUD через RTK Query.
        {isAdmin ? ' Вы вошли как администратор.' : ' Вы вошли как обычный пользователь.'}
      </Alert>

      {isAdmin ? (
        <>
          <Card sx={{ mb: 3 }} elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Таблица пользователей (admin)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Данные из GET /api/users через RTK Query. Кликните по заголовку столбца для
                сортировки.
              </Typography>
              <UsersTable />
            </CardContent>
          </Card>

          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Таблица отзывов (admin)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Данные из GET /api/feedback. Администратор может удалять отзывы.
              </Typography>
              <FeedbackAdminTable />
            </CardContent>
          </Card>
        </>
      ) : (
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Отзывы (только чтение)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Обычный пользователь видит отзывы без возможности управления.
              Для доступа к таблицам войдите как <strong>admin / admin</strong>.
            </Typography>
            <ReadOnlyFeedback />
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default Lab8Page

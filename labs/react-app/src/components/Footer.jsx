import React from 'react'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        px: 2,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        textAlign: 'center',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
        <Button component={Link} to="/lab/5" size="small" color="primary">
          Оставить отзыв
        </Button>
        <Button component={Link} to="/about" size="small" color="inherit">
          О приложении
        </Button>
        <Button component={Link} to="/lab/1" size="small" color="inherit">
          Лаб. 1
        </Button>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Typography variant="caption" color="text.secondary">
        © 2024 Web Labs — Лабораторные работы по Web-программированию
      </Typography>
    </Box>
  )
}

export default Footer

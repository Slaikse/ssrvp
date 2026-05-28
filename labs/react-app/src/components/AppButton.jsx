import React from 'react'
import Button from '@mui/material/Button'

function AppButton({ variant = 'contained', color = 'primary', onClick, children, ...rest }) {
  return (
    <Button variant={variant} color={color} onClick={onClick} {...rest}>
      {children}
    </Button>
  )
}

export default AppButton

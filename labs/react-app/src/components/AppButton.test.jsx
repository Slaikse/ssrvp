import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AppButton from './AppButton'

describe('AppButton', () => {
  it('renders button with correct text', () => {
    render(<AppButton>Нажми меня</AppButton>)
    expect(screen.getByRole('button', { name: 'Нажми меня' })).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<AppButton onClick={handleClick}>Кнопка</AppButton>)
    fireEvent.click(screen.getByRole('button', { name: 'Кнопка' }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders with custom variant and color props', () => {
    render(
      <AppButton variant="outlined" color="secondary">
        Outlined
      </AppButton>
    )
    const btn = screen.getByRole('button', { name: 'Outlined' })
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveClass('MuiButton-outlined')
  })

  it('does not throw when onClick is not provided', () => {
    render(<AppButton>Без обработчика</AppButton>)
    expect(() =>
      fireEvent.click(screen.getByRole('button', { name: 'Без обработчика' }))
    ).not.toThrow()
  })
})

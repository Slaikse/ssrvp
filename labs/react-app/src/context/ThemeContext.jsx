import React, { createContext, useContext, useState, useMemo } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

export const ThemeContext = createContext({
  mode: 'dark',
  toggleTheme: () => {},
})

export function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'dark'
  })

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('themeMode', next)
      return next
    })
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                primary: { main: '#7c3aed' },
                background: { default: '#0f1117', paper: '#1a1d27' },
              }
            : {
                primary: { main: '#7c3aed' },
              }),
        },
      }),
    [mode]
  )

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  return useContext(ThemeContext)
}

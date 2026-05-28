import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Box from '@mui/material/Box'
import store from './store'
import { ThemeContextProvider } from './context/ThemeContext'
import Header from './components/Header'
import DrawerMenu from './components/DrawerMenu'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import Lab2Page from './pages/Lab2Page'
import Lab3Page from './pages/Lab3Page'
import Lab4Page from './pages/Lab4Page'
import Lab5Page from './pages/Lab5Page'
import Lab6Page from './pages/Lab6Page'
import Lab7Page from './pages/Lab7Page'
import Lab8Page from './pages/Lab8Page'
import Lab9Page from './pages/Lab9Page'

function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onMenuOpen={() => setDrawerOpen(true)} />
      <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <Box component="main" sx={{ flex: 1 }}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Lab 1 is vanilla JS — link to static file */}
          <Route
            path="/lab/1"
            element={
              <Box sx={{ maxWidth: 600, mx: 'auto', px: 2, py: 6, textAlign: 'center' }}>
                <Box
                  component="a"
                  href="/lab1/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'inline-block',
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 4,
                    py: 2,
                    borderRadius: 2,
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    '&:hover': { opacity: 0.85 },
                  }}
                >
                  Открыть Лаб. 1 (Vanilla JS)
                </Box>
                <Box sx={{ mt: 2, color: 'text.secondary', fontSize: '0.9rem' }}>
                  Лаб. 1 — отдельный HTML-файл без React.
                  Находится в <code>labs/lab1/index.html</code>.
                </Box>
              </Box>
            }
          />

          {/* Lab 2 — public (demo) */}
          <Route path="/lab/2" element={<Lab2Page />} />

          {/* Lab 3 — public */}
          <Route path="/lab/3" element={<Lab3Page />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab/4"
            element={
              <ProtectedRoute>
                <Lab4Page />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab/5"
            element={
              <ProtectedRoute>
                <Lab5Page />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab/6"
            element={
              <ProtectedRoute>
                <Lab6Page />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab/7"
            element={
              <ProtectedRoute>
                <Lab7Page />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab/8"
            element={
              <ProtectedRoute>
                <Lab8Page />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab/9"
            element={
              <ProtectedRoute>
                <Lab9Page />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Lab8Page />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>

      <Footer />
    </Box>
  )
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeContextProvider>
          <AppLayout />
        </ThemeContextProvider>
      </BrowserRouter>
    </Provider>
  )
}

export default App

import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DashboardLayout from './components/DashboardLayout';
import { lazy, Suspense } from 'react';
import { lightTheme, darkTheme } from './themes/theme';

// Importing the lazy-loaded components
const HomePage = lazy(() => import('./components/HomePage'));
const Employees = lazy(() => import('./components/Employees'));
const EmployeeDetails = lazy(() => import('./components/EmployeeDetails'));
const Schedule = lazy(() => import('./components/Schedule'));

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <DashboardLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/employees/:id" element={<EmployeeDetails />} />
              <Route path="/schedules" element={<Schedule />} />
            </Routes>
          </Suspense>
        </DashboardLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;

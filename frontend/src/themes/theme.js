import { createTheme } from '@mui/material/styles';

// Thème clair (Light Mode)
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#05be46',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#fff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#000',
    },
    action: {
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
    },
  },
  components: {
    MuiTable: {
      styleOverrides: {
        root: {},
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
          borderBottom: '1px solid #ddd',
        },
        head: {
          backgroundColor: '#00ACC1',
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center',
        },
        body: {
          color: '#000',
          borderRight: '1px solid #ddd',
          fontWeight: 'bold',
          '&:not(:first-of-type):not(:last-child)': {
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              transition: 'background-color 0.3s ease',
            },
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child th': {
            border: 0,
          },
        },
      },
    },
  },
});

// Thème sombre (Dark Mode)
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#05be46',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#3e3e3e',
      paper: '#2d2d30',
    },
    text: {
      primary: '#ffffff',
    },
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
    },
  },
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
        },
        head: {
          backgroundColor: '#00bcd4',
          color: '#2d2d30',
          fontWeight: 'bold',
          textAlign: 'center',
        },
        body: {
          color: '#ffffff',
          borderRight: '1px solid rgba(81, 81, 81, 1)',
          fontWeight: 'bold',
          '&:not(:first-child):not(:last-child)': {
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              transition: 'background-color 0.3s ease',
            },
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child th': {
            border: 0,
          },
        },
      },
    },
  },
});

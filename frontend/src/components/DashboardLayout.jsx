// DashboardLayout component
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Typography,
  Box,
  Container,
  FormControlLabel,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  HomeRounded,
  PeopleRounded,
  CalendarMonthRounded,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import MaterialUISwitch from './MaterialUISwitch';

const drawerWidth = 60; // Taille fixe réduite

const DashboardLayout = ({ children, isDarkMode, toggleTheme }) => {
  const theme = useTheme();
  const location = useLocation();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Accueil';
      case '/employees':
        return 'Salariés';
      case '/schedules':
        return 'Planning';
      default:
        return 'Tableau de bord';
    }
  };

  const drawerContent = (
    <div>
      <Toolbar />
      <List>
        {[
          { to: '/', icon: <HomeRounded />, label: 'Accueil' },
          { to: '/employees', icon: <PeopleRounded />, label: 'Salariés' },
          { to: '/schedules', icon: <CalendarMonthRounded />, label: 'Planning' }
        ].map((item) => (
          <ListItem
            key={item.to}
            component={Link}
            to={item.to}
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              backgroundColor: location.pathname === item.to ? 'action.selected' : 'transparent',
              '&:hover': {
                backgroundColor: 'action.hover',
								color: 'inherit',
              },
            }}
          >
            <Tooltip title={item.label} placement="right">
              <ListItemIcon
                sx={{
                  paddingBottom: 1,
                  paddingTop: 1,
                  color: location.pathname === item.to ? 'primary.main' : 'inherit', // Couleur active
                }}
              >
                {item.icon}
              </ListItemIcon>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
					zIndex: 2, // Plus élevé que le z-index du Drawer
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar className='app-bar'
          sx={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <img
            src="/assets/logo_seul_transparent.png"
            alt="Logo"
            style={{ height: 40 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, marginLeft: 2, fontVariant: 'small-caps' }}
          >
            Raq&Staff
          </Typography>
          <FormControlLabel
            control={<MaterialUISwitch checked={isDarkMode} onChange={toggleTheme} />}
            label="Mode sombre"
            sx={{ marginLeft: 'auto' }}
          />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            overflowX: 'hidden',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRight: 'none',
            minHeight: '100vh',
            position: 'fixed',
            boxShadow: '7px 0 10px rgba(0, 0, 0, 0.4)',
						zIndex: 1, // Plus bas que le z-index de l'AppBar
          },
        }}
      >
        <Toolbar />
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <Toolbar />
        <Container
          maxWidth="xl"
          sx={{
            mt: 4,
            mb: 4,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h2" sx={{ mb: 5, fontVariant: 'small-caps' }}>
            {getPageTitle(location.pathname)}
          </Typography>

          {children}
        </Container>
      </Box>
    </Box>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default DashboardLayout;

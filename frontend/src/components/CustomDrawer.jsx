// CustomDrawer.jsx

import PropTypes from 'prop-types';
import { Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CustomDrawer = ({ isOpen, onClose, title, children }) => {
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      variant="temporary"
	  sx={{
		'& .MuiDrawer-paper': {
          width: 600,
          position: 'fixed',
          zIndex: 3, // Plus élevé que le z-index de l'AppBar
		  borderTopLeftRadius: 20,
        },
	  }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          left: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <div style={{ width: 300, padding: '40px 20px' }}>
        <h2>{title}</h2>
        {children}
      </div>
    </Drawer>
  );
};

// Validation des props
CustomDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CustomDrawer;

import React from 'react';
import Logo from '/Users/matthewsimon/Desktop/acdc.electron/public/logo-Av2.svg';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import FolderIcon from '@mui/icons-material/FolderRounded'; // Rounded icon
import HomeIcon from '@mui/icons-material/HomeRounded'; // Rounded icon
import StorageIcon from '@mui/icons-material/StorageRounded'; // Rounded icon
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';

// Define the width of the drawer
const drawerWidth = 195;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth,
    }),
  }),
);

const AppDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: 'rgba(40, 44, 52, 0.95)',
  },
}));

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  margin: theme.spacing(0, 1.25), // Add horizontal padding
  padding: theme.spacing(0),
  justifyContent: 'flex-start',
  color: 'white',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: 'rgba(97, 218, 251, 0.2)',
  },
  '& .MuiListItemIcon-root': {
    color: 'inherit',
    minWidth: '35px',
  },
  '& .MuiListItemText-primary': {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const SidebarSectionHeading = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[400],
  fontSize: '0.9rem',
  fontWeight: theme.typography.fontWeightMedium,
  padding: theme.spacing(1),
}));

const Sidebar = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppDrawer
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Toolbar>
        <img src="/logo-Av2.svg" alt="Logo" style={{ height: 'auto', maxWidth: '90%' }} />
        </Toolbar>
        <Divider sx={{ backgroundColor: 'grey' }} />
        <List>
          <SidebarSectionHeading>Devices</SidebarSectionHeading>
          <CustomListItemButton>
            <ListItemIcon>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText primary="Macintosh HD" />
          </CustomListItemButton>
          {/* More devices */}
        </List>
        <List>
          <SidebarSectionHeading>Local</SidebarSectionHeading>
          <CustomListItemButton>
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </CustomListItemButton>
          {/* Other main items */}
        </List>
        <List>
          <SidebarSectionHeading>Locations</SidebarSectionHeading>
          <CustomListItemButton>
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary="Documents" />
          </CustomListItemButton>
          {/* More locations */}
        </List>
      </AppDrawer>
      <Main open={open}>
        {/* Your main content */}
      </Main>
    </Box>
  );
};

export default Sidebar;



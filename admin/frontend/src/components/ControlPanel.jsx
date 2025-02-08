import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, FormControlLabel, Alert, Snackbar, Typography, Box, Collapse, Switch } from '@mui/material';
import { Lock, Security, GppGood, DeviceHub, Build, PeopleAlt } from '@mui/icons-material';

// Custom iOS-style switch with ControlPanel's color scheme
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  marginRight: '16px', // Add space between switch and label
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#FF9800',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#FF9800',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: '#2A2A2A',
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
    backgroundColor: '#fff',
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

// Custom styled FormControlLabel for better spacing
const StyledFormControlLabel = styled(FormControlLabel)({
  '.MuiFormControlLabel-label': {
    marginLeft: '8px', // Additional space between switch and label
  },
});

export default function ControlPanel() {
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [expandedCategory, setExpandedCategory] = useState(null);

  const switches = [
    { id: 'flexSwitchCheckAccCracked', label: 'Run acc_cracked.py', endpoint: '/cracked/acc', category: 'Cracked', icon: <Lock /> },
    { id: 'flexSwitchCheckCrackedCombo', label: 'Run cracked_combo.py', endpoint: '/cracked/combo', category: 'Cracked', icon: <Security /> },
    { id: 'flexSwitchCheckCrackedHire', label: 'Run cracked_hire.py', endpoint: '/cracked/hire', category: 'Cracked', icon: <PeopleAlt /> },
    { id: 'flexSwitchCheckCrackedSource', label: 'Run cracked.py', endpoint: '/cracked/source', category: 'Cracked', icon: <Build /> },
    { id: 'flexSwitchCheckProductsCracked', label: 'Run products_cracked.py', endpoint: '/cracked/products', category: 'Cracked', icon: <DeviceHub /> },
    { id: 'flexSwitchCheckServiceCracked', label: 'Run service_cracked.py', endpoint: '/cracked/service', category: 'Cracked', icon: <Security /> },

    { id: 'flexSwitchCheckBreachAcc', label: 'Run cracked_acc.py', endpoint: '/breached/acc', category: 'Breach Forum', icon: <Lock /> },
    { id: 'flexSwitchCheckDatabases', label: 'Run databases.py', endpoint: '/breached/databases', category: 'Breach Forum', icon: <Build /> },
    { id: 'flexSwitchCheckOtherLeaks', label: 'Run other_leaks.py', endpoint: '/breached/other-leaks', category: 'Breach Forum', icon: <Security /> },
    { id: 'flexSwitchCheckStealer', label: 'Run stealer.py', endpoint: '/breached/stealer', category: 'Breach Forum', icon: <GppGood /> },

    { id: 'flexSwitchCheckDoxbin', label: 'Run doxbin.py', endpoint: '/doxbin/doxbin', category: 'Doxbin', icon: <Lock /> },

    { id: 'flexSwitchCheckNulledAcc', label: 'Run nulled_acc.py', endpoint: '/nulled/acc', category: 'Nulled', icon: <Security /> },
    { id: 'flexSwitchCheckNulledCombo', label: 'Run nulled_combo.py', endpoint: '/nulled/combo', category: 'Nulled', icon: <PeopleAlt /> },
    { id: 'flexSwitchCheckNulledDbs', label: 'Run nulled_dbs.py', endpoint: '/nulled/dbs', category: 'Nulled', icon: <DeviceHub /> },
    { id: 'flexSwitchCheckNulledProds', label: 'Run nulled_prods.py', endpoint: '/nulled/prods', category: 'Nulled', icon: <Build /> },
    { id: 'flexSwitchCheckNulledSource', label: 'Run nulled_source.py', endpoint: '/nulled/source', category: 'Nulled', icon: <Lock /> },

    { id: 'flexSwitchCheckOnniDbs', label: 'Run onni_dbs.py', endpoint: '/onni/dbs', category: 'Onni', icon: <DeviceHub /> },
    { id: 'flexSwitchCheckOnniHack', label: 'Run onni_hack.py', endpoint: '/onni/hack', category: 'Onni', icon: <GppGood /> },
    { id: 'flexSwitchCheckOnniOpsec', label: 'Run onni_opsec.py', endpoint: '/onni/opsec', category: 'Onni', icon: <Security /> },
    { id: 'flexSwitchCheckOnniOther', label: 'Run onni_other.py', endpoint: '/onni/other', category: 'Onni', icon: <Lock /> },
    { id: 'flexSwitchCheckOnniPrem', label: 'Run onni_prem.py', endpoint: '/onni/prem', category: 'Onni', icon: <Build /> }
  ];

  const handleToggle = async (endpoint, isChecked) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ running: isChecked }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setToast({
        open: true,
        message: data.message || "Action completed successfully!",
        severity: 'success'
      });
    } catch (error) {
      setToast({
        open: true,
        message: `Error: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const handleCategoryClick = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const groupedSwitches = switches.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#1A1A1A',
      color: '#E0E0E0',
      overflow: 'hidden',
      borderRadius: '0px',
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '20rem',
        paddingRight: '1rem',
        paddingLeft: '1rem',
        height: '100%',
        overflowY: 'auto',
      }}>
        <Typography variant="h4" component="h1" sx={{
          fontWeight: 'bold',
          color: '#FF9800',
          textAlign: 'center',
          marginBottom: '3rem',
        }}>
          Ingestion Engine Control Panel
        </Typography>

        <Box>
          {Object.entries(groupedSwitches).map(([category], index) => (
            <Card
              key={index}
              sx={{
                backgroundColor: '#2A2A2A',
                marginBottom: '1rem',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0 8px 18px rgba(0, 0, 0, 0.15)',
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1rem',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              }}
              onClick={() => handleCategoryClick(category)}
            >
              <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: 0,
              }}>
                <Typography variant="h6" sx={{
                  fontWeight: 'bold',
                  color: '#FF9800',
                  marginBottom: '1rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {category}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem',
        backgroundColor: '#2A2A2A',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        height: '100%',
        overflowY: 'auto',
      }}>
        {expandedCategory && (
          <Collapse in={expandedCategory === expandedCategory} timeout="auto" unmountOnExit>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '40rem',
              width: '100%',
            }}>
              <Typography variant="h5" sx={{
                fontWeight: 'bold',
                color: '#FF9800',
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}>
                {expandedCategory} - Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                {groupedSwitches[expandedCategory]?.map((item) => (
                  <StyledFormControlLabel
                    key={item.id}
                    control={
                      <IOSSwitch
                        onChange={(event) => handleToggle(item.endpoint, event.target.checked)}
                      />
                    }
                    label={
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Box sx={{ marginRight: '8px', color: '#FF9800' }}>{item.icon}</Box>
                        {item.label}
                      </Box>
                    }
                    sx={{
                      color: '#E0E0E0',
                      textAlign: 'center',
                      fontSize: '14px',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Collapse>
        )}
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ width: '100%', backgroundColor: toast.severity === 'error' ? '#D32F2F' : '#4CAF50', color: '#fff' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
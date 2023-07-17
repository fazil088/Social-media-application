import React from 'react'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Form from './Form';

function LoginPage() {
  const theme = useTheme();
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");

  return (
    <Box>
      <Box
        width="100%"
        padding="1rem 5%"
        textAlign="center"
        backgroundColor= {theme.palette.background.alt}>
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          BUILD MORE
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Box
        width={isNonMobileScreen ? "50%" : "90%"}
        backgroundColor={theme.palette.background.alt}
        p="2rem"
        mt="2rem"
        borderRadius="1.5rem"
        >
        <Typography variant='h5' fontWeight="500" mb="1.5rem" textAlign="center">
          Welcome to the BUILD MORE MEDIA !
        </Typography>
        <Form />
      </Box>
      </Box>
    </Box>
  )
}

export default LoginPage
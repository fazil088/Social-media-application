import React,{ useState } from 'react';
import { Box, Stack, Alert, useMediaQuery } from '@mui/material';

function ErrorMsg({ message, severity }) {
    const [isAlertBox, setIsAlertBox] = useState(true);
    const isMobileScreen = useMediaQuery("(max-width:600px)")
  
    setTimeout(()=>{
        setIsAlertBox(false)
    },5000)

  return (
    <Box
        width={isMobileScreen ? '90%' : '500px'}
        height='90px'
        position='absolute' 
        bottom='20px' 
        right={isAlertBox ? '10px' : '-100%'}
        zIndex='9'
        sx={{
            transition: 'all 0.5s ease-in-out'
        }}
    >
        <Stack sx={{mb:'1.5rem'}} spacing={2} >
            <Alert severity={severity} sx={{p:'1rem',fontSize:'16px',textAlign:'center'}}>{message}</Alert>
        </Stack>
    </Box>
    )
}

export default ErrorMsg

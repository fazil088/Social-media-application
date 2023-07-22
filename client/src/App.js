import { BrowserRouter,Navigate, Routes, Route } from 'react-router-dom';
import HomePage from './Scenes/homePage';
import ProfilePage from './Scenes/profilePage';
import LoginPage from './Scenes/loginPage';
import OTP from './Scenes/loginPage/OTP';
import { useMemo } from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';



function App() {
  const mode = useSelector((state) => state.mode);
  const isAuth = Boolean(useSelector((state)=>state.token));
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route exact path='/' element={isAuth ? <HomePage/> : <Navigate to="/login"/> } />
            <Route path='/profile/:userId' element={isAuth ? <ProfilePage/> : <Navigate to="/login"/>} />
            <Route path='/verify-otp' element={<OTP/>} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

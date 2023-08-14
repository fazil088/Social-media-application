import { BrowserRouter,Navigate, Routes, Route } from 'react-router-dom';
import HomePage from './Scenes/homePage';
import ProfilePage from './Scenes/profilePage';
import LoginPage from './Scenes/loginPage';
import ChatPage from './Scenes/ChatPage';
import ChatWidget from './Scenes/Widgets/ChatWidget';
import { useMemo } from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



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
            <Route path='/chat' element={isAuth ? <ChatPage/> : <Navigate to="/login"/>} />
          </Routes>
        </ThemeProvider>
        <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        />
      </BrowserRouter>
    </div>
  );
}

export default App;

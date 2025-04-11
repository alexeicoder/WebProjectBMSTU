import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES } from './routes/routes';
import WelcomePage from './pages/WelcomePage/WelcomePage';
// import SigninPage from './pages/SignInPage/SignInPage';
// import SignupPage from './pages/SignupPage/SignupPage';
// import HomePage from './pages/HomePage/HomePage';
// import SettingsPage from './pages/SettingsPage/SettingsPage';

import './App.css';
import SigninPage from './pages/SigninPage/SigninPage';
import SignupPage from './pages/SignupPage/SignupPage';
import Header from './components/Header/Header';
// import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
// import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Header />}>
          <Route path={ROUTES.WELCOME} element={<WelcomePage />} />
          <Route path={ROUTES.SIGN_IN} element={<SigninPage />} />
          <Route path={ROUTES.SIGN_UP} element={<SignupPage />} />
        </Route>
        {/* <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          <Route path={ROUTES.HOME} element={<HomePage />} /> */}
      </Routes>
    </Router >
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import LoginForm from './components/LoginForm';
import StudentDashboard from './components/StudentDashboard';
import SecurityDashboard from './components/SecurityDashboard';
import WardenDashboard from './components/WardenDashboard';
import RegistrationForm from './components/RegistrationForm';
import { Language } from './utils/translations';

type UserRole = 'student' | 'security' | 'warden';

interface User {
  id: string;
  name: string;
  registrationNumber?: string;
  username?: string;
  role: UserRole;
  roomNumber?: string;
  approved?: boolean;
}

interface AppState {
  currentUser: User | null;
  accessToken: string | null;
  currentView: 'login' | 'register' | 'dashboard';
  theme: 'light' | 'dark';
  language: Language;
  colorBlindMode: boolean;
}

export default function App() {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    accessToken: null,
    currentView: 'login',
    theme: 'light',
    language: 'en',
    colorBlindMode: false
  });

  // Apply theme and color blind mode to document
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    if (state.colorBlindMode) {
      document.documentElement.classList.add('color-blind');
    } else {
      document.documentElement.classList.remove('color-blind');
    }
  }, [state.theme, state.colorBlindMode]);

  const handleLogin = (user: User, accessToken: string) => {
    setState(prev => ({
      ...prev,
      currentUser: user,
      accessToken,
      currentView: 'dashboard'
    }));
  };

  const handleLogout = () => {
    setState(prev => ({
      ...prev,
      currentUser: null,
      accessToken: null,
      currentView: 'login'
    }));
  };

  const handleRegister = () => {
    setState(prev => ({
      ...prev,
      currentView: 'register'
    }));
  };

  const handleBackToLogin = () => {
    setState(prev => ({
      ...prev,
      currentView: 'login'
    }));
  };

  const toggleTheme = () => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  const changeLanguage = (language: Language) => {
    setState(prev => ({
      ...prev,
      language
    }));
  };

  const toggleColorBlindMode = () => {
    setState(prev => ({
      ...prev,
      colorBlindMode: !prev.colorBlindMode
    }));
  };

  const renderCurrentView = () => {
    if (state.currentView === 'register') {
      return <RegistrationForm onBackToLogin={handleBackToLogin} />;
    }

    if (state.currentView === 'login') {
      return (
        <LoginForm 
          onLogin={handleLogin} 
          onRegister={handleRegister} 
          theme={state.theme}
          language={state.language}
          onChangeLanguage={changeLanguage}
        />
      );
    }

    if (state.currentUser && state.accessToken) {
      switch (state.currentUser.role) {
        case 'student':
          return (
            <StudentDashboard 
              user={state.currentUser} 
              accessToken={state.accessToken}
              onLogout={handleLogout}
              theme={state.theme}
              onToggleTheme={toggleTheme}
              language={state.language}
              onChangeLanguage={changeLanguage}
              colorBlindMode={state.colorBlindMode}
              onToggleColorBlindMode={toggleColorBlindMode}
            />
          );
        case 'security':
          return (
            <SecurityDashboard 
              user={state.currentUser} 
              accessToken={state.accessToken}
              onLogout={handleLogout}
              theme={state.theme}
              onToggleTheme={toggleTheme}
              language={state.language}
              onChangeLanguage={changeLanguage}
              colorBlindMode={state.colorBlindMode}
              onToggleColorBlindMode={toggleColorBlindMode}
            />
          );
        case 'warden':
          return (
            <WardenDashboard 
              user={state.currentUser} 
              accessToken={state.accessToken}
              onLogout={handleLogout}
              theme={state.theme}
              onToggleTheme={toggleTheme}
              language={state.language}
              onChangeLanguage={changeLanguage}
              colorBlindMode={state.colorBlindMode}
              onToggleColorBlindMode={toggleColorBlindMode}
            />
          );
        default:
          return (
            <LoginForm 
              onLogin={handleLogin} 
              onRegister={handleRegister} 
              theme={state.theme}
              language={state.language}
              onChangeLanguage={changeLanguage}
            />
          );
      }
    }

    return (
      <LoginForm 
        onLogin={handleLogin} 
        onRegister={handleRegister} 
        theme={state.theme}
        language={state.language}
        onChangeLanguage={changeLanguage}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentView()}
      <Toaster />
    </div>
  );
}
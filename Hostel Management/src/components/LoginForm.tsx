import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Globe } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Language, getTranslation } from '../utils/translations';
import logoDark from 'figma:asset/b9f6f0ce26f4229b951859011c4adc982a0777de.png';
import logoLight from 'figma:asset/a4884a76e9fe2c5d7dd602979820b5ca36aca3bf.png';

interface User {
  id: string;
  name: string;
  registrationNumber?: string;
  username?: string;
  role: 'student' | 'security' | 'warden';
  roomNumber?: string;
  approved?: boolean;
}

interface LoginFormProps {
  onLogin: (user: User, accessToken: string) => void;
  onRegister: () => void;
  theme?: 'light' | 'dark';
  language?: Language;
  onChangeLanguage?: (language: Language) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onLogin, 
  onRegister, 
  theme = 'light', 
  language = 'en', 
  onChangeLanguage 
}) => {
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e0452d3f/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          identifier: loginData.identifier,
          password: loginData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      toast.success('Login successful!');
      onLogin(data.user, data.session.access_token);
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
    
    setIsLoading(false);
  };

  const handleInitDatabase = async () => {
    try {
      toast.info('Initializing demo data... This may take a few moments.');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e0452d3f/init`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Demo data initialized successfully! You can now login with the demo credentials.');
      } else {
        console.error('Init failed:', data);
        toast.error(data.error || 'Failed to initialize database');
      }
    } catch (error) {
      console.error('Init error:', error);
      toast.error('Failed to initialize database. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 bg-background">
      <Card className="w-full max-w-xs sm:max-w-md border-0 sm:border shadow-none sm:shadow-sm">
        <CardHeader className="text-center space-y-3 sm:space-y-4 p-3 sm:p-6">
          
          {/* Logo */}
          <div className="flex justify-center">
            <img 
              src={theme === 'dark' ? logoDark : logoLight} 
              alt="Hostel Key Digital Logo"
              className="h-24 sm:h-32 md:h-40 w-auto"
            />
          </div>
          
          {/* Sign In Text */}
          <h2 className="text-base sm:text-lg md:text-xl font-medium text-center">
            {getTranslation(language, 'signIn')}
          </h2>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="identifier" className="text-sm">
                {language === 'ta' ? 'பதிவு எண் / பயனர் பெயர்' : 
                 language === 'si' ? 'ලියාපදිංචි අංකය / පරිශීලක නාමය' : 
                 'Registration Number / Username'}
              </Label>
              <Input
                id="identifier"
                type="text"
                placeholder={
                  language === 'ta' ? 'உங்கள் பதிவு எண் அல்லது பயனர் பெயரை உள்ளிடவும்' :
                  language === 'si' ? 'ඔබගේ ලියාපදිංචි අංකය හෝ පරිශීලක නාමය ඇතුළත් කරන්න' :
                  'Enter your registration number or username'
                }
                value={loginData.identifier}
                onChange={(e) => setLoginData(prev => ({ ...prev, identifier: e.target.value }))}
                required
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="password" className="text-sm">
                {language === 'ta' ? 'கடவுச்சொல்' : 
                 language === 'si' ? 'මුර පදය' : 
                 'Password'}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={
                  language === 'ta' ? 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்' :
                  language === 'si' ? 'ඔබගේ මුර පදය ඇතුළත් කරන්න' :
                  'Enter your password'
                }
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                required
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
            <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={isLoading}>
              {isLoading ? 
                (language === 'ta' ? 'உள்நுழைகிறது...' : 
                 language === 'si' ? 'ඇතුළු වෙමින්...' : 
                 'Signing in...') : 
                getTranslation(language, 'signIn')
              }
            </Button>
          </form>
          
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {language === 'ta' ? 'புதிய மாணவரா?' : 
               language === 'si' ? 'නව ශිෂ්‍යයෙක්ද?' : 
               'New student?'}{' '}
              <button
                onClick={onRegister}
                className="text-primary hover:underline text-xs sm:text-sm"
              >
                {language === 'ta' ? 'இங்கே பதிவு செய்யுங்கள்' : 
                 language === 'si' ? 'මෙහි ලියාපදිංචි වන්න' : 
                 'Register here'}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
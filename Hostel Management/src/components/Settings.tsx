import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Moon, Sun, Globe, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { apiCall } from '../utils/supabase/client';
import { Language, getTranslation } from '../utils/translations';

interface User {
  id: string;
  name: string;
  registrationNumber?: string;
  username?: string;
  role: string;
}

interface SettingsProps {
  onBack: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  userRole: 'student' | 'security' | 'warden';
  user?: User;
  language: Language;
  onChangeLanguage: (language: Language) => void;
  colorBlindMode?: boolean;
  onToggleColorBlindMode?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack, theme, onToggleTheme, userRole, user, language, onChangeLanguage, colorBlindMode = false, onToggleColorBlindMode }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }

    setIsLoading(true);

    try {
      const identifier = userRole === 'student' ? user?.registrationNumber : user?.username;
      
      await apiCall('/update-password', {
        method: 'POST',
        body: {
          userType: userRole,
          identifier,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }
      });

      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1>{getTranslation(language, 'settings')}</h1>
      </div>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{getTranslation(language, 'appearance')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language Setting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5" />
              <div>
                <p className="text-sm">{getTranslation(language, 'language')}</p>
                <p className="text-xs text-muted-foreground">
                  {getTranslation(language, 'languageDescription')}
                </p>
              </div>
            </div>
            <Select value={language} onValueChange={(value: Language) => onChangeLanguage(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{getTranslation(language, 'english')}</SelectItem>
                <SelectItem value="ta">{getTranslation(language, 'tamil')}</SelectItem>
                <SelectItem value="si">{getTranslation(language, 'sinhala')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Theme Setting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <div>
                <p className="text-sm">{getTranslation(language, 'darkMode')}</p>
                <p className="text-xs text-muted-foreground">
                  {getTranslation(language, 'darkModeDescription')}
                </p>
              </div>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={onToggleTheme}
            />
          </div>

          {/* Color Blind Accessibility Setting */}
          {onToggleColorBlindMode && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5" />
                <div>
                  <p className="text-sm">{getTranslation(language, 'colorBlindMode')}</p>
                  <p className="text-xs text-muted-foreground">
                    {getTranslation(language, 'colorBlindModeDescription')}
                  </p>
                </div>
              </div>
              <Switch
                checked={colorBlindMode}
                onCheckedChange={onToggleColorBlindMode}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Reset */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>{getTranslation(language, 'resetPassword')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{getTranslation(language, 'currentPassword')}</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder={getTranslation(language, 'currentPassword')}
                  value={passwordData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">{getTranslation(language, 'newPassword')}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder={getTranslation(language, 'newPassword')}
                  value={passwordData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{getTranslation(language, 'confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={getTranslation(language, 'confirmPassword')}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? getTranslation(language, 'updating') : getTranslation(language, 'updatePassword')}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Settings;
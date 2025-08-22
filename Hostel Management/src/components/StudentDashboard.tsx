import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { KeyRound, KeySquare, Menu, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import NightPassForm from './NightPassForm';
import KeyForm from './KeyForm';
import Settings from './Settings';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { Language, getTranslation } from '../utils/translations';

interface User {
  id: string;
  name: string;
  registrationNumber?: string;
  role: string;
  roomNumber?: string;
}

interface StudentDashboardProps {
  user: User;
  accessToken: string;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  language: Language;
  onChangeLanguage: (language: Language) => void;
  colorBlindMode?: boolean;
  onToggleColorBlindMode?: () => void;
}

interface RoomData {
  id: string;
  number: string;
  keyAvailable: boolean;
  students: Array<{
    id: string;
    name: string;
    registrationNumber: string;
  }>;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  user, 
  accessToken,
  onLogout, 
  theme, 
  onToggleTheme,
  language,
  onChangeLanguage,
  colorBlindMode,
  onToggleColorBlindMode
}) => {
  const [currentView, setCurrentView] = useState<'home' | 'nightpass' | 'settings' | 'receiving-key' | 'giving-key'>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [buttonsEnabled, setButtonsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const sidebarItems = [
    { 
      id: 'nightpass', 
      label: 'Night Pass', 
      onClick: () => setCurrentView('nightpass')
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      onClick: () => setCurrentView('settings')
    }
  ];

  // Fetch room data
  useEffect(() => {
    fetchRoomData();
    checkAccess();
  }, [user.roomNumber]);

  const fetchRoomData = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e0452d3f/rooms/${user.roomNumber}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRoomData(data.room);
      }
    } catch (error) {
      console.error('Error fetching room data:', error);
      toast.error('Failed to load room data');
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e0452d3f/check-access/${user.roomNumber}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setButtonsEnabled(data.hasAccess);
      }
    } catch (error) {
      console.error('Error checking access:', error);
    }
  };

  const handleKeySubmit = async (type: 'receiving' | 'giving', formData: any) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e0452d3f/key-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          type,
          name: formData.name,
          registrationNumber: formData.registrationNumber,
          date: formData.date,
          time: formData.time,
          roomNumber: user.roomNumber
        })
      });

      if (response.ok) {
        toast.success(`Key ${type} recorded successfully!`);
        fetchRoomData(); // Refresh room data
        setButtonsEnabled(false); // Disable buttons after use
        setCurrentView('home');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to record key transaction');
      }
    } catch (error) {
      console.error('Error submitting key form:', error);
      toast.error('Failed to record key transaction');
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'nightpass':
        return (
          <NightPassForm 
            user={user} 
            accessToken={accessToken}
            onBack={() => setCurrentView('home')} 
          />
        );
      case 'settings':
        return (
          <Settings 
            onBack={() => setCurrentView('home')}
            theme={theme}
            onToggleTheme={onToggleTheme}
            userRole="student"
            user={user}
            language={language}
            onChangeLanguage={onChangeLanguage}
            colorBlindMode={colorBlindMode}
            onToggleColorBlindMode={onToggleColorBlindMode}
          />
        );
      case 'receiving-key':
        return (
          <KeyForm 
            type="receiving"
            user={user}
            onBack={() => setCurrentView('home')}
            onSubmit={(formData) => handleKeySubmit('receiving', formData)}
          />
        );
      case 'giving-key':
        return (
          <KeyForm 
            type="giving"
            user={user}
            onBack={() => setCurrentView('home')}
            onSubmit={(formData) => handleKeySubmit('giving', formData)}
          />
        );
      default:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Header - Mobile Optimized */}
            <div className="flex items-center justify-between">
              {/* Menu Button - Left Corner */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="p-2 h-10 w-10 flex-shrink-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              {/* User Info - Center */}
              <div className="flex-1 text-center mx-3">
                <h1 className="text-lg sm:text-xl font-medium truncate">Welcome, {user.name}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Reg: {user.registrationNumber}
                </p>
              </div>
              
              {/* Logout Button - Right Corner */}
              <Button 
                variant="ghost" 
                onClick={onLogout}
                className="p-2 h-10 w-10 flex-shrink-0"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>

            {loading ? (
              <div className="text-center p-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading room data...</p>
              </div>
            ) : roomData ? (
              <>
                {/* Room Status Card - Mobile Optimized */}
                <Card className={`rounded-2xl sm:rounded-3xl border-2 ${!roomData.keyAvailable ? 'bg-success/10 border-success/30' : 'bg-destructive/10 border-destructive/30'}`}>
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <div className="text-center mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl mb-1 sm:mb-2">Room {roomData.number}</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Key Status: {!roomData.keyAvailable ? 'With Students' : 'With Security'}
                      </p>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="text-base sm:text-lg text-center mb-3 sm:mb-4">Roommates</h3>
                      {roomData.students.map((roommate) => (
                        <div 
                          key={roommate.id}
                          className="flex justify-between items-center p-2 sm:p-3 bg-background/50 rounded-lg text-sm sm:text-base"
                        >
                          <span className="truncate flex-1 mr-2">{roommate.name}</span>
                          <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">
                            {roommate.registrationNumber}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Key Management Buttons - Mobile Optimized */}
                <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                  <Button
                    onClick={() => setCurrentView('receiving-key')}
                    disabled={!buttonsEnabled}
                    className="w-full h-14 sm:h-16 lg:h-20 flex flex-col gap-1 sm:gap-2 text-sm sm:text-base"
                    variant={!roomData.keyAvailable ? "secondary" : "default"}
                  >
                    <KeyRound className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                    <span>Receiving Room Key</span>
                  </Button>
                  
                  <Button
                    onClick={() => setCurrentView('giving-key')}
                    disabled={!buttonsEnabled}
                    className="w-full h-14 sm:h-16 lg:h-20 flex flex-col gap-1 sm:gap-2 text-sm sm:text-base"
                    variant={roomData.keyAvailable ? "secondary" : "default"}
                  >
                    <KeySquare className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                    <span>Giving Room Key</span>
                  </Button>
                </div>

                {!buttonsEnabled && (
                  <div className="text-center p-3 sm:p-4 bg-muted rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Key management buttons are disabled. Please wait for security to give access.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-8">
                <p className="text-sm text-muted-foreground">Failed to load room data</p>
                <Button onClick={fetchRoomData} className="mt-2">Retry</Button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        items={sidebarItems}
        title="Student Menu"
      />
      
      <div className="p-2 sm:p-4 lg:p-6 max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default StudentDashboard;
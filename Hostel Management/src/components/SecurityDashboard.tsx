import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Menu, LogOut, Users, Key, Clock, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Sidebar from './Sidebar';
import Settings from './Settings';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { Language, getTranslation } from '../utils/translations';

interface User {
  id: string;
  name: string;
  username?: string;
  role: string;
}

interface SecurityDashboardProps {
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

interface Room {
  id: string;
  number: string;
  keyAvailable: boolean;
  students: Array<{
    id: string;
    name: string;
    registrationNumber: string;
  }>;
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ 
  user, 
  accessToken,
  onLogout, 
  theme, 
  onToggleTheme,
  language,
  onChangeLanguage,
  colorBlindMode = false,
  onToggleColorBlindMode
}) => {
  const [currentView, setCurrentView] = useState<'home' | 'settings'>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [waitingForSubmission, setWaitingForSubmission] = useState(false);

  const sidebarItems = [
    { 
      id: 'settings', 
      label: getTranslation(language, 'settings'), 
      onClick: () => setCurrentView('settings')
    }
  ];

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e0452d3f/rooms`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms);
      } else {
        toast.error('Failed to load rooms');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error('Unable to connect to the server. Please check your internet connection.');
      } else {
        toast.error('Failed to load rooms');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setWaitingForSubmission(false);
  };

  const handleGiveAccess = async () => {
    if (!selectedRoom) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e0452d3f/give-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          roomNumber: selectedRoom.number
        })
      });

      if (response.ok) {
        toast.success('Access granted to students');
        setWaitingForSubmission(true);
        
        // Poll for form submission (simulate waiting)
        setTimeout(() => {
          // Simulate form submission
          toast.success('Student has submitted the form');
          fetchRooms(); // Refresh room data
          setWaitingForSubmission(false);
        }, 5000);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to grant access');
      }
    } catch (error) {
      console.error('Error granting access:', error);
      toast.error('Failed to grant access');
    }
  };

  const handleClosePopup = () => {
    setSelectedRoom(null);
    setWaitingForSubmission(false);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'settings':
        return (
          <Settings 
            onBack={() => setCurrentView('home')}
            theme={theme}
            onToggleTheme={onToggleTheme}
            userRole="security"
            user={user}
            language={language}
            onChangeLanguage={onChangeLanguage}
            colorBlindMode={colorBlindMode}
            onToggleColorBlindMode={onToggleColorBlindMode}
          />
        );
      default:
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <div>
                  <h1>{getTranslation(language, 'securityDashboard')}</h1>
                  <p className="text-sm text-muted-foreground">
                    {getTranslation(language, 'welcome')}, {user.name}
                  </p>
                </div>
              </div>
              <Button variant="ghost" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            {loading ? (
              <div className="text-center p-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">{getTranslation(language, 'loading')} rooms...</p>
              </div>
            ) : (
              <>
                {/* Rooms Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {rooms.map((room) => (
                    <Card
                      key={room.id}
                      className={`cursor-pointer transition-colors hover:shadow-md ${
                        room.keyAvailable 
                          ? 'bg-destructive/10 border-destructive/30' 
                          : 'bg-success/10 border-success/30'
                      }`}
                      onClick={() => handleRoomClick(room)}
                    >
                      <CardContent className="p-3 sm:p-4 text-center">
                        <h3 className="text-base sm:text-lg mb-2">{getTranslation(language, 'room')} {room.number}</h3>
                        <p className="text-xs text-muted-foreground">
                          {room.keyAvailable ? getTranslation(language, 'keyAvailable') : getTranslation(language, 'keyWithStudents')}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {getTranslation(language, 'greenKeyWithStudents')} | {getTranslation(language, 'redKeyAvailable')}
                  </p>
                </div>
              </>
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
        title={getTranslation(language, 'securityMenu')}
      />
      
      <div className="p-3 sm:p-4 lg:p-6 max-w-xs sm:max-w-6xl mx-auto">
        {renderCurrentView()}
      </div>

      {/* Enhanced Room Details Popup */}
      <Dialog open={!!selectedRoom} onOpenChange={() => !waitingForSubmission && handleClosePopup()}>
        <DialogContent className="sm:max-w-lg" aria-describedby="security-room-dialog-description">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">{getTranslation(language, 'room')} {selectedRoom?.number}</DialogTitle>
                <DialogDescription id="security-room-dialog-description" className="text-sm text-muted-foreground font-normal">
                  {getTranslation(language, 'accessControlPanel')}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {selectedRoom && (
            <div className="space-y-6">
              {/* Key Status Card */}
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3 mb-3">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">{getTranslation(language, 'keyStatus')}</h4>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{getTranslation(language, 'currentStatus')}</span>
                  <Badge 
                    variant={selectedRoom.keyAvailable ? "destructive" : "default"}
                    className="ml-2"
                  >
                    {selectedRoom.keyAvailable ? getTranslation(language, 'availableWithSecurity') : getTranslation(language, 'withStudents')}
                  </Badge>
                </div>
              </div>

              {/* Students List Card */}
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">{getTranslation(language, 'roomOccupants')}</h4>
                  <Badge variant="secondary" className="ml-auto">
                    {selectedRoom.students.length} {getTranslation(language, 'students')}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {selectedRoom.students.map((student, index) => (
                    <div key={student.id}>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.registrationNumber}</p>
                          </div>
                        </div>
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                      {index < selectedRoom.students.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Section */}
              {!waitingForSubmission && (
                <div className="space-y-4">
                  <Separator />
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-800 dark:text-blue-200">
                      <p className="font-medium mb-1">{getTranslation(language, 'securityProtocol')}</p>
                      <p>{getTranslation(language, 'securityProtocolDescription')}</p>
                    </div>
                  </div>
                  <Button onClick={handleGiveAccess} className="w-full h-11">
                    <Shield className="h-4 w-4 mr-2" />
                    {getTranslation(language, 'grantAccess')}
                  </Button>
                </div>
              )}

              {/* Waiting State */}
              {waitingForSubmission && (
                <div className="space-y-4">
                  <Separator />
                  <div className="text-center p-6 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center justify-center mb-3">
                      <Loader2 className="h-6 w-6 animate-spin text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                      {getTranslation(language, 'waitingForStudentResponse')}
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {getTranslation(language, 'waitingDescription')}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-3 text-xs text-amber-600 dark:text-amber-400">
                      <Clock className="h-3 w-3" />
                      <span>{getTranslation(language, 'monitoringSubmission')}</span>
                    </div>
                  </div>
                  <Button onClick={handleClosePopup} variant="outline" className="w-full h-11">
                    {getTranslation(language, 'cancelAndClose')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecurityDashboard;
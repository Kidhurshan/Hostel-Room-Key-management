import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Menu, LogOut, AlertCircle, Users, Key, Clock, Shield, CheckCircle, Crown, Moon, Calendar, MapPin, MessageCircle } from 'lucide-react';
import Sidebar from './Sidebar';
import Settings from './Settings';
import StudentManagement from './StudentManagement';
import SecurityManagement from './SecurityManagement';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { Language, getTranslation } from '../utils/translations';

interface User {
  id: string;
  name: string;
  username?: string;
  role: string;
}

interface WardenDashboardProps {
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
  hasNightPassRequest: boolean;
  students: Array<{
    id: string;
    name: string;
    registrationNumber: string;
  }>;
  nightPassRequest?: {
    studentName: string;
    registrationNumber: string;
    reason: string;
    date: string;
    arrivalTime: string;
    dispatchTime: string;
  };
}

const WardenDashboard: React.FC<WardenDashboardProps> = ({ 
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
  const [currentView, setCurrentView] = useState<'home' | 'students' | 'securities' | 'settings'>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const sidebarItems = [
    { 
      id: 'students', 
      label: getTranslation(language, 'studentManagement'), 
      onClick: () => setCurrentView('students')
    },
    { 
      id: 'securities', 
      label: getTranslation(language, 'hostelSecurities'), 
      onClick: () => setCurrentView('securities')
    },
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

  const handleRoomClick = async (room: Room) => {
    // Fetch detailed room data including night pass request
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e0452d3f/rooms/${room.number}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedRoom(data.room);
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
      setSelectedRoom(room);
    }
  };

  const handleAcceptNightPass = async () => {
    if (!selectedRoom) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e0452d3f/approve-night-pass`, {
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
        toast.success('Night pass approved successfully');
        setSelectedRoom(null);
        fetchRooms(); // Refresh room data
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to approve night pass');
      }
    } catch (error) {
      console.error('Error approving night pass:', error);
      toast.error('Failed to approve night pass');
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'students':
        return (
          <StudentManagement 
            accessToken={accessToken}
            onBack={() => setCurrentView('home')}
          />
        );
      case 'securities':
        return (
          <SecurityManagement 
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
            userRole="warden"
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
                  <h1>{getTranslation(language, 'wardenDashboard')}</h1>
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
                      className={`cursor-pointer transition-colors hover:shadow-md relative ${
                        room.keyAvailable 
                          ? 'bg-destructive/10 border-destructive/30' 
                          : 'bg-success/10 border-success/30'
                      }`}
                      onClick={() => handleRoomClick(room)}
                    >
                      <CardContent className="p-3 sm:p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <h3 className="text-base sm:text-lg">{getTranslation(language, 'room')} {room.number}</h3>
                          {room.hasNightPassRequest && (
                            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {room.keyAvailable ? getTranslation(language, 'keyAvailable') : getTranslation(language, 'keyWithStudents')}
                        </p>
                        {room.hasNightPassRequest && (
                          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                            {getTranslation(language, 'nightPassRequestText')}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {getTranslation(language, 'greenKeyWithStudents')} | {getTranslation(language, 'redKeyAvailable')} | {getTranslation(language, 'orangeAlert')}
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
        title={getTranslation(language, 'wardenMenu')}
      />
      
      <div className="p-3 sm:p-4 lg:p-6 max-w-xs sm:max-w-6xl mx-auto">
        {renderCurrentView()}
      </div>

      {/* Enhanced Room Details Popup */}
      <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="warden-room-dialog-description">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">{getTranslation(language, 'room')} {selectedRoom?.number}</DialogTitle>
                <DialogDescription id="warden-room-dialog-description" className="text-sm text-muted-foreground font-normal">
                  {getTranslation(language, 'wardenAdministrativePanel')}
                </DialogDescription>
              </div>
              {selectedRoom?.hasNightPassRequest && (
                <Badge variant="secondary" className="ml-auto bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {getTranslation(language, 'nightPassPending')}
                </Badge>
              )}
            </div>
          </DialogHeader>
          
          {selectedRoom && (
            <div className="space-y-6">
              {/* Room Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Key Status Card */}
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-3 mb-3">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">{getTranslation(language, 'keyStatus')}</h4>
                  </div>
                  <Badge 
                    variant={selectedRoom.keyAvailable ? "destructive" : "default"}
                    className="text-xs"
                  >
                    {selectedRoom.keyAvailable ? getTranslation(language, 'availableWithSecurity') : getTranslation(language, 'withStudents')}
                  </Badge>
                </div>

                {/* Occupancy Card */}
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">{getTranslation(language, 'occupancy')}</h4>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {selectedRoom.students.length} {getTranslation(language, 'students')}
                  </Badge>
                </div>
              </div>

              {/* Students List */}
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">{getTranslation(language, 'roomOccupants')}</h4>
                </div>
                
                <div className="space-y-3">
                  {selectedRoom.students.map((student, index) => (
                    <div key={student.id}>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.registrationNumber}</p>
                          </div>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      {index < selectedRoom.students.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Night Pass Request Section */}
              {selectedRoom.hasNightPassRequest && selectedRoom.nightPassRequest && (
                <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 rounded-xl border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                      <Moon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200">
                        {getTranslation(language, 'nightPassRequest')}
                      </h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        {getTranslation(language, 'pendingApproval')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Student Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <div>
                          <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                            {selectedRoom.nightPassRequest.studentName}
                          </p>
                          <p className="text-xs text-orange-700 dark:text-orange-300">
                            {selectedRoom.nightPassRequest.registrationNumber}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <div>
                          <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                            {new Date(selectedRoom.nightPassRequest.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-orange-700 dark:text-orange-300">
                            {getTranslation(language, 'date')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <div>
                          <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                            {selectedRoom.nightPassRequest.dispatchTime} - {selectedRoom.nightPassRequest.arrivalTime}
                          </p>
                          <p className="text-xs text-orange-700 dark:text-orange-300">
                            {getTranslation(language, 'dispatchReturnTime')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <MessageCircle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                            {selectedRoom.nightPassRequest.reason}
                          </p>
                          <p className="text-xs text-orange-700 dark:text-orange-300">
                            {getTranslation(language, 'reason')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-orange-200 dark:bg-orange-800 my-4" />
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={handleAcceptNightPass} 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white h-11"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {getTranslation(language, 'approveNightPass')}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-950 h-11"
                      onClick={() => setSelectedRoom(null)}
                    >
                      {getTranslation(language, 'reviewLater')}
                    </Button>
                  </div>
                </div>
              )}

              {/* No Night Pass - Info Section */}
              {!selectedRoom.hasNightPassRequest && (
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle className="h-4 w-4" />
                    <p className="text-sm font-medium">{getTranslation(language, 'allClear')}</p>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {getTranslation(language, 'noPendingRequests')}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WardenDashboard;
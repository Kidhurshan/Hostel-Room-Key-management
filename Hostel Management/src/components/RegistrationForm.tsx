import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { ArrowLeft } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface RegistrationFormProps {
  onBackToLogin: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    roomNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e0452d3f/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          name: formData.name,
          registrationNumber: formData.registrationNumber,
          roomNumber: formData.roomNumber,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Registration failed');
        setIsLoading(false);
        return;
      }

      toast.success('Registration submitted successfully! Please wait for warden approval.');
      
      // Redirect to login after successful registration
      setTimeout(() => {
        onBackToLogin();
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 bg-background">
      <Card className="w-full max-w-xs sm:max-w-md border-0 sm:border shadow-none sm:shadow-sm">
        <CardHeader className="p-3 sm:p-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToLogin}
              className="p-1 h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <CardTitle className="text-base sm:text-lg">Student Registration</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Register for hostel key management system
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="name" className="text-sm">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="registrationNumber" className="text-sm">Registration Number</Label>
              <Input
                id="registrationNumber"
                type="text"
                placeholder="Enter your registration number"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                required
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="roomNumber" className="text-sm">Room Number</Label>
              <Input
                id="roomNumber"
                type="text"
                placeholder="Enter your room number"
                value={formData.roomNumber}
                onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                required
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
            
            <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Register'}
            </Button>
          </form>
          
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground">
              Note: Your registration will be reviewed by the hostel warden. 
              You will be able to login once approved.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationForm;
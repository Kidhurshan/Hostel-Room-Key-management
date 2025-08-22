import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../utils/supabase/info';

interface User {
  id: string;
  name: string;
  registrationNumber?: string;
  roomNumber?: string;
}

interface NightPassFormProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

const NightPassForm: React.FC<NightPassFormProps> = ({ user, accessToken, onBack }) => {
  const [formData, setFormData] = useState({
    studentName: user.name,
    registrationNumber: user.registrationNumber || '',
    roomNumber: user.roomNumber || '',
    date: '',
    arrivalTime: '',
    dispatchTime: '',
    reason: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e0452d3f/night-pass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Night pass request submitted successfully!');
        onBack();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit night pass request');
      }
    } catch (error) {
      console.error('Error submitting night pass:', error);
      toast.error('Failed to submit night pass request');
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="p-2 h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg sm:text-xl font-medium">Night Pass Request</h1>
      </div>

      <Card className="border-0 sm:border shadow-none sm:shadow-sm">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Submit Night Pass Request</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="studentName" className="text-sm">Student Name</Label>
                <Input
                  id="studentName"
                  value={formData.studentName}
                  onChange={(e) => handleInputChange('studentName', e.target.value)}
                  required
                  disabled
                  className="h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="registrationNumber" className="text-sm">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  required
                  disabled
                  className="h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="roomNumber" className="text-sm">Room Number</Label>
              <Input
                id="roomNumber"
                value={formData.roomNumber}
                onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                required
                disabled
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="date" className="text-sm">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="dispatchTime" className="text-sm">Dispatch Time</Label>
                <Input
                  id="dispatchTime"
                  type="time"
                  value={formData.dispatchTime}
                  onChange={(e) => handleInputChange('dispatchTime', e.target.value)}
                  required
                  className="h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="arrivalTime" className="text-sm">Arrival Time</Label>
                <Input
                  id="arrivalTime"
                  type="time"
                  value={formData.arrivalTime}
                  onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                  required
                  className="h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="reason" className="text-sm">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Please provide the reason for night pass request"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                required
                className="min-h-16 sm:min-h-20 text-sm sm:text-base"
              />
            </div>

            <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Night Pass Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NightPassForm;
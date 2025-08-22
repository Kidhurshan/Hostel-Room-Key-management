import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft } from 'lucide-react';

interface User {
  id: string;
  name: string;
  registrationNumber?: string;
  roomNumber?: string;
}

interface KeyFormProps {
  type: 'receiving' | 'giving';
  user: User;
  onBack: () => void;
  onSubmit: (formData: any) => void;
}

const KeyForm: React.FC<KeyFormProps> = ({ type, user, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    registrationNumber: user.registrationNumber || '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5)
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await onSubmit(formData);
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const title = type === 'receiving' ? 'Receiving Room Key' : 'Giving Room Key';

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
        <h1 className="text-lg sm:text-xl font-medium">{title}</h1>
      </div>

      <Card className="border-0 sm:border shadow-none sm:shadow-sm">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="name" className="text-sm">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
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

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="date" className="text-sm">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                  className="h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="time" className="text-sm">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  required
                  className="h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={isLoading}>
              {isLoading ? 'Recording...' : `Record ${type === 'receiving' ? 'Receiving' : 'Giving'} Key`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyForm;
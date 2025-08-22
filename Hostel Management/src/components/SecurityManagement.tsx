import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';
import { ArrowLeft, Plus, Trash2, Shield, User, Phone, Lock, UserCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../utils/supabase/info';

interface SecurityManagementProps {
  accessToken: string;
  onBack: () => void;
}

interface Security {
  id: string;
  name: string;
  phoneNumber: string;
  username: string;
}

const SecurityManagement: React.FC<SecurityManagementProps> = ({ accessToken, onBack }) => {
  const [securities, setSecurities] = useState<Security[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newSecurity, setNewSecurity] = useState({
    name: '',
    phoneNumber: '',
    username: '',
    password: ''
  });

  useEffect(() => {
    fetchSecurities();
  }, []);

  const fetchSecurities = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e0452d3f/securities`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSecurities(data.securities);
      } else {
        toast.error('Failed to load security guards');
      }
    } catch (error) {
      console.error('Error fetching securities:', error);
      toast.error('Failed to load security guards');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSecurity.name || !newSecurity.phoneNumber || !newSecurity.username || !newSecurity.password) {
      toast.error('Please fill in all fields!');
      return;
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e0452d3f/add-security`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(newSecurity)
      });

      if (response.ok) {
        toast.success('Security guard added successfully!');
        setNewSecurity({ name: '', phoneNumber: '', username: '', password: '' });
        setIsAddDialogOpen(false);
        fetchSecurities(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to add security guard');
      }
    } catch (error) {
      console.error('Error adding security:', error);
      toast.error('Failed to add security guard');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewSecurity(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1>Security Management</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Hostel Securities</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Security
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl">Add Security Guard</DialogTitle>
                      <p className="text-sm text-muted-foreground font-normal">Create new security personnel account</p>
                    </div>
                  </div>
                </DialogHeader>
                
                <form onSubmit={handleAddSecurity} className="space-y-6">
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium text-sm">Personal Information</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter security guard's full name"
                        value={newSecurity.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="Enter contact phone number"
                        value={newSecurity.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Account Credentials Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium text-sm">Account Credentials</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="Enter unique username for login"
                        value={newSecurity.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter secure password"
                        value={newSecurity.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-800 dark:text-blue-200">
                        <p className="font-medium mb-1">Security Guidelines</p>
                        <p>New security guard will have access to room monitoring and key management functions.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                      className="flex-1 h-11"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 h-11">
                      <Shield className="h-4 w-4 mr-2" />
                      Add Security
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center p-8">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading security guards...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {securities.map((security) => (
                  <TableRow key={security.id}>
                    <TableCell>{security.name}</TableCell>
                    <TableCell>{security.phoneNumber}</TableCell>
                    <TableCell>{security.username}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled
                        title="Remove functionality disabled in demo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityManagement;
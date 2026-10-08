
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Edit } from 'lucide-react';
import { User as AuthUser } from '@supabase/supabase-js';
import { Profile } from '@/types/database';

interface UserAccountCardProps {
  user: AuthUser;
  profile: Profile;
  onEditProfile: () => void;
}

const UserAccountCard = ({ user, profile, onEditProfile }: UserAccountCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <User size={20} />
            <span>Account Information</span>
          </CardTitle>
          <Button onClick={onEditProfile} variant="outline" size="sm">
            <Edit size={16} className="mr-2" />
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 rounded-full bg-swati-purple/10 flex items-center justify-center">
            {profile?.profile_image ? (
              <img
                src={profile.profile_image}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <User size={24} className="text-swati-purple" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{profile?.full_name || 'No name set'}</h3>
            <div className="flex items-center space-x-2">
              <Mail size={14} className="text-gray-500" />
              <span className="text-sm text-gray-600">{user.email}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Account Type</p>
            <Badge variant={profile?.is_artist ? 'default' : 'secondary'}>
              {profile?.is_artist ? 'Artist' : 'Client'}
            </Badge>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700 flex items-center">
              <Calendar size={14} className="mr-1" />
              Member Since
            </p>
            <p className="text-sm text-gray-600">
              {new Date(user.created_at!).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAccountCard;

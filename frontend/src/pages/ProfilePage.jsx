import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Upload, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const ProfilePage = () => {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await profileService.getProfile();
      setProfile(profileData);
      setEditedName(profileData.name);
      setAvatarFile(null);
      
      // Set avatar preview with full URL
      if (profileData.avatarUrl) {
        const avatarUrl = profileData.avatarUrl.startsWith('http') 
          ? profileData.avatarUrl 
          : `http://localhost:8080${profileData.avatarUrl}`;
        setAvatarPreview(avatarUrl);
      } else {
        setAvatarPreview(null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const updated = await profileService.updateProfile(editedName, avatarFile);
      setProfile(updated);
      setIsEditing(false);
      setAvatarFile(null);
      
      // Update avatar preview with full URL
      if (updated.avatarUrl) {
        // If avatarUrl already includes http://, use it as is, otherwise prepend base URL
        const avatarUrl = updated.avatarUrl.startsWith('http') 
          ? updated.avatarUrl 
          : `http://localhost:8080${updated.avatarUrl}`;
        setAvatarPreview(avatarUrl);
      } else {
        setAvatarPreview(null);
      }
      
      // Update auth context if needed
      if (authUser) {
        authUser.name = updated.name;
        authUser.avatarUrl = updated.avatarUrl;
        localStorage.setItem('apeer_user', JSON.stringify(authUser));
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB.');
        return;
      }
      
      setAvatarFile(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    const route = authUser?.role === 'admin' ? '/admin' 
                : authUser?.role === 'teacher' ? '/teacher' 
                : '/student';
    navigate(route);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Card className="max-w-md">
          <p className="text-red-400">Failed to load profile</p>
          <Button onClick={handleBack} className="mt-4">Go Back</Button>
        </Card>
      </div>
    );
  }

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'teacher':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card spotlight className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Avatar & Role */}
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    {avatarPreview || profile.avatarUrl ? (
                      <img
                        src={avatarPreview || (profile.avatarUrl?.startsWith('http') ? profile.avatarUrl : `http://localhost:8080${profile.avatarUrl}`)}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-teal-500/50"
                        onError={(e) => {
                          // Fallback to initial if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-32 h-32 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-4xl font-bold ${avatarPreview || profile.avatarUrl ? 'hidden' : ''}`}
                    >
                      {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    {isEditing && (
                      <motion.label
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center hover:bg-teal-600 transition-colors cursor-pointer"
                        title="Upload Profile Picture"
                      >
                        <Upload className="w-5 h-5 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </motion.label>
                    )}
                  </div>
                  
                  <div className={`px-4 py-2 rounded-full border text-sm font-medium ${getRoleBadgeColor(profile.role)}`}>
                    {profile.role?.toUpperCase() || 'STUDENT'}
                  </div>
                  
                  {profile.joinedDate && (
                    <div className="mt-4 flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(profile.joinedDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Profile Info */}
              <div className="md:col-span-2">
                <div className="space-y-6">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    ) : (
                      <div className="p-3 bg-gray-900/50 rounded-lg text-white">
                        {profile.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <div className="p-3 bg-gray-900/50 rounded-lg text-gray-400">
                      {profile.email}
                      <span className="ml-2 text-xs text-gray-500">(Cannot be changed)</span>
                    </div>
                  </div>

                  {profile.department && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Department
                      </label>
                      <div className="p-3 bg-gray-900/50 rounded-lg text-gray-400">
                        {profile.department}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex-1"
                        >
                          {isSaving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setIsEditing(false);
                            setEditedName(profile.name);
                            setAvatarFile(null);
                            if (profile?.avatarUrl) {
                              const avatarUrl = profile.avatarUrl.startsWith('http') 
                                ? profile.avatarUrl 
                                : `http://localhost:8080${profile.avatarUrl}`;
                              setAvatarPreview(avatarUrl);
                            } else {
                              setAvatarPreview(null);
                            }
                            setError(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="flex-1"
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;


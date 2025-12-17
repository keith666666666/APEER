import api from './api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const profileService = {
  async getProfile() {
    if (USE_MOCK) {
      return {
        id: '1',
        name: 'Mock User',
        email: 'mock@example.com',
        role: 'student',
        department: null,
        avatarUrl: null,
        joinedDate: new Date().toISOString()
      };
    }

    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  async updateProfile(name, avatarFile) {
    if (USE_MOCK) {
      return {
        id: '1',
        name: name || 'Mock User',
        email: 'mock@example.com',
        role: 'student',
        department: null,
        avatarUrl: avatarFile ? URL.createObjectURL(avatarFile) : null,
        joinedDate: new Date().toISOString()
      };
    }

    try {
      const formData = new FormData();
      if (name) {
        formData.append('name', name);
      }
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await api.put('/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};


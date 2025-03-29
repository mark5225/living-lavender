let users = [
    {
      id: '1',
      email: 'demo@example.com',
      password: 'password123',
      firstName: 'Demo',
      lastName: 'User',
      profile: {
        bio: 'This is a demo user profile.',
        photos: [{ url: '/images/demo-profile.jpg' }],
        interests: ['Travel', 'Music', 'Cooking'],
        location: 'New York',
        gender: 'non-binary',
        birthdate: '1990-01-01',
      }
    }
  ];
  
  export const mockAuthService = {
    login: async (email, password) => {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        return { success: true, user: userWithoutPassword };
      }
      return { success: false, error: 'Invalid email or password' };
    },
    
    register: async (userData) => {
      // Check if user already exists
      if (users.some(u => u.email === userData.email)) {
        return { success: false, error: 'Email already in use' };
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        profile: {
          // Default profile
        }
      };
      
      users.push(newUser);
      const { password, ...userWithoutPassword } = newUser;
      return { success: true, user: userWithoutPassword };
    },
    
    updateProfile: async (userId, profileData) => {
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].profile = {
          ...users[userIndex].profile,
          ...profileData
        };
        return { success: true, profile: users[userIndex].profile };
      }
      return { success: false, error: 'User not found' };
    },
    
    getProfile: async (userId) => {
      const user = users.find(u => u.id === userId);
      if (user) {
        return { success: true, profile: user.profile };
      }
      return { success: false, error: 'User not found' };
    }
  };
// services/api.ts

import axios from 'axios';

// Base API URL
const apiBaseUrl = "https://app.mazzl.ae/api";

// API call to send user data
export const sendUserData = async (userData: any) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/telegram-user`, userData);
    console.log('User data saved:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

// API call to update referral details
export const updateReferralDetails = async (payload: any) => {
  try {
    const response = await axios.put(`${apiBaseUrl}/telegram-user/update-referrer-details`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Referral details updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating referral details:', error);
    throw error;
  }
};

// API call to handle referrals (POST)
export const handleReferral = async (userId: string, referrerId: string) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/referrals`, { userId, referrerId });
    console.log('Referral processed:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error processing referral:', error);
    throw error;
  }
};

export const fetchTelegramUser = async (userId: string) => {
    try {
      const response = await axios.get(`https://app.mazzl.ae/api/telegram-user/${userId || ""}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error; // Re-throw error for further handling
    }
  };


  // update reffered by data

  export const updateRefferedBy = async (payload: any) => {
    const { userId, refferedby } = payload;
    try {
      const response = await axios.put(`${apiBaseUrl}/update-referredBy/${userId}`, refferedby, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Referral details updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating referral details:', error);
      throw error;
    }
  };
  export const updateRefferedUnlock = async (payload: any) => {
    const { userId, refferUnlock } = payload;
    try {
      const response = await axios.put(`${apiBaseUrl}/update-referalUnlock/${userId}`, refferUnlock, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Referral details updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating referral details:', error);
      throw error;
    }
  };

  export const updateCredit = async (payload: any) => {
    const { userId, credit } = payload;
    try {
      const response = await axios.put(`${apiBaseUrl}/update-credit/${userId}`, credit, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Referral details updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating referral details:', error);
      throw error;
    }
  };

  export const updateLastGamePlay = async (payload: any) => {
    try {
      const response = await axios.put(`${apiBaseUrl}/last-game-played/${payload}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Referral details updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating referral details:', error);
      throw error;
    }
  };

  
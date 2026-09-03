import React, { createContext, useState, useContext } from 'react';
import { InterstitialAd, RewardedAd } from '../components/Ads/AdModals';

const AdContext = createContext();

export const AdProvider = ({ children }) => {
  const [interstitialVisible, setInterstitialVisible] = useState(false);
  const [rewardedVisible, setRewardedVisible] = useState(false);
  const [rewardCallback, setRewardCallback] = useState(null);

  const showInterstitial = () => {
    return new Promise((resolve) => {
      setInterstitialVisible(true);
      setTimeout(() => {
        setInterstitialVisible(false);
        resolve(true);
      }, 3000);
    });
  };

  const showRewardedVideo = () => {
    return new Promise((resolve) => {
      setRewardedVisible(true);
      setRewardCallback(() => resolve);
    });
  };

  const handleReward = () => {
    if (rewardCallback) {
      rewardCallback(true);
      setRewardCallback(null);
    }
  };

  const handleRewardClose = () => {
    setRewardedVisible(false);
    if (rewardCallback) {
      rewardCallback(false);
      setRewardCallback(null);
    }
  };

  return (
    <AdContext.Provider value={{ showInterstitial, showRewardedVideo }}>
      {children}
      <InterstitialAd visible={interstitialVisible} onClose={() => setInterstitialVisible(false)} />
      <RewardedAd 
        visible={rewardedVisible} 
        onClose={handleRewardClose}
        onReward={handleReward}
      />
    </AdContext.Provider>
  );
};

export const useAds = () => useContext(AdContext);

export const state = {
    currentAdventurer: null,
    currentUserMaxRing: 1,
    cart: [],
    activeShops: [],
    currentShopIndex: 0,
    currentItem: null,
    activeDiscount: 0,
    hasSpunWheel: false,
    loginAttempts: 0,
    loginAttempts: 0,
    // userGold: Removed in favor of playerState.gold (Persistent)
    // userBloodCoins: Removed in favor of playerState.bloodCoins (Persistent)
    currentRing: 1 // Default to 1
};

export const constants = {
    MAX_ATTEMPTS: 3
};

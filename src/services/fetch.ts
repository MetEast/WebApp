export const getElaUsdRate = async () => {
    try {
        const resElaUsdRate = await fetch(`${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getLatestElaPrice`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const dataElaUsdRate = await resElaUsdRate.json();
        
        if (dataElaUsdRate && dataElaUsdRate.data) return parseFloat(dataElaUsdRate.data);
        return NaN;
      } catch (error) {
        return NaN;
      }
};

export const getMyFavouritesList = async (loginState: boolean, did: string) => {
    const strDid = loginState ? did : '------------------';
    const resFavouriteList = await fetch(
        `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getFavoritesCollectible?did=${strDid}`,
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        },
    );
    const dataFavouriteList = await resFavouriteList.json();
    return dataFavouriteList.data.result;
};

export const getTotalEarned = async (address: string) => {
    const resTotalEarnedResult = await fetch(
        `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getEarnedByWalletAddress?address=${address}`,
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        },
    );
    const dataTotalEarnedResult = await resTotalEarnedResult.json();
    return dataTotalEarnedResult.data;
};

export const getTodayEarned = async (address: string) => {
    const resTodayEarnedResult = await fetch(
        `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getTodayEarnedByWalletAddress?address=${address}`,
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        },
    );
    const dataTodayEarnedResult = await resTodayEarnedResult.json();
    return dataTodayEarnedResult.data;
};

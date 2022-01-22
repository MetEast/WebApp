export const getElaUsdRate = async () => {
    const resElaUsdRate = await fetch(`${process.env.REACT_APP_ELASTOS_LATEST_PRICE_API_URL}`, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }
    });
    const dataElaUsdRate = await resElaUsdRate.json();
    return parseFloat(dataElaUsdRate.result.coin_usd);
};

export const getViewsAndLikes = async (tokenIds: Array<string>) => {
    const resViewsAndLikes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getViewsLikesCountOfTokens?tokenIds=${tokenIds.join(",")}`, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }
    });
    const dataViewsAndLikes = await resViewsAndLikes.json();
    return dataViewsAndLikes.data;
};

export const getMyFavouritesList = async (loginState: boolean, did: string) => {
    const strDid = loginState ? did : '------------------';
    const resFavouriteList = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getFavoritesCollectible?did=${strDid}`, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }
    });
    const dataFavouriteList = await resFavouriteList.json();
    return dataFavouriteList.data;
};
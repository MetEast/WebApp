export const FETCH_CONFIG_JSON = {
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
};

export const getELA2USD = async () => {
    try {
        const resElaUsdRate = await fetch(`${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getLatestElaPrice`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const dataElaUsdRate = await resElaUsdRate.json();

        if (dataElaUsdRate && dataElaUsdRate.data) return parseFloat(dataElaUsdRate.data);
        return 0;
    } catch (error) {
        return 0;
    }
};

export const getMyFavouritesList = async (loginState: boolean, did: string) => {
    if (loginState) {
        try {
            const resFavouriteList = await fetch(
                `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getFavoritesCollectible?did=${did}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                },
            );
            const dataFavouriteList = await resFavouriteList.json();
            return dataFavouriteList.data.result;
        } catch (error) {
            return [];
        }
    } else return [];
};

export const getTotalEarned = async (address: string) => {
    try {
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
        if (dataTotalEarnedResult && dataTotalEarnedResult.data) return parseFloat(dataTotalEarnedResult.data);
        return 0;
    } catch (error) {
        return 0;
    }
};

export const getTodayEarned = async (address: string) => {
    try {
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
        if (dataTodayEarnedResult && dataTodayEarnedResult.data) return parseFloat(dataTodayEarnedResult.data);
        return 0;
    } catch (error) {
        return 0;
    }
};

export const uploadUserProfile = (
    token: string,
    did: string,
    name: string,
    description: string,
    _urlAvatar: string,
    _urlCoverImage: string,
) =>
    new Promise((resolve, reject) => {
        const reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/updateUserProfile`;
        const reqBody = {
            token: token,
            did: did,
            name: name,
            description: description,
            avatar: _urlAvatar,
            coverImage: _urlCoverImage,
        };
        fetch(reqUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqBody),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.code === 200) {
                    resolve(data.token);
                } else {
                    reject(data);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });

export const url2FileObject = async (imgUrl: string) => {
    const response = await fetch(imgUrl);
    // here image is url/location of image
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });
    return file;
};

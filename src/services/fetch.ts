import { useCallback } from "react";
// const [elaPrice, setElaPrice] = useState<number>(0);
// export const getELA2USD = useCallback(async () => {
//     try {
//         const resElaUsdRate = await fetch(`${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getLatestElaPrice`, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 Accept: 'application/json',
//             },
//         });
//         const dataElaUsdRate = await resElaUsdRate.json();

//         if (dataElaUsdRate && dataElaUsdRate.data) return parseFloat(dataElaUsdRate.data);
//         return NaN;
//     } catch (error) {
//         return NaN;
//     }
// }, []);

export const FETCH_CONFIG_JSON = {
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
}

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

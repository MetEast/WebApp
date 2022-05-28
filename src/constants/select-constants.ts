import { TypeSelectItem } from 'src/types/select-types';

export enum enmSortOptionValues {
    low_to_high = 'low_to_high',
    high_to_low = 'high_to_low',
    most_viewed = 'most_viewed',
    most_liked = 'most_liked',
    most_recent = 'most_recent',
    oldest = 'oldest',
    ending_soon = 'ending_soon',
}

export const sortOptions: Array<TypeSelectItem> = [
    {
        label: 'Price: Low to high',
        value: enmSortOptionValues.low_to_high,
    },
    {
        label: 'Price: High to low',
        value: enmSortOptionValues.high_to_low,
    },
    {
        label: 'Most Viewed',
        value: enmSortOptionValues.most_viewed,
    },
    {
        label: 'Most Liked',
        value: enmSortOptionValues.most_liked,
    },
    {
        label: 'Most Recent',
        value: enmSortOptionValues.most_recent,
    },
    {
        label: 'Oldest',
        value: enmSortOptionValues.oldest,
    },
    // {
    //     label: 'Ending Soon',
    //     value: enmSortOptionValues.ending_soon,
    // },
];

export const mintNFTCategoryOptions: Array<TypeSelectItem> = [
    {
        label: 'Original',
        value: 'Original',
        icon: 'ph:fingerprint',
    },
    {
        label: 'Museum',
        value: 'Museum',
        icon: 'ph:bank',
    },
    {
        label: 'Arts',
        value: 'Arts',
        icon: 'ph:paint-brush',
    },
    {
        label: 'Sports',
        value: 'Sports',
        icon: 'ph:football',
    },
    {
        label: 'Dimension',
        value: 'Dimension',
        icon: 'ph:line-segments',
    },
    {
        label: 'Pets',
        value: 'Pets',
        icon: 'ph:paw-print',
    },
    {
        label: 'Recreation',
        value: 'Recreation',
        icon: 'ph:video-camera',
    },
    {
        label: 'Star',
        value: 'Star',
        icon: 'ph:star',
    },
    {
        label: 'Other',
        value: 'Other',
        icon: 'ph:leaf',
    },
];

export const sellNFTSaleEndsOptions: Array<TypeSelectItem> = [
    {
        label: '1 day',
        value: '1 day',
    },
    {
        label: '1 week',
        value: '1 week',
    },
    {
        label: '1 month',
        value: '1 month',
    },
];

export const auctionNFTExpirationOptions: Array<TypeSelectItem> = [
    {
        label: '7 days',
        value: '7 days',
    },
    {
        label: '3 days',
        value: '3 days',
    },
    {
        label: '1 day',
        value: '1 day',
    },
];

export const priceHistoryUnitSelectOptions: Array<TypeSelectItem> = [
    {
        label: 'Daily',
        value: 'Daily',
    },
    {
        label: 'Weekly',
        value: 'Weekly',
    },
    {
        label: 'Monthly',
        value: 'Monthly',
    },
];

export const viewAllDlgSortOptions: Array<TypeSelectItem> = [
    {
        label: 'Price: Low to high',
        value: enmSortOptionValues.low_to_high,
    },
    {
        label: 'Price: High to low',
        value: enmSortOptionValues.high_to_low,
    },
    {
        label: 'Most Recent',
        value: enmSortOptionValues.most_recent,
    },
    {
        label: 'Oldest',
        value: enmSortOptionValues.oldest,
    },
];

export const adminNftStateOptions: Array<TypeSelectItem> = [
    {
        label: 'online',
        value: 'online',
    },
    {
        label: 'removed',
        value: 'removed',
    },
];

export const adminNftSaleTypeOptions: Array<TypeSelectItem> = [
    {
        label: 'Buy now',
        value: 'Buy now',
    },
    {
        label: 'On auction',
        value: 'On auction',
    },
];

export enum nftGalleryFilterBtnTypes {
    All = 'All',
    Acquired = 'Owned',
    Created = 'Created',
    ForSale = 'For Sale',
    Sold = 'Sold',
    Liked = 'Liked'
}

export const nftGalleryFilterButtons = [
    { label: nftGalleryFilterBtnTypes.All, value: 46 },
    { label: nftGalleryFilterBtnTypes.Acquired, value: 28 },
    { label: nftGalleryFilterBtnTypes.Created, value: 28 },
    { label: nftGalleryFilterBtnTypes.ForSale, value: 14 },
    { label: nftGalleryFilterBtnTypes.Sold, value: 14 },
    { label: nftGalleryFilterBtnTypes.Liked, value: 14 },
];

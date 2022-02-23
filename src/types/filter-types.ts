export enum enmFilterOption {
    onAuction,
    buyNow,
    hasBids,
    new,
}

export type TypeFilterRange = {
    min: number | undefined,
    max: number | undefined,
};

export const filterStatusButtons = [
    { title: 'Buy Now', icon: 'ph:lightning' },
    { title: 'ON auction', icon: 'ph:scales' },
    { title: 'Is new', icon: 'ph:lightning' },
    { title: 'Has Bids', icon: 'ph:ticket' },
];
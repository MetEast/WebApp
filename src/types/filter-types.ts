export enum enumFilterOption {
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
    // { title: 'Has Bids', icon: 'ph:ticket' },
];
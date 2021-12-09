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
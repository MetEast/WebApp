export enum enumMetEastContractType {
    METEAST = 1,
    METEAST_MARKET = 2,
};

export enum enumMETokenContractType {
    MET_BASE = 1,
    MET_VESTING = 2,
    MET_STAKING = 3,
    MET_MINING_REWARD = 4,
};

export enum enumCallMethodType {
    SEND = 1,
    CALL = 2,
};

export type TypeMiningReward = {
    lastReceipt: number;
    availableToken: number;
    availablePrice: number;
    receivedReward: number;
};
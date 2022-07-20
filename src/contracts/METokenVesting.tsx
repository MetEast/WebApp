export const METEAST_VESTING_TOKEN_CONTRACT_ABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'token_',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'Paused',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'beneficiaryAddress',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'Released',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'Unpaused',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'currentTime',
                type: 'uint256',
            },
        ],
        name: 'getDailyReleasableAmountForMiningPool',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'beneficiaryString',
                type: 'string',
            },
        ],
        name: 'getReleasableAmount',
        outputs: [
            {
                internalType: 'uint256',
                name: '_releasable',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'beneficiaryString',
                type: 'string',
            },
        ],
        name: 'getReleaseInfo',
        outputs: [
            {
                internalType: 'address',
                name: 'beneficiary',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'releasable',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'released',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'total',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getStartTime',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getToken',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'beneficiaryString',
                type: 'string',
            },
            {
                internalType: 'uint256',
                name: 'scheduleId',
                type: 'uint256',
            },
        ],
        name: 'getVestingSchedule',
        outputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'totalAmount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'startTime',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'duration',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct VestingSchedule',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'beneficiaryString',
                type: 'string',
            },
        ],
        name: 'getVestingSchedulesCount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getWithdrawableAmount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'startTime_',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'miningPoolAddr_',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'marketerAddr_',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'daoAddr_',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'foundationAddr_',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'ecoAddr_',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'teamAddr_',
                type: 'address',
            },
        ],
        name: 'initialize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'pause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'paused',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'releaseDao',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'releaseEco',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'releaseFoundation',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'releaseMarketer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'releaseMiningPool',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'releaseTeam',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'miningPoolAddr_',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'marketerAddr_',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'daoAddr_',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'foundationAddr_',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'ecoAddr_',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'teamAddr_',
                type: 'address',
            },
        ],
        name: 'setBeneficiaryAddress',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'unpause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

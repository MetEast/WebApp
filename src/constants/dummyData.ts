import { TypeNotification } from 'src/types/notification-types';
import {
    TypeProduct,
    TypeNFTTransaction,
    TypeSingleNFTBid,
    TypeBlindBoxSelectItem,
    enumBlindBoxNFTType,
    enumSingleNFTType,
    enumMyNFTType,
    enumTransactionType,
} from 'src/types/product-types';

export const dummyNotificationList: Array<TypeNotification> = [
    {
        title: 'You have a new bid!',
        content: 'Your CryptoGirl#19 project has just been bid by a VKWR909981 user for E 100.00',
        date: '2021-09-03',
    },
    {
        title: 'New sale!',
        content: 'Your CryptoGirl#19 project has just been bid by a VKWR909981 user for E 100.00',
        date: '2021-09-03',
    },
    {
        title: 'New Mistery Box!',
        content: 'Your CryptoGirl#19 project has just been bid by a VKWR909981 user for E 100.00',
        date: '2021-09-03',
        isRead: true,
    },
    {
        title: 'Royalties Received!',
        content: 'Your CryptoGirl#19 project has just been bid by a VKWR909981 user for E 100.00',
        date: '2021-09-03',
        isRead: true,
    },
];


export const nftTransactions: Array<TypeNFTTransaction> = [
    {
        type: enumTransactionType.Bid,
        user: 'Nickname',
        price: 199,
        time: '2022/02/28 10:00',
        txHash: '0x111111111111111111',
    },
    {
        type: enumTransactionType.OnAuction,
        user: 'Nickname',
        price: 199,
        time: '2022/02/28 10:00',
        txHash: '0x111111111111111111',
    },
    {
        type: enumTransactionType.SoldTo,
        user: 'Nickname',
        price: 199,
        time: '2022/02/28 10:00',
        txHash: '0x111111111111111111',
    },
    {
        type: enumTransactionType.ForSale,
        user: 'Nickname',
        price: 199,
        time: '2022/02/28 10:00',
        txHash: '0x111111111111111111',
    },
    {
        type: enumTransactionType.CreatedBy,
        user: 'Nickname',
        price: 199,
        time: '2022/02/28 10:00',
        txHash: '0x111111111111111111',
    },
];

export const singleNFTBids: Array<TypeSingleNFTBid> = [
    { user: 'Nickname', price: 199, time: '2022/02/28  10:00', orderId: '' },
    { user: 'Nickname', price: 199, time: '2022/02/28  10:00', orderId: '' },
    { user: 'Nickname', price: 199, time: '2022/02/28  10:00', orderId: '' },
    { user: 'Nickname', price: 199, time: '2022/02/28  10:00', orderId: '' },
    { user: 'Nickname', price: 199, time: '2022/02/28  10:00', orderId: '' },
    { user: 'Nickname', price: 199, time: '2022/02/28  10:00', orderId: '' },
];

export const testItemsList: Array<TypeBlindBoxSelectItem> = [
    {
        id: 1,
        tokenId: '32459024',
        nftIdentity: 'NFT Identity',
        projectTitle: 'Project Title',
        projectType: 'Project Type',
        url: '/assets/images/blindbox/blindbox-nft-template1.png',
    },
    {
        id: 2,
        tokenId: '32459024',
        nftIdentity: 'NFT Identity',
        projectTitle: 'Project Title',
        projectType: 'Project Type',
        url: '/assets/images/blindbox/blindbox-nft-template2.png',
    },
    {
        id: 3,
        tokenId: '32459024',
        nftIdentity: 'NFT Identity',
        projectTitle: 'Project Title',
        projectType: 'Project Type',
        url: '/assets/images/blindbox/blindbox-nft-template3.png',
    },
    {
        id: 4,
        tokenId: '32459024',
        nftIdentity: 'NFT Identity',
        projectTitle: 'Project Title',
        projectType: 'Project Type',
        url: '/assets/images/blindbox/blindbox-nft-template4.png',
    },
    {
        id: 5,
        tokenId: '32459024',
        nftIdentity: 'NFT Identity',
        projectTitle: 'Project Title',
        projectType: 'Project Type',
        url: '/assets/images/blindbox/blindbox-nft-template2.png',
    },
    {
        id: 6,
        tokenId: '32459024',
        nftIdentity: 'NFT Identity',
        projectTitle: 'Project Title',
        projectType: 'Project Type',
        url: '/assets/images/blindbox/blindbox-nft-template2.png',
    },
    {
        id: 7,
        tokenId: '32459024',
        nftIdentity: 'NFT Identity',
        projectTitle: 'Project Title',
        projectType: 'Project Type',
        url: '/assets/images/blindbox/blindbox-nft-template2.png',
    },
    {
        id: 8,
        tokenId: '32459024',
        nftIdentity: 'NFT Identity',
        projectTitle: 'Project Title',
        projectType: 'Project Type',
        url: '/assets/images/blindbox/blindbox-nft-template2.png',
    },
    {
        id: 9,
        tokenId: '32459024',
        nftIdentity: 'NFT Identity',
        projectTitle: 'Project Title',
        projectType: 'Project Type',
        url: '/assets/images/blindbox/blindbox-nft-template2.png',
    },
];

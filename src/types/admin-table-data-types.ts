import React from 'react';
import { enumBadgeType } from 'src/types/product-types';

export type AdminTableColumn = {
    id: string;
    label: string;
    cell?: (props: any) => React.ReactNode;
    width?: number;
};

export type AdminNFTItemType = {
    id: number; // required
    tokenId: string;
    token_id: string;
    nft_title: string;
    nft_image: string;
    selling_price: number;
    nft_owner: string;
    nft_creator: string;
    orderId: string;
    created_date: string;
    listed_date: string;
    likes: number;
    views: number;
    sale_type: enumBadgeType.BuyNow | enumBadgeType.OnAuction;
    status: 'Online' | 'Removed';
};

export type AdminUsersItemType = {
    id: number; // required
    address: string;
    username: string;
    avatar: string;
    status: number;
    remarks: string;
};

export type AdminBlindBoxItemType = {
    id: number; // required
    blindbox_id: string;
    blindbox_name: string;
    status: string;
    price: number;
    sale_begins: string;
    sale_ends: string;
    transactions: number;
    purchases: number;
    available: number;
    latest_trans_time: string;
    liked: number;
    page_views: number;
};

export type AdminHomeItemType = {
    id: number; // required
    project_title: string;
    project_type: string;
    sort: number;
    created: string;
};

export type AdminOrdersBlindBoxItemType = {
    id: number; // required
    blindbox_id: string;
    blindbox_title: string;
    status: string;
    order_amount: number;
    created: string;
    buyer_id: string;
    purchases: number;
    buyer_nickname: string;
    seller_nickname: string;
};

export type AdminBidsItemType = {
    id: number; // required
    nft_identity: string;
    project_title: string;
    buyer: string;
    buyer_id: string;
    state: string;
    created: string;
};

export type AdminBannersItemType = {
    id: number; // required
    banner_id: number;
    image: string;
    url: string;
    sort: number;
    location: string;
    status: string;
    created: string;
};

export type AdminTableItemType =
    | AdminNFTItemType
    | AdminUsersItemType
    | AdminBlindBoxItemType
    | AdminHomeItemType
    | AdminOrdersBlindBoxItemType
    | AdminBidsItemType
    | AdminBannersItemType;

export type AdminUsersItemFetchType = {
    id: number; // required
    address: string;
    name: string;
    avatar: string;
    role: string;   // 0: Admin, 1: Moderator, 2: Normal user, 3: Banned user
    remarks: string;
};

export type AdminBannersItemFetchType = {
    id: number; // required
    _id: number;
    image: string;
    sort: number;
    location: string;
    status: number;
    createTime: string;
};
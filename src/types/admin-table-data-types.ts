import React from 'react';

export type AdminTableHeadCell = {
    id: string;
    label: string;
    cell?: (props: any) => React.ReactNode;
};

export type AdminNFTItemType = {
    id: number;
    rulenumber: string;
    nftid: string;
    nfttitle: string;
    state: string;
    classification: string;
    original_price: number;
    original_owner: string;
};

export type AdminBlindBoxItemType = {
    id: number;
    blindbox_id: string;
    blindbox_name: string;
    status: string;
    price: number;
    sale_begins: string;
    sale_ends: string;
};

export type AdminTableItemType = AdminNFTItemType | AdminBlindBoxItemType;

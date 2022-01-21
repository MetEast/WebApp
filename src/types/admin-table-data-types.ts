import React from 'react';

export type AdminTableColumn = {
    id: string;
    label: string;
    cell?: (props: any) => React.ReactNode;
    width?: number;
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

export type AdminHomeItemType = {
    id: number;
    project_title: string;
    project_type: string;
    sort: number;
    created: string;
};

export type AdminTableItemType = AdminNFTItemType | AdminBlindBoxItemType | AdminHomeItemType;

export type AdminNFTItemType = {
    rulenumber: string;
    nftid: string;
    nfttitle: string;
    state: string;
    classification: string;
    original_price: number;
    original_owner: string;
};

export type AdminTableItemType = AdminNFTItemType;

export type AdminTableHeadCell = {
    id: keyof AdminTableItemType;
    label: string;
}

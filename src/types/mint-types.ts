import { TypeSelectItem } from "./select-types";

export type TypeMintInputForm = {
    name: string;
    description: string;
    author: string;
    category: TypeSelectItem;
    file: File;
}

export type TypeMintInput = {
    key: string;
    value: string | File | TypeSelectItem | undefined;
}

export type TypeIpfsUpload = {
    path: string;
    cid: string;
    size: number;
    type: string;
}

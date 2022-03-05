import { create } from 'ipfs-http-client';

const client = create({ url: process.env.REACT_APP_IPFS_UPLOAD_URL });

export const uploadImage2Ipfs = (f: File) =>
    new Promise((resolve, reject) => {
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(f);
        reader.onloadend = async () => {
            try {
                const fileContent = Buffer.from(reader.result as string);
                const added = await client.add(fileContent);
                resolve({ ...added, type: f.type } as any);
            } catch (error) {
                reject(error);
            }
        };
    });

export const uploadMetaData2Ipfs = (added: any, did: string, name: string, description: string, nftName: string, nftDescription: string, nftCategory: string) =>
    new Promise((resolve, reject) => {
        // create the metadata object we'll be storing
        const metaObj = {
            version: '1',
            type: 'image',
            name: nftName,
            description: nftDescription,
            creator: {
                did: did,
                description: description,
                name: name,
            },
            data: {
                image: `meteast:image:${added.path}`,
                kind: added.type.replace('image/', ''),
                size: added.size,
                thumbnail: `meteast:image:${added.path}`,
            },
            category: nftCategory,
        };

        try {
            const jsonMetaObj = JSON.stringify(metaObj);
            // add the metadata itself as well
            const metaRecv = Promise.resolve(client.add(jsonMetaObj));
            resolve(metaRecv);
        } catch (error) {
            reject(error);
        }
    });

export const uploadDidUri2Ipfs = (did: string, name: string, description: string) =>
        new Promise((resolve, reject) => {
            // create the metadata object we'll be storing
            const didObj = {
                did: did,
                description: description,
                name: name,
            };
            try {
                const jsonDidObj = JSON.stringify(didObj);
                // add the metadata itself as well
                const didRecv = Promise.resolve(client.add(jsonDidObj));
                resolve(didRecv);
            } catch (error) {
                reject(error);
            }
        });

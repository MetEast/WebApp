import { create } from 'ipfs-http-client';
import { ipfsConfig } from 'src/config';

const client = create({ url: ipfsConfig.ipfsUploadUrl });

const zoomImgSize = (imgWidth: number, imgHeight: number, maxWidth: number, maxHeight: number): [number, number] => {
    let newWidth = imgWidth;
    let newHeight = imgHeight;
    if (imgWidth / imgHeight >= maxWidth / maxHeight) {
        if (imgWidth > maxWidth) {
            newWidth = maxWidth;
            newHeight = (imgHeight * maxWidth) / imgWidth;
        }
    } else if (imgHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = (imgWidth * maxHeight) / imgHeight;
    }
    if (newWidth > maxWidth || newHeight > maxHeight) {
        return zoomImgSize(newWidth, newHeight, maxWidth, maxHeight);
    }
    return [newWidth, newHeight];
};

export const convert = (file: File, maxWidth: number, maxHeight: number, quality: number = 1) => {
    return new Promise((resolve, reject) => {
        if (!file.name) {
            resolve({ success: 1 });
            return;
        }
        const imageType = file.name.split('.').reverse()[0].toLowerCase();
        const allow = ['jpg', 'gif', 'bmp', 'png', 'jpeg', 'svg'];
        try {
            if (!imageType || !allow.includes(imageType) || !file.size || !file.type) {
                resolve({ success: 1 });
                return;
            }
            if (file.size < 10 * 1000 * 1000 && imageType === 'gif') {
                resolve({ success: 2 });
                return;
            }

            const fileName = file.name;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event: any) => {
                const img: HTMLImageElement = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    if (img.src.length < maxWidth * maxHeight) {
                        resolve({ success: 2 });
                        return;
                    }

                    const imgWidth = img.width;
                    const imgHeight = img.height;

                    if (imgWidth <= 0 || imgHeight <= 0) {
                        resolve({ success: 2 });
                        return;
                    }

                    const canvasSize = zoomImgSize(imgWidth, imgHeight, maxWidth, maxHeight);

                    const canvas = document.createElement('canvas');
                    [canvas.width, canvas.height] = canvasSize;

                    const ctx: any = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    ctx.canvas.toBlob(
                        (blob: any) => {
                            const file = new File([blob], fileName, {
                                type: `image/${imageType}`,
                                lastModified: Date.now(),
                            });

                            const reader: any = new window.FileReader();
                            reader.readAsArrayBuffer(file);
                            reader.onloadend = async () => {
                                try {
                                    const fileContent = Buffer.from(reader.result);
                                    resolve({ success: 0, fileContent });
                                } catch (error) {
                                    reject(error);
                                }
                            };
                        },
                        file.type,
                        quality,
                    );
                };
            };
            reader.onerror = (error) => reject(error);
        } catch (error) {
            console.log('Error while image resize: ', error);
            reject(error);
        }
    });
};

export const uploadImage2Ipfs = (f: File | undefined) =>
    new Promise((resolve, reject) => {
        if (!f) resolve('no file');
        else {
            const reader = new window.FileReader();
            reader.readAsArrayBuffer(f);
            reader.onloadend = async () => {
                try {
                    const fileContent = Buffer.from(reader.result as string);
                    const thumbnail: any = await convert(f, 300, 300);
                    const added = await client.add(fileContent);
                    if (thumbnail.success === 0) {
                        const addedThumbnail = await client.add(thumbnail.fileContent);
                        resolve({ origin: { ...added }, thumbnail: { ...addedThumbnail }, type: f.type } as any);
                    }
                    resolve({ origin: { ...added }, thumbnail: { ...added }, type: f.type } as any);
                } catch (error) {
                    reject(error);
                }
            };
        }
    });

export const uploadMetaData2Ipfs = (
    added: any,
    did: string,
    name: string,
    description: string,
    nftName: string,
    nftDescription: string,
    nftCategory: string,
) =>
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
                image: `meteast:image:${added.origin.path}`,
                kind: added.type.replace('image/', ''),
                size: added.origin.size,
                thumbnail: `meteast:image:${added.thumbnail.path}`,
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

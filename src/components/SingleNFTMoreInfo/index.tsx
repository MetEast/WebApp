import React from 'react';
import { Stack, Grid, Typography } from '@mui/material';

interface ComponentProps {}

const SingleNFTMoreInfo: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Grid container marginTop={5} columnSpacing={5}>
            <Grid item xs={4}>
                <Stack spacing={1}>
                    <Typography fontSize={22} fontWeight={700}>
                        About the author
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <img src="/assets/images/avatar-template.png" width={24} alt="" />
                        <Typography fontSize={14} fontWeight={700}>
                            {`Author’s nickName`}
                        </Typography>
                    </Stack>
                    <Typography fontSize={14} fontWeight={400}>
                        One Sentence Introduction. One Sentence Introduction. One Sentence Introduction. One Sentence
                        Introduction. One Sentence Introduction. One Sentence Introduction.
                    </Typography>
                </Stack>
            </Grid>
            <Grid item xs={4}>
                <Stack spacing={1}>
                    <Typography fontSize={22} fontWeight={700}>
                        Project Description
                    </Typography>
                    <Typography fontSize={14} fontWeight={400}>
                        One Sentence Introduction. One Sentence Introduction. One Sentence Introduction. One Sentence
                        Introduction. One Sentence Introduction. One Sentence Introduction.
                    </Typography>
                </Stack>
            </Grid>
            <Grid item xs={4}>
                <Typography fontSize={22} fontWeight={700}>
                    Chain Details
                </Typography>
                <Grid
                    container
                    rowSpacing={1}
                    fontSize={12}
                    fontWeight={500}
                    padding={4}
                    borderRadius={5}
                    marginTop={1}
                    sx={{ background: '#F0F1F2' }}
                >
                    <Grid item xs={5}>
                        Chain name
                    </Grid>
                    <Grid item xs={7}>
                        Elastos Smart Chain
                    </Grid>
                    <Grid item xs={5}>
                        Platform ID
                    </Grid>
                    <Grid item xs={7}>
                        574
                    </Grid>
                    <Grid item xs={5}>
                        Chain ID
                    </Grid>
                    <Grid item xs={7} sx={{ overflowWrap: 'break-word' }} color="#1890FF">
                        0x0548d861114855da46bcf8739885b4627c2372700fa1a4bdf43e7a2d7e13667d
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SingleNFTMoreInfo;

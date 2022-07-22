import React from 'react';
import { Button } from './styles';
import { Icon } from '@iconify/react';
import { Link } from '@mui/material';
import { chainConfig } from 'src/config';

export interface ComponentProps {
    txHash: string;
}

const ViewOnExplorerButton: React.FC<ComponentProps> = ({ txHash }): JSX.Element => {
    return (
        <Link href={`${chainConfig.exploreUrl}/tx/${txHash}`} underline="none" target="_blank">
            <Button>
                {`View on explorer`}
                <Icon
                    icon="ph:arrow-square-out-bold"
                    fontSize={16}
                    color="#1890FF"
                    style={{ marginLeft: 4, marginBottom: 4 }}
                />
            </Button>
        </Link>
    );
};

export default ViewOnExplorerButton;

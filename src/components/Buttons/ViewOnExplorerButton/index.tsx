import React from 'react';
import { LinkButton } from './styles';
import { Icon } from '@iconify/react';

export interface ComponentProps {
    txHash: string;
}

const ViewOnExplorerButton: React.FC<ComponentProps> = ({txHash}): JSX.Element => {
    return (
        
        <LinkButton href={`https://esc.elastos.io/tx/${txHash}`} underline="none" target="_blank">
            {`View on explorer`}
            <Icon
                icon="ph:arrow-square-out-bold"
                fontSize={16}
                color="#1890FF"
                style={{ marginLeft: 4, marginBottom: 4 }}
            />
        </LinkButton>
    );
};

export default ViewOnExplorerButton;

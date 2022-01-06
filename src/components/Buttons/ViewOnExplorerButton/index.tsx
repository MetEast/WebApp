import React from 'react';
import { Button } from './styles';
import { Icon } from '@iconify/react';

export interface ComponentProps {}

const ViewOnExplorerButton: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Button>
            {`View on explorer`}
            <Icon
                icon="ph:arrow-square-out-bold"
                fontSize={16}
                color="#1890FF"
                style={{ marginLeft: 4, marginBottom: 4 }}
            />
        </Button>
    );
};

export default ViewOnExplorerButton;

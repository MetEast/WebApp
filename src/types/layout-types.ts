import { IFluentIconsProps } from '@fluentui/react-icons';
import React from 'react';

export type TypeMenuItem = {
    icon?: React.FC<React.HTMLAttributes<HTMLSpanElement> & IFluentIconsProps>;
    title: string;
    url: string;
};

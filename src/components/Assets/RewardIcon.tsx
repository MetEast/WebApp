import * as React from 'react';
import { SVGProps } from 'react';

const RewardIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg width={24} height={24} fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M19.35 13.752c0 2.121-.756 4.015-2.096 5.376-1.336 1.358-3.29 2.222-5.754 2.222-2.464 0-4.417-.864-5.754-2.222-1.34-1.36-2.096-3.255-2.096-5.376 0-2.12.756-4.014 2.096-5.376C7.083 7.02 9.036 6.155 11.5 6.155c2.465 0 4.418.864 5.755 2.221 1.34 1.362 2.095 3.255 2.095 5.376Z"
            strokeWidth={1.3}
        />
        <path
            d="M11.5 17.052V14.99m0 0h2.639m-2.639 0H8.861m2.639 0v-2.062h2.639M11.5 12.928H8.861m2.639 0L9.389 10.35m2.111 2.577 2.111-2.577"
            strokeLinecap="round"
        />
        <path d="M14.667 3.958c0 1.424-.835 2.062-3.167 2.062S8.333 5.382 8.333 3.96" strokeWidth={1.3} />
        <path d="M8.333 4.062C8.333 2.639 9.168 2 11.5 2s3.167.639 3.167 2.062" strokeWidth={1.3} />
    </svg>
);

export default RewardIcon;

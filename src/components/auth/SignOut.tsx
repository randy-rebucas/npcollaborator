'use client';

import { Button } from "../ui/button";

type Props = {
    onSignOut: () => Promise<void>;
};

const SignOut = ({ onSignOut }: Props) => {
    return (
        <Button
            variant={'outline'}
            onClick={() => {
                onSignOut();
            }}
        >
            Sign Out
        </Button>
    );
};

export default SignOut;
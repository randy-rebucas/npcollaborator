'use client';

import { Button } from "../ui/button";

type Props = {
    onSignIn: () => Promise<void>;
};

const SignIn = ({ onSignIn }: Props) => {
    return (
        <Button variant={'outline'}
            onClick={() => {
                onSignIn();
            }}
        >
            Sign In
        </Button>
    );
};

export default SignIn;
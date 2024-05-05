import React, { useState } from 'react';
import SignIn from './SignIn';
import Signup from './SignUp';

const Authentication = () => {
    const [isSignIn, setIsSignIn] = useState(true);

    const handleSignIn = () => {
        setIsSignIn(!isSignIn); 
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 text-white ">
            <div className="authentication sm:min-w-96 min-w-52 flex flex-col items-center ">
                {isSignIn ? (
                    <>
                        <SignIn /> 
                        <div className="border border-gray-500 mt-3 px-4">
                            <button className="text-xs py-3 text-center" onClick={handleSignIn}>Don't have an account? <a href="#" className="text-blue-500">Sign up</a></button>
                        </div>
                    </>
                ) : (
                    <>
                        <Signup />
                        <div className="border border-gray-500 mt-3 px-4">
                            <button className="text-xs py-3 text-center" onClick={handleSignIn}>Already have an account? <a href="#" className="text-blue-500">Log in</a></button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Authentication;

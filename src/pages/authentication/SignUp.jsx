import React, { useState } from 'react';
import { IoGameController } from "react-icons/io5";

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useDispatch } from 'react-redux';
import { login, setLoading } from '../../store/slices/authSlice'

function SignUp() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: fullName });

            dispatch(setLoading(true))
            dispatch(login({
                userId: user.uid,
                name: fullName,
                email: email
            }));
            dispatch(setLoading(false))

            setEmail('');
            setFullName('');
            setPassword('');

        } catch (error) {
            alert(error.message);
            console.error('Error adding user to Firestore:', error);
        }
    };


    return (
        <div className="max-w-md w-full space-y-8 bg-gray-800 sm:p-8 p-4 rounded-lg shadow-md">
            <div className='flex items-center justify-center gap-3'>
                <IoGameController size={30} style={{ color: '#0762C8' }} />
                <h2 className="text-center text-2xl font-bold text-white">Sign Up</h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
                <div className="flex flex-col gap-3 rounded-md shadow-sm -space-y-px">
                    <div className='w-full'>
                        <label htmlFor="full-name" className="">Full Name</label>
                        <input
                            id="full-name"
                            name="full-name"
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="input-class appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                            placeholder="Full Name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email-address" className="sr-">Email address</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete=""
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-class appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete=""
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-class appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                            placeholder="Password"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SignUp; 

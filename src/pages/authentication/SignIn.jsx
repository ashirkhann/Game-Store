import React, { useState } from 'react';
import { auth } from '../../firebase/firebase';
import { IoGameController } from "react-icons/io5";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/slices/authSlice';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch()

    const handleSignIn = async (event) => {
        event.preventDefault();
        dispatch(setLoading(true))
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            alert(error.message);
            console.log(error);
        }
        finally {
            dispatch(setLoading(false))
        }

    };

    return (
        <div className="w-full space-y-4 bg-gray-800 sm:px-8 py-8 px-4 rounded-lg shadow-md">
            <div className='flex flex-col items-center justify-center'>
                <span className='flex gap-3 items-center'>
                    <IoGameController size={30} />
                    <h2 className="text-center sm:text-2xl text-lg font-bold ">Sign In to Account</h2>
                </span>
                <span className='text-xs'>Default-Id: ashir@gmail.com</span>
                <span className='text-xs'>Password: ashir123</span>
            </div>
            <form className="w-full space-y-6" onSubmit={handleSignIn}>
                <div className="rounded-md shadow-sm space-y-3">
                    <div className='w-full'>
                        <label htmlFor="email-address" className="">Email address</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete=""
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-class appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500
                            text-black"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="">Password</label>
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
                        Sign In
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignIn;

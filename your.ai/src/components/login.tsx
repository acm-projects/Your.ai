import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      navigate('/dashboard');
    },
    onError: () => {
      console.log('Login Failed');
    },
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <button
        onClick={() => login()}
        className="flex items-center space-x-3 bg-white text-gray-700 px-6 py-3 rounded-md shadow-md hover:bg-gray-100 transition"
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google logo"
          className="w-5 h-5"
        />
        <span className="font-medium">Sign in with Google</span>
      </button>
    </div>
  );
};

export default Login;

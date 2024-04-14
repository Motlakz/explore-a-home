import React from 'react';

interface AuthToggleProps {
  isSignUp: boolean;
  onToggle: () => void;
}

const AuthToggle: React.FC<AuthToggleProps> = ({ isSignUp, onToggle }) => {
  return (
    <div className="flex justify-center mt-8">
      <button
        type="button"
        className="text-indigo-600 hover:text-indigo-800"
        onClick={onToggle}
      >
        {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
      </button>
    </div>
  );
};

export default AuthToggle;

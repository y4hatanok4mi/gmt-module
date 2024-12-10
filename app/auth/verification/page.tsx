"use client"

import { useState } from 'react';

const VerifyEmail = () => {
  const [code, setCode] = useState('');

  const onSubmit = async () => {
    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        console.log('Verification successful!');
      } else {
        throw new Error('Verification failed!');
      }
    } catch (error) {
      console.error("");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter verification code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={onSubmit}>Verify</button>
    </div>
  );
};

export default VerifyEmail;

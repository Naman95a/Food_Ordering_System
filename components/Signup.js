import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Check your email for confirmation!');
  };

  return (
    <div className="p-5">
      <input className="p-2 border" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="p-2 border" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button className="p-2 bg-blue-500 text-white" onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default Signup;

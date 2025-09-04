'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

export default function LoginForm() {
  const router = useRouter(); 
  const { login } = useAuth(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(''); 

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      login(data.user);
      router.push('/dashboard'); 

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Staff Attendance Login</CardTitle>
      </CardHeader>
      <form onSubmit={handleLogin}> 
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="Enter your email" 
                value={email}
                // === THIS IS THE CORRECTED LINE ===
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Login</Button> 
        </CardFooter>
      </form>
    </Card>
  );
}
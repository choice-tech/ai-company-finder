import React, { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignUpForm } from '@/components/auth/SignUpForm'

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)

  const toggleMode = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-amber-50 p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm onToggleMode={toggleMode} />
        ) : (
          <SignUpForm onToggleMode={toggleMode} />
        )}
      </div>
    </div>
  )
} 
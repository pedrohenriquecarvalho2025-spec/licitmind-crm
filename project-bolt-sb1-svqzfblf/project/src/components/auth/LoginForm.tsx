import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/atoms/Button'
import { Input } from '../ui/atoms/Input'
import { AlertCircle, Brain, Zap, Sparkles, Shield, TrendingUp } from 'lucide-react'
import { Logo } from '../ui/Logo'

// Componente de Logo 3D com movimento interativo
function Logo3D() {
  const logoRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return

      const rect = logoRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY

      // Limitar a rotação a valores razoáveis
      const rotateY = (deltaX / window.innerWidth) * 30 // -15 a 15 graus
      const rotateX = -(deltaY / window.innerHeight) * 30 // -15 a 15 graus

      setTransform({ rotateX, rotateY })
    }

    const handleMouseLeave = () => {
      setTransform({ rotateX: 0, rotateY: 0 })
    }

    window.addEventListener('mousemove', handleMouseMove)
    logoRef.current?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      logoRef.current?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={logoRef}
      className="relative group"
      style={{ perspective: '1000px' }}
    >
      {/* Logo Image with 3D Transform */}
      <div
        className="relative w-32 h-32 flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(1.1)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: 'translateZ(20px)',
          }}
        >
          <Logo className="w-full h-full text-brand-cyan drop-shadow-[0_0_30px_rgba(57,162,219,1)]" />
        </div>
      </div>

      {/* Multi-layer Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan via-primary-500 to-brand-cyan rounded-full blur-[80px] opacity-60 group-hover:opacity-90 transition-opacity animate-glow-pulse" />
      <div className="absolute inset-0 bg-brand-cyan rounded-full blur-[60px] opacity-50 animate-pulse" />
      <div className="absolute inset-0 bg-primary-500 rounded-full blur-[40px] opacity-40" />

      {/* AI Badge with 3D effect */}
      <div
        className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-brand-tech-green to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-brand-tech-green/70 animate-pulse border-4 border-neutral-900 transition-transform duration-300"
        style={{
          transform: `translateZ(40px) rotateY(${-transform.rotateY * 0.5}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <Zap className="w-5 h-5 text-white" />
      </div>

      {/* Decorative Rings */}
      <div className="absolute inset-0 rounded-full border-2 border-brand-cyan/20 scale-125 animate-ping opacity-20" />
      <div
        className="absolute inset-0 rounded-full border border-primary-500/30 scale-150 animate-ping opacity-10"
        style={{ animationDelay: '1s' }}
      />
    </div>
  )
}

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password)
        if (error) throw error
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.fullName)
        if (error) throw error
      }
    } catch (error: any) {
      let errorMessage = 'Erro desconhecido'
      
      if (error?.message) {
        errorMessage = error.message
      }
      
      if (error?.body) {
        try {
          const parsedBody = typeof error.body === 'string' ? JSON.parse(error.body) : error.body
          if (parsedBody?.message) {
            errorMessage = parsedBody.message
          }
        } catch (parseError) {
          // Keep the original error message if parsing fails
        }
      }
      
      if (errorMessage === 'Invalid login credentials') {
        errorMessage = 'Email ou senha incorretos'
      } else if (errorMessage.includes('Email not confirmed')) {
        errorMessage = 'Por favor, confirme seu email antes de fazer login'
      } else if (errorMessage.includes('Too many requests')) {
        errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-dots-pattern opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 via-transparent to-primary-500/5" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-tech-green/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      
      <div className="max-w-md w-full relative">
        {/* Logo Card with 3D Effect */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6 perspective-1000">
            <Logo3D />
          <h1 className="text-5xl font-bold mb-3 tracking-tight bg-gradient-to-r from-white via-brand-cyan to-white bg-clip-text text-transparent">LicitMind</h1>
          <p className="text-brand-cyan font-semibold mb-2 flex items-center justify-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>IA para Licitações</span>
          </p>
          <p className="text-neutral-400 text-sm mb-6">
            Gestão Inteligente e Automatizada
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2">
                <Brain className="w-6 h-6 text-brand-cyan" />
              </div>
              <p className="text-xs text-brand-silver font-medium">IA Integrada</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-brand-tech-green" />
              </div>
              <p className="text-xs text-brand-silver font-medium">Seguro</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-brand-cyan" />
              </div>
              <p className="text-xs text-brand-silver font-medium">Performance</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-primary-500/5" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-cyan to-transparent" />
          <div className="relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
            </h2>
            <p className="text-neutral-400">
              {isLogin ? 'Acesse sua conta LicitMind' : 'Comece sua jornada inteligente'}
            </p>
          </div>

          {/* Demo Notice */}
          <div className="relative mb-6 p-4 bg-gradient-to-r from-brand-tech-green/20 to-emerald-500/20 backdrop-blur-sm border border-brand-tech-green/30 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            <div className="relative flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-brand-tech-green animate-pulse" />
              <p className="text-sm font-bold text-white">Modo Demonstração</p>
            </div>
            <p className="text-xs text-neutral-300 relative">
              Use qualquer email/senha para entrar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <Input
                type="text"
                name="fullName"
                label="Nome completo"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Digite seu nome completo"
              />
            )}

            <Input
              type="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Digite seu email"
            />

            <Input
              type="password"
              name="password"
              label="Senha"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Digite sua senha"
            />

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full bg-gradient-to-r from-brand-cyan via-primary-500 to-brand-cyan hover:from-brand-cyan hover:via-primary-600 hover:to-brand-cyan shadow-2xl shadow-brand-cyan/30 border border-white/20"
              size="lg"
            >
              {isLogin ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-brand-cyan hover:text-white font-semibold transition-all duration-300 hover:scale-105"
            >
              {isLogin ? 'Não tem conta? Criar conta' : 'Já tem conta? Entrar'}
            </button>
          </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-neutral-500 text-sm">
          <p className="flex items-center justify-center space-x-2">
            <Brain className="w-4 h-4 text-brand-cyan" />
            <span>© 2024 LicitMind - IA para Licitações</span>
          </p>
        </div>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import logoNova from '@/assets/logo-nova-800x200-b63d1.png'
import { useToast } from '@/hooks/use-toast'

export default function Login() {
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [email, setEmail] = useState('rafael@peresperes.com.br')
  const [password, setPassword] = useState('Skip@Pass')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/admin" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      toast({
        title: 'Erro de Autenticação',
        description: 'Credenciais inválidas.',
        variant: 'destructive',
      })
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-800 bg-white">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <img
              src={logoNova}
              alt="PERES PERES Consultoria & Contabilidade"
              className="h-10 w-auto object-contain"
            />
          </div>
          <CardTitle className="text-xl font-bold text-black">
            PERES PERES Consultoria &amp; Contabilidade
          </CardTitle>
          <CardDescription>Acesso restrito à equipe técnica.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-lg h-12"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Acessar Painel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import pb from '@/lib/pocketbase/client'

interface AuthContextType {
  user: any
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signInWithOAuth2: (provider?: string) => Promise<{ error: any; record?: any }>
  signOut: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(pb.authStore.record)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_token, record) => {
      if (record) {
        const email = (record.email || '').trim().toLowerCase()
        const allowedEmail = 'rafael@peresperes.com.br'
        if (email && email !== allowedEmail) {
          pb.authStore.clear()
          setUser(null)
          return
        }
      }
      setUser(record)
    })

    // Checagem defensiva de inicialização caso haja resquício de outro usuário no authStore
    if (pb.authStore.record) {
      const email = (pb.authStore.record.email || '').trim().toLowerCase()
      const allowedEmail = 'rafael@peresperes.com.br'
      if (email && email !== allowedEmail) {
        pb.authStore.clear()
        setUser(null)
      }
    }

    setLoading(false)
    return () => {
      unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signInWithOAuth2 = async (provider = 'google') => {
    try {
      // Pré-validação defensiva da resposta de auth-methods para evitar que o SDK
      // estoure erros internos criptográficos como "Cannot read properties of undefined (reading 'providers')"
      // caso o backend esteja indisponível, retorne HTML ou o provider não esteja listado.
      try {
        const methods = await pb.collection('users').listAuthMethods()
        const oauthProviders = methods?.oauth2?.providers || []
        const hasProvider = oauthProviders.some((p: any) => p && p.name === provider)
        if (!hasProvider) {
          const unavailableError = new Error(
            'Serviço de autenticação indisponível no momento. Tente novamente mais tarde.',
          )
          return { error: unavailableError, record: null }
        }
      } catch (checkErr: any) {
        const isAbort =
          checkErr?.isAbort ||
          checkErr?.message?.includes?.('autocancelled') ||
          checkErr?.message?.includes?.('cancelled')
        if (isAbort) {
          return { error: checkErr, record: null }
        }
        const unavailableError = new Error(
          'Serviço de autenticação indisponível no momento. Tente novamente.',
        )
        return { error: unavailableError, record: null }
      }

      const authData = await pb.collection('users').authWithOAuth2({ provider })
      const record = authData.record
      const email = (record?.email || '').trim().toLowerCase()
      const allowedEmail = 'rafael@peresperes.com.br'

      if (email && email !== allowedEmail) {
        // Encerra imediatamente a sessão não autorizada
        pb.authStore.clear()
        setUser(null)
        const restrictedError = new Error(
          'Acesso restrito. Este ambiente é exclusivo para a administração da PERES PERES Consultoria & Contabilidade (rafael@peresperes.com.br).',
        )
        return { error: restrictedError, record: null }
      }

      return { error: null, record }
    } catch (error: any) {
      const msg = error?.message || ''
      // Se estourar erro de 'providers', converte em mensagem clara de serviço indisponível
      if (
        msg.includes('providers') ||
        msg.includes('Failed to fetch') ||
        msg.includes('NetworkError')
      ) {
        const friendlyError = new Error(
          'Serviço de autenticação indisponível no momento, tente novamente.',
        )
        return { error: friendlyError, record: null }
      }
      return { error, record: null }
    }
  }

  const signOut = () => {
    pb.authStore.clear()
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signInWithOAuth2, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

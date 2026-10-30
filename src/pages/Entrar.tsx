import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Loader2, LogOut, AlertCircle } from 'lucide-react'
import logoNova from '@/assets/logo-nova-560w.png'

export default function Entrar() {
  const { user, signInWithOAuth2, signOut, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const allowedEmail = 'rafael@peresperes.com.br'
  const isAuthorized = user && (user.email || '').trim().toLowerCase() === allowedEmail

  useEffect(() => {
    document.title = 'Entrar | PERES PERES Consultoria & Contabilidade'
    if (user && isAuthorized) {
      navigate('/admin', { replace: true })
    }
  }, [user, isAuthorized, navigate])

  const handleGoogleLogin = async () => {
    setSubmitting(true)
    setErrorMessage(null)
    try {
      const { error, record } = await signInWithOAuth2('google')
      if (error) {
        console.error('Erro no login com Google:', error)
        const isCancelled =
          error?.isAbort ||
          error?.message?.includes?.('autocancelled') ||
          error?.message?.includes?.('cancelled')
        if (!isCancelled) {
          setErrorMessage(
            error?.message || 'Falha ao autenticar com o Google. Acesso exclusivo à equipe.',
          )
        }
        setSubmitting(false)
        return
      }

      const email = (record?.email || '').trim().toLowerCase()
      if (email === allowedEmail) {
        navigate('/admin', { replace: true })
      } else {
        setErrorMessage(
          'Acesso restrito. Este ambiente é exclusivo para a administração da PERES PERES Consultoria & Contabilidade (rafael@peresperes.com.br).',
        )
      }
      setSubmitting(false)
    } catch (err: any) {
      console.error('Erro inesperado no login:', err)
      setErrorMessage('Ocorreu um erro inesperado ao conectar. Tente novamente.')
      setSubmitting(false)
    }
  }

  // Se o usuário estiver logado com conta NÃO autorizada:
  if (user && !isAuthorized) {
    return (
      <main className="bg-black text-white min-h-[calc(100vh-80px)] flex items-center justify-center font-sans px-4 py-12 selection:bg-[#FAB319] selection:text-black">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center mb-2">
            <img
              src={logoNova}
              alt="PERES PERES Consultoria & Contabilidade"
              className="h-12 w-auto object-contain"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            PERES PERES Consultoria &amp; Contabilidade
          </h1>

          <div
            role="alert"
            className="p-5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-sm space-y-2 text-left"
          >
            <div className="flex items-center gap-2 text-red-400 font-semibold">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>Acesso restrito</span>
            </div>
            <p className="text-xs text-red-300 leading-relaxed">
              O e-mail conectado ({user.email}) não possui permissão de acesso ao painel
              administrativo. O acesso é restrito exclusivamente a {allowedEmail}.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => signOut()}
            className="w-full border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white h-12 text-sm font-medium flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4 text-[#FAB319]" />
            Sair da conta
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-black text-white min-h-[calc(100vh-80px)] flex items-center justify-center font-sans px-4 py-12 selection:bg-[#FAB319] selection:text-black">
      <div className="w-full max-w-md text-center space-y-6">
        {/* 1. Logo do escritório */}
        <div className="flex justify-center mb-2">
          <img
            src={logoNova}
            alt="PERES PERES Consultoria & Contabilidade"
            className="h-12 w-auto object-contain"
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          PERES PERES Consultoria &amp; Contabilidade
        </h1>

        {/* 2. Frase curta informando que o acesso é restrito à equipe do escritório */}
        <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
          Acesso restrito à equipe do escritório.
        </p>

        {errorMessage && (
          <div
            role="alert"
            className="p-3.5 rounded-lg bg-red-950/70 border border-red-800 text-red-200 text-xs text-left flex items-start gap-2.5"
          >
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* 3. Botão "Entrar com Google" */}
        <div className="pt-2">
          {authLoading ? (
            <div className="py-6 flex justify-center items-center gap-2 text-neutral-400">
              <Loader2 className="h-5 w-5 animate-spin text-[#FAB319]" />
              <span className="text-sm">Verificando sessão...</span>
            </div>
          ) : (
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={submitting}
              className="w-full bg-white hover:bg-neutral-100 text-neutral-900 font-semibold h-13 py-3 px-5 text-base shadow-lg transition-all flex items-center justify-center gap-3 border border-neutral-200"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-neutral-900" />
                  <span>Conectando com o Google...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Entrar com Google</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}

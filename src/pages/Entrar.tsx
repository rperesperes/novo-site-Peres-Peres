import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut, ShieldCheck, UserCheck, AlertCircle, Loader2 } from 'lucide-react'
import logoNova from '@/assets/logo-nova-800x200-b63d1.png'

export default function Entrar() {
  const { user, signInWithOAuth2, signOut, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const pageTitle = 'Entrar | PERES PERES Consultoria e Contabilidade'
    document.title = pageTitle
    window.scrollTo(0, 0)
  }, [])

  const handleGoogleLogin = async () => {
    setSubmitting(true)
    setErrorMessage(null)
    try {
      const { error } = await signInWithOAuth2('google')
      if (error) {
        console.error('Erro no login com Google:', error)
        // Se o usuário fechou o popup ou cancelou, exibe mensagem amigável
        const isCancelled =
          error?.isAbort ||
          error?.message?.includes?.('autocancelled') ||
          error?.message?.includes?.('cancelled')
        if (!isCancelled) {
          setErrorMessage(
            error?.message || 'Falha ao autenticar com o Google. Por favor, tente novamente.',
          )
        }
        setSubmitting(false)
        return
      }
      navigate('/', { replace: true })
    } catch (err: any) {
      console.error('Erro inesperado no login:', err)
      setErrorMessage('Ocorreu um erro inesperado ao conectar. Tente novamente em instantes.')
      setSubmitting(false)
    }
  }

  const handleSignOut = () => {
    signOut()
  }

  const displayName = user?.name || user?.email || 'Usuário conectado'
  const displayEmail = user?.email || ''

  return (
    <article className="bg-black text-white min-h-[calc(100vh-80px)] py-16 md:py-24 font-sans selection:bg-[#FAB319] selection:text-black flex items-center">
      <div className="container mx-auto px-4 max-w-2xl w-full">
        <div className="space-y-8 animate-fade-in-up">
          {/* Cabeçalho */}
          <header className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 border border-neutral-800 bg-neutral-900/90 px-3.5 py-1.5 rounded text-xs font-mono uppercase tracking-wider text-neutral-300">
              <ShieldCheck className="h-3.5 w-3.5 text-[#FAB319]" />
              Acesso Seguro • PERES PERES
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Entrar
            </h1>

            <p className="text-base md:text-lg text-neutral-300 leading-relaxed font-sans max-w-lg mx-auto">
              Identificação técnica e institucional para acesso aos serviços integrados da PERES
              PERES Consultoria e Contabilidade.
            </p>
          </header>

          {/* Cartão Principal */}
          <Card className="border border-neutral-800 bg-neutral-950/90 text-white rounded-2xl shadow-2xl p-6 sm:p-10">
            <CardContent className="p-0 space-y-6">
              {/* Logo institucional sutil */}
              <div className="flex justify-center pb-2">
                <img
                  src={logoNova}
                  alt="PERES PERES Consultoria e Contabilidade"
                  className="h-9 sm:h-11 w-auto object-contain"
                />
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-sm flex items-start gap-3"
                >
                  <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-white">Não foi possível concluir o login</p>
                    <p className="text-xs text-red-300 leading-relaxed">{errorMessage}</p>
                  </div>
                </div>
              )}

              {authLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-neutral-400">
                  <Loader2 className="h-6 w-6 animate-spin text-[#FAB319]" />
                  <p className="text-sm font-sans">Carregando status de conexão...</p>
                </div>
              ) : user ? (
                /* Estado autenticado: conectado como <nome/email> com botão Sair */
                <div className="space-y-6 text-center">
                  <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 text-left flex items-start gap-3.5">
                    <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[#FAB319] shrink-0 mt-0.5">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-0.5">
                        Status da Sessão
                      </span>
                      <p className="text-xs text-neutral-300 font-sans">
                        Conectado como{' '}
                        <strong className="text-white font-semibold">{displayName}</strong>
                      </p>
                      {displayEmail && displayName !== displayEmail && (
                        <p className="text-xs text-neutral-400 font-mono mt-0.5 truncate">
                          {displayEmail}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSignOut}
                      className="w-full border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white h-12 text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <LogOut className="h-4 w-4 text-[#FAB319]" />
                      Sair da conta
                    </Button>
                    <Button
                      type="button"
                      onClick={() => navigate('/')}
                      className="w-full bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold h-12 text-sm shadow-sm flex items-center justify-center gap-2"
                    >
                      Ir para o Início
                    </Button>
                  </div>
                </div>
              ) : (
                /* Estado não autenticado: botão Entrar com Google */
                <div className="space-y-6">
                  <div className="p-3.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300 text-xs text-center leading-relaxed">
                    Acesso restrito exclusivamente à equipe e gestão interna da{' '}
                    <strong className="text-white font-medium">
                      PERES PERES Consultoria & Contabilidade
                    </strong>
                    .
                  </div>

                  <Button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={submitting}
                    className="w-full bg-white hover:bg-neutral-100 text-neutral-900 font-semibold h-13 py-3 px-4 text-base shadow-md transition-all flex items-center justify-center gap-3 border border-neutral-200"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin text-neutral-900" />
                        <span>Conectando com o Google...</span>
                      </>
                    ) : (
                      <>
                        {/* Ícone oficial Google 4 cores em SVG */}
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

                  <div className="pt-4 border-t border-neutral-900 text-center">
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      Autenticação com criptografia de ponta a ponta e proteção em conformidade com
                      as diretrizes da LGPD.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rodapé informativo do card */}
          <div className="text-center text-xs text-neutral-400 font-mono">
            PERES PERES CONSULTORIA & CONTABILIDADE LTDA • CRC 027704
          </div>
        </div>
      </div>
    </article>
  )
}

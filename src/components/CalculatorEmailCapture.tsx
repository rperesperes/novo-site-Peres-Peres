import { useState } from 'react'
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createContactRequest } from '@/services/contact_requests'

interface CalculatorEmailCaptureProps {
  calculatorName: string
  className?: string
}

export function CalculatorEmailCapture({
  calculatorName,
  className = '',
}: CalculatorEmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.trim()) return

    setStatus('loading')
    setErrorMessage('')

    try {
      await createContactRequest({
        email: email.trim(),
        source_page: calculatorName,
      })
      setStatus('success')
      setEmail('')
    } catch (err) {
      console.error('Erro ao enviar análise por e-mail:', err)
      setStatus('error')
      setErrorMessage(
        'Não foi possível registrar seu e-mail no momento. Por favor, tente novamente ou fale conosco diretamente pelo WhatsApp.',
      )
    }
  }

  return (
    <div
      className={`border border-neutral-300 bg-white rounded-xl p-6 md:p-8 shadow-sm my-8 relative overflow-hidden ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#FAB319]" />

      <div className="max-w-2xl">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded bg-neutral-900 text-[#FAB319] shrink-0">
            <Mail className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-xl md:text-2xl text-black">
            Receba esta análise por e-mail
          </h3>
        </div>

        <p className="text-sm text-neutral-600 leading-relaxed mb-5">
          Informe seu e-mail corporativo para receber um resumo detalhado desta simulação,
          diretrizes normativas e orientações práticas para a sua empresa.
        </p>

        {status === 'success' ? (
          <div
            role="status"
            className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-sm">Recebemos sua solicitação com sucesso!</p>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Nossa equipe enviará os detalhes desta análise e está à disposição para aprofundar o
                diagnóstico da sua empresa.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="text-xs text-emerald-900 underline hover:no-underline font-medium pt-1 block"
              >
                Enviar para outro e-mail
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                required
                disabled={status === 'loading'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite aqui seu e-mail principal"
                className="border-neutral-300 focus-visible:ring-black h-11 text-sm bg-neutral-50 sm:flex-1"
              />
              <Button
                type="submit"
                disabled={status === 'loading'}
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold h-11 px-6 text-sm shadow-sm shrink-0 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-black" />
                    Enviando...
                  </>
                ) : (
                  'Enviar análise'
                )}
              </Button>
            </div>

            {status === 'error' && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-900 flex items-start gap-2 text-xs"
              >
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <p className="text-[11px] text-neutral-500">
              Respeitamos a LGPD e o sigilo profissional (CRC 027704). Não enviamos spam.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
export default CalculatorEmailCapture

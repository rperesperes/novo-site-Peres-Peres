import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Send,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SITE_INFO } from '@/lib/data'
import { createContactRequest } from '@/services/contact_requests'

export default function Contact() {
  const whatsappUrl = SITE_INFO.whatsappUrl
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const pageTitle = 'Fale com o Escritório | PERES PERES Consultoria e Contabilidade'
    const pageDesc =
      'Entre em contato com a PERES PERES Consultoria e Contabilidade em Brasília. Atendimento tributário e contábil consultivo sob responsabilidade técnica CRC 027704.'

    document.title = pageTitle

    let metaDescTag = document.querySelector('meta[name="description"]')
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta')
      metaDescTag.setAttribute('name', 'description')
      document.head.appendChild(metaDescTag)
    }
    metaDescTag.setAttribute('content', pageDesc)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      await createContactRequest({
        name: nome.trim(),
        email: email.trim(),
        phone: telefone.trim(),
        message: mensagem.trim(),
        source_page: 'Página de Contato (/contato)',
      })
      setStatus('success')
      setNome('')
      setEmail('')
      setTelefone('')
      setMensagem('')
    } catch (err) {
      console.error('Erro ao enviar contato:', err)
      setStatus('error')
      setErrorMessage(
        'Não foi possível enviar sua mensagem no momento devido a uma falha de conexão. Por favor, tente novamente ou entre em contato diretamente conosco pelo WhatsApp ou e-mail.',
      )
    }
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://peresperes.com.br/contato#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Início',
            item: 'https://peresperes.com.br/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Contato',
            item: 'https://peresperes.com.br/contato',
          },
        ],
      },
      {
        '@type': 'ContactPage',
        '@id': 'https://peresperes.com.br/contato#webpage',
        url: 'https://peresperes.com.br/contato',
        name: 'Fale com o escritório | PERES PERES Consultoria e Contabilidade',
        description:
          'Canal de contato da PERES PERES Consultoria e Contabilidade em Brasília. Agende uma reunião especializada.',
        mainEntity: {
          '@type': 'AccountingService',
          name: SITE_INFO.name,
          telephone: '+55-61-3686-1689',
          email: SITE_INFO.email,
          sameAs: [SITE_INFO.instagramUrl, SITE_INFO.linkedinUrl],
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Brasília',
            addressRegion: 'DF',
            addressCountry: 'BR',
          },
        },
      },
    ],
  }

  return (
    <div className="py-12 md:py-20 bg-background min-h-screen text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Trilha de navegação: Início > Contato */}
        <nav
          aria-label="Trilha de navegação"
          className="flex items-center gap-2 text-xs md:text-sm text-neutral-500 mb-8"
        >
          <Link to="/" className="hover:text-black transition-colors">
            Início
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
          <span className="text-black font-medium">Contato</span>
        </nav>

        {/* Cabeçalho */}
        <header className="mb-12 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold text-black mb-4 leading-tight">
            Fale com o escritório
          </h1>
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
            Estamos à disposição para entender o momento da sua empresa e propor soluções
            tributárias e contábeis com rigor técnico e conformidade jurídica.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Informações de contato do escritório */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-neutral-200 bg-white rounded-xl p-6 md:p-8 shadow-sm space-y-6">
              <h2 className="font-bold text-xl text-black">Canais de Atendimento</h2>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-black shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-0.5">
                      E-mail direto
                    </span>
                    <a
                      href={`mailto:${SITE_INFO.email}`}
                      className="font-medium text-black hover:underline"
                    >
                      {SITE_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-black shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-0.5">
                      WHATSAPP
                    </span>
                    <a
                      href={`tel:${SITE_INFO.phone.replace(/\D/g, '')}`}
                      className="font-medium text-black hover:underline"
                    >
                      {SITE_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-black shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-0.5">
                      Localização
                    </span>
                    <p className="font-medium text-black">Brasília – DF</p>
                  </div>
                </div>
              </div>

              {/* Botão principal de WhatsApp */}
              <div className="pt-2 border-t border-neutral-200">
                <Button
                  asChild
                  className="w-full bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold h-12 text-sm shadow-sm flex items-center justify-center gap-2"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="h-4 w-4" />
                    Conversar pelo WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            {/* Responsabilidade técnica */}
            <div className="border border-neutral-200 bg-neutral-50 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-neutral-900 text-white shrink-0 mt-0.5">
                  <UserCheck className="h-4 w-4 text-[#FAB319]" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-0.5">
                    Responsabilidade Técnica
                  </span>
                  <h3 className="font-bold text-base text-black">Rafael Peres Peres Nunes Altoé</h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Contador Responsável • <strong>CRC 027704</strong>
                  </p>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                    Atuação em conformidade estrita com as normas do Conselho Federal de
                    Contabilidade e a legislação tributária brasileira.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de contato */}
          <div className="lg:col-span-7">
            <div className="border border-neutral-200 bg-white rounded-xl p-6 md:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="font-bold text-xl md:text-2xl text-black mb-2">
                  Envie sua mensagem
                </h2>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Preencha os campos abaixo para solicitar atendimento ou esclarecer dúvidas. Nossa
                  equipe entrará em contato prontamente.
                </p>
              </div>

              {status === 'success' && (
                <div
                  role="status"
                  className="mb-6 p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">
                      Recebemos sua mensagem, entraremos em contato em breve!
                    </p>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Seus dados foram enviados com sucesso à nossa equipe consultiva. Caso
                      necessite de retorno imediato, utilize também nosso canal direto de WhatsApp.
                    </p>
                    <div className="pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setStatus('idle')}
                        className="bg-white hover:bg-neutral-50 text-emerald-900 border-emerald-300 text-xs h-8"
                      >
                        Enviar outra mensagem
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div
                  role="alert"
                  className="mb-6 p-5 rounded-xl bg-red-50 border border-red-200 text-red-950 flex items-start gap-3"
                >
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <p className="font-semibold text-sm text-red-900">
                      Não foi possível enviar sua mensagem
                    </p>
                    <p className="text-red-800 leading-relaxed">{errorMessage}</p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-xs transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Chamar no WhatsApp
                      </a>
                      <a
                        href={`mailto:${SITE_INFO.email}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 text-xs transition-colors"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {SITE_INFO.email}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="nome"
                    className="block text-sm font-semibold text-neutral-900 mb-1"
                  >
                    Nome completo
                  </label>
                  <Input
                    id="nome"
                    type="text"
                    required
                    disabled={status === 'loading'}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome ou razão social"
                    className="border-neutral-300 focus-visible:ring-black"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-neutral-900 mb-1"
                    >
                      E-mail corporativo
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      disabled={status === 'loading'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nome@empresa.com.br"
                      className="border-neutral-300 focus-visible:ring-black"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="telefone"
                      className="block text-sm font-semibold text-neutral-900 mb-1"
                    >
                      Telefone / WhatsApp
                    </label>
                    <Input
                      id="telefone"
                      type="tel"
                      disabled={status === 'loading'}
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(61) 90000-0000"
                      className="border-neutral-300 focus-visible:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="mensagem"
                    className="block text-sm font-semibold text-neutral-900 mb-1"
                  >
                    Mensagem
                  </label>
                  <Textarea
                    id="mensagem"
                    required
                    rows={5}
                    disabled={status === 'loading'}
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Descreva brevemente a sua demanda ou dúvida tributária..."
                    className="border-neutral-300 focus-visible:ring-black resize-y"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-black hover:bg-neutral-800 text-white font-semibold h-11 text-sm shadow-sm flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-[#FAB319]" />
                        Enviando mensagem...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Enviar mensagem
                      </>
                    )}
                  </Button>
                  <p className="text-[11px] text-neutral-500 text-center mt-2">
                    Seus dados são protegidos e tratados sob sigilo profissional estrito (CRC
                    027704).
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

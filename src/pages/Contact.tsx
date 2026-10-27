import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Mail, Phone, MessageSquare, MapPin, Send, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SITE_INFO } from '@/lib/data'

export default function Contact() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    const pageTitle = 'Fale com o Escritório | PERES PERES Consultoria e Contabilidade'
    const pageDesc =
      'Entre em contato com a PERES PERES Consultoria e Contabilidade em Brasília. Atendimento tributário e contábil consultivo sob responsabilidade técnica CRC 027704/O.'

    document.title = pageTitle

    let metaDescTag = document.querySelector('meta[name="description"]')
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta')
      metaDescTag.setAttribute('name', 'description')
      document.head.appendChild(metaDescTag)
    }
    metaDescTag.setAttribute('content', pageDesc)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const subject = encodeURIComponent(`Contato pelo site - ${nome || 'Novo Interessado'}`)
    const bodyLines = [
      `Nome: ${nome}`,
      `E-mail: ${email}`,
      `Telefone: ${telefone}`,
      '',
      'Mensagem:',
      mensagem,
    ]
    const body = encodeURIComponent(bodyLines.join('\n'))
    window.location.href = `mailto:${SITE_INFO.email}?subject=${subject}&body=${body}`
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
          'Canal de contato da PERES PERES Consultoria e Contabilidade em Brasília. Agende consultoria tributária especializada.',
        mainEntity: {
          '@type': 'AccountingService',
          name: SITE_INFO.name,
          telephone: '+55-61-3686-1689',
          email: SITE_INFO.email,
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
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-black mb-4 leading-tight">
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
              <h2 className="font-serif font-bold text-xl text-black">Canais de Atendimento</h2>

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
                      Telefone
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
                  <a
                    href="https://wa.me/556136861689?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consultoria%20tribut%C3%A1ria"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
                  <h3 className="font-serif font-bold text-base text-black">
                    Rafael Peres Peres Nunes Altoé
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1">
                    Contador Responsável • <strong>CRC 027704/O</strong>
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
                <h2 className="font-serif font-bold text-xl md:text-2xl text-black mb-2">
                  Envie sua mensagem
                </h2>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Preencha os campos abaixo. Ao clicar em enviar, seu aplicativo de e-mail será
                  aberto com os dados organizados para envio direto a{' '}
                  <span className="font-medium text-black">{SITE_INFO.email}</span>.
                </p>
              </div>

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
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Descreva brevemente a sua demanda ou dúvida tributária..."
                    className="border-neutral-300 focus-visible:ring-black resize-y"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-neutral-800 text-white font-semibold h-11 text-sm shadow-sm flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Abrir e-mail com a mensagem preenchida
                  </Button>
                  <p className="text-[11px] text-neutral-500 text-center mt-2">
                    Não gravamos dados em servidores externos neste formulário. Seu próprio cliente
                    de e-mail será acionado.
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

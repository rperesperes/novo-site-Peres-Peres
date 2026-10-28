import { Link } from 'react-router-dom'
import { SITE_INFO } from '@/lib/data'
import { MapPin, Mail, MessageSquare, Linkedin, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import logoPadrao from '@/assets/logo-padrao-oficial-844b7.png'

export function Footer() {
  const { toast } = useToast()

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Inscrição realizada!',
      description: 'Você receberá nossas atualizações tributárias.',
    })
  }

  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & NAP */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img
                src={logoPadrao}
                alt="PERES PERES Consultoria e Contabilidade"
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-neutral-400 mt-4 leading-relaxed">
              Expertise e segurança para o seu negócio. Consultoria e contabilidade tributária de
              alto rigor técnico.
            </p>
            <div className="space-y-2 text-sm text-neutral-300 mt-6">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-neutral-400" />
                <span>{SITE_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-neutral-400" />
                <a
                  href={`mailto:${SITE_INFO.email}`}
                  className="hover:text-[#FAB319] transition-colors"
                >
                  {SITE_INFO.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 shrink-0 text-neutral-400" />
                <a
                  href={SITE_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FAB319] transition-colors"
                >
                  WhatsApp: {SITE_INFO.whatsapp}
                </a>
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Navegação</h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <Link to="/sobre" className="hover:text-[#FAB319] transition-colors">
                  Sobre o Escritório
                </Link>
              </li>
              <li>
                <Link to="/servicos" className="hover:text-[#FAB319] transition-colors">
                  Áreas de Atuação
                </Link>
              </li>
              <li>
                <Link to="/casos" className="hover:text-[#FAB319] transition-colors">
                  Casos de Sucesso
                </Link>
              </li>
              <li>
                <a
                  href="https://blog.peresperes.com.br"
                  className="hover:text-[#FAB319] transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <Link to="/recursos" className="hover:text-[#FAB319] transition-colors">
                  Recursos e Materiais
                </Link>
              </li>
              <li>
                <Link to="/calculadoras" className="hover:text-[#FAB319] transition-colors">
                  Calculadoras Tributárias
                </Link>
              </li>
              <li>
                <Link to="/glossario" className="hover:text-[#FAB319] transition-colors">
                  Glossário Tributário
                </Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-[#FAB319] transition-colors">
                  Fale Conosco
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-lg mb-4 text-white">Boletim Informativo</h4>
            <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
              Receba algumas das nossas análises e informes sobre as mudanças na legislação
              pertinente ao seu negócio.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Digite aqui seu e-mail principal"
                required
                className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-[#FAB319]"
              />
              <Button
                type="submit"
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold shrink-0"
              >
                Assinar
              </Button>
            </form>
            <div className="flex items-center gap-4 mt-8">
              <a
                href="https://www.linkedin.com/company/peresperes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-[#FAB319] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/peresperes.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-[#FAB319] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p className="leading-relaxed">
            Copyright 2017 a 2026 - Todos os conteúdos deste site, inclusive textos, imagens,
            vídeos, executáveis e arquivos baixáveis estão protegidos pela legislação brasileira
            sobre direito autoral. Para compartilha-los é obrigatório citar a fonte.
            <br />
            <br />
            Escritório PERES PERES CONSULTORIA &amp; CONTABILIDADE LTDA, CNPJ 44.961.875/0001-25,
            CF/DF 0810995100100, www.peresperes.com.br, registrado como sociedade limitada perante o
            Conselho Federal de Contabilidade sob o no DF-003366.
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/politica-de-privacidade" className="hover:text-white transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import { SITE_INFO } from '@/lib/data'
import { MapPin, Phone, Mail, Linkedin, Instagram, Youtube } from 'lucide-react'
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
              <img src={logoPadrao} alt="Peres & Peres" className="h-16 w-auto object-contain" />
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Expertise e Segurança para o seu Negócio. Contabilidade Tributária de alta
              performance.
            </p>
            <div className="space-y-2 text-sm text-gray-300 mt-6">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{SITE_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{SITE_INFO.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{SITE_INFO.email}</span>
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4 text-primary">Navegação</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/sobre" className="hover:text-white transition-colors">
                  Sobre o Escritório
                </Link>
              </li>
              <li>
                <Link to="/servicos" className="hover:text-white transition-colors">
                  Áreas de Atuação
                </Link>
              </li>
              <li>
                <Link to="/casos" className="hover:text-white transition-colors">
                  Casos de Sucesso
                </Link>
              </li>
              <li>
                <Link to="/glossario" className="hover:text-white transition-colors">
                  Glossário Tributário
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="font-serif font-semibold text-lg mb-4 text-primary">
              Boletim Tributário
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Receba atualizações semanais sobre legislação e jurisprudência do CARF/STF.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                required
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary"
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-black font-bold">
                Assinar
              </Button>
            </form>
            <div className="flex items-center gap-4 mt-8">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Peres & Peres Contabilidade. Todos os direitos
            reservados.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className="font-semibold text-gray-400">{SITE_INFO.crc}</span>
            <Link to="/privacidade" className="hover:text-primary transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

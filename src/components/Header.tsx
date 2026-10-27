import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import logoNova from '@/assets/logo-nova-800x200-b63d1.png'

const NAV_LINKS = [
  { name: 'Início', path: '/' },
  { name: 'Sobre Nós', path: '/sobre' },
  { name: 'Serviços', path: '/servicos' },
  { name: 'Metodologia', path: '/casos' },
  { name: 'Blog', path: '/blog' },
  { name: 'Recursos', path: '/recursos' },
]
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close sheet on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-transparent bg-black',
        isScrolled ? 'py-3 shadow-lg' : 'py-5',
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logoNova}
            alt="PERES PERES Consultoria e Contabilidade"
            className="h-10 md:h-12 w-auto object-contain"
          />
          <span className="sr-only font-serif">PERES PERES Consultoria e Contabilidade</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm transition-colors',
                location.pathname === link.path
                  ? 'text-white font-medium underline decoration-[#FAB319] decoration-2 underline-offset-8'
                  : 'text-neutral-300 hover:text-white',
              )}
            >
              {link.name}
            </Link>
          ))}
          <Button
            asChild
            className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold border-none px-5 py-2 shadow-sm transition-colors"
          >
            <Link to="/contato">Agendar Consultoria</Link>
          </Button>
        </nav>

        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px] bg-black border-l-gray-800 text-white"
          >
            <nav className="flex flex-col gap-4 mt-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'block px-2 py-2 text-base transition-colors',
                    location.pathname === link.path
                      ? 'text-white font-semibold border-l-2 border-[#FAB319] pl-3'
                      : 'text-neutral-300 hover:text-white',
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  asChild
                  className="w-full bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold"
                >
                  <Link to="/contato">Agendar Consultoria</Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

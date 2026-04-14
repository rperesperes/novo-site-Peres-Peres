import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X, Landmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { name: 'Início', path: '/' },
  { name: 'Sobre Nós', path: '/sobre' },
  { name: 'Serviços', path: '/servicos' },
  { name: 'Casos de Sucesso', path: '/casos' },
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
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-transparent',
        isScrolled ? 'glass-effect py-3 shadow-sm' : 'bg-transparent py-5',
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Landmark className="h-8 w-8 text-accent" />
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl leading-none tracking-tight">
              Peres & Peres
            </span>
            <span className="text-[10px] uppercase tracking-widest text-secondary font-semibold">
              Contabilidade Tributária
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-accent',
                location.pathname === link.path ? 'text-accent font-semibold' : 'text-primary/80',
              )}
            >
              {link.name}
            </Link>
          ))}
          <Button asChild className="bg-accent hover:bg-accent/90 text-white border-none">
            <Link to="/contato">Agendar Consultoria</Link>
          </Button>
        </nav>

        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-primary">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'block px-2 py-1 text-lg transition-colors hover:text-accent',
                    location.pathname === link.path ? 'text-accent font-bold' : 'text-foreground',
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                <Button asChild className="w-full bg-accent hover:bg-accent/90 text-white">
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

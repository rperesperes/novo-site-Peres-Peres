import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'
import {
  Scale,
  Stethoscope,
  Brain,
  Ruler,
  DraftingCompass,
  Megaphone,
  GraduationCap,
  ShoppingCart,
  Rocket,
  HeartPulse,
  Plane,
  Landmark,
} from 'lucide-react'

interface SegmentoCard {
  nome: string
  icon: LucideIcon
  desc: string
  link: string
}

const PROFISSOES_REGULAMENTADAS: SegmentoCard[] = [
  {
    nome: 'Advogados',
    icon: Scale,
    desc: 'o peso de escolher entre pessoa física e sociedade de advogados, com honorários e sucumbência na conta certa.',
    link: '/profissoes-regulamentadas/advogados',
  },
  {
    nome: 'Médicos',
    icon: Stethoscope,
    desc: 'a PJ que cresce junto com a agenda, e a folha que decide o anexo antes de o faturamento decidir.',
    link: '/profissoes-regulamentadas/medicos',
  },
  {
    nome: 'Psicólogos',
    icon: Brain,
    desc: 'a clínica que vira empresa sem que o atendimento pareça empresa, e o custo disso quando ninguém olha.',
    link: '/profissoes-regulamentadas/psicologos',
  },
  {
    nome: 'Engenheiros',
    icon: Ruler,
    desc: 'a receita por medição e a retenção do cliente que chega descontada antes de o dinheiro cair.',
    link: '/profissoes-regulamentadas/engenheiros',
  },
  {
    nome: 'Arquitetos',
    icon: DraftingCompass,
    desc: 'o projeto parcelado por etapa e o Fator R que desce o anexo no mês em que a folha esfria.',
    link: '/profissoes-regulamentadas/arquitetos',
  },
]

const SEGMENTOS: SegmentoCard[] = [
  {
    nome: 'Agências de Publicidade',
    icon: Megaphone,
    desc: 'a verba de mídia que entra no caixa como se fosse receita, e o imposto cobrado sobre o que é repasse.',
    link: '/contabilidade-para-agencias-de-publicidade',
  },
  {
    nome: 'Educação e Treinamentos',
    icon: GraduationCap,
    desc: 'o infoproduto que o município enquadra de um jeito e o estado de outro, e a nota que trava no meio.',
    link: '/contabilidade-para-educacao-e-treinamentos',
  },
  {
    nome: 'E-commerce',
    icon: ShoppingCart,
    desc: 'o sublimite de faturamento que tira o ICMS do Simples sem aviso, e o DIFAL que chega junto.',
    link: '/contabilidade-para-ecommerce',
  },
  {
    nome: 'Startups e Tech',
    icon: Rocket,
    desc: 'a rodada de investimento que entra como receita, e o regime escolhido no primeiro ano que prende os seguintes.',
    link: '/contabilidade-para-startups-e-tech',
  },
  {
    nome: 'Clínicas Médicas',
    icon: HeartPulse,
    desc: 'a presunção de oito por cento que exige estrutura empresarial, e não só o código certo.',
    link: '/contabilidade-para-clinicas-medicas',
  },
  {
    nome: 'Agências de Viagem',
    icon: Plane,
    desc: 'o pacote antecipado que vira caixa hoje e custo depois, e a comissão que se confunde com repasse.',
    link: '/contabilidade-para-agencias-de-viagem',
  },
]

const ESTRUTURA_PATRIMONIAL: SegmentoCard[] = [
  {
    nome: 'Holdings Familiares e Patrimoniais',
    icon: Landmark,
    desc: 'o imóvel que passa de geração em geração sem documento, e o inventário que custa mais do que o planejamento.',
    link: '/holdings-familiares-e-patrimoniais',
  },
]

const GRUPOS: {
  id: string
  titulo: string
  abertura: string
  cards: SegmentoCard[]
  lg: string
}[] = [
  {
    id: 'profissoes-regulamentadas',
    titulo: 'Profissões regulamentadas',
    abertura:
      'Se a sua atividade é regulamentada por conselho de classe, a primeira decisão não é quanto custa a contabilidade. É como a sua profissão pode ser tributada, e essa resposta muda conforme a forma societária escolhida.',
    cards: PROFISSOES_REGULAMENTADAS,
    lg: 'lg:grid-cols-3',
  },
  {
    id: 'areas-de-atuacao',
    titulo: 'Áreas de atuação',
    abertura:
      'Se a sua empresa já opera, o problema raramente é abrir CNPJ. É fazer a rotina do mês caber no regime certo, com a base de cálculo correta e o limite de faturamento sob controle.',
    cards: SEGMENTOS,
    lg: 'lg:grid-cols-3',
  },
  {
    id: 'estrutura-patrimonial',
    titulo: 'Estrutura patrimonial',
    abertura:
      'Organizar patrimônio não é serviço de contabilidade. É decisão de família e de sucessão, com efeito tributário, e por isso é tratada em separado.',
    cards: ESTRUTURA_PATRIMONIAL,
    lg: 'lg:grid-cols-3',
  },
]

function SegmentoCardItem({ item }: { item: SegmentoCard }) {
  return (
    <Card className="flex flex-col justify-between transition-all duration-300 border border-neutral-200 bg-white shadow-sm hover:shadow-md">
      <div>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="h-10 w-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center">
              <item.icon className="h-5 w-5 text-black" aria-hidden="true" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-black font-sans">{item.nome}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-sans">
            {item.desc}
          </p>
        </CardContent>
      </div>
      <div className="p-6 pt-4 border-t border-neutral-100">
        <Button
          asChild
          variant="outline"
          className="w-full font-semibold h-10 text-xs md:text-sm border-neutral-200 text-neutral-800 hover:bg-neutral-50"
        >
          <Link to={item.link} className="inline-flex items-center justify-center gap-1.5">
            <span>Saiba mais informações</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  )
}

const ATALHOS: { href: string; texto: string; apoio: string }[] = [
  {
    href: '#profissoes-regulamentadas',
    texto: 'Minha profissão é regulamentada por conselho',
    apoio: 'OAB, CRM, CRP, CREA ou CAU. A primeira decisão é como a atividade pode ser tributada.',
  },
  {
    href: '#areas-de-atuacao',
    texto: 'Tenho empresa e preciso da rotina em ordem',
    apoio: 'Apuração, base de cálculo, limite de faturamento e obrigações do mês.',
  },
  {
    href: '#estrutura-patrimonial',
    texto: 'Quero organizar patrimônio e sucessão',
    apoio: 'Bens, imóveis e herdeiros, em estrutura separada da empresa.',
  },
]

/** Atalho "Qual é o seu caso hoje?": links de âncora para os três grupos (não filtra nada). */
function CasoAtalho() {
  return (
    <nav aria-labelledby="qual-caso-hoje" className="mb-10">
      <h3
        id="qual-caso-hoje"
        className="text-sm md:text-base font-semibold text-neutral-700 font-sans mb-3"
      >
        Qual é o seu caso hoje?
      </h3>
      <ul className="grid gap-3 sm:grid-cols-3">
        {ATALHOS.map((atalho) => (
          <li key={atalho.href}>
            <Link
              to={atalho.href}
              className="block h-full rounded-lg border border-neutral-200 bg-white px-4 py-3 transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              <span className="block text-sm font-medium text-neutral-800 font-sans leading-snug">
                {atalho.texto}
              </span>
              <span className="mt-1 block text-xs text-neutral-500 font-sans leading-relaxed">
                {atalho.apoio}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Grade de doze cards em três grupos, do bloco Segmentos e Áreas de Atuação. */
export function SegmentosGrade() {
  return (
    <div>
      <CasoAtalho />
      <div className="space-y-10">
        {GRUPOS.map((grupo) => (
          <div key={grupo.id} id={grupo.id} className="scroll-mt-24">
            <p className="text-xs md:text-sm text-neutral-500 leading-relaxed font-sans mb-1">
              {grupo.abertura}
            </p>
            <h3 className="text-lg md:text-xl font-bold text-black font-sans mb-4">
              {grupo.titulo}
            </h3>
            <div className={`grid sm:grid-cols-2 ${grupo.lg} gap-6 items-stretch`}>
              {grupo.cards.map((item) => (
                <SegmentoCardItem key={item.nome} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Briefcase,
  Plus,
  Pencil,
  XCircle,
  Clock,
  Sparkles,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  getAllJobVacancies,
  createJobVacancy,
  updateJobVacancy,
  closeJobVacancy,
  type JobVacancyRecord,
  type JobVacancyInput,
  type JobContractType,
  type JobModality,
  type JobStatus,
} from '@/services/job_vacancies'

const INITIAL_FORM: JobVacancyInput = {
  title: '',
  area: 'Contábil e Tributária',
  contract_type: 'CLT',
  modality: 'Híbrido',
  description: '',
  responsibilities: '',
  requirements: '',
  status: 'aberta',
  display_order: 1,
}

export default function AdminJobs() {
  const { toast } = useToast()
  const [vacancies, setVacancies] = useState<JobVacancyRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Modal de criação / edição
  const [modalOpen, setModalOpen] = useState(false)
  const [editingVacancy, setEditingVacancy] = useState<JobVacancyRecord | null>(null)
  const [formData, setFormData] = useState<JobVacancyInput>(INITIAL_FORM)
  const [saving, setSaving] = useState(false)

  // Diálogo de confirmação para encerrar vaga
  const [closeDialogOpen, setCloseDialogOpen] = useState(false)
  const [vacancyToClose, setVacancyToClose] = useState<JobVacancyRecord | null>(null)
  const [closing, setClosing] = useState(false)

  const loadVacancies = async () => {
    try {
      setLoading(true)
      const data = await getAllJobVacancies()
      setVacancies(data)
    } catch (err: any) {
      console.error('Erro ao carregar vagas:', err)
      toast({
        title: 'Erro ao carregar vagas',
        description: err?.message || 'Não foi possível buscar as vagas do banco.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVacancies()
  }, [])

  const handleOpenCreate = () => {
    setEditingVacancy(null)
    setFormData({
      ...INITIAL_FORM,
      display_order: vacancies.length + 1,
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (v: JobVacancyRecord) => {
    setEditingVacancy(v)
    setFormData({
      title: v.title,
      area: v.area,
      contract_type: v.contract_type,
      modality: v.modality,
      description: v.description,
      responsibilities: v.responsibilities || '',
      requirements: v.requirements || '',
      status: v.status,
      display_order: v.display_order ?? 1,
    })
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Por favor, informe o título da vaga.',
        variant: 'destructive',
      })
      return
    }

    if (!formData.description.trim()) {
      toast({
        title: 'Descrição obrigatória',
        description: 'Por favor, informe a descrição e o resumo da vaga.',
        variant: 'destructive',
      })
      return
    }

    try {
      setSaving(true)
      if (editingVacancy) {
        await updateJobVacancy(editingVacancy.id, formData)
        toast({
          title: 'Vaga atualizada!',
          description: `A vaga "${formData.title}" foi atualizada com sucesso.`,
        })
      } else {
        await createJobVacancy(formData)
        toast({
          title: 'Vaga cadastrada!',
          description: `A vaga "${formData.title}" foi criada com sucesso.`,
        })
      }
      setModalOpen(false)
      loadVacancies()
    } catch (err: any) {
      console.error('Erro ao salvar vaga:', err)
      toast({
        title: 'Falha ao salvar vaga',
        description: err?.message || 'Ocorreu um erro ao comunicar com o servidor.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleConfirmClose = async () => {
    if (!vacancyToClose) return
    try {
      setClosing(true)
      await closeJobVacancy(vacancyToClose.id)
      toast({
        title: 'Vaga encerrada',
        description: `A vaga "${vacancyToClose.title}" foi encerrada. Ela não aparecerá no site, mas continua registrada no painel.`,
      })
      setCloseDialogOpen(false)
      setVacancyToClose(null)
      loadVacancies()
    } catch (err: any) {
      console.error('Erro ao encerrar vaga:', err)
      toast({
        title: 'Erro ao encerrar vaga',
        description: err?.message || 'Não foi possível alterar a situação da vaga.',
        variant: 'destructive',
      })
    } finally {
      setClosing(false)
    }
  }

  const formatDate = (isoString?: string) => {
    if (!isoString) return '-'
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return isoString
    }
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FAB319]">
              Recrutamento & Seleção
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Briefcase className="h-7 w-7 text-[#FAB319]" />
            Gestão de Vagas
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Gerencie as oportunidades de trabalho do escritório. Vagas abertas aparecem
            automaticamente na página pública Trabalhe Conosco; vagas encerradas são ocultadas do
            site e preservadas aqui como histórico.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs"
          >
            <a href="/trabalhe-conosco" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Ver no site
            </a>
          </Button>
          <Button
            type="button"
            onClick={handleOpenCreate}
            className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-xs shadow-md"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Nova Vaga
          </Button>
        </div>
      </div>

      {/* Lista de Vagas */}
      {loading ? (
        <Card className="bg-neutral-950 border-neutral-800 p-12 text-center">
          <div className="h-6 w-6 border-2 border-[#FAB319] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-400">Carregando vagas cadastradas...</p>
        </Card>
      ) : vacancies.length === 0 ? (
        <Card className="bg-neutral-950 border-neutral-800 p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#FAB319] mx-auto mb-4">
            <Briefcase className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Nenhuma vaga cadastrada</h3>
          <p className="text-sm text-neutral-400 max-w-md mx-auto mb-6">
            Você ainda não cadastrou nenhuma vaga de emprego. Crie a primeira vaga para que ela
            fique visível aos candidatos na página Trabalhe Conosco.
          </p>
          <Button
            type="button"
            onClick={handleOpenCreate}
            className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Cadastrar primeira vaga
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
            <span>
              Total de vagas: <strong className="text-white">{vacancies.length}</strong> (
              <span className="text-green-400">
                {vacancies.filter((v) => v.status === 'aberta').length} abertas
              </span>{' '}
              / {vacancies.filter((v) => v.status === 'encerrada').length} encerradas)
            </span>
          </div>

          <div className="grid gap-3">
            {vacancies.map((v) => {
              const isOpen = v.status === 'aberta'

              return (
                <Card
                  key={v.id}
                  className={`bg-neutral-950 border transition-all ${
                    isOpen
                      ? 'border-neutral-800 hover:border-neutral-700'
                      : 'border-neutral-900 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isOpen ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] hover:bg-emerald-500/20">
                            Aberta (visível no site)
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-neutral-700 text-neutral-400 text-[11px] bg-neutral-900"
                          >
                            Encerrada (histórico)
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className="border-neutral-800 text-neutral-300 text-[11px] bg-neutral-900"
                        >
                          {v.area}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-neutral-800 text-neutral-300 text-[11px] bg-neutral-900"
                        >
                          {v.contract_type} • {v.modality}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-bold text-white truncate">{v.title}</h3>

                      <p className="text-xs text-neutral-400 line-clamp-2 max-w-3xl">
                        {v.description}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-neutral-500 font-mono pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Última alteração: {formatDate(v.updated || v.created)}
                        </span>
                        {v.display_order !== undefined && <span>Ordem: #{v.display_order}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(v)}
                        className="border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white text-xs h-9 px-3"
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1.5 text-[#FAB319]" />
                        Editar
                      </Button>

                      {isOpen ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setVacancyToClose(v)
                            setCloseDialogOpen(true)
                          }}
                          className="border-neutral-800 bg-neutral-900 text-red-400 hover:bg-red-950/60 hover:text-red-300 hover:border-red-800 text-xs h-9 px-3"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1.5" />
                          Encerrar
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              await updateJobVacancy(v.id, { status: 'aberta' })
                              toast({
                                title: 'Vaga reaberta!',
                                description: `A vaga "${v.title}" voltou a ficar visível no site.`,
                              })
                              loadVacancies()
                            } catch (err: any) {
                              toast({
                                title: 'Erro ao reabrir vaga',
                                description: err?.message,
                                variant: 'destructive',
                              })
                            }
                          }}
                          className="border-neutral-800 bg-neutral-900 text-emerald-400 hover:bg-emerald-950/60 hover:text-emerald-300 text-xs h-9 px-3"
                        >
                          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                          Reabrir
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Modal Formulário de Criação/Edição */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-neutral-950 border-neutral-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[#FAB319]" />
              {editingVacancy ? 'Editar Vaga' : 'Nova Vaga'}
            </DialogTitle>
            <DialogDescription className="text-neutral-400 text-xs">
              Preencha os campos da vaga. Textos longos como descrição, responsabilidades e
              requisitos aceitam múltiplos parágrafos.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Título da Vaga *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Assistente Contábil e Fiscal"
                  required
                  className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-[#FAB319]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Área / Setor *</label>
                <Input
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="Ex: Contábil e Tributária"
                  required
                  className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-[#FAB319]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Tipo de Contratação *
                </label>
                <Select
                  value={formData.contract_type}
                  onValueChange={(val: JobContractType) =>
                    setFormData({ ...formData, contract_type: val })
                  }
                >
                  <SelectTrigger className="bg-neutral-900 border-neutral-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                    <SelectItem value="CLT">CLT</SelectItem>
                    <SelectItem value="Estágio">Estágio</SelectItem>
                    <SelectItem value="PJ">PJ</SelectItem>
                    <SelectItem value="Temporário">Temporário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Modalidade de Trabalho *
                </label>
                <Select
                  value={formData.modality}
                  onValueChange={(val: JobModality) => setFormData({ ...formData, modality: val })}
                >
                  <SelectTrigger className="bg-neutral-900 border-neutral-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                    <SelectItem value="Presencial">Presencial</SelectItem>
                    <SelectItem value="Híbrido">Híbrido</SelectItem>
                    <SelectItem value="Remoto">Remoto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Situação *</label>
                <Select
                  value={formData.status}
                  onValueChange={(val: JobStatus) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger className="bg-neutral-900 border-neutral-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                    <SelectItem value="aberta">Aberta (visível no site)</SelectItem>
                    <SelectItem value="encerrada">Encerrada (oculta do site)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Ordem de Exibição</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.display_order ?? 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-[#FAB319]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                Descrição Geral / Resumo da Posição *
              </label>
              <Textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Apresentação do papel, contexto do departamento e objetivos da vaga..."
                required
                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-[#FAB319] text-xs leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                Responsabilidades e Atividades
              </label>
              <Textarea
                rows={4}
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                placeholder="• Executar conciliações contábeis e fiscais...&#10;• Apoiar no atendimento consultivo..."
                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-[#FAB319] text-xs leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                Requisitos e Qualificações
              </label>
              <Textarea
                rows={4}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="• Formação ou graduação em andamento em Ciências Contábeis...&#10;• Conhecimento em rotinas fiscais..."
                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-[#FAB319] text-xs leading-relaxed"
              />
            </div>

            <DialogFooter className="pt-4 border-t border-neutral-800 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                disabled={saving}
                className="border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold"
              >
                {saving ? 'Salvando...' : editingVacancy ? 'Atualizar Vaga' : 'Publicar Vaga'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmação para Encerrar */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent className="bg-neutral-950 border-neutral-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Confirmar encerramento de vaga
            </DialogTitle>
            <DialogDescription className="text-neutral-400 text-xs">
              Tem certeza de que deseja encerrar a vaga{' '}
              <strong className="text-white">"{vacancyToClose?.title}"</strong>?
            </DialogDescription>
          </DialogHeader>

          <p className="text-xs text-neutral-300 leading-relaxed py-2">
            Ela deixará de ser exibida no site para os candidatos, mas permanecerá salva no painel
            com status <strong>Encerrada</strong> para fins de histórico e consulta futura.
          </p>

          <DialogFooter className="pt-4 border-t border-neutral-800 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCloseDialogOpen(false)}
              disabled={closing}
              className="border-neutral-800 bg-neutral-900 text-neutral-300"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmClose}
              disabled={closing}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs"
            >
              {closing ? 'Encerrando...' : 'Sim, encerrar vaga'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

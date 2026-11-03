import { useState, useEffect, useCallback } from 'react'
import {
  Save,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Link2,
  ExternalLink,
  RefreshCw,
  EyeOff,
  Loader2,
} from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useRealtime } from '@/hooks/use-realtime'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import {
  SOCIAL_NETWORKS,
  getSocialLinks,
  saveSocialLinks,
  isValidSocialUrl,
  normalizeSocialUrl,
  type SocialLinksMap,
  type SocialNetworkId,
} from '@/services/social_links'
import { SocialNetworkIcon } from '@/components/SocialNetworkIcon'

const ALLOWED_EMAIL = 'rafael@peresperes.com.br'

interface IntegrationStatus {
  email: { configured: boolean; missing: string[] }
  google: { configured: boolean; missing: string[] }
}

interface IntegrationsState {
  loading: boolean
  error: string | null
  data: IntegrationStatus | null
}

function formFromRecord(record: SocialLinksMap | null): SocialLinksMap {
  const values: SocialLinksMap = {}
  for (const net of SOCIAL_NETWORKS) {
    values[net.id] = record?.[net.id] || ''
  }
  return values
}

function statusLabel(configured: boolean): string {
  return configured ? 'Configurado' : 'Não configurado'
}

export default function AdminSettings() {
  const { toast } = useToast()
  const [values, setValues] = useState<SocialLinksMap>(() => formFromRecord(null))
  const [recordId, setRecordId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [integrations, setIntegrations] = useState<IntegrationsState>({
    loading: true,
    error: null,
    data: null,
  })

  const loadLinks = useCallback(async () => {
    try {
      setLoading(true)
      setLoadError(null)
      const rec = await getSocialLinks()
      setValues(formFromRecord(rec))
      setRecordId(rec ? rec.id : null)
    } catch (err) {
      console.error('Erro ao carregar links de redes sociais:', err)
      setLoadError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const loadIntegrations = useCallback(async () => {
    setIntegrations({ loading: true, error: null, data: null })
    try {
      const res = await pb.send('/backend/v1/integrations-status', { method: 'GET' })
      setIntegrations({ loading: false, error: null, data: res as IntegrationStatus })
    } catch (err) {
      console.error('Erro ao consultar integrações:', err)
      setIntegrations({ loading: false, error: getErrorMessage(err), data: null })
    }
  }, [])

  useEffect(() => {
    loadLinks()
    loadIntegrations()
  }, [loadLinks, loadIntegrations])

  // Mantém a tela em sincronia se outro dispositivo salvar.
  useRealtime('social_links', () => {
    ;(async () => {
      try {
        const rec = await getSocialLinks()
        setValues(formFromRecord(rec))
        setRecordId(rec ? rec.id : null)
        setDirty(false)
      } catch (_) {
        // Silencioso: o recarregamento manual cobre falhas pontuais.
      }
    })()
  })

  const setField = (network: SocialNetworkId, value: string) => {
    setValues((prev) => ({ ...prev, [network]: value }))
    setDirty(true)
  }

  const handleClear = (network: SocialNetworkId) => {
    setValues((prev) => ({ ...prev, [network]: '' }))
    setDirty(true)
  }

  const handleSave = async () => {
    const trimmed: SocialLinksMap = {}
    let invalidNetwork: string | null = null
    for (const net of SOCIAL_NETWORKS) {
      const raw = (values[net.id] || '').trim()
      if (raw && !isValidSocialUrl(raw)) {
        invalidNetwork = net.label
        break
      }
      trimmed[net.id] = raw
    }
    if (invalidNetwork) {
      toast({
        title: 'Link inválido',
        description: `O link de ${invalidNetwork} não é uma URL https válida. Corrija o campo antes de salvar.`,
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    const result = await saveSocialLinks(trimmed)
    setSaving(false)

    if (!result.ok) {
      toast({
        title: 'Erro ao salvar',
        description: result.message || 'Não foi possível salvar os links.',
        variant: 'destructive',
      })
      return
    }

    setValues(trimmed)
    setDirty(false)
    const refreshed = await getSocialLinks()
    if (refreshed) {
      setValues(formFromRecord(refreshed))
      setRecordId(refreshed.id)
    }
    toast({
      title: 'Configurações salvas',
      description:
        'Links de redes sociais atualizados. No site, cada rede aparece somente com o link preenchido.',
    })
  }

  return (
    <div className="space-y-8 font-sans">
      <SettingsHeader dirty={dirty} saving={saving} onSave={handleSave} />

      {loadError ? (
        <Card className="bg-neutral-950 border-red-900 text-neutral-100">
          <CardContent className="py-12 px-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400 mx-auto">
              <XCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Erro ao carregar configurações</h3>
            <p className="text-sm text-neutral-400 max-w-md mx-auto">
              {loadError} Não foi possível ler os links salvos no banco de dados.
            </p>
            <Button
              type="button"
              onClick={loadLinks}
              className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Recarregar
            </Button>
          </CardContent>
        </Card>
      ) : loading ? (
        <Card className="bg-neutral-950 border-neutral-800 text-neutral-100">
          <CardContent className="py-12 text-center">
            <div className="h-6 w-6 border-2 border-[#FAB319] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-neutral-400">Carregando configurações...</p>
          </CardContent>
        </Card>
      ) : (
        <SocialLinksCard
          values={values}
          recordId={recordId}
          saving={saving}
          setField={setField}
          handleClear={handleClear}
          onSave={handleSave}
        />
      )}

      <IntegrationsCard integrations={integrations} onReload={loadIntegrations} />
    </div>
  )
}

function SettingsHeader({
  dirty,
  saving,
  onSave,
}: {
  dirty: boolean
  saving: boolean
  onSave: () => void
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-[#FAB319] block mb-1">
          Painel Administrativo
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Configurações</h1>
        <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
          Links das redes sociais exibidas no site e estado das integrações, sem exibir valores de
          chaves.
        </p>
      </div>
      <Button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold shadow-md shrink-0"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        {saving ? 'Salvando...' : dirty ? 'Salvar alterações' : 'Salvar'}
      </Button>
    </div>
  )
}

function SocialLinksCard({
  values,
  recordId,
  saving,
  setField,
  handleClear,
  onSave,
}: {
  values: SocialLinksMap
  recordId: string | null
  saving: boolean
  setField: (network: SocialNetworkId, value: string) => void
  handleClear: (network: SocialNetworkId) => void
  onSave: () => void
}) {
  return (
    <Card className="border border-neutral-800 bg-neutral-900/60 text-neutral-100 rounded-xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-white">
          <Link2 className="h-5 w-5 text-[#FAB319]" />
          Links das redes sociais
        </CardTitle>
        <CardDescription className="text-sm text-neutral-400">
          Cole o link completo, começando com https, de cada rede. No site aparece somente as redes
          com link preenchido. Blog e WhatsApp não entram nesta lista e seguem fixos no site.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recordId ? (
          <p className="text-xs text-neutral-500">Configuração salva, pronta para edição.</p>
        ) : (
          <p className="text-xs text-neutral-500">
            Nenhum link salvo ainda. Preencha os desejados e clique em Salvar.
          </p>
        )}
        {SOCIAL_NETWORKS.map((net) => {
          const value = values[net.id] || ''
          const invalid = Boolean(value.trim()) && !isValidSocialUrl(value)
          return (
            <div
              key={net.id}
              className="grid grid-cols-1 sm:grid-cols-[11rem,1fr,auto] items-center gap-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="inline-flex p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-[#FAB319] shrink-0">
                  <SocialNetworkIcon network={net.id} className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-white whitespace-nowrap">
                  {net.label}
                </span>
              </div>
              <Input
                value={value}
                onChange={(e) => setField(net.id, e.target.value)}
                placeholder="https://..."
                inputMode="url"
                autoComplete="off"
                className={cn(
                  'bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-[#FAB319]',
                  invalid && 'border-red-700 focus-visible:ring-red-600',
                )}
              />
              <div className="flex items-center gap-2 justify-end">
                {invalid ? (
                  <Badge className="bg-red-950 border border-red-800 text-red-300 text-[11px]">
                    https obrigatório
                  </Badge>
                ) : value.trim() ? (
                  <>
                    <a
                      href={normalizeSocialUrl(value)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Abrir link em nova aba"
                      aria-label={`Abrir link de ${net.label} em nova aba`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-[#FAB319] hover:bg-neutral-800 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleClear(net.id)}
                      title={`Remover ${net.label} do site`}
                      aria-label={`Remover ${net.label} do site`}
                      className="h-9 w-9 border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-neutral-700 text-neutral-500 text-[11px]"
                  >
                    Sem link
                  </Badge>
                )}
              </div>
            </div>
          )
        })}
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Salvando...' : 'Salvar links'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function IntegrationsCard({
  integrations,
  onReload,
}: {
  integrations: IntegrationsState
  onReload: () => void
}) {
  return (
    <Card className="border border-neutral-800 bg-neutral-900/60 text-neutral-100 rounded-xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-white">
          <ShieldCheck className="h-5 w-5 text-[#FAB319]" />
          Estado das integrações
        </CardTitle>
        <CardDescription className="text-sm text-neutral-400">
          Somente leitura: indica se cada integração está configurada no servidor. As chaves nunca
          são exibidas nesta tela.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {integrations.loading && (
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando estado das integrações...
          </div>
        )}
        {!integrations.loading && integrations.error && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-white">Falha ao consultar integrações</h4>
                <p className="text-xs text-red-300 mt-1">{integrations.error}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onReload}
              className="border-red-800 bg-red-900/40 text-red-100 hover:bg-red-800 hover:text-white text-xs h-8 shrink-0"
            >
              Tentar novamente
            </Button>
          </div>
        )}
        {!integrations.loading && !integrations.error && integrations.data && (
          <div className="space-y-4">
            <IntegrationRow
              title="Envio de e-mails (Resend)"
              configured={integrations.data.email.configured}
              missing={integrations.data.email.missing}
            />
            <Separator className="bg-neutral-800" />
            <IntegrationRow
              title="Login com Google"
              configured={integrations.data.google.configured}
              missing={integrations.data.google.missing}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function IntegrationRow({
  title,
  configured,
  missing,
}: {
  title: string
  configured: boolean
  missing: string[]
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-neutral-400 mt-0.5 max-w-lg">
          {configured
            ? 'Todas as chaves necessárias estão presentes no servidor.'
            : `Ação necessária: configure ${missing.join(', ')} no armazenamento seguro do servidor (Skip Cloud).`}
        </p>
        <p className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3 text-neutral-600" />
          Acesso administrativo permitido apenas para {ALLOWED_EMAIL}.
        </p>
      </div>
      <Badge
        className={cn(
          'border text-xs font-medium px-2.5 py-1 shrink-0',
          configured
            ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
            : 'bg-red-950 border-red-800 text-red-300',
        )}
      >
        {configured ? (
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
        ) : (
          <AlertTriangle className="h-3.5 w-3.5 mr-1" />
        )}
        {statusLabel(configured)}
      </Badge>
    </div>
  )
}

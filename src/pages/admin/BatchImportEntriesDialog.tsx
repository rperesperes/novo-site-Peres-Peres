import { useState, useMemo } from 'react'
import {
  IndexRecord,
  IndexEntryRecord,
  importIndexEntriesBatch,
  BatchImportEntryItem,
} from '@/services/indices'
import { parseBatchInput, ParsedBatchLine } from '@/lib/indexBatchParser'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Copy,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
  XCircle,
} from 'lucide-react'

interface BatchImportEntriesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: IndexRecord
  existingEntries: IndexEntryRecord[]
  onSuccess: () => Promise<void>
}

export function BatchImportEntriesDialog({
  open,
  onOpenChange,
  item,
  existingEntries,
  onSuccess,
}: BatchImportEntriesDialogProps) {
  const [rawText, setRawText] = useState('')
  const [duplicateResolution, setDuplicateResolution] = useState<'update' | 'skip'>('update')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)

  const { toast } = useToast()

  // Mapa de datas existentes para rápida verificação de duplicidade
  const existingDateMap = useMemo(() => {
    const map = new Map<string, { id: string; value: string }>()
    for (const ent of existingEntries) {
      if (ent.effective_date) {
        map.set(ent.effective_date.trim(), { id: ent.id, value: ent.value })
      }
    }
    return map
  }, [existingEntries])

  // Parse do texto em tempo real conforme o usuário cola/digita
  const parseResult = useMemo(() => {
    if (!rawText.trim()) return null
    return parseBatchInput(rawText, existingDateMap)
  }, [rawText, existingDateMap])

  // Exemplo de preenchimento rápido
  const handleInsertExample = () => {
    if (item.slug === 'salario-minimo-federal') {
      setRawText(
        `01/01/2025; 1.518,00; Decreto Federal nº 12.345
01/01/2024; 1.412,00; Medida Provisória nº 1.200
01/05/2023; 1.320,00; Lei Federal nº 14.663
01/01/2023; 1.302,00; Medida Provisória nº 1.143
01/01/2022; 1.212,00; Medida Provisória nº 1.091`,
      )
    } else if (item.slug.includes('selic')) {
      setRawText(
        `01/10/2026; 13,65%; Copom nº 262
01/08/2026; 13,25%; Copom nº 261
01/06/2026; 12,75%; Copom nº 260
01/04/2026; 12,25%; Copom nº 259`,
      )
    } else {
      setRawText(
        `01/10/2026; 0,55%; Série oficial
01/09/2026; 0,48%; Série oficial
01/08/2026; 0,32%; Série oficial
01/07/2026; 0,21%; Série oficial`,
      )
    }
  }

  const handleClear = () => {
    setRawText('')
  }

  const handleConfirmImport = async () => {
    if (!parseResult || parseResult.validCount === 0) {
      toast({
        title: 'Nenhum registro válido',
        description: 'Cole as vigências no campo antes de confirmar a importação.',
        variant: 'destructive',
      })
      return
    }

    if (parseResult.hasErrors) {
      toast({
        title: 'Erros pendentes',
        description: 'Corrija ou remova as linhas com erro antes de importar.',
        variant: 'destructive',
      })
      return
    }

    const itemsToImport: BatchImportEntryItem[] = parseResult.lines
      .filter((line) => line.isValid)
      .map((line) => {
        let action: 'create' | 'update' | 'skip' = 'create'
        if (line.isExistingDuplicate) {
          action = duplicateResolution === 'update' ? 'update' : 'skip'
        }
        return {
          effective_date: line.dateStr,
          value: line.valueStr,
          notes: line.notesStr,
          action,
          existingEntryId: line.existingEntryId,
        }
      })

    try {
      setIsSubmitting(true)
      setProgress({ current: 0, total: itemsToImport.length })

      const result = await importIndexEntriesBatch(
        item.id,
        item.slug,
        itemsToImport,
        (current, total) => {
          setProgress({ current, total })
        },
      )

      if (result.errors.length > 0) {
        toast({
          title: 'Importação parcial',
          description: `${result.createdCount} criadas, ${result.updatedCount} atualizadas. Alguns registros falharam.`,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Importação concluída com sucesso',
          description: `${result.createdCount} novas vigências criadas, ${result.updatedCount} atualizadas e ${result.skippedCount} mantidas sem alteração.`,
        })
      }

      onOpenChange(false)
      setRawText('')
      await onSuccess()
    } catch (err: any) {
      console.error('Erro na importação em lote:', err)
      toast({
        title: 'Falha na importação',
        description: err?.message || 'Ocorreu um erro ao gravar o lote de vigências.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
      setProgress(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-4xl max-h-[90vh] flex flex-col font-sans">
        <DialogHeader className="border-b border-neutral-800 pb-3">
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-white">
            <FileSpreadsheet className="h-5 w-5 text-[#FAB319]" />
            Importação de Vigências em Lote: {item.name}
          </DialogTitle>
          <p className="text-xs text-neutral-400 mt-1">
            Adicione dezenas de vigências à série histórica de uma vez. Cole linhas copiadas do
            Excel, Google Sheets, arquivos CSV ou texto comum.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
          {/* Instrução e Formato Esperado */}
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#FAB319] flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" /> Formato esperado por linha
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleInsertExample}
                className="h-7 text-xs border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 flex items-center gap-1"
              >
                <Copy className="h-3 w-3 text-[#FAB319]" /> Inserir exemplo preenchido
              </Button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Uma vigência por linha, no formato{' '}
              <code className="bg-neutral-900 px-1.5 py-0.5 rounded text-[#FAB319] font-mono">
                data;valor
              </code>{' '}
              ou com notas opcionais{' '}
              <code className="bg-neutral-900 px-1.5 py-0.5 rounded text-[#FAB319] font-mono">
                data;valor;fundamento
              </code>
              . Também aceita separação por tabulação (ao colar direto de planilhas).
            </p>

            <div className="bg-neutral-900/90 rounded border border-neutral-800 p-2 font-mono text-[11px] text-neutral-400">
              <span className="text-neutral-500 block mb-0.5">Exemplo:</span>
              <span className="text-neutral-200 block">01/01/2026; 1.621,00; Decreto Federal</span>
              <span className="text-neutral-200 block">01/01/2025; 1.518,00</span>
              <span className="text-neutral-200 block">01/07/1994; 64,79; Plano Real</span>
            </div>
          </div>

          {/* Área de Colagem */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-neutral-300">
                Cole aqui os registros (uma vigência por linha)
              </label>
              {rawText && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-[11px] text-neutral-400 hover:text-red-400 underline font-sans"
                >
                  Limpar texto
                </button>
              )}
            </div>

            <Textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Cole aqui as linhas. Exemplo:&#10;01/01/2026; 1.621,00&#10;01/01/2025; 1.518,00&#10;01/01/2024; 1.412,00"
              rows={6}
              className="bg-neutral-950 border-neutral-800 text-white font-mono text-xs focus:border-[#FAB319] resize-y"
            />
          </div>

          {/* Seção de Resolução de Duplicatas */}
          {parseResult && parseResult.duplicatesCount > 0 && (
            <div className="bg-amber-950/40 border border-amber-800/80 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[#FAB319] shrink-0" />
                <span className="text-xs font-bold text-white">
                  {parseResult.duplicatesCount} vigência
                  {parseResult.duplicatesCount === 1 ? '' : 's'} com data já existente na série
                  histórica
                </span>
              </div>
              <p className="text-xs text-amber-200 leading-relaxed">
                Escolha o que fazer com os registros cuja data de início já consta cadastrada para
                este índice:
              </p>
              <div className="flex items-center gap-4 text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-200">
                  <input
                    type="radio"
                    name="dup-resolution"
                    value="update"
                    checked={duplicateResolution === 'update'}
                    onChange={() => setDuplicateResolution('update')}
                    className="accent-[#FAB319]"
                  />
                  <span>Atualizar valor da vigência existente</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-neutral-200">
                  <input
                    type="radio"
                    name="dup-resolution"
                    value="skip"
                    checked={duplicateResolution === 'skip'}
                    onChange={() => setDuplicateResolution('skip')}
                    className="accent-[#FAB319]"
                  />
                  <span>Ignorar duplicatas (manter o valor atual)</span>
                </label>
              </div>
            </div>
          )}

          {/* Prévia dos Registros */}
          {parseResult && (
            <div className="space-y-2.5 pt-1">
              {/* Barra de Estatísticas da Prévia */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-neutral-950 border border-neutral-800 rounded p-2.5">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                    Total de Linhas
                  </span>
                  <span className="text-base font-bold text-white font-mono">
                    {parseResult.lines.length}
                  </span>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded p-2.5">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                    Linhas Válidas
                  </span>
                  <span className="text-base font-bold text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {parseResult.validCount}
                  </span>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded p-2.5">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                    Linhas com Erro
                  </span>
                  <span
                    className={`text-base font-bold font-mono flex items-center gap-1 ${parseResult.invalidCount > 0 ? 'text-red-400' : 'text-neutral-500'}`}
                  >
                    {parseResult.invalidCount > 0 && <XCircle className="h-3.5 w-3.5" />}
                    {parseResult.invalidCount}
                  </span>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded p-2.5">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                    Intervalo de Datas
                  </span>
                  <span
                    className="text-xs font-mono text-neutral-200 block truncate"
                    title={`${parseResult.firstDate || 'N/A'} até ${parseResult.lastDate || 'N/A'}`}
                  >
                    {parseResult.firstDate
                      ? `${parseResult.firstDate} a ${parseResult.lastDate}`
                      : 'Nenhuma'}
                  </span>
                </div>
              </div>

              {/* Mensagem de Bloqueio em caso de erro */}
              {parseResult.hasErrors && (
                <div className="bg-red-950/60 border border-red-800 rounded p-3 text-xs text-red-200 flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-semibold">
                      Existem linhas com erro de interpretação
                    </strong>
                    Por segurança, a gravação fica bloqueada até que todas as linhas sejam
                    corrigidas ou removidas do texto acima.
                  </div>
                </div>
              )}

              {/* Tabela de Prévia Detalhada */}
              <div className="border border-neutral-800 rounded-lg overflow-hidden max-h-56 overflow-y-auto">
                <Table>
                  <TableHeader className="bg-neutral-950 sticky top-0">
                    <TableRow className="border-neutral-800 hover:bg-transparent">
                      <TableHead className="text-neutral-400 font-mono text-[10px] py-1.5 w-12">
                        Linha
                      </TableHead>
                      <TableHead className="text-neutral-400 font-mono text-[10px] py-1.5">
                        Data Vigência
                      </TableHead>
                      <TableHead className="text-neutral-400 font-mono text-[10px] py-1.5">
                        Valor
                      </TableHead>
                      <TableHead className="text-neutral-400 font-mono text-[10px] py-1.5">
                        Observação
                      </TableHead>
                      <TableHead className="text-neutral-400 font-mono text-[10px] py-1.5">
                        Situação
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parseResult.lines.map((line, idx) => (
                      <TableRow
                        key={idx}
                        className={`border-neutral-800/80 text-xs ${
                          !line.isValid
                            ? 'bg-red-950/30 hover:bg-red-950/40 text-red-200'
                            : line.isExistingDuplicate
                              ? 'bg-amber-950/20 hover:bg-amber-950/30'
                              : 'hover:bg-neutral-800/30'
                        }`}
                      >
                        <TableCell className="font-mono text-neutral-400 py-1.5">
                          {line.lineNumber}
                        </TableCell>
                        <TableCell className="font-mono py-1.5 font-medium">
                          {line.dateStr || <span className="text-neutral-500 italic">vazia</span>}
                        </TableCell>
                        <TableCell className="font-mono py-1.5 font-bold">
                          {line.valueStr || <span className="text-neutral-500 italic">vazio</span>}
                        </TableCell>
                        <TableCell className="text-neutral-300 py-1.5 truncate max-w-xs">
                          {line.notesStr || <span className="text-neutral-600">sem notas</span>}
                        </TableCell>
                        <TableCell className="py-1.5">
                          {!line.isValid ? (
                            <Badge className="bg-red-900/80 text-red-200 border-red-700 text-[10px] font-sans">
                              {line.errorMessage || 'Erro'}
                            </Badge>
                          ) : line.isExistingDuplicate ? (
                            <Badge className="bg-amber-950 text-amber-300 border-amber-800 text-[10px] font-sans">
                              {duplicateResolution === 'update'
                                ? `Atualizará (era ${line.existingValue})`
                                : `Pulará (mantém ${line.existingValue})`}
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-950 text-emerald-400 border-emerald-800 text-[10px] font-sans">
                              Nova vigência
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Informação sobre a regra de vigência vigente */}
              <div className="bg-neutral-950 border border-neutral-800 rounded p-2.5 text-[11px] text-neutral-400 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#FAB319] shrink-0" />
                <span>
                  Regra de resumo preservada: ao término da importação, o valor vigente exibido
                  continuará apontando para a vigência de maior data de início de toda a série
                  histórica.
                </span>
              </div>
            </div>
          )}

          {/* Barra de Progresso Durante a Gravação */}
          {isSubmitting && progress && (
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FAB319]" /> Gravando vigências
                  no banco de dados...
                </span>
                <span className="font-mono text-[#FAB319]">
                  {progress.current} de {progress.total}
                </span>
              </div>
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#FAB319] h-full transition-all duration-150"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-neutral-800 pt-3 gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
            className="border-neutral-800 text-neutral-300 hover:bg-neutral-800 text-xs"
          >
            Cancelar
          </Button>

          <Button
            type="button"
            disabled={
              isSubmitting || !parseResult || parseResult.validCount === 0 || parseResult.hasErrors
            }
            onClick={handleConfirmImport}
            className="bg-[#FAB319] hover:bg-[#e0a116] text-black font-semibold text-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Gravando Lote...
              </>
            ) : (
              `Importar ${parseResult?.validCount || 0} Vigências de Uma Vez`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

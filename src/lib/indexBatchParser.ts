import { parseDateFlexible } from '@/services/indices'

export interface ParsedBatchLine {
  rawLine: string
  lineNumber: number
  dateStr: string
  valueStr: string
  notesStr?: string
  parsedDate: Date | null
  isValid: boolean
  errorMessage?: string
  isExistingDuplicate?: boolean
  existingEntryId?: string
  existingValue?: string
  status?: 'create' | 'update' | 'skip'
}

export interface ParseBatchResult {
  lines: ParsedBatchLine[]
  validCount: number
  invalidCount: number
  duplicatesCount: number
  firstDate: string | null
  lastDate: string | null
  hasErrors: boolean
}

/**
 * Normaliza data para formato DD/MM/AAAA para comparação consistente
 */
export function normalizeDateToBR(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Interpreta uma linha de texto contendo dados de vigência.
 * Aceita:
 * - Separadores: tabulação (\t), ponto e vírgula (;), vírgula (,) quando não parte do número decimal, ou múltiplos espaços
 * - Formatos de data: DD/MM/AAAA, DD/MM/AA, AAAA-MM-DD, MM/AAAA
 * - Valores: R$ 1.621,00, 1621, 13,65%, 0,1500%, etc.
 * - Notas opcionais na terceira coluna: data;valor;notas
 */
export function parseSingleBatchLine(
  raw: string,
  lineNumber: number,
  existingDateMap?: Map<string, { id: string; value: string }>,
): ParsedBatchLine {
  const trimmed = raw.trim()
  if (!trimmed) {
    return {
      rawLine: raw,
      lineNumber,
      dateStr: '',
      valueStr: '',
      parsedDate: null,
      isValid: false,
      errorMessage: 'Linha vazia',
    }
  }

  let parts: string[] = []

  // 1. Tabulação (planilha como Excel/Sheets)
  if (trimmed.includes('\t')) {
    parts = trimmed
      .split('\t')
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
  }
  // 2. Ponto e vírgula (CSV brasileiro comum)
  else if (trimmed.includes(';')) {
    parts = trimmed
      .split(';')
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
  }
  // 3. Pipe (|)
  else if (trimmed.includes('|')) {
    parts = trimmed
      .split('|')
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
  }
  // 4. Vírgula ou espaço: cuidado com valores decimais tipo "13,65%" ou "1.621,00"
  else {
    // Tenta separar por espaço duplo ou hífen com espaços
    if (/\s{2,}|\s-\s|\s:\s/.test(trimmed)) {
      parts = trimmed
        .split(/\s{2,}|\s-\s|\s:\s/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
    } else if (trimmed.includes(',')) {
      // Se tiver vírgula, verifica se a primeira parte parece ser uma data (ex: 01/01/2026, 1621 ou 2026-01-01, 13,65)
      const firstCommaIndex = trimmed.indexOf(',')
      const candidateDate = trimmed.substring(0, firstCommaIndex).trim()
      const candidateRest = trimmed.substring(firstCommaIndex + 1).trim()

      const parsedCandidateDate = parseDateFlexible(candidateDate)
      if (parsedCandidateDate) {
        // A primeira coluna é a data, o restante é valor (e talvez notas)
        // Se no candidateRest houver vírgula separando notas (ex: "13,65%, Copom"), precisamos checar
        // Para simplificar, se candidateRest começar com número ou símbolo de moeda:
        parts = [candidateDate, candidateRest]
      } else {
        // Tenta separar por espaços simples: ex "01/01/2026 1.621,00"
        const spaceParts = trimmed.split(/\s+/).filter(Boolean)
        if (spaceParts.length >= 2) {
          parts = spaceParts
        } else {
          parts = trimmed
            .split(',')
            .map((p) => p.trim())
            .filter(Boolean)
        }
      }
    } else {
      parts = trimmed.split(/\s+/).filter(Boolean)
    }
  }

  if (parts.length < 2) {
    return {
      rawLine: raw,
      lineNumber,
      dateStr: parts[0] || '',
      valueStr: '',
      parsedDate: null,
      isValid: false,
      errorMessage:
        'Formato inválido. Esperado data e valor separados por ponto e vírgula, tabulação ou vírgula.',
    }
  }

  const rawDate = parts[0]
  const rawValue = parts[1]
  const rawNotes = parts.slice(2).join(' ') || undefined

  // Validação da data
  let parsedDate = parseDateFlexible(rawDate)

  // Suporte a mês/ano (ex: 07/1994 -> 01/07/1994)
  if (!parsedDate && /^\d{1,2}\/\d{4}$/.test(rawDate.trim())) {
    const [mm, yyyy] = rawDate.trim().split('/')
    parsedDate = new Date(Number(yyyy), Number(mm) - 1, 1)
  }

  if (!parsedDate || isNaN(parsedDate.getTime())) {
    return {
      rawLine: raw,
      lineNumber,
      dateStr: rawDate,
      valueStr: rawValue,
      notesStr: rawNotes,
      parsedDate: null,
      isValid: false,
      errorMessage: `Data "${rawDate}" não reconhecida. Use DD/MM/AAAA ou AAAA-MM-DD.`,
    }
  }

  // Verifica se o ano é razoável (1900 até 2100)
  const year = parsedDate.getFullYear()
  if (year < 1900 || year > 2100) {
    return {
      rawLine: raw,
      lineNumber,
      dateStr: rawDate,
      valueStr: rawValue,
      notesStr: rawNotes,
      parsedDate: null,
      isValid: false,
      errorMessage: `Ano "${year}" fora do intervalo permitido (1900 a 2100).`,
    }
  }

  // Formata a data normalizada em DD/MM/AAAA para exibição e gravação padrão
  const normalizedDateStr = normalizeDateToBR(parsedDate)

  // Validação do valor
  const cleanVal = rawValue.trim()
  if (!cleanVal) {
    return {
      rawLine: raw,
      lineNumber,
      dateStr: normalizedDateStr,
      valueStr: '',
      notesStr: rawNotes,
      parsedDate,
      isValid: false,
      errorMessage: 'Valor ou alíquota não informado.',
    }
  }

  // Checagem de duplicata com a base existente
  let isExistingDuplicate = false
  let existingEntryId: string | undefined
  let existingValue: string | undefined

  if (existingDateMap) {
    const existing = existingDateMap.get(normalizedDateStr)
    if (existing) {
      isExistingDuplicate = true
      existingEntryId = existing.id
      existingValue = existing.value
    }
  }

  return {
    rawLine: raw,
    lineNumber,
    dateStr: normalizedDateStr,
    valueStr: cleanVal,
    notesStr: rawNotes,
    parsedDate,
    isValid: true,
    isExistingDuplicate,
    existingEntryId,
    existingValue,
    status: isExistingDuplicate ? 'update' : 'create',
  }
}

/**
 * Faz a análise de todo o texto colado pelo usuário
 */
export function parseBatchInput(
  rawText: string,
  existingDateMap?: Map<string, { id: string; value: string }>,
): ParseBatchResult {
  const rawLines = rawText.split('\n')
  const lines: ParsedBatchLine[] = []

  // Rastreia datas dentro do próprio lote para evitar duplicatas internas
  const seenDatesInBatch = new Set<string>()

  let lineNumber = 0
  for (const rawLine of rawLines) {
    lineNumber++
    if (!rawLine.trim()) {
      continue // ignora linhas em branco
    }

    const parsed = parseSingleBatchLine(rawLine, lineNumber, existingDateMap)

    // Se válida, verifica se já apareceu nesta mesma colagem
    if (parsed.isValid && parsed.dateStr) {
      if (seenDatesInBatch.has(parsed.dateStr)) {
        parsed.isValid = false
        parsed.errorMessage = `Data ${parsed.dateStr} repetida mais de uma vez no mesmo texto colado.`
      } else {
        seenDatesInBatch.add(parsed.dateStr)
      }
    }

    lines.push(parsed)
  }

  // Ordena por data cronológica para a prévia (mais recente primeiro)
  const validLines = lines.filter((l) => l.isValid && l.parsedDate !== null)
  const invalidLines = lines.filter((l) => !l.isValid)
  const duplicates = validLines.filter((l) => l.isExistingDuplicate)

  let firstDate: string | null = null
  let lastDate: string | null = null

  if (validLines.length > 0) {
    const sortedChronological = [...validLines].sort(
      (a, b) => (a.parsedDate?.getTime() || 0) - (b.parsedDate?.getTime() || 0),
    )
    firstDate = sortedChronological[0].dateStr
    lastDate = sortedChronological[sortedChronological.length - 1].dateStr
  }

  return {
    lines,
    validCount: validLines.length,
    invalidCount: invalidLines.length,
    duplicatesCount: duplicates.length,
    firstDate,
    lastDate,
    hasErrors: invalidLines.length > 0,
  }
}

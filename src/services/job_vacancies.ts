import pb from '@/lib/pocketbase/client'

export type JobContractType = 'CLT' | 'Estágio' | 'PJ' | 'Temporário'
export type JobModality = 'Presencial' | 'Híbrido' | 'Remoto'
export type JobStatus = 'aberta' | 'encerrada'

export interface JobVacancyRecord {
  id: string
  title: string
  area: string
  contract_type: JobContractType
  modality: JobModality
  description: string
  responsibilities?: string
  requirements?: string
  status: JobStatus
  display_order?: number
  created?: string
  updated?: string
}

export interface JobVacancyInput {
  title: string
  area: string
  contract_type: JobContractType
  modality: JobModality
  description: string
  responsibilities?: string
  requirements?: string
  status: JobStatus
  display_order?: number
}

/**
 * Retorna somente vagas com status "aberta" para a página pública
 */
export const getPublicJobVacancies = async (): Promise<JobVacancyRecord[]> => {
  return pb.collection('job_vacancies').getFullList<JobVacancyRecord>({
    filter: "status = 'aberta'",
    sort: 'display_order,-created',
  })
}

/**
 * Retorna todas as vagas (abertas e encerradas) para o painel administrativo
 */
export const getAllJobVacancies = async (): Promise<JobVacancyRecord[]> => {
  return pb.collection('job_vacancies').getFullList<JobVacancyRecord>({
    sort: 'display_order,-updated',
  })
}

export const getJobVacancy = async (id: string): Promise<JobVacancyRecord> => {
  return pb.collection('job_vacancies').getOne<JobVacancyRecord>(id)
}

export const createJobVacancy = async (data: JobVacancyInput): Promise<JobVacancyRecord> => {
  return pb.collection('job_vacancies').create<JobVacancyRecord>(data)
}

export const updateJobVacancy = async (
  id: string,
  data: Partial<JobVacancyInput>,
): Promise<JobVacancyRecord> => {
  return pb.collection('job_vacancies').update<JobVacancyRecord>(id, data)
}

export const closeJobVacancy = async (id: string): Promise<JobVacancyRecord> => {
  return pb.collection('job_vacancies').update<JobVacancyRecord>(id, {
    status: 'encerrada',
  })
}

export const deleteJobVacancy = async (id: string): Promise<boolean> => {
  return pb.collection('job_vacancies').delete(id)
}

/**
 * Exportações públicas do módulo de Contratos
 * @module modules/contracts
 */

export { ContractsDashboard } from './views/ContractsDashboard'
export { ContractForm } from './components/ContractForm'
export { PenaltyAlertsWidget } from './components/PenaltyAlertsWidget'
export { PenaltySimulator } from './components/PenaltySimulator'
export { contractsAPI } from './contracts.api'
export type { Contract, ContractStatus, ContractType, ContractStats } from './types'
export * from './types/penalties'


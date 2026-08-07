export type PillarId = 'growth' | 'engagement' | 'core' | 'platform'

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export type PartnerToolId =
  | 'testmcp'
  | 'forgeqa'
  | 'release-gate'
  | 'war-room'

export type AppPlatformId =
  | 'ios'
  | 'android'
  | 'tvos'
  | 'firetv'
  | 'androidtv'
  | 'roku'

export interface Pillar {
  id: PillarId
  name: string
  short: string
  ticketCount: number
  focus: string
}

export interface AppPlatform {
  id: AppPlatformId
  name: string
  family: string
  shareNote: string
}

export type TicketKind = 'feature' | 'bug'

export interface TrainTicket {
  key: string
  title: string
  kind: TicketKind
  pillar: PillarId
  surfaces: string[]
  risk: RiskLevel
}

export interface Collision {
  id: string
  surface: string
  pillars: PillarId[]
  whyItMatters: string
  severity: RiskLevel
}

export interface P0Case {
  id: string
  title: string
  platform: string
  reason: string
  partner: PartnerToolId
}

export interface PartnerTool {
  id: PartnerToolId
  name: string
  role: string
  url: string
  when: string
}

export interface StakeholderItem {
  id: string
  label: string
  detail: string
  defaultChecked: boolean
}

export interface WeeklyRelease {
  version: string
  product: string
  shipWindow: string
  riskScore: number
  riskLabel: string
  summary: string
  problemNote: string
  platforms: AppPlatform[]
  pillars: Pillar[]
  tickets: TrainTicket[]
  collisions: Collision[]
  /** Aimed P0-P2 (manual) slice for this release — automation not counted. */
  p0p2Slice: P0Case[]
  fullLibraryNote: string
  stakeholderItems: StakeholderItem[]
  residualRisk: string
}

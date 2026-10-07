// ─── Auth ───────────────────────────────────────────────────────

export interface User {
  userId: string
  username: string
  email: string
  role: 'Admin' | 'Moderator' | 'Player'
  displayName?: string
  avatarUrl?: string
  sessionId?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  displayName: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  sessionId: string
  userId: string
  username: string
  email: string
  role: 'Admin' | 'Moderator' | 'Player'
  displayName?: string
  avatarUrl?: string
}

export interface RegisterResponse {
  userId: string
  username: string
  email: string
  displayName: string
  message: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
}

// ─── Account (Admin) ────────────────────────────────────────────

export interface Account {
  id: string
  username: string
  email: string
  role: 'Admin' | 'Moderator' | 'Player'
  isActive: boolean
  isBanned: boolean
  banReason?: string
  displayName?: string
  avatarUrl?: string
  createdAt: string
  lastLoginAt?: string
}

export interface CreateAccountRequest {
  username: string
  email: string
  password: string
  role: 'Admin' | 'Moderator' | 'Player'
}

export interface UpdateAccountRequest {
  email?: string
  displayName?: string
  avatarUrl?: string
  isActive?: boolean
}

export interface BanAccountRequest {
  reason: string
}

// ─── Profile (Web Portal) ───────────────────────────────────────

export interface ProfileResponse {
  userId: string
  username: string
  email: string
  role: 'Admin' | 'Moderator' | 'Player'
  displayName?: string
  avatarUrl?: string
  totalPlaytimeMin: number
  createdAt: string
  lastLoginAt?: string
}

export interface UpdateProfileRequest {
  displayName?: string
  avatarUrl?: string
  currentPassword?: string
  newPassword?: string
}

export interface GameHistoryItem {
  sessionId: string
  lobbyCode: string
  chapterId?: string
  role: string
  status: 'Active' | 'Completed' | 'Abandoned'
  startedAt: string
  endedAt?: string
  durationMin?: number
  totalScore: number
}

export interface GameHistoryResponse {
  totalGames: number
  completedGames: number
  abandonedGames: number
  totalScore: number
  totalPlaytimeMin: number
  recentGames: GameHistoryItem[]
}

// ─── Active Rooms ───────────────────────────────────────────────

export interface ActiveRoom {
  lobbyCode: string
  player1Id: string
  player2Id?: string
  player1Username?: string
  player2Username?: string
  status: 'Waiting' | 'Ready' | 'InGame' | 'Finished'
  chapterId?: string
  createdAt: string
}

// ─── Lobby ──────────────────────────────────────────────────────

export interface Lobby {
  lobbyCode: string
  player1Id: string
  player2Id?: string
  dadUserId: string
  childUserId?: string
  status: string
  chapterId?: string
  createdAt: string
}

// ─── Game Logs (Admin Audit) ────────────────────────────────────

export interface ModActionLog {
  id: string
  adminId: string
  targetType: string
  targetId: string
  action: string
  createdAt: string
}

// ─── Game Content ───────────────────────────────────────────────

export interface Character {
  id: string
  name: string
  role: 'Dad' | 'Child'
  isActive: boolean
  attributes?: Record<string, unknown>
}

export interface Chapter {
  id: string
  name: string
  theme: string
  orderIndex: number
  description: string
  isActive?: boolean
}

export interface Quest {
  id: string
  name: string
  questType: string
  description: string
  orderIndex: number
  chapterId: string
  isActive?: boolean
}

// ─── API Helpers ────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  message: string
  statusCode?: number
  errors?: string[]
}


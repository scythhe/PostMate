import type { AuthUser, PostMateUserData } from '../types'

const USERS_KEY = 'postmate_users'
const CURRENT_USER_KEY = 'postmate_current_user'

const demoUser: AuthUser = {
  name: 'Demo Owner',
  email: 'demo@postmate.local',
  password: 'demo-password',
}

export function getUsers(): AuthUser[] {
  return readJson<AuthUser[]>(USERS_KEY, [])
}

export function getCurrentUser(): AuthUser | null {
  const email = localStorage.getItem(CURRENT_USER_KEY)
  if (!email) return null
  return getUsers().find((user) => user.email === email) ?? null
}

export function signUpUser(user: AuthUser) {
  const email = normalizeEmail(user.email)
  const users = getUsers()

  if (users.some((existingUser) => existingUser.email === email)) {
    throw new Error('An account with this email already exists.')
  }

  const nextUser = { ...user, email }
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, nextUser]))
  setCurrentUser(nextUser)
  return nextUser
}

export function signInUser(emailValue: string, password: string) {
  const email = normalizeEmail(emailValue)
  const user = getUsers().find((existingUser) => existingUser.email === email)

  if (!user || user.password !== password) {
    throw new Error('That email and password do not match. Please try again.')
  }

  setCurrentUser(user)
  return user
}

export function continueWithDemoAccount() {
  const users = getUsers()
  const existingDemo = users.find((user) => user.email === demoUser.email)

  if (!existingDemo) {
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, demoUser]))
  }

  const user = existingDemo ?? demoUser
  setCurrentUser(user)
  return user
}

export function setCurrentUser(user: AuthUser) {
  localStorage.setItem(CURRENT_USER_KEY, user.email)
}

export function signOutUser() {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function getUserData(email: string): PostMateUserData {
  return readJson<PostMateUserData>(dataKey(email), {
    businessProfile: null,
    businessAssets: null,
    savedPosts: [],
  })
}

export function saveUserData(email: string, data: PostMateUserData) {
  localStorage.setItem(dataKey(email), JSON.stringify(data))
}

function dataKey(email: string) {
  return `postmate_data_${normalizeEmail(email)}`
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function readJson<T>(key: string, fallback: T): T {
  const rawValue = localStorage.getItem(key)
  if (!rawValue) return fallback

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return fallback
  }
}

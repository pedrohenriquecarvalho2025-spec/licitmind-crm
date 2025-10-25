// Demo Supabase client that works without real backend
import { mockUser, mockProfile, mockEditals, mockUsers, mockPipelines, mockPipelineStages, mockGoogleDriveFolders } from './mockData'
import type { Database } from './database.types'

type Edital = Database['public']['Tables']['editals']['Row']
type EditalInsert = Database['public']['Tables']['editals']['Insert']

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Local storage keys
const STORAGE_KEYS = {
  editals: 'licitaflow_demo_editals',
  pipelines: 'licitaflow_demo_pipelines',
  stages: 'licitaflow_demo_stages',
  driveFolders: 'licitaflow_demo_drive_folders',
  user: 'licitaflow_demo_user',
  session: 'licitaflow_demo_session'
}

// Mock organization data
const mockOrganization = {
  id: 'org-demo-123',
  name: 'Empresa Demo',
  slug: 'empresa-demo',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

// Get editals from localStorage or use mock data
const getStoredEditals = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.editals)
  return stored ? JSON.parse(stored) : mockEditals
}

// Save editals to localStorage
const saveEditals = (editals: any[]) => {
  localStorage.setItem(STORAGE_KEYS.editals, JSON.stringify(editals))
}

// Get pipelines from localStorage or use mock data
const getStoredPipelines = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.pipelines)
  return stored ? JSON.parse(stored) : mockPipelines
}

// Save pipelines to localStorage
const savePipelines = (pipelines: any[]) => {
  localStorage.setItem(STORAGE_KEYS.pipelines, JSON.stringify(pipelines))
}

// Get stages from localStorage or use mock data
const getStoredStages = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.stages)
  return stored ? JSON.parse(stored) : mockPipelineStages
}

// Save stages to localStorage
const saveStages = (stages: any[]) => {
  localStorage.setItem(STORAGE_KEYS.stages, JSON.stringify(stages))
}

// Get drive folders from localStorage or use mock data
const getStoredDriveFolders = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.driveFolders)
  return stored ? JSON.parse(stored) : mockGoogleDriveFolders
}

// Save drive folders to localStorage
const saveDriveFolders = (folders: any[]) => {
  localStorage.setItem(STORAGE_KEYS.driveFolders, JSON.stringify(folders))
}

// Check if user is "logged in"
const isLoggedIn = () => {
  return localStorage.getItem(STORAGE_KEYS.session) === 'active'
}

// Demo auth methods
const demoAuth = {
  async getSession() {
    await delay(100)
    if (isLoggedIn()) {
      return {
        data: {
          session: {
            user: mockUser,
            access_token: 'demo-token',
            refresh_token: 'demo-refresh',
            expires_at: Date.now() + 3600000,
            token_type: 'bearer'
          }
        },
        error: null
      }
    }
    return { data: { session: null }, error: null }
  },

  async signInWithPassword({ email, password }: { email: string; password: string }) {
    await delay(500)
    
    // Accept any email/password for demo
    if (email && password) {
      localStorage.setItem(STORAGE_KEYS.session, 'active')
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(mockUser))
      
      return {
        data: {
          user: mockUser,
          session: {
            user: mockUser,
            access_token: 'demo-token',
            refresh_token: 'demo-refresh',
            expires_at: Date.now() + 3600000,
            token_type: 'bearer'
          }
        },
        error: null
      }
    }
    
    return {
      data: { user: null, session: null },
      error: { message: 'Email ou senha incorretos' }
    }
  },

  async signUp({ email, password }: { email: string; password: string }) {
    await delay(500)
    
    if (email && password) {
      localStorage.setItem(STORAGE_KEYS.session, 'active')
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(mockUser))
      
      return {
        data: {
          user: mockUser,
          session: {
            user: mockUser,
            access_token: 'demo-token',
            refresh_token: 'demo-refresh',
            expires_at: Date.now() + 3600000,
            token_type: 'bearer'
          }
        },
        error: null
      }
    }
    
    return {
      data: { user: null, session: null },
      error: { message: 'Dados inválidos' }
    }
  },

  async signOut() {
    await delay(200)
    localStorage.removeItem(STORAGE_KEYS.session)
    localStorage.removeItem(STORAGE_KEYS.user)
    return { error: null }
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    // Simulate auth state change
    setTimeout(() => {
      if (isLoggedIn()) {
        callback('SIGNED_IN', {
          user: mockUser,
          access_token: 'demo-token',
          refresh_token: 'demo-refresh',
          expires_at: Date.now() + 3600000,
          token_type: 'bearer'
        })
      } else {
        callback('SIGNED_OUT', null)
      }
    }, 100)

    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    }
  }
}

// Demo database methods
const createTableQuery = (tableName: string) => {
  const queries = {
    user_profiles: {
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          order: (column: string, options?: any) => ({
            async then(resolve: any) {
              await delay(200)
              if (!isLoggedIn()) {
                resolve({ data: [], error: { message: 'Not authenticated' } })
                return
              }
              const users = [mockProfile, ...mockUsers.slice(1).map(u => ({
                ...mockProfile,
                id: u.id,
                full_name: u.full_name,
                email: u.full_name.toLowerCase().replace(' ', '.') + '@demo.com',
                role: 'analista' as const
              }))]
              resolve({ data: users, error: null })
            }
          }),
          single: async () => {
            await delay(200)
            if (!isLoggedIn()) {
              return { data: null, error: { message: 'Not authenticated' } }
            }
            return { data: mockProfile, error: null }
          }
        })
      })
    },
    organizations: {
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            await delay(200)
            if (!isLoggedIn()) {
              return { data: null, error: { message: 'Not authenticated' } }
            }
            return { data: mockOrganization, error: null }
          }
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          async then(resolve: any) {
            await delay(300)
            if (!isLoggedIn()) {
              resolve({ data: null, error: { message: 'Not authenticated' } })
              return
            }
            resolve({ data: { ...mockOrganization, ...data }, error: null })
          }
        })
      })
    },
    pipelines: {
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          order: (column: string, options?: any) => ({
            order: (column2: string, options2?: any) => ({
              async then(resolve: any) {
                await delay(200)
                if (!isLoggedIn()) {
                  resolve({ data: [], error: { message: 'Not authenticated' } })
                  return
                }
                const pipelines = getStoredPipelines()
                resolve({ data: pipelines, error: null })
              }
            })
          })
        })
      }),
      insert: (data: any[]) => ({
        async then(resolve: any) {
          await delay(400)
          if (!isLoggedIn()) {
            resolve({ data: null, error: { message: 'Not authenticated' } })
            return
          }
          
          const pipelines = getStoredPipelines()
          const newPipeline = {
            ...data[0],
            id: `pipeline-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          
          pipelines.push(newPipeline)
          savePipelines(pipelines)
          resolve({ data: [newPipeline], error: null })
        }
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          async then(resolve: any) {
            await delay(300)
            if (!isLoggedIn()) {
              resolve({ data: null, error: { message: 'Not authenticated' } })
              return
            }
            
            const pipelines = getStoredPipelines()
            const index = pipelines.findIndex((p: any) => p.id === value)
            
            if (index !== -1) {
              pipelines[index] = {
                ...pipelines[index],
                ...data,
                updated_at: new Date().toISOString(),
              }
              savePipelines(pipelines)
              resolve({ data: pipelines[index], error: null })
            } else {
              resolve({ data: null, error: { message: 'Pipeline not found' } })
            }
          }
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          async then(resolve: any) {
            await delay(200)
            if (!isLoggedIn()) {
              resolve({ data: null, error: { message: 'Not authenticated' } })
              return
            }
            
            const pipelines = getStoredPipelines()
            const filteredPipelines = pipelines.filter((p: any) => p.id !== value)
            savePipelines(filteredPipelines)
            resolve({ data: null, error: null })
          }
        })
      })
    },
    pipeline_stages: {
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          order: (column: string, options?: any) => ({
            async then(resolve: any) {
              await delay(200)
              if (!isLoggedIn()) {
                resolve({ data: [], error: { message: 'Not authenticated' } })
                return
              }
              const stages = getStoredStages()
              const filteredStages = stages.filter((s: any) => s.pipeline_id === value)
              resolve({ data: filteredStages, error: null })
            }
          }),
          limit: (count: number) => ({
            async then(resolve: any) {
              await delay(200)
              if (!isLoggedIn()) {
                resolve({ data: [], error: { message: 'Not authenticated' } })
                return
              }
              const stages = getStoredStages()
              const filteredStages = stages.filter((s: any) => s.pipeline_id === value)
              resolve({ data: filteredStages.slice(0, count), error: null })
            }
          })
        })
      }),
      insert: (data: any[]) => ({
        async then(resolve: any) {
          await delay(400)
          if (!isLoggedIn()) {
            resolve({ data: null, error: { message: 'Not authenticated' } })
            return
          }
          
          const stages = getStoredStages()
          const newStage = {
            ...data[0],
            id: `stage-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          
          stages.push(newStage)
          saveStages(stages)
          resolve({ data: [newStage], error: null })
        }
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          async then(resolve: any) {
            await delay(300)
            if (!isLoggedIn()) {
              resolve({ data: null, error: { message: 'Not authenticated' } })
              return
            }
            
            const stages = getStoredStages()
            const index = stages.findIndex((s: any) => s.id === value)
            
            if (index !== -1) {
              stages[index] = {
                ...stages[index],
                ...data,
                updated_at: new Date().toISOString(),
              }
              saveStages(stages)
              resolve({ data: stages[index], error: null })
            } else {
              resolve({ data: null, error: { message: 'Stage not found' } })
            }
          }
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          async then(resolve: any) {
            await delay(200)
            if (!isLoggedIn()) {
              resolve({ data: null, error: { message: 'Not authenticated' } })
              return
            }
            
            const stages = getStoredStages()
            const filteredStages = stages.filter((s: any) => s.id !== value)
            saveStages(filteredStages)
            resolve({ data: null, error: null })
          }
        })
      })
    },
    google_drive_folders: {
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          order: (column: string, options?: any) => ({
            async then(resolve: any) {
              await delay(200)
              if (!isLoggedIn()) {
                resolve({ data: [], error: { message: 'Not authenticated' } })
                return
              }
              const folders = getStoredDriveFolders()
              const filteredFolders = folders.filter((f: any) => f.edital_id === value)
              resolve({ data: filteredFolders, error: null })
            }
          })
        })
      }),
      insert: (data: any[]) => ({
        async then(resolve: any) {
          await delay(400)
          if (!isLoggedIn()) {
            resolve({ data: null, error: { message: 'Not authenticated' } })
            return
          }
          
          const folders = getStoredDriveFolders()
          const newFolder = {
            ...data[0],
            id: `drive-${Date.now()}`,
            created_at: new Date().toISOString(),
          }
          
          folders.push(newFolder)
          saveDriveFolders(folders)
          resolve({ data: [newFolder], error: null })
        }
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          async then(resolve: any) {
            await delay(200)
            if (!isLoggedIn()) {
              resolve({ data: null, error: { message: 'Not authenticated' } })
              return
            }
            
            const folders = getStoredDriveFolders()
            const filteredFolders = folders.filter((f: any) => f.id !== value)
            saveDriveFolders(filteredFolders)
            resolve({ data: null, error: null })
          }
        })
      })
    },
    editals: {
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          not: (column: string, operator: string, value: any) => ({
            order: (column: string, options?: any) => ({
              async then(resolve: any) {
                await delay(300)
                if (!isLoggedIn()) {
                  resolve({ data: [], error: { message: 'Not authenticated' } })
                  return
                }
                const editals = getStoredEditals()
                // Filter out editals where the specified column is null (for 'is' operator with null value)
                const filteredEditals = operator === 'is' && value === null 
                  ? editals.filter((e: any) => e[column] !== null)
                  : editals
                resolve({ data: filteredEditals, error: null })
              }
            })
          }),
          gte: (column: string, value: any) => ({
            lte: (column: string, value: any) => ({
              order: (column: string, options?: any) => ({
                async then(resolve: any) {
                  await delay(300)
                  if (!isLoggedIn()) {
                    resolve({ data: [], error: { message: 'Not authenticated' } })
                    return
                  }
                  const editals = getStoredEditals()
                  resolve({ data: editals, error: null })
                }
              })
            })
          }),
          order: (column: string, options?: any) => ({
            async then(resolve: any) {
              await delay(300)
              if (!isLoggedIn()) {
                resolve({ data: [], error: { message: 'Not authenticated' } })
                return
              }
              const editals = getStoredEditals()
              resolve({ data: editals, error: null })
            }
          })
        })
      }),
      user_profiles: {
        select: (columns: string) => ({
          eq: (column: string, value: any) => ({
            order: (column: string, options?: any) => ({
              async then(resolve: any) {
                await delay(200)
                if (!isLoggedIn()) {
                  resolve({ data: [], error: { message: 'Not authenticated' } })
                  return
                }
                resolve({ data: [mockProfile, ...mockUsers.slice(1).map(u => ({
                  ...mockProfile,
                  id: u.id,
                  full_name: u.full_name,
                  email: u.full_name.toLowerCase().replace(' ', '.') + '@demo.com',
                  role: 'analista'
                }))], error: null })
              }
            }),
            single: async () => {
              await delay(200)
              if (!isLoggedIn()) {
                return { data: null, error: { message: 'Not authenticated' } }
              }
              return { data: mockProfile, error: null }
            }
          })
        }),
        insert: (data: any[]) => ({
          async then(resolve: any) {
            await delay(400)
            if (!isLoggedIn()) {
              resolve({ data: null, error: { message: 'Not authenticated' } })
              return
            }
            resolve({ data: data, error: null })
          }
        }),
        update: (data: any) => ({
          eq: (column: string, value: any) => ({
            async then(resolve: any) {
              await delay(300)
              if (!isLoggedIn()) {
                resolve({ data: null, error: { message: 'Not authenticated' } })
                return
              }
              resolve({ data: { ...mockProfile, ...data }, error: null })
            }
          })
        }),
        delete: () => ({
          eq: (column: string, value: any) => ({
            async then(resolve: any) {
              await delay(200)
              if (!isLoggedIn()) {
                resolve({ data: null, error: { message: 'Not authenticated' } })
                return
              }
              resolve({ data: null, error: null })
            }
          })
        })
      },
      organizations: {
        select: (columns: string) => ({
          eq: (column: string, value: any) => ({
            single: async () => {
              await delay(200)
              if (!isLoggedIn()) {
                return { data: null, error: { message: 'Not authenticated' } }
              }
              return { data: mockOrganization, error: null }
            }
          })
        }),
        update: (data: any) => ({
          eq: (column: string, value: any) => ({
            async then(resolve: any) {
              await delay(300)
              if (!isLoggedIn()) {
                resolve({ data: null, error: { message: 'Not authenticated' } })
                return
              }
              resolve({ data: { ...mockOrganization, ...data }, error: null })
            }
          })
        })
      },
      insert: (data: EditalInsert[]) => ({
        async then(resolve: any) {
          await delay(400)
          if (!isLoggedIn()) {
            resolve({ data: null, error: { message: 'Not authenticated' } })
            return
          }
          
          const editals = getStoredEditals()
          const newEdital = {
            ...data[0],
            id: `edital-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            responsavel: data[0].responsavel_id ? 
              mockUsers.find(u => u.id === data[0].responsavel_id) || null : null
          }
          
          editals.unshift(newEdital)
          saveEditals(editals)
          resolve({ data: [newEdital], error: null })
        }
      }),
      update: (data: Partial<Edital>) => ({
        eq: (column: string, value: any) => ({
          async then(resolve: any) {
            await delay(300)
            if (!isLoggedIn()) {
              resolve({ data: null, error: { message: 'Not authenticated' } })
              return
            }
            
            const editals = getStoredEditals()
            const index = editals.findIndex((e: any) => e.id === value)
            
            if (index !== -1) {
              editals[index] = {
                ...editals[index],
                ...data,
                updated_at: new Date().toISOString(),
                responsavel: data.responsavel_id ? 
                  mockUsers.find(u => u.id === data.responsavel_id) || null : 
                  editals[index].responsavel
              }
              saveEditals(editals)
              resolve({ data: editals[index], error: null })
            } else {
              resolve({ data: null, error: { message: 'Edital not found' } })
            }
          }
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          async then(resolve: any) {
            await delay(200)
            if (!isLoggedIn()) {
              resolve({ data: null, error: { message: 'Not authenticated' } })
              return
            }
            
            const editals = getStoredEditals()
            const filteredEditals = editals.filter((e: any) => e.id !== value)
            saveEditals(filteredEditals)
            resolve({ data: null, error: null })
          }
        })
      })
    }
  }

  return queries[tableName as keyof typeof queries] || {}
}

// Mock Realtime channel
const createMockChannel = (channelName: string) => {
  return {
    on: (event: string, config: any, callback: Function) => {
      return {
        subscribe: () => {
          return {
            unsubscribe: () => {}
          }
        }
      }
    },
    subscribe: () => {
      return {
        unsubscribe: () => {}
      }
    },
    unsubscribe: () => {}
  }
}

// Demo Supabase client
export const demoSupabase = {
  auth: demoAuth,
  from: (tableName: string) => createTableQuery(tableName),
  channel: (channelName: string) => createMockChannel(channelName),
  rpc: async (functionName: string, params?: any) => {
    await delay(200)
    return { data: null, error: null }
  }
}
/**
 * View principal de Portais com abas
 */

import React, { useState, useEffect } from 'react'
import { Globe, Shield } from 'lucide-react'
import { BiddingPortalsManager } from '../components/BiddingPortalsManager'
import { PortalValidityMonitor } from '../components/PortalValidityMonitor'
import { portalsAPI } from '../portals.api'
import { useAuth } from '../../../hooks/useAuth'
import type { BiddingPortal } from '../types'

type TabView = 'portals' | 'monitor'

export function PortalsView() {
  const { profile } = useAuth()
  const [currentTab, setCurrentTab] = useState<TabView>('portals')
  const [portals, setPortals] = useState<BiddingPortal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPortals()
  }, [profile])

  const loadPortals = async () => {
    if (!profile?.organization_id) return

    try {
      setLoading(true)
      const data = await portalsAPI.listPortals(profile.organization_id)
      setPortals(data)
    } catch (error) {
      console.error('Error loading portals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePortalClick = (portal: BiddingPortal) => {
    // Aqui pode abrir um modal de detalhes ou navegar para outra view
    console.log('Portal clicked:', portal)
  }

  const criticalCount = portals.filter(
    p => p.status === 'pendente_renovacao' || p.status === 'vencido'
  ).length

  return (
    <div className="p-6">
      {/* Header com Tabs */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-800 mb-4">Portais de Licitação</h1>
        
        <div className="bg-white rounded-2xl shadow-brand border border-neutral-200 p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentTab('portals')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                currentTab === 'portals'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Globe className="w-5 h-5" />
              <span>Todos os Portais</span>
            </button>
            <button
              onClick={() => setCurrentTab('monitor')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                currentTab === 'monitor'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>Monitor de Validade</span>
              {criticalCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {criticalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      {currentTab === 'portals' && <BiddingPortalsManager />}
      {currentTab === 'monitor' && !loading && (
        <PortalValidityMonitor portals={portals} onPortalClick={handlePortalClick} />
      )}
    </div>
  )
}


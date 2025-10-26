/**
 * View principal de Configurações
 * Reutiliza o componente existente
 */

import React from 'react'
import { Settings as SettingsComponent } from '../../../components/settings/Settings'

export function SettingsView() {
  return <div className="p-6"><SettingsComponent /></div>
}


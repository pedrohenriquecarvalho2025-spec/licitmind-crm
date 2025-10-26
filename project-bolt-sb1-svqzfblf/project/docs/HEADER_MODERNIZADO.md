# Header Modernizado - Documentação

## 📋 Visão Geral

O componente `Header` foi completamente refatorado seguindo os princípios de **Single Responsibility Principle (SRP)** e **componentização**, resultando em uma arquitetura mais limpa, manutenível e reutilizável.

## 🎯 Objetivos Alcançados

### ✅ Componentização
- **Separação de Responsabilidades**: Cada funcionalidade foi extraída para um componente dedicado
- **Reutilização**: Componentes podem ser usados isoladamente em outros contextos
- **Manutenibilidade**: Código mais fácil de entender e modificar

### ✅ Design Moderno
- Layout limpo e profissional
- Suporte completo a tema claro/escuro
- Efeitos visuais sutis e elegantes
- Responsividade otimizada

### ✅ Integração de UI Atoms
- Uso de `Title` e `Text` para tipografia consistente
- Seguindo o sistema de design estabelecido

## 🏗️ Arquitetura de Componentes

### 1. **Header.tsx** (Componente Principal)
**Localização**: `src/components/layout/Header.tsx`

**Responsabilidades**:
- Estrutura e layout geral do cabeçalho
- Integração dos subcomponentes
- Gerenciamento de tema (toggle light/dark)

**Uso**:
```tsx
import { Header } from './components/layout/Header'

<Header 
  title="Dashboard" 
  description="Visão geral do sistema"
  actions={<CustomButton />} // Opcional
/>
```

**Props**:
- `title` (string, obrigatório): Título principal da página
- `description` (string, opcional): Descrição ou subtítulo
- `actions` (ReactNode, opcional): Ações customizadas adicionais

---

### 2. **NotificationBell.tsx** (Subcomponente)
**Localização**: `src/components/layout/NotificationBell.tsx`

**Responsabilidades**:
- Exibir sino de notificações
- Mostrar contador de não lidas
- Abrir/fechar NotificationCenter
- Sincronização real-time via Supabase

**Recursos**:
- 🔔 Ícone animado no hover
- 🔴 Badge com contagem de não lidas
- ⚡ Atualização em tempo real
- 📱 Responsivo

**Uso Isolado** (se necessário):
```tsx
import { NotificationBell } from './components/layout/NotificationBell'

<NotificationBell />
```

---

### 3. **UserProfileMenu.tsx** (Subcomponente)
**Localização**: `src/components/layout/UserProfileMenu.tsx`

**Responsabilidades**:
- Exibir informações do usuário (avatar, nome, role)
- Menu dropdown com opções:
  - 👤 Meu Perfil
  - ⚙️ Configurações
  - 🚪 Sair do Sistema

**Recursos**:
- Avatar com inicial do usuário
- Indicador de status online (bolinha verde)
- Menu dropdown elegante
- Ação de logout integrada

**Props**:
- `onProfileClick` (function, opcional): Callback ao clicar em "Meu Perfil"
- `onSettingsClick` (function, opcional): Callback ao clicar em "Configurações"

**Uso Isolado**:
```tsx
import { UserProfileMenu } from './components/layout/UserProfileMenu'

<UserProfileMenu 
  onProfileClick={() => navigate('/profile')}
  onSettingsClick={() => navigate('/settings')}
/>
```

---

### 4. **Dropdown.tsx** (Molécula Genérica)
**Localização**: `src/components/ui/molecules/Dropdown.tsx`

**Responsabilidades**:
- Componente dropdown reutilizável genérico
- Gerenciamento de estado aberto/fechado
- Fechamento ao clicar fora
- Suporte a teclado (ESC para fechar)

**Recursos**:
- 📍 Alinhamento configurável (left/right)
- 🎨 Suporte a variantes (default, danger)
- ♿ Acessibilidade
- 🎭 Animações suaves

**Interface**:
```tsx
interface DropdownItem {
  id: string
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'danger'
  disabled?: boolean
}

interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  className?: string
}
```

**Exemplo de Uso**:
```tsx
import { Dropdown } from '../ui/molecules/Dropdown'
import { Settings, LogOut } from 'lucide-react'

const items = [
  {
    id: 'settings',
    label: 'Configurações',
    icon: <Settings className="w-4 h-4" />,
    onClick: () => console.log('Settings')
  },
  {
    id: 'logout',
    label: 'Sair',
    icon: <LogOut className="w-4 h-4" />,
    onClick: handleLogout,
    variant: 'danger'
  }
]

<Dropdown 
  trigger={<button>Menu</button>}
  items={items}
  align="right"
/>
```

---

## 🎨 Design e Estilo

### Paleta de Cores
- **Background**: `bg-white dark:bg-neutral-900`
- **Border**: `border-neutral-200 dark:border-neutral-700`
- **Accent**: Gradientes com `brand-cyan` e `brand-blue`

### Efeitos Visuais
- **Backdrop Blur**: `backdrop-blur-xl bg-white/95`
- **Orbs Flutuantes**: Efeitos de gradiente animados
- **Linhas Tech**: Linhas sutis horizontais
- **Hover States**: Transições suaves e escalas

### Responsividade
- Menu de usuário oculta nome/role em telas pequenas
- Espaçamentos ajustados para mobile
- Botões mantêm tamanho de toque adequado (min 44x44px)

---

## 🔧 Integração com Hooks

### useAuth
Usado para:
- Obter informações do perfil do usuário
- Função de logout
- Verificação de permissões

```tsx
const { profile, signOut } = useAuth()
```

### useTheme
Usado para:
- Alternar entre tema claro/escuro
- Obter tema atual

```tsx
const { theme, toggleTheme } = useTheme()
```

---

## 🚀 Benefícios da Refatoração

### Antes
- ❌ Código monolítico (~140 linhas)
- ❌ Múltiplas responsabilidades em um único arquivo
- ❌ Difícil de testar componentes individuais
- ❌ Difícil de reutilizar funcionalidades

### Depois
- ✅ 4 componentes bem definidos
- ✅ Cada componente com responsabilidade única
- ✅ Testável isoladamente
- ✅ Componentes reutilizáveis (especialmente Dropdown)
- ✅ Uso consistente do Design System (Átomos e Moléculas)

---

## 📦 Estrutura de Arquivos

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx              ← Componente principal
│   │   ├── NotificationBell.tsx    ← Subcomponente
│   │   └── UserProfileMenu.tsx     ← Subcomponente
│   └── ui/
│       ├── atoms/
│       │   ├── Title.tsx           ← Usado no Header
│       │   └── Text.tsx            ← Usado no Header
│       └── molecules/
│           ├── Dropdown.tsx        ← Nova molécula genérica
│           └── index.ts            ← Export atualizado
```

---

## 🔄 Próximos Passos Sugeridos

1. **Implementar Navegação Real**:
   - Conectar "Meu Perfil" a uma página de perfil
   - Conectar "Configurações" a uma página de settings

2. **Adicionar Testes**:
   ```tsx
   // Header.test.tsx
   describe('Header', () => {
     it('renders title and description', () => {...})
     it('toggles theme on button click', () => {...})
   })
   ```

3. **Adicionar Mais Opções ao Menu**:
   - Preferências de notificação
   - Atalhos de teclado
   - Modo de acessibilidade

4. **Criar Storybook Stories**:
   ```tsx
   export default {
     title: 'Layout/Header',
     component: Header
   }
   ```

---

## 📚 Referências

- Design System: `src/components/ui/atoms/`
- Hooks: `src/hooks/useAuth.ts`
- Tema: `src/contexts/ThemeContext.tsx`
- Notificações: `src/components/notifications/NotificationCenter.tsx`

---

**Desenvolvido com ❤️ seguindo princípios SOLID e Design System**


# 🎨 Como Adicionar a Logo no LicitMind

## 📋 Passo a Passo

### 1. Salvar a Imagem da Logo

1. **Abra a imagem da logo** (a Manta Ray com cérebro em tons de azul)
2. **Clique com botão direito** na imagem
3. **Salvar imagem como...**
4. **Navegue até:** `C:\Users\ICE Brasil\Desktop\LICITMIND\project-bolt-sb1-svqzfblf\project\public\assets\`
5. **Nome do arquivo:** `logo.png`
6. **Salvar**

### 2. Verificar se Funcionou

Após salvar a logo:
1. O navegador irá recarregar automaticamente (Vite hot reload)
2. A logo aparecerá:
   - No **favicon** (aba do navegador)
   - Na **tela de login**
   - Na **sidebar** (menu lateral)
   - Em todos os lugares onde o componente `<Logo />` é usado

### 3. Se a Logo Não Aparecer

Se a logo não carregar automaticamente:
1. **Recarregue a página** (F5 ou Ctrl+R)
2. **Limpe o cache** (Ctrl+Shift+Delete)
3. **Verifique o nome do arquivo:** deve ser exatamente `logo.png` (minúsculas)
4. **Verifique a pasta:** deve estar em `public/assets/logo.png`

---

## ✅ O Que Já Foi Atualizado

### 🎨 Paleta de Cores
As cores do sistema foram atualizadas para seguir exatamente a logo:

```javascript
'brand': {
  'blue-dark': '#1B7FB8',   // Azul escuro da logo
  'blue': '#1B9FD8',        // Azul médio da logo (principal)
  'cyan': '#5EC8E8',        // Azul ciano claro
  'cyan-light': '#8DD9F0',  // Azul ciano muito claro
  'white': '#FFFFFF',       // Branco do cérebro
}
```

### 🖼️ Componente Logo
- ✅ Atualizado para usar a imagem real
- ✅ Fallback SVG caso a imagem não carregue
- ✅ Responsivo e adaptável

### 🌐 HTML
- ✅ Favicon atualizado para usar a logo
- ✅ Meta tags adicionadas
- ✅ Theme color definido (#1B9FD8)

---

## 📁 Estrutura de Arquivos

```
project/
└── public/
    └── assets/
        ├── logo.png          ← COLOQUE A LOGO AQUI
        └── README.md         ← Instruções
```

---

## 🎯 Resultado Esperado

Após adicionar a logo, você verá:

1. **Tela de Login**
   - Logo grande e centralizada
   - Efeitos de brilho nas cores da logo
   - Animações suaves

2. **Sidebar**
   - Logo no topo do menu
   - Efeito de hover
   - Badge "IA" verde

3. **Favicon**
   - Logo na aba do navegador
   - Visível em todas as páginas

---

## 💡 Dicas

- **Formato recomendado:** PNG com fundo transparente
- **Tamanho ideal:** 512x512px ou maior
- **Qualidade:** Alta resolução para melhor visualização
- **Transparência:** Mantenha o fundo transparente da logo original

---

**Após adicionar a logo, o sistema estará 100% personalizado com a identidade visual do LicitMind!** 🚀

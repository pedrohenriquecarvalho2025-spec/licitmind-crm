import React from 'react';
import { 
  Kanban, 
  FolderClock, 
  FileSignature, 
  Target, 
  ShieldCheck, 
  Zap, 
  Quote, 
  Rocket 
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* ============================================ */}
      {/* SEÇÃO 1: ATENÇÃO (Hero Section)             */}
      {/* ============================================ */}
      <section className="relative min-h-screen bg-neutral-900 overflow-hidden">
        {/* Padrão de fundo tech sutil */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(34, 211, 238, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(90deg, rgba(34, 211, 238, 0.03) 1px, transparent 0), linear-gradient(0deg, rgba(34, 211, 238, 0.03) 1px, transparent 0)`,
            backgroundSize: '80px 80px'
          }}></div>
        </div>

        {/* Conteúdo Hero */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-4 sm:px-6 lg:px-8">
          {/* Logo Principal */}
          <img 
            src="/assets/logo.png" 
            alt="LicitMind Logo" 
            className="w-24 h-24 mb-6 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
          />

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Menos Planilhas, Mais Licitações Ganhas.<br />Assuma o Controle.
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-neutral-300 mt-4 max-w-xl lg:max-w-2xl mx-auto">
            LicitMind é o CRM definitivo para gestão de licitações. Centralize tudo, 
            economize tempo e aumente suas chances de sucesso.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-brand-cyan to-brand-blue hover:opacity-95 text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg transform transition hover:scale-105">
              Teste Grátis por 14 Dias
            </button>
            <button className="border-2 border-brand-cyan text-brand-cyan hover:bg-brand-cyan/10 font-semibold py-3 px-8 rounded-lg text-lg transition">
              Ver Demonstração
            </button>
          </div>

          {/* Garantia */}
          <p className="text-sm text-neutral-400 mt-4">
            Sem cartão de crédito. Simples e direto.
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* SEÇÃO 2: INTERESSE (Features)                */}
      {/* ============================================ */}
      <section className="bg-neutral-800 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Título */}
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
            Sua Central Inteligente de Licitações
          </h2>

          {/* Subtítulo */}
          <p className="text-lg text-neutral-400 text-center mb-12 lg:mb-16 max-w-3xl mx-auto">
            Do edital ao contrato, LicitMind organiza seu fluxo de trabalho para 
            máxima eficiência e controle.
          </p>

          {/* Grid de Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Card 1: Pipeline */}
            <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-700 shadow-md hover:border-brand-cyan transition-colors">
              <Kanban className="w-12 h-12 text-brand-cyan mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">
                Funil Kanban Intuitivo
              </h3>
              <p className="text-neutral-400">
                Gerencie todas as fases da licitação visualmente. Arraste e solte 
                oportunidades, acompanhe o progresso e nunca mais perca um prazo importante.
              </p>
            </div>

            {/* Card 2: Documentos */}
            <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-700 shadow-md hover:border-brand-cyan transition-colors">
              <FolderClock className="w-12 h-12 text-brand-cyan mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">
                Cofre de Documentos Seguro
              </h3>
              <p className="text-neutral-400">
                Centralize atestados, certidões e toda documentação. Receba alertas 
                automáticos de vencimento e mantenha sua empresa sempre habilitada.
              </p>
            </div>

            {/* Card 3: Contratos */}
            <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-700 shadow-md hover:border-brand-cyan transition-colors">
              <FileSignature className="w-12 h-12 text-brand-cyan mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">
                Gestão de Contratos e Empenhos
              </h3>
              <p className="text-neutral-400">
                Monitore vigências, valores, aditivos e pagamentos. Tenha uma visão 
                clara da saúde financeira dos seus contratos ativos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SEÇÃO 3: DESEJO (Diferenciais e Prova Social) */}
      {/* ============================================ */}
      <section className="bg-brand-blue-dark py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Título Diferenciais */}
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12 lg:mb-16">
            Feito Sob Medida para o Mundo das Licitações
          </h2>

          {/* Grid de Diferenciais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Diferencial 1 */}
            <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-700 shadow-md hover:border-brand-cyan transition-colors">
              <Target className="w-10 h-10 text-brand-cyan mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">
                Especialização Vertical
              </h3>
              <p className="text-neutral-400">
                Desenvolvido por quem entende de licitação, para quem vive de licitação. 
                Fluxos pensados para o seu dia a dia.
              </p>
            </div>

            {/* Diferencial 2 */}
            <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-700 shadow-md hover:border-brand-cyan transition-colors">
              <ShieldCheck className="w-10 h-10 text-brand-cyan mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">
                Segurança e Confiabilidade
              </h3>
              <p className="text-neutral-400">
                Infraestrutura Supabase com RLS garante a privacidade dos seus dados 
                estratégicos.
              </p>
            </div>

            {/* Diferencial 3 */}
            <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-700 shadow-md hover:border-brand-cyan transition-colors">
              <Zap className="w-10 h-10 text-brand-cyan mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">
                Intuitivo e Rápido
              </h3>
              <p className="text-neutral-400">
                Interface moderna e fluxo otimizado. Concentre-se nos resultados, 
                não em aprender a usar o software.
              </p>
            </div>
          </div>

          {/* Título Testemunhos */}
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mt-16 sm:mt-24 mb-12 lg:mb-16">
            Veja Quem Já Está Ganhando Tempo (e Licitações)
          </h2>

          {/* Grid de Testemunhos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Testemunho 1 */}
            <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
              <Quote className="w-8 h-8 text-brand-cyan mb-4 opacity-50" />
              <p className="text-neutral-300 text-lg italic mb-4">
                "O controle de vencimento de documentos do LicitMind é essencial. 
                Reduzimos nosso risco de inabilitação a zero."
              </p>
              <p className="text-white font-semibold">
                Mariana Lima
              </p>
              <p className="text-brand-cyan-light text-sm">
                Diretora de Operações - Engenharia Alfa
              </p>
            </div>

            {/* Testemunho 2 */}
            <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
              <Quote className="w-8 h-8 text-brand-cyan mb-4 opacity-50" />
              <p className="text-neutral-300 text-lg italic mb-4">
                "Migrar das planilhas foi a melhor decisão. A visão do pipeline e a 
                centralização dos contratos nos deram um controle inédito."
              </p>
              <p className="text-white font-semibold">
                Roberto Dias
              </p>
              <p className="text-brand-cyan-light text-sm">
                Sócio-Diretor - Soluções Tech BR
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SEÇÃO 4: AÇÃO (CTA Final)                    */}
      {/* ============================================ */}
      <section className="bg-gradient-to-t from-brand-blue-dark to-neutral-900 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Título */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-4">
            Transforme Sua Gestão de Licitações Hoje.
          </h2>

          {/* Subtítulo */}
          <p className="text-lg sm:text-xl text-neutral-300 text-center mb-8 max-w-xl mx-auto">
            Experimente o LicitMind gratuitamente por 14 dias e veja a diferença 
            na sua produtividade.
          </p>

          {/* Botão Principal CTA */}
          <div className="mt-8 text-center">
            <button className="bg-gradient-to-r from-brand-cyan to-brand-blue hover:opacity-95 text-white font-bold py-4 px-10 rounded-lg shadow-lg text-xl transform transition hover:scale-105">
              <Rocket className="inline mr-2 h-6 w-6" />
              Iniciar Meu Teste Gratuito Agora
            </button>
          </div>

          {/* Garantia */}
          <p className="text-sm text-neutral-400 mt-4 text-center">
            Sem cartão. Sem compromisso. Apenas resultados.
          </p>

          {/* Link Secundário */}
          <div className="mt-6 text-center">
            <p className="text-neutral-400">
              Dúvidas?{' '}
              <a href="/contato" className="text-brand-cyan hover:underline font-semibold">
                Fale com um especialista
              </a>
            </p>
          </div>

          {/* Footer Final */}
          <footer className="mt-16 sm:mt-24 border-t border-neutral-700 pt-8 text-center">
            <p className="text-neutral-500 text-sm mb-4">
              © {new Date().getFullYear()} LicitMind. Todos os direitos reservados.
            </p>
            <div className="flex justify-center gap-4">
              <a href="/politica-privacidade" className="text-sm text-neutral-400 hover:text-white transition">
                Política de Privacidade
              </a>
              <span className="text-neutral-600">|</span>
              <a href="/termos" className="text-sm text-neutral-400 hover:text-white transition">
                Termos de Uso
              </a>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;


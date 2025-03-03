# Controle Financeiro

Um aplicativo web simples para controlar dívidas, parcelas e pagamentos. Ideal para acompanhar dinheiro emprestado, compras parceladas feitas para terceiros ou qualquer situação onde você precisa controlar pagamentos recebidos.

## Funcionalidades

- Cadastro e gerenciamento de dívidas
- Organização por categorias (Pessoal, Família, Compras Online, Emergência, etc.)
- Filtro rápido por categoria de pendência
- Controle detalhado de parcelas
- Marcação de pagamentos realizados
- Visualização do status de cada dívida
- Cálculo automático de valores pendentes e pagos
- Banco de dados integrado no navegador (IndexedDB)
- Sistema de notificações para feedback ao usuário
- Interface responsiva para desktop e dispositivos móveis
- **Relatórios financeiros e gráficos interativos**
- **Notificações de vencimento para parcelas próximas**
- **Modo escuro (Dark Mode) para conforto visual**

## Como Usar

1. Abra o arquivo `index.html` em qualquer navegador moderno
2. Clique em "NOVO" para adicionar um novo item
3. Selecione a categoria apropriada para cada pendência
4. Use os filtros para visualizar pendências por categoria
5. Para visualizar os detalhes de uma dívida, clique no ícone de expansão (seta para baixo)
6. Para marcar uma parcela como paga/pendente, clique no botão correspondente na linha da parcela
7. **Para visualizar relatórios financeiros, clique no botão "Ver Relatórios"**
8. **Para visualizar notificações de vencimento, clique no ícone de sino no topo da página**
9. **Para alternar entre modo claro e escuro, clique no ícone de sol/lua no canto superior direito**

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- Banco de dados IndexedDB para armazenamento persistente
- Font Awesome para ícones
- Formatação brasileira de valores monetários (R$ 0.000,00)
- **Chart.js para gráficos interativos e visualizações de dados**

## Instalação

Não é necessária instalação. Este é um aplicativo web estático que funciona diretamente no navegador sem necessidade de servidor.

1. Baixe todos os arquivos do projeto
2. Abra o arquivo `index.html` em qualquer navegador moderno

## Sistema de Banco de Dados

Esta aplicação utiliza IndexedDB, um banco de dados NoSQL integrado nos navegadores modernos:

- Capacidade de armazenamento muito maior que localStorage
- Estrutura de dados mais robusta e confiável
- Suporte a transações para garantir a integridade dos dados
- Funciona offline sem necessidade de conexão com a internet
- Os dados persistem mesmo após fechar o navegador
- Importação automática de dados do localStorage (se houver)

## Relatórios Financeiros

O sistema inclui uma seção de relatórios financeiros com visualizações detalhadas:

- **Relatórios por Categoria**:
  - Distribuição do valor total por categoria
  - Status de pagamento (pago vs. pendente) por categoria
  - Identificação visual por cores para cada categoria

- **Análise Temporal**:
  - Gráfico de linha do tempo mostrando pagamentos e pendências
  - Previsão de pagamentos futuros com valor mensal e acumulado
  - Visualização clara da evolução financeira ao longo do tempo

- **Resumo Estatístico**:
  - Totais de pendências e parcelas
  - Taxa de pagamento e média por parcela
  - Identificação da maior pendência e categoria mais comum
  - Alerta para próximo vencimento

Use os relatórios para obter insights sobre seus padrões de gastos, planejar futuros pagamentos e manter um controle financeiro mais eficiente.

## Sistema de Notificações de Vencimento

O aplicativo inclui um sistema completo de notificações para alertar sobre parcelas próximas do vencimento:

- **Centro de Notificações**:
  - Acesso rápido através do ícone de sino no topo da página
  - Indicador visual com contagem de notificações não lidas
  - Interface intuitiva para visualizar e gerenciar alertas

- **Alertas Personalizáveis**:
  - Configuração do número de dias de antecedência para receber alertas
  - Opção para ativar/desativar popups de notificação
  - Verificação automática de vencimentos ao iniciar o aplicativo

- **Interatividade**:
  - Ao clicar em uma notificação, o sistema destaca a pendência correspondente
  - Marcação visual para diferenciar notificações lidas e não lidas
  - Opções para marcar todas como lidas ou excluir notificações individuais

Este sistema ajuda a evitar atrasos em pagamentos e manter um controle financeiro mais eficiente, reduzindo custos com juros e multas por atraso.

## Modo Escuro (Dark Mode)

O aplicativo oferece um modo escuro completo para reduzir o cansaço visual, especialmente em ambientes com pouca luz:

- **Alternância Intuitiva**: Botão de sol/lua no canto superior para mudar rapidamente entre temas.
- **Persistência de Preferência**: Sua escolha de tema é salva automaticamente no localStorage.
- **Detecção Automática**: O aplicativo detecta e aplica a preferência do sistema operacional.
- **Design Adaptativo**: Todos os elementos da interface são otimizados para ambos os temas.
- **Gráficos Otimizados**: Os relatórios e gráficos se adaptam automaticamente ao tema selecionado.

O modo escuro não apenas oferece conforto visual, mas também pode reduzir o consumo de bateria em dispositivos com telas OLED/AMOLED.

## Desenvolvimento Futuro

Possíveis melhorias para futuras versões:

- Sincronização com a nuvem
- Múltiplos devedores/categorias
- Relatórios mais avançados
- Integração com calendários externos 
# Controle Financeiro

Um aplicativo web simples para controlar dívidas, parcelas e pagamentos. Ideal para acompanhar dinheiro emprestado, compras parceladas feitas para terceiros ou qualquer situação onde você precisa controlar pagamentos recebidos.

## Funcionalidades

- Cadastro e gerenciamento de dívidas
- Controle detalhado de parcelas
- Marcação de pagamentos realizados
- Visualização do status de cada dívida
- Cálculo automático de valores pendentes e pagos
- Banco de dados integrado no navegador (IndexedDB)
- Sistema de notificações para feedback ao usuário
- Interface responsiva para desktop e dispositivos móveis

## Como Usar

1. Abra o arquivo `index.html` em qualquer navegador moderno
2. As dívidas de exemplo serão carregadas automaticamente na primeira execução
3. Clique em "NOVO" para adicionar um novo item
4. Para visualizar os detalhes de uma dívida, clique no ícone de expansão (seta para baixo)
5. Para marcar uma parcela como paga/pendente, clique no botão correspondente na linha da parcela

## Dados Pré-carregados

O sistema vem com três exemplos de dívidas pré-configuradas:

1. **ESCOVA**
   - Comprada em Novembro de 2024
   - 6 parcelas de R$ 89,60
   - Vencimento no dia 28 de cada mês
   - Primeira parcela (Dezembro) já está marcada como paga

2. **MOTORZINHO**
   - Comprado em Fevereiro de 2025
   - 8 parcelas de R$ 67,00
   - Vencimento no dia 17 de cada mês
   - Nenhuma parcela paga ainda

3. **EMPRÉSTIMO PARA DONA SHIRLEY**
   - Iniciado em Janeiro de 2025
   - 12 parcelas de R$ 115,00
   - Vencimento no dia 17 de cada mês
   - Nenhuma parcela paga ainda

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- Banco de dados IndexedDB para armazenamento persistente
- Font Awesome para ícones
- Formatação brasileira de valores monetários (R$ 0.000,00)

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

## Backups e Exportação

Os dados são armazenados no banco de dados IndexedDB do navegador. Para evitar perda de dados:

- Não limpe os dados de navegação do seu navegador sem antes fazer backup
- Use o mesmo navegador e dispositivo para acessar o sistema

## Desenvolvimento Futuro

Possíveis melhorias para futuras versões:

- Exportação e importação de dados (CSV/JSON)
- Sincronização com a nuvem
- Notificações de parcelas próximas do vencimento
- Múltiplos devedores/categorias
- Relatórios e gráficos 
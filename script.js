// Dados de exemplo pré-carregados (poderiam vir de um backend/API)
let loans = [
    {
        id: 1,
        name: "Mercado Livre",
        category: "compras",
        startDate: "2024-11-01",
        installments: 6,
        installmentValue: 89.60,
        dueDay: 28,
        // Gerar as parcelas automaticamente
        payments: [
            { number: 1, dueDate: "2024-12-28", value: 89.60, status: "paid" },
            { number: 2, dueDate: "2025-01-28", value: 89.60, status: "pending" },
            { number: 3, dueDate: "2025-02-28", value: 89.60, status: "pending" },
            { number: 4, dueDate: "2025-03-28", value: 89.60, status: "pending" },
            { number: 5, dueDate: "2025-04-28", value: 89.60, status: "pending" },
            { number: 6, dueDate: "2025-05-28", value: 89.60, status: "pending" }
        ]
    },
    {
        id: 2,
        name: "Aliexpress",
        category: "compras",
        startDate: "2025-02-01",
        installments: 8,
        installmentValue: 67.00,
        dueDay: 17,
        // Gerar as parcelas automaticamente
        payments: [
            { number: 1, dueDate: "2025-03-17", value: 67.00, status: "pending" },
            { number: 2, dueDate: "2025-04-17", value: 67.00, status: "pending" },
            { number: 3, dueDate: "2025-05-17", value: 67.00, status: "pending" },
            { number: 4, dueDate: "2025-06-17", value: 67.00, status: "pending" },
            { number: 5, dueDate: "2025-07-17", value: 67.00, status: "pending" },
            { number: 6, dueDate: "2025-08-17", value: 67.00, status: "pending" },
            { number: 7, dueDate: "2025-09-17", value: 67.00, status: "pending" },
            { number: 8, dueDate: "2025-10-17", value: 67.00, status: "pending" }
        ]
    },
    {
        id: 3,
        name: "Shirley",
        category: "pessoal",
        startDate: "2025-01-01",
        installments: 12,
        installmentValue: 115.00,
        dueDay: 17,
        // Gerar as parcelas automaticamente
        payments: [
            { number: 1, dueDate: "2025-01-17", value: 115.00, status: "pending" },
            { number: 2, dueDate: "2025-02-17", value: 115.00, status: "pending" },
            { number: 3, dueDate: "2025-03-17", value: 115.00, status: "pending" },
            { number: 4, dueDate: "2025-04-17", value: 115.00, status: "pending" },
            { number: 5, dueDate: "2025-05-17", value: 115.00, status: "pending" },
            { number: 6, dueDate: "2025-06-17", value: 115.00, status: "pending" },
            { number: 7, dueDate: "2025-07-17", value: 115.00, status: "pending" },
            { number: 8, dueDate: "2025-08-17", value: 115.00, status: "pending" },
            { number: 9, dueDate: "2025-09-17", value: 115.00, status: "pending" },
            { number: 10, dueDate: "2025-10-17", value: 115.00, status: "pending" },
            { number: 11, dueDate: "2025-11-17", value: 115.00, status: "pending" },
            { number: 12, dueDate: "2025-12-17", value: 115.00, status: "pending" }
        ]
    }
];

// Elementos do DOM
const loansList = document.getElementById('loans-list');
const addLoanBtn = document.getElementById('add-loan-btn');
const loanModal = document.getElementById('loan-modal');
const closeModalBtn = document.querySelector('.close');
const loanForm = document.getElementById('loan-form');
const modalTitle = document.getElementById('modal-title');
const totalValue = document.getElementById('total-value');
const totalPaid = document.getElementById('total-paid');
const totalPending = document.getElementById('total-pending');
const filterButtons = document.querySelectorAll('.filter-button');

// Variáveis de estado
let currentLoanId = null;
let activeCategory = 'all'; // Filtro de categoria ativo

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    // Mudar o título da seção de dívidas
    const loansHeader = document.querySelector('.loans-header h2');
    if (loansHeader) {
        loansHeader.textContent = 'Pendências';
    }
    
    // Mostrar indicador de carregamento
    loansList.innerHTML = '<p class="loading-indicator">Carregando dados do banco...</p>';
    
    try {
        // Inicializar o banco de dados
        await db.init();
        
        // Carregar dívidas do banco de dados
        loans = await db.getAllLoans();
        
        // Se não houver dívidas no banco, adicionar os exemplos pré-carregados
        if (loans.length === 0) {
            // Já temos os exemplos pré-carregados na variável loans
            // Vamos adicionar cada um ao banco de dados
            console.log('Adicionando exemplos pré-carregados ao banco de dados...');
            
            const exampleLoans = [
                {
                    id: 1,
                    name: "Mercado Livre",
                    category: "compras",
                    creditor: "Loja de Produtos de Beleza",
                    totalValue: 537.60,
                    startDate: "2024-11-01",
                    installments: 6,
                    installmentValue: 89.60,
                    dueDay: 28,
                    payments: [
                        { number: 1, dueDate: "2024-12-28", value: 89.60, status: "paid" },
                        { number: 2, dueDate: "2025-01-28", value: 89.60, status: "pending" },
                        { number: 3, dueDate: "2025-02-28", value: 89.60, status: "pending" },
                        { number: 4, dueDate: "2025-03-28", value: 89.60, status: "pending" },
                        { number: 5, dueDate: "2025-04-28", value: 89.60, status: "pending" },
                        { number: 6, dueDate: "2025-05-28", value: 89.60, status: "pending" }
                    ]
                },
                {
                    id: 2,
                    name: "Aliexpress",
                    category: "compras",
                    creditor: "Auto Peças Silva",
                    totalValue: 536.00,
                    startDate: "2025-02-01",
                    installments: 8,
                    installmentValue: 67.00,
                    dueDay: 17,
                    payments: [
                        { number: 1, dueDate: "2025-03-17", value: 67.00, status: "pending" },
                        { number: 2, dueDate: "2025-04-17", value: 67.00, status: "pending" },
                        { number: 3, dueDate: "2025-05-17", value: 67.00, status: "pending" },
                        { number: 4, dueDate: "2025-06-17", value: 67.00, status: "pending" },
                        { number: 5, dueDate: "2025-07-17", value: 67.00, status: "pending" },
                        { number: 6, dueDate: "2025-08-17", value: 67.00, status: "pending" },
                        { number: 7, dueDate: "2025-09-17", value: 67.00, status: "pending" },
                        { number: 8, dueDate: "2025-10-17", value: 67.00, status: "pending" }
                    ]
                },
                {
                    id: 3,
                    name: "Shirley",
                    category: "pessoal",
                    creditor: "Dona Shirley",
                    totalValue: 1380.00,
                    startDate: "2025-01-01",
                    installments: 12,
                    installmentValue: 115.00,
                    dueDay: 17,
                    payments: [
                        { number: 1, dueDate: "2025-01-17", value: 115.00, status: "pending" },
                        { number: 2, dueDate: "2025-02-17", value: 115.00, status: "pending" },
                        { number: 3, dueDate: "2025-03-17", value: 115.00, status: "pending" },
                        { number: 4, dueDate: "2025-04-17", value: 115.00, status: "pending" },
                        { number: 5, dueDate: "2025-05-17", value: 115.00, status: "pending" },
                        { number: 6, dueDate: "2025-06-17", value: 115.00, status: "pending" },
                        { number: 7, dueDate: "2025-07-17", value: 115.00, status: "pending" },
                        { number: 8, dueDate: "2025-08-17", value: 115.00, status: "pending" },
                        { number: 9, dueDate: "2025-09-17", value: 115.00, status: "pending" },
                        { number: 10, dueDate: "2025-10-17", value: 115.00, status: "pending" },
                        { number: 11, dueDate: "2025-11-17", value: 115.00, status: "pending" },
                        { number: 12, dueDate: "2025-12-17", value: 115.00, status: "pending" }
                    ]
                }
            ];
            
            for (const loan of exampleLoans) {
                await db.addLoan(loan);
            }
            
            // Recarregar as dívidas do banco
            loans = await db.getAllLoans();
            showNotification('Exemplos pré-carregados adicionados com sucesso!', 'success');
        }
        
        // Renderizar a lista de dívidas e o resumo
        renderLoans();
        updateSummary();
        
        showNotification('Dados carregados com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        loansList.innerHTML = `<p class="error-message">Erro ao carregar dados: ${error.message}</p>`;
        showNotification('Erro ao carregar dados do banco de dados.', 'error');
    }
    
    // Configurar os event listeners
    setupEventListeners();
});

// Configuração dos listeners de eventos
function setupEventListeners() {
    // Abrir modal para adicionar nova dívida
    addLoanBtn.addEventListener('click', () => {
        openModal();
    });

    // Fechar modal
    closeModalBtn.addEventListener('click', () => {
        closeModal();
    });

    // Clique fora do modal para fechar
    window.addEventListener('click', (e) => {
        if (e.target === loanModal) {
            closeModal();
        }
    });

    // Envio do formulário
    loanForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveFormData();
    });
    
    // Cálculo automático entre valor total e valor da parcela
    const loanTotalInput = document.getElementById('loan-total');
    const loanInstallmentsInput = document.getElementById('loan-installments');
    const loanValueInput = document.getElementById('loan-value');
    
    // Quando o valor total ou número de parcelas mudar, calcular o valor da parcela
    function updateInstallmentValue() {
        const totalValue = parseFloat(loanTotalInput.value);
        const installments = parseInt(loanInstallmentsInput.value);
        
        if (!isNaN(totalValue) && !isNaN(installments) && installments > 0) {
            const installmentValue = totalValue / installments;
            loanValueInput.value = installmentValue.toFixed(2);
        }
    }
    
    // Quando o valor da parcela ou número de parcelas mudar, calcular o valor total
    function updateTotalValue() {
        const installmentValue = parseFloat(loanValueInput.value);
        const installments = parseInt(loanInstallmentsInput.value);
        
        if (!isNaN(installmentValue) && !isNaN(installments)) {
            const totalValue = installmentValue * installments;
            loanTotalInput.value = totalValue.toFixed(2);
        }
    }
    
    loanTotalInput.addEventListener('input', updateInstallmentValue);
    loanInstallmentsInput.addEventListener('input', () => {
        // Se o valor total já estiver preenchido, calcular o valor da parcela
        if (loanTotalInput.value) {
            updateInstallmentValue();
        } 
        // Se o valor da parcela já estiver preenchido, calcular o valor total
        else if (loanValueInput.value) {
            updateTotalValue();
        }
    });
    loanValueInput.addEventListener('input', updateTotalValue);

    // Adicionar event listeners para os botões de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            
            // Atualizar botões ativos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Aplicar filtro
            activeCategory = category;
            renderLoans();
        });
    });
}

// Renderizar lista de dívidas
function renderLoans() {
    loansList.innerHTML = '';

    if (loans.length === 0) {
        loansList.innerHTML = '<p class="empty-list">Nenhuma pendência cadastrada.</p>';
        return;
    }

    // Filtrar por categoria, se necessário
    const filteredLoans = activeCategory === 'all' 
        ? loans 
        : loans.filter(loan => loan.category === activeCategory);
        
    if (filteredLoans.length === 0) {
        loansList.innerHTML = `<p class="empty-list">Nenhuma pendência na categoria selecionada.</p>`;
        return;
    }

    filteredLoans.forEach(loan => {
        const loanCard = document.createElement('div');
        loanCard.classList.add('loan-card');
        loanCard.setAttribute('data-id', loan.id);

        // Calcular totais para esta dívida
        const totalLoanValue = loan.totalValue || (loan.installments * loan.installmentValue);
        const paidValue = loan.payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.value, 0);
        const pendingValue = totalLoanValue - paidValue;
        
        // Usar sempre o ícone de exclamação para todas as pendências
        const statusIcon = 'fa-exclamation-circle';

        // Cabeçalho do card
        loanCard.innerHTML = `
            <div class="loan-header">
                <div class="loan-title">
                    <i class="fas ${statusIcon}"></i>
                    ${loan.name}
                    <span class="category-badge category-${loan.category || 'outros'}">${getCategoryName(loan.category)}</span>
                </div>
                <div class="loan-actions">
                    <button class="loan-action edit-loan" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="loan-action delete-loan" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="loan-action toggle-details" title="Expandir/Recolher">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
            </div>
            <div class="loan-details">
                <div class="loan-info">
                    ${loan.creditor ? `
                    <div class="loan-info-item">
                        <div class="loan-info-label">Credor</div>
                        <div class="loan-info-value">${loan.creditor}</div>
                    </div>
                    ` : ''}
                    <div class="loan-info-item">
                        <div class="loan-info-label">Categoria</div>
                        <div class="loan-info-value">${getCategoryName(loan.category)}</div>
                    </div>
                    <div class="loan-info-item">
                        <div class="loan-info-label">Data de Início</div>
                        <div class="loan-info-value">${formatDate(loan.startDate)}</div>
                    </div>
                    <div class="loan-info-item">
                        <div class="loan-info-label">Parcelas</div>
                        <div class="loan-info-value">${loan.installments}x de R$ ${formatCurrency(loan.installmentValue)}</div>
                    </div>
                    <div class="loan-info-item">
                        <div class="loan-info-label">Valor Total</div>
                        <div class="loan-info-value">R$ ${formatCurrency(totalLoanValue)}</div>
                    </div>
                    <div class="loan-info-item">
                        <div class="loan-info-label">Valor Pago</div>
                        <div class="loan-info-value">R$ ${formatCurrency(paidValue)}</div>
                    </div>
                    <div class="loan-info-item">
                        <div class="loan-info-label">Valor Pendente</div>
                        <div class="loan-info-value">R$ ${formatCurrency(pendingValue)}</div>
                    </div>
                </div>
                <h3>Parcelas</h3>
                <ul class="installments-list">
                    ${renderInstallmentsList(loan.payments)}
                </ul>
            </div>
        `;

        loansList.appendChild(loanCard);

        // Adicionar event listeners para as ações
        const toggleBtn = loanCard.querySelector('.toggle-details');
        const details = loanCard.querySelector('.loan-details');
        const editBtn = loanCard.querySelector('.edit-loan');
        const deleteBtn = loanCard.querySelector('.delete-loan');

        toggleBtn.addEventListener('click', () => {
            details.style.display = details.style.display === 'block' ? 'none' : 'block';
            toggleBtn.querySelector('i').classList.toggle('fa-chevron-down');
            toggleBtn.querySelector('i').classList.toggle('fa-chevron-up');
        });

        editBtn.addEventListener('click', () => {
            openModal(loan.id);
        });

        deleteBtn.addEventListener('click', () => {
            if (confirm(`Tem certeza que deseja excluir a pendência "${loan.name}"?`)) {
                deleteLoan(loan.id);
            }
        });

        // Adicionar event listeners para os botões de pagamento
        const paymentButtons = loanCard.querySelectorAll('.toggle-payment');
        paymentButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const installmentNumber = parseInt(btn.getAttribute('data-installment'));
                togglePaymentStatus(loan.id, installmentNumber);
            });
        });
    });
}

// Renderizar a lista de parcelas para uma dívida
function renderInstallmentsList(payments) {
    const today = new Date();
    
    return payments.map(payment => {
        // Determinar o status da parcela
        let statusClass = 'status-pending';
        let statusText = 'Pendente';
        let statusIcon = 'fa-clock';
        let buttonIcon = 'fa-check';
        let buttonClass = 'btn-success';
        let buttonTitle = 'Marcar como pago';
        
        if (payment.status === 'paid') {
            statusClass = 'status-paid';
            statusText = 'Pago';
            statusIcon = 'fa-check';
            buttonIcon = 'fa-times';
            buttonClass = 'btn-warning';
            buttonTitle = 'Marcar como pendente';
        } else if (new Date(payment.dueDate) < today) {
            statusClass = 'status-late';
            statusText = 'Atrasado';
            statusIcon = 'fa-exclamation-triangle';
        }
        
        return `
            <li class="installment-item">
                <div class="installment-info">
                    <div class="installment-number">Parcela ${payment.number}</div>
                    <div class="installment-date">Vencimento: ${formatDate(payment.dueDate)}</div>
                    <div class="installment-value">R$ ${formatCurrency(payment.value)}</div>
                    <div class="installment-status">
                        <span class="status-badge ${statusClass}">
                            <i class="fas ${statusIcon}"></i> ${statusText}
                        </span>
                    </div>
                </div>
                <div class="installment-action">
                    <button class="btn ${buttonClass} toggle-payment" data-installment="${payment.number}" title="${buttonTitle}">
                        <i class="fas ${buttonIcon}"></i>
                    </button>
                </div>
            </li>
        `;
    }).join('');
}

// Abrir modal para adicionar ou editar dívida
async function openModal(loanId = null) {
    currentLoanId = loanId;
    const loanNameInput = document.getElementById('loan-name');
    const creditorNameInput = document.getElementById('creditor-name');
    const loanCategorySelect = document.getElementById('loan-category');
    const loanTotalInput = document.getElementById('loan-total');
    const loanDateInput = document.getElementById('loan-date');
    const loanInstallmentsInput = document.getElementById('loan-installments');
    const loanValueInput = document.getElementById('loan-value');
    const loanDueDayInput = document.getElementById('loan-due-day');

    // Limpar formulário
    loanForm.reset();

    if (loanId) {
        // Edição de dívida existente
        try {
            const loan = await db.getLoan(loanId);
            if (loan) {
                modalTitle.textContent = 'Editar Pendência';
                loanNameInput.value = loan.name;
                // Preencher o campo credor se existir, senão deixar vazio
                creditorNameInput.value = loan.creditor || '';
                // Definir categoria
                if (loan.category) {
                    loanCategorySelect.value = loan.category;
                } else {
                    loanCategorySelect.value = 'outros';
                }
                // Calcular o valor total baseado nas parcelas existentes
                const totalValue = loan.installmentValue * loan.installments;
                loanTotalInput.value = totalValue;
                loanDateInput.value = loan.startDate;
                loanInstallmentsInput.value = loan.installments;
                loanValueInput.value = loan.installmentValue;
                loanDueDayInput.value = loan.dueDay;
            }
        } catch (error) {
            console.error('Erro ao carregar dívida para edição:', error);
            alert('Erro ao carregar dívida para edição. Tente novamente.');
            return;
        }
    } else {
        // Nova dívida
        modalTitle.textContent = 'Nova Pendência';
    }

    loanModal.style.display = 'block';
}

// Fechar modal
function closeModal() {
    loanModal.style.display = 'none';
    currentLoanId = null;
}

// Salvar dados do formulário
async function saveFormData() {
    const loanNameInput = document.getElementById('loan-name');
    const creditorNameInput = document.getElementById('creditor-name');
    const loanCategorySelect = document.getElementById('loan-category');
    const loanTotalInput = document.getElementById('loan-total');
    const loanDateInput = document.getElementById('loan-date');
    const loanInstallmentsInput = document.getElementById('loan-installments');
    const loanValueInput = document.getElementById('loan-value');
    const loanDueDayInput = document.getElementById('loan-due-day');

    const name = loanNameInput.value.trim();
    const creditor = creditorNameInput.value.trim();
    const category = loanCategorySelect.value;
    const totalValue = parseFloat(loanTotalInput.value);
    const startDate = loanDateInput.value;
    const installments = parseInt(loanInstallmentsInput.value);
    const installmentValue = parseFloat(loanValueInput.value);
    const dueDay = parseInt(loanDueDayInput.value);

    if (!name || !startDate || isNaN(installments) || isNaN(installmentValue) || isNaN(dueDay) || isNaN(totalValue)) {
        showNotification('Por favor, preencha todos os campos obrigatórios corretamente.', 'error');
        return;
    }

    // Verificar se o valor total é aproximadamente igual ao valor das parcelas vezes o número de parcelas
    const calculatedTotal = installmentValue * installments;
    if (Math.abs(totalValue - calculatedTotal) > 0.1) {
        // Mostrar alerta, mas permitir continuar
        if (!confirm(`Atenção: O valor total (R$ ${formatCurrency(totalValue)}) não corresponde ao cálculo das parcelas (${installments}x R$ ${formatCurrency(installmentValue)} = R$ ${formatCurrency(calculatedTotal)}). Deseja continuar mesmo assim?`)) {
            return;
        }
    }

    // Gerar parcelas
    const payments = generateInstallments(startDate, installments, installmentValue, dueDay);

    try {
        if (currentLoanId) {
            // Atualizar dívida existente
            // Primeiro, buscar a dívida atual para manter o status das parcelas, se possível
            const existingLoan = await db.getLoan(currentLoanId);
            
            // Se o número de parcelas for o mesmo, mantenha o status das parcelas existentes
            if (existingLoan && existingLoan.installments === installments) {
                for (let i = 0; i < payments.length; i++) {
                    if (existingLoan.payments[i]) {
                        payments[i].status = existingLoan.payments[i].status;
                    }
                }
            }
            
            // Criar objeto atualizado da dívida
            const updatedLoan = {
                id: currentLoanId,
                name,
                creditor,
                category,
                totalValue,
                startDate,
                installments,
                installmentValue,
                dueDay,
                payments
            };
            
            // Atualizar no banco de dados
            await db.updateLoan(updatedLoan);
            
            // Atualizar também na lista local
            const loanIndex = loans.findIndex(l => l.id === currentLoanId);
            if (loanIndex !== -1) {
                loans[loanIndex] = updatedLoan;
            }
            
            showNotification(`Pendência "${name}" atualizada com sucesso!`, 'success');
        } else {
            // Adicionar nova dívida
            const newLoan = {
                name,
                creditor,
                category,
                totalValue,
                startDate,
                installments,
                installmentValue,
                dueDay,
                payments
            };
            
            // Adicionar ao banco de dados
            const newId = await db.addLoan(newLoan);
            
            // Se o método addLoan não retornar um ID, buscaremos todas as dívidas novamente
            if (!newId) {
                loans = await db.getAllLoans();
            } else {
                // Atualizar o ID e adicionar à lista local
                newLoan.id = newId;
                loans.push(newLoan);
            }
            
            showNotification(`Pendência "${name}" adicionada com sucesso!`, 'success');
        }
        
        // Atualizar interface
        renderLoans();
        updateSummary();
        closeModal();
        
    } catch (error) {
        console.error('Erro ao salvar dívida:', error);
        showNotification('Erro ao salvar pendência. Tente novamente.', 'error');
    }
}

// Gerar parcelas para uma dívida
function generateInstallments(startDate, numInstallments, installmentValue, dueDay) {
    const payments = [];
    const date = new Date(startDate);
    
    // Ajustar para o primeiro mês de pagamento
    date.setMonth(date.getMonth() + 1);
    
    for (let i = 0; i < numInstallments; i++) {
        // Definir o dia de vencimento
        date.setDate(dueDay);
        
        // Em caso de dias inválidos (ex: 31 de fevereiro), o JavaScript ajusta automaticamente
        // para o último dia do mês atual
        const dueDate = new Date(date);
        
        payments.push({
            number: i + 1,
            dueDate: dueDate.toISOString().split('T')[0],
            value: installmentValue,
            status: 'pending'
        });
        
        // Avançar para o próximo mês
        date.setMonth(date.getMonth() + 1);
    }
    
    return payments;
}

// Alternar o status de pagamento de uma parcela
async function togglePaymentStatus(loanId, installmentNumber) {
    try {
        // Buscar a dívida atual no banco de dados
        const loan = await db.getLoan(loanId);
        if (!loan) return;
        
        // Encontrar a parcela
        const paymentIndex = loan.payments.findIndex(p => p.number === installmentNumber);
        if (paymentIndex === -1) return;
        
        // Alternar status
        const currentStatus = loan.payments[paymentIndex].status;
        loan.payments[paymentIndex].status = currentStatus === 'paid' ? 'pending' : 'paid';
        
        // Atualizar no banco de dados
        await db.updateLoan(loan);
        
        // Atualizar também na lista local
        const loanIndex = loans.findIndex(l => l.id === loanId);
        if (loanIndex !== -1) {
            loans[loanIndex] = loan;
        }
        
        // Atualizar interface
        renderLoans();
        updateSummary();
        
        const statusText = loan.payments[paymentIndex].status === 'paid' ? 'paga' : 'pendente';
        showNotification(`Parcela ${installmentNumber} marcada como ${statusText}.`, 'success');
        
    } catch (error) {
        console.error('Erro ao atualizar status de pagamento:', error);
        showNotification('Erro ao atualizar status de pagamento. Tente novamente.', 'error');
    }
}

// Excluir uma dívida
async function deleteLoan(loanId) {
    try {
        // Obter o nome da dívida para a mensagem
        const loan = loans.find(l => l.id === loanId);
        const loanName = loan ? loan.name : 'Pendência';
        
        // Excluir do banco de dados
        await db.deleteLoan(loanId);
        
        // Remover da lista local
        loans = loans.filter(loan => loan.id !== loanId);
        
        // Atualizar interface
        renderLoans();
        updateSummary();
        
        showNotification(`"${loanName}" foi excluída com sucesso.`, 'success');
        
    } catch (error) {
        console.error('Erro ao excluir pendência:', error);
        showNotification('Erro ao excluir pendência. Tente novamente.', 'error');
    }
}

// Atualizar o resumo de valores
function updateSummary() {
    let totalValueSum = 0;
    let totalPaidSum = 0;
    let totalPendingSum = 0;
    
    loans.forEach(loan => {
        const loanTotal = loan.installments * loan.installmentValue;
        totalValueSum += loanTotal;
        
        const paidValue = loan.payments
            .filter(p => p.status === 'paid')
            .reduce((sum, p) => sum + p.value, 0);
        
        totalPaidSum += paidValue;
        totalPendingSum += (loanTotal - paidValue);
    });
    
    totalValue.textContent = `R$ ${formatCurrency(totalValueSum)}`;
    totalPaid.textContent = `R$ ${formatCurrency(totalPaidSum)}`;
    totalPending.textContent = `R$ ${formatCurrency(totalPendingSum)}`;
}

// Formatar valor monetário
function formatCurrency(value) {
    // Converter para string com 2 casas decimais
    let valueStr = value.toFixed(2);
    
    // Separar a parte inteira da decimal
    let parts = valueStr.split('.');
    let intPart = parts[0];
    let decPart = parts[1];
    
    // Adicionar separadores de milhar
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Retornar com vírgula como separador decimal
    return intPart + ',' + decPart;
}

// Formatar data
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
}

// Exibir notificação para o usuário
function showNotification(message, type = 'success') {
    // Remover notificações anteriores
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="close-notification"><i class="fas fa-times"></i></button>
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Adicionar evento para fechar
    const closeButton = notification.querySelector('.close-notification');
    closeButton.addEventListener('click', () => {
        notification.remove();
    });
    
    // Automaticamente remover após 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.add('notification-hide');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 500);
        }
    }, 5000);
}

// Função auxiliar para obter o nome da categoria
function getCategoryName(categoryCode) {
    const categories = {
        'pessoal': 'Pessoal',
        'familia': 'Família',
        'compras': 'Compras Online',
        'emergencia': 'Emergência',
        'outros': 'Outros'
    };
    
    return categories[categoryCode] || 'Outros';
} 
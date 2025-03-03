// Dados de exemplo pré-carregados (poderiam vir de um backend/API)
let loans = [];

// Função para limpar todos os dados existentes (será executada apenas uma vez)
async function clearAllData() {
    // Verificar se a limpeza já foi feita
    if (localStorage.getItem('dataCleared') === 'true') {
        return; // Se já foi limpo, não faz nada
    }
    
    try {
        // Inicializar o banco de dados
        await db.init();
        
        // Limpar todos os empréstimos no banco de dados
        const allLoans = await db.getAllLoans();
        for (const loan of allLoans) {
            await db.deleteLoan(loan.id);
        }
        
        // Limpar notificações
        localStorage.removeItem('notifications');
        
        // Marcar que a limpeza foi feita
        localStorage.setItem('dataCleared', 'true');
        
        console.log('Todos os dados foram limpos com sucesso!');
    } catch (error) {
        console.error('Erro ao limpar dados:', error);
    }
}

// Variáveis de tema
let currentTheme = localStorage.getItem('theme') || 'light';
let systemThemeDetected = false;

// Elementos do DOM
const addLoanBtn = document.getElementById('add-loan-btn');
const loanModal = document.getElementById('loan-modal');
const closeModalBtn = document.querySelector('.close');
const loanForm = document.getElementById('loan-form');
const loansContainer = document.getElementById('loans-container');
const loansList = document.getElementById('loans-list');
const filterContainer = document.querySelector('.filter-container');
const themeToggle = document.getElementById('theme-toggle');
const totalValue = document.getElementById('total-value');
const totalPaid = document.getElementById('total-paid');
const totalPending = document.getElementById('total-pending');
const modalTitle = document.getElementById('modal-title');

// Elementos do DOM para notificações
const notificationBell = document.getElementById('notification-bell');
const notificationBadge = document.getElementById('notification-badge');
const notificationsCenter = document.getElementById('notifications-center');
const notificationsList = document.getElementById('notifications-list');
const emptyNotifications = document.getElementById('empty-notifications');
const closeNotificationsBtn = document.getElementById('close-notifications-btn');
const markAllReadBtn = document.getElementById('mark-all-read-btn');
const notificationSettingsBtn = document.getElementById('notification-settings-btn');
const notificationSettingsModal = document.getElementById('notification-settings-modal');
const notificationSettingsForm = document.getElementById('notification-settings-form');
const notificationDaysInput = document.getElementById('notification-days');
const showNotificationPopupCheckbox = document.getElementById('show-notification-popup');
const notificationOnStartupCheckbox = document.getElementById('notification-on-startup');
const notificationSettingsModalClose = notificationSettingsModal.querySelector('.close');

// Variáveis de estado
let currentLoanId = null;
let isEditing = false;
let notifications = [];
let notificationDays = 7;
let showNotificationPopup = true;
let checkOnStartup = true;
let notificationsEnabled = true;

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
        // Limpar todos os dados existentes (será executado apenas uma vez)
        await clearAllData();
        
        // Inicializar o banco de dados
        await db.init();
        
        // Carregar dívidas do banco de dados
        loans = await db.getAllLoans();
        
        // Se não houver dívidas no banco, mostramos uma mensagem informativa
        if (loans.length === 0) {
            console.log('Banco de dados vazio. Nenhum exemplo será carregado.');
            // Não adiciona mais exemplos pré-carregados
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
    
    // Carregar configurações de notificações
    loadNotificationSettings();
    
    // Verificar notificações ao iniciar, se configurado
    if (checkOnStartup) {
        setTimeout(() => {
            checkDueInstallments();
        }, 1000); // Pequeno atraso para garantir que os dados estejam carregados
    }
});

// Configuração dos listeners de eventos
function setupEventListeners() {
    // Abrir modal para adicionar nova dívida
    addLoanBtn.addEventListener('click', () => {
        currentLoanId = null;
        loanForm.reset();
        loanModal.style.display = 'block';
    });

    // Fechar modal
    closeModalBtn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    });

    // Clique fora do modal para fechar
    window.addEventListener('click', (event) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
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

    // Eventos para notificações
    notificationBell.addEventListener('click', toggleNotificationsCenter);
    closeNotificationsBtn.addEventListener('click', closeNotificationsCenter);
    markAllReadBtn.addEventListener('click', markAllNotificationsAsRead);
    notificationSettingsBtn.addEventListener('click', openNotificationSettings);
    notificationSettingsModalClose.addEventListener('click', closeNotificationSettings);
    
    // Prevenir que cliques dentro do centro de notificações fechem ele
    notificationsCenter.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Fechar o centro de notificações ao clicar fora dele
    document.body.addEventListener('click', (e) => {
        if (e.target !== notificationBell && notificationsCenter.classList.contains('show')) {
            closeNotificationsCenter();
        }
    });
    
    // Salvar configurações de notificações
    notificationSettingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveNotificationSettings();
    });

    // Tema
    themeToggle.addEventListener('click', toggleTheme);
}

// Função para renderizar a lista de empréstimos
function renderLoans() {
    const loansList = document.getElementById('loans-list');
    loansList.innerHTML = '';
    
    if (loans.length === 0) {
        loansList.innerHTML = `
            <div class="empty-list">
                <i class="fas fa-file-invoice-dollar"></i>
                <p>Nenhuma pendência registrada. Clique em "Nova Pendência" para adicionar.</p>
            </div>
        `;
        return;
    }
    
    // Exibir todos os empréstimos
    loans.forEach(loan => {
        const loanCard = createLoanCard(loan);
        loansList.appendChild(loanCard);
    });
}

function createLoanCard(loan) {
    const loanCard = document.createElement('div');
    loanCard.className = 'loan-card';
    loanCard.id = `loan-${loan.id}`;
    
    const paidInstallments = loan.installments.filter(inst => inst.paid).length;
    const totalInstallments = loan.installments.length;
    const progress = (paidInstallments / totalInstallments) * 100;
    
    loanCard.innerHTML = `
        <div class="loan-header">
            <div class="loan-title">
                <i class="fas fa-file-invoice-dollar"></i>
                <h3>${loan.name}</h3>
            </div>
            <div class="loan-actions">
                <button class="loan-action edit-loan" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="loan-action delete-loan" title="Excluir">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
        <div class="loan-details">
            <div class="loan-info">
                <div class="loan-info-item">
                    <div class="loan-info-label">Credor</div>
                    <div class="loan-info-value">${loan.creditor || 'Não especificado'}</div>
                </div>
                <div class="loan-info-item">
                    <div class="loan-info-label">Valor Total</div>
                    <div class="loan-info-value">R$ ${formatCurrency(loan.total)}</div>
                </div>
                <div class="loan-info-item">
                    <div class="loan-info-label">Progresso</div>
                    <div class="loan-info-value">${paidInstallments} de ${totalInstallments} parcelas (${progress.toFixed(0)}%)</div>
                </div>
            </div>
            <div class="installments-list">
                <h4>Parcelas</h4>
                ${createInstallmentsList(loan)}
            </div>
        </div>
    `;
    
    // Adicionar event listeners
    const editBtn = loanCard.querySelector('.edit-loan');
    const deleteBtn = loanCard.querySelector('.delete-loan');
    
    editBtn.addEventListener('click', () => {
        editLoan(loan.id);
    });
    
    deleteBtn.addEventListener('click', () => {
        if (confirm(`Tem certeza que deseja excluir "${loan.name}"?`)) {
            deleteLoan(loan.id);
        }
    });
    
    // Adicionar event listeners para os botões de marcar parcela como paga
    const payButtons = loanCard.querySelectorAll('.pay-installment');
    payButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const installmentIndex = parseInt(e.currentTarget.getAttribute('data-index'));
            toggleInstallmentPaid(loan.id, installmentIndex);
        });
    });
    
    return loanCard;
}

// Abrir modal para adicionar ou editar dívida
async function openLoanModal(isEdit = false, loanId = null) {
    modalTitle.textContent = isEdit ? 'Editar Pendência' : 'Nova Pendência';
    isEditing = isEdit;
    currentLoanId = loanId;
    
    // Limpar o formulário
    loanForm.reset();
    
    if (isEdit && loanId) {
        const loan = loans.find(l => l.id === loanId);
        if (loan) {
            // Preencher o formulário com os dados do empréstimo
            document.getElementById('loan-name').value = loan.name;
            document.getElementById('creditor-name').value = loan.creditor || '';
            document.getElementById('loan-total').value = loan.total;
            document.getElementById('loan-installments').value = loan.installments.length;
            document.getElementById('loan-value').value = loan.installmentValue;
            document.getElementById('loan-date').value = formatDateForInput(loan.startDate);
            document.getElementById('loan-due-day').value = loan.dueDay;
        }
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
    const loanTotalInput = document.getElementById('loan-total');
    const loanDateInput = document.getElementById('loan-date');
    const loanInstallmentsInput = document.getElementById('loan-installments');
    const loanValueInput = document.getElementById('loan-value');
    const loanDueDayInput = document.getElementById('loan-due-day');

    const name = loanNameInput.value.trim();
    const creditor = creditorNameInput.value.trim();
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
                total: totalValue,
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
                total: totalValue,
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

// Sistema de Notificações

// Verificar parcelas próximas do vencimento
function checkDueInstallments() {
    if (!notificationsEnabled) return;
    
    const today = new Date();
    const upcomingNotifications = [];
    
    // Limpar notificações antigas de vencimento
    notifications = notifications.filter(notif => notif.type !== 'due');
    
    // Para cada empréstimo
    loans.forEach(loan => {
        const loanName = loan.name;
        
        // Para cada parcela
        loan.payments.forEach(payment => {
            if (payment.status === 'pending') {
                const dueDate = new Date(payment.dueDate);
                const diffTime = dueDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                // Se estiver dentro do período de alerta
                if (diffDays >= 0 && diffDays <= notificationDays) {
                    const notificationText = diffDays === 0 
                        ? `A parcela ${payment.number} de ${loanName} vence hoje!` 
                        : `A parcela ${payment.number} de ${loanName} vence em ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
                    
                    const notification = {
                        id: `due-${loan.id}-${payment.number}`,
                        type: 'due',
                        title: `Vencimento Próximo`,
                        message: notificationText,
                        date: new Date(),
                        read: false,
                        dueDate: dueDate,
                        loanId: loan.id,
                        installmentNumber: payment.number,
                        value: payment.value
                    };
                    
                    upcomingNotifications.push(notification);
                }
            }
        });
    });
    
    // Adicionar as novas notificações
    if (upcomingNotifications.length > 0) {
        notifications = [...upcomingNotifications, ...notifications];
        
        // Atualizar o badge
        updateNotificationBadge();
        
        // Atualizar a lista de notificações
        renderNotifications();
        
        // Mostrar popup se configurado
        if (showNotificationPopup && upcomingNotifications.length > 0) {
            showNotificationPopup && showNotification(
                `Você tem ${upcomingNotifications.length} parcela${upcomingNotifications.length > 1 ? 's' : ''} próxima${upcomingNotifications.length > 1 ? 's' : ''} do vencimento!`,
                'warning'
            );
            
            // Animar o sino
            notificationBell.classList.add('active');
            setTimeout(() => {
                notificationBell.classList.remove('active');
            }, 1000);
        }
    }
}

// Salvar configurações de notificações
function saveNotificationSettings() {
    notificationDays = parseInt(notificationDaysInput.value) || 7;
    showNotificationPopup = showNotificationPopupCheckbox.checked;
    checkOnStartup = notificationOnStartupCheckbox.checked;
    
    // Salvar no localStorage
    const settings = {
        enabled: notificationsEnabled,
        days: notificationDays,
        popup: showNotificationPopup,
        startup: checkOnStartup
    };
    
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    
    // Fechar o modal
    closeNotificationSettings();
    
    // Re-verificar notificações com as novas configurações
    checkDueInstallments();
    
    showNotification('Configurações de notificação salvas com sucesso!', 'success');
}

// Carregar configurações de notificações
function loadNotificationSettings() {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        notificationsEnabled = settings.enabled !== undefined ? settings.enabled : true;
        notificationDays = settings.days || 7;
        showNotificationPopup = settings.popup !== undefined ? settings.popup : true;
        checkOnStartup = settings.startup !== undefined ? settings.startup : true;
        
        // Atualizar os campos do formulário
        notificationDaysInput.value = notificationDays;
        showNotificationPopupCheckbox.checked = showNotificationPopup;
        notificationOnStartupCheckbox.checked = checkOnStartup;
    }
    
    // Carregar notificações salvas
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
        notifications = JSON.parse(savedNotifications);
        
        // Converter strings de data para objetos Date
        notifications.forEach(notification => {
            notification.date = new Date(notification.date);
            if (notification.dueDate) {
                notification.dueDate = new Date(notification.dueDate);
            }
        });
        
        // Atualizar o badge
        updateNotificationBadge();
    }
}

// Salvar notificações
function saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// Mostrar ou esconder o centro de notificações
function toggleNotificationsCenter() {
    notificationsCenter.classList.toggle('show');
    
    // Se estiver abrindo o centro, marcar as notificações como visualizadas
    if (notificationsCenter.classList.contains('show')) {
        notifications.forEach(notification => {
            notification.seen = true; // Diferente de "read", apenas indica que o usuário viu a notificação
        });
        
        // Recarregar as notificações
        renderNotifications();
    }
}

// Fechar o centro de notificações
function closeNotificationsCenter() {
    notificationsCenter.classList.remove('show');
}

// Abrir modal de configurações de notificações
function openNotificationSettings() {
    closeNotificationsCenter();
    notificationSettingsModal.style.display = 'block';
}

// Fechar modal de configurações de notificações
function closeNotificationSettings() {
    notificationSettingsModal.style.display = 'none';
}

// Atualizar o badge de notificações
function updateNotificationBadge() {
    const unreadCount = notifications.filter(notification => !notification.read).length;
    
    if (unreadCount > 0) {
        notificationBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
        notificationBadge.classList.add('show');
    } else {
        notificationBadge.classList.remove('show');
    }
}

// Renderizar lista de notificações
function renderNotifications() {
    notificationsList.innerHTML = '';
    
    if (notifications.length === 0) {
        emptyNotifications.style.display = 'block';
        return;
    }
    
    emptyNotifications.style.display = 'none';
    
    // Ordenar notificações por data (mais recentes primeiro)
    notifications.sort((a, b) => b.date - a.date);
    
    // Renderizar cada notificação
    notifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification-item ${notification.read ? 'read' : ''}`;
        notificationElement.dataset.id = notification.id;
        
        // Formatar a data
        const formattedDate = formatRelativeTime(notification.date);
        
        notificationElement.innerHTML = `
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-date">
                <span>${formattedDate}</span>
                <div class="notification-actions-item">
                    <button class="btn-icon mark-read-btn" title="${notification.read ? 'Marcar como não lida' : 'Marcar como lida'}">
                        <i class="fas ${notification.read ? 'fa-envelope' : 'fa-envelope-open'}"></i>
                    </button>
                    <button class="btn-icon delete-notification-btn" title="Remover">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Adicionar listeners de eventos
        const markReadBtn = notificationElement.querySelector('.mark-read-btn');
        markReadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleNotificationReadStatus(notification.id);
        });
        
        const deleteBtn = notificationElement.querySelector('.delete-notification-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteNotification(notification.id);
        });
        
        // Ao clicar na notificação, mostrar o empréstimo correspondente
        if (notification.loanId) {
            notificationElement.addEventListener('click', () => {
                closeNotificationsCenter();
                highlightLoan(notification.loanId);
                markNotificationAsRead(notification.id);
            });
        }
        
        notificationsList.appendChild(notificationElement);
    });
    
    // Salvar as notificações
    saveNotifications();
    
    // Atualizar o badge
    updateNotificationBadge();
}

// Destacar um empréstimo específico quando clicar na notificação
function highlightLoan(loanId) {
    const loanElement = document.querySelector(`.loan-card[data-id="${loanId}"]`);
    
    if (loanElement) {
        // Abrir os detalhes se estiverem fechados
        const loanDetails = loanElement.querySelector('.loan-details');
        if (loanDetails && loanDetails.style.display !== 'block') {
            loanElement.querySelector('.loan-header').click();
        }
        
        // Scroll para o empréstimo
        loanElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Adicionar uma classe de destaque
        loanElement.classList.add('highlight-loan');
        
        // Remover a classe após a animação
        setTimeout(() => {
            loanElement.classList.remove('highlight-loan');
        }, 2000);
    }
}

// Formatar data relativa (ex: "há 2 horas")
function formatRelativeTime(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Agora mesmo';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `Há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `Há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
    }
    
    return date.toLocaleDateString('pt-BR');
}

// Marcar todas as notificações como lidas
function markAllNotificationsAsRead() {
    notifications.forEach(notification => {
        notification.read = true;
    });
    
    renderNotifications();
    showNotification('Todas as notificações foram marcadas como lidas', 'success');
}

// Marcar uma notificação como lida
function markNotificationAsRead(id) {
    const index = notifications.findIndex(notification => notification.id === id);
    if (index !== -1) {
        notifications[index].read = true;
        renderNotifications();
    }
}

// Alternar o status de leitura de uma notificação
function toggleNotificationReadStatus(id) {
    const index = notifications.findIndex(notification => notification.id === id);
    if (index !== -1) {
        notifications[index].read = !notifications[index].read;
        renderNotifications();
    }
}

// Excluir uma notificação
function deleteNotification(id) {
    notifications = notifications.filter(notification => notification.id !== id);
    renderNotifications();
}

// Adicionar ao renderLoans para verificar notificações quando a lista for atualizada
const originalRenderLoans = renderLoans;
renderLoans = function() {
    originalRenderLoans();
    checkDueInstallments();
}

// Tema
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
    updateThemeIcon();
}

function initTheme() {
    // Verificar preferência do sistema se não houver tema salvo
    if (!localStorage.getItem('theme')) {
        checkSystemThemePreference();
    } else {
        // Aplicar tema salvo
        applyTheme(currentTheme);
    }
    
    // Atualizar ícone do botão de tema
    updateThemeIcon();
    
    // Ouvir por mudanças na preferência do sistema
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Adicionar listener para mudanças de tema do sistema
        try {
            // Chrome & Firefox
            mediaQuery.addEventListener('change', checkSystemThemePreference);
        } catch (e) {
            try {
                // Safari
                mediaQuery.addListener(checkSystemThemePreference);
            } catch (err) {
                console.error('Navegador não suporta detecção de tema do sistema');
            }
        }
    }
}

function checkSystemThemePreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Sistema está usando tema escuro
        if (!systemThemeDetected) {
            currentTheme = 'dark';
            systemThemeDetected = true;
            applyTheme('dark');
            updateThemeIcon();
        }
    } else {
        // Sistema está usando tema claro
        if (!systemThemeDetected) {
            currentTheme = 'light';
            systemThemeDetected = true;
            applyTheme('light');
            updateThemeIcon();
        }
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Atualizar a meta tag theme-color para combinar com o tema
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#121212' : '#4361ee');
    }
}

function updateThemeIcon() {
    if (themeToggle) {
        themeToggle.innerHTML = currentTheme === 'dark' 
            ? '<i class="fas fa-moon"></i>' 
            : '<i class="fas fa-sun"></i>';
    }
} 
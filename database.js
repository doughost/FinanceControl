// Gerenciador de Banco de Dados - usando IndexedDB
class FinanceDatabase {
    constructor() {
        this.dbName = 'financeControlDB';
        this.dbVersion = 1;
        this.db = null;
        this.dbReady = false;
    }

    // Inicializar o banco de dados
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            // Evento disparado quando é necessário criar ou atualizar o banco de dados
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Criar object store para as dívidas se não existir
                if (!db.objectStoreNames.contains('loans')) {
                    const loansStore = db.createObjectStore('loans', { keyPath: 'id', autoIncrement: true });
                    loansStore.createIndex('name', 'name', { unique: false });
                    loansStore.createIndex('startDate', 'startDate', { unique: false });
                    loansStore.createIndex('category', 'category', { unique: false });
                }
            };

            // Evento disparado quando o banco de dados é aberto com sucesso
            request.onsuccess = (event) => {
                this.db = event.target.result;
                this.dbReady = true;
                console.log('Banco de dados inicializado com sucesso.');
                
                // Migrar dados do localStorage, se existirem
                this.migrateFromLocalStorage().then(() => {
                    resolve(true);
                });
            };

            // Evento disparado em caso de erro
            request.onerror = (event) => {
                console.error('Erro ao abrir o banco de dados:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Migrar dados do localStorage para o IndexedDB
    async migrateFromLocalStorage() {
        const savedLoans = localStorage.getItem('loans');
        if (savedLoans) {
            const loans = JSON.parse(savedLoans);
            if (loans && Array.isArray(loans) && loans.length > 0) {
                // Verificar se já existem dados no banco
                const existingLoans = await this.getAllLoans();
                if (existingLoans.length === 0) {
                    console.log('Migrando dados do localStorage para o IndexedDB...');
                    // Adicionar cada empréstimo ao banco de dados
                    for (const loan of loans) {
                        await this.addLoan(loan);
                    }
                    console.log('Migração concluída com sucesso.');
                }
            }
        }
    }

    // Adicionar nova dívida
    addLoan(loan) {
        return new Promise((resolve, reject) => {
            if (!this.dbReady) {
                reject(new Error('Banco de dados não está pronto.'));
                return;
            }

            const transaction = this.db.transaction(['loans'], 'readwrite');
            const store = transaction.objectStore('loans');
            
            // Se o loan já tiver um ID, vamos preservá-lo
            if (loan.id) {
                const request = store.add(loan);
                
                request.onsuccess = (event) => {
                    resolve(event.target.result);
                };
                
                request.onerror = (event) => {
                    console.error('Erro ao adicionar dívida:', event.target.error);
                    reject(event.target.error);
                };
            } else {
                // Se não tiver ID, obter o próximo ID disponível
                const countRequest = store.count();
                
                countRequest.onsuccess = () => {
                    const newId = countRequest.result > 0 ? countRequest.result + 1 : 1;
                    loan.id = newId;
                    
                    const request = store.add(loan);
                    
                    request.onsuccess = (event) => {
                        resolve(loan.id);
                    };
                    
                    request.onerror = (event) => {
                        console.error('Erro ao adicionar dívida:', event.target.error);
                        reject(event.target.error);
                    };
                };
            }
        });
    }

    // Atualizar dívida existente
    updateLoan(loan) {
        return new Promise((resolve, reject) => {
            if (!this.dbReady) {
                reject(new Error('Banco de dados não está pronto.'));
                return;
            }

            const transaction = this.db.transaction(['loans'], 'readwrite');
            const store = transaction.objectStore('loans');
            
            const request = store.put(loan);
            
            request.onsuccess = () => {
                resolve(true);
            };
            
            request.onerror = (event) => {
                console.error('Erro ao atualizar dívida:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Excluir dívida
    deleteLoan(id) {
        return new Promise((resolve, reject) => {
            if (!this.dbReady) {
                reject(new Error('Banco de dados não está pronto.'));
                return;
            }

            const transaction = this.db.transaction(['loans'], 'readwrite');
            const store = transaction.objectStore('loans');
            
            const request = store.delete(id);
            
            request.onsuccess = () => {
                resolve(true);
            };
            
            request.onerror = (event) => {
                console.error('Erro ao excluir dívida:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Obter uma dívida específica pelo ID
    getLoan(id) {
        return new Promise((resolve, reject) => {
            if (!this.dbReady) {
                reject(new Error('Banco de dados não está pronto.'));
                return;
            }

            const transaction = this.db.transaction(['loans'], 'readonly');
            const store = transaction.objectStore('loans');
            
            const request = store.get(id);
            
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            
            request.onerror = (event) => {
                console.error('Erro ao buscar dívida:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Obter todas as dívidas
    getAllLoans() {
        return new Promise((resolve, reject) => {
            if (!this.dbReady) {
                reject(new Error('Banco de dados não está pronto.'));
                return;
            }

            const transaction = this.db.transaction(['loans'], 'readonly');
            const store = transaction.objectStore('loans');
            
            const request = store.getAll();
            
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            
            request.onerror = (event) => {
                console.error('Erro ao buscar todas as dívidas:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Limpar todos os dados do banco
    clearAllData() {
        return new Promise((resolve, reject) => {
            if (!this.dbReady) {
                reject(new Error('Banco de dados não está pronto.'));
                return;
            }

            const transaction = this.db.transaction(['loans'], 'readwrite');
            const store = transaction.objectStore('loans');
            
            const request = store.clear();
            
            request.onsuccess = () => {
                resolve(true);
            };
            
            request.onerror = (event) => {
                console.error('Erro ao limpar dados:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Exportar todos os dados do banco de dados
    async exportAllData() {
        return new Promise((resolve, reject) => {
            if (!this.dbReady) {
                reject(new Error('Banco de dados não está pronto.'));
                return;
            }

            const transaction = this.db.transaction(['loans'], 'readonly');
            const store = transaction.objectStore('loans');
            
            const request = store.getAll();
            
            request.onsuccess = (event) => {
                const data = {
                    version: this.dbVersion,
                    timestamp: new Date().toISOString(),
                    loans: event.target.result
                };
                
                resolve(data);
            };
            
            request.onerror = (event) => {
                console.error('Erro ao exportar dados:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Importar dados para o banco de dados
    async importData(data) {
        return new Promise(async (resolve, reject) => {
            if (!this.dbReady) {
                reject(new Error('Banco de dados não está pronto.'));
                return;
            }

            // Validar dados
            if (!data || !data.loans || !Array.isArray(data.loans)) {
                reject(new Error('Formato de dados inválido.'));
                return;
            }

            try {
                // Limpar banco de dados atual
                await this.clearAllData();
                
                // Criar transação para adicionar os novos dados
                const transaction = this.db.transaction(['loans'], 'readwrite');
                const store = transaction.objectStore('loans');
                
                // Adicionar cada dívida
                let counter = 0;
                const total = data.loans.length;
                
                // Função para adicionar uma dívida
                const addLoan = (index) => {
                    if (index >= total) {
                        // Todos os itens foram adicionados
                        transaction.oncomplete = () => {
                            resolve({success: true, count: counter});
                        };
                        return;
                    }
                    
                    const loan = data.loans[index];
                    const request = store.add(loan);
                    
                    request.onsuccess = () => {
                        counter++;
                        // Continuar com o próximo
                        addLoan(index + 1);
                    };
                    
                    request.onerror = (event) => {
                        console.error(`Erro ao importar item ${index}:`, event.target.error);
                        // Continuar com o próximo, mesmo se houver erro
                        addLoan(index + 1);
                    };
                };
                
                // Iniciar o processo de adição
                addLoan(0);
                
                // Configurar manipulador de erro para a transação inteira
                transaction.onerror = (event) => {
                    console.error('Erro na transação de importação:', event.target.error);
                    reject(event.target.error);
                };
                
            } catch (error) {
                console.error('Erro ao importar dados:', error);
                reject(error);
            }
        });
    }
}

// Exportar uma instância única do banco de dados
const db = new FinanceDatabase();

// Função para atualizar a estrutura do banco se necessário
async function upgradeDatabase(db) {
    const currentVersion = db.version;
    console.log(`Atualizando banco de dados da versão ${currentVersion} para ${db.version + 1}`);
    
    // Verificar se a loja de objetos já existe
    if (!db.objectStoreNames.contains('loans')) {
        // Criar a loja de objetos
        const loansStore = db.createObjectStore('loans', { keyPath: 'id', autoIncrement: true });
        
        // Adicionar índices para buscas mais rápidas
        loansStore.createIndex('name', 'name', { unique: false });
        loansStore.createIndex('category', 'category', { unique: false });
        console.log('Loja de objetos "loans" criada com sucesso');
    } else {
        // Se a loja já existe, verificar se o índice de categoria existe
        const loansStore = e.currentTarget.transaction.objectStore('loans');
        if (!loansStore.indexNames.contains('category')) {
            loansStore.createIndex('category', 'category', { unique: false });
            console.log('Índice de categoria adicionado à loja existente');
        }
    }
} 
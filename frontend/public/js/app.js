// URL da API - Configurada no index.html via window.API_BASE_URL
// Função para obter a URL da API
function getApiBaseUrl() {
    return window.API_BASE_URL || 'http://localhost:3000/api/produtos';
}

// Elementos do DOM
const produtoForm = document.getElementById('produto-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const produtosList = document.getElementById('produtos-list');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const refreshBtn = document.getElementById('refresh-btn');
const searchBtn = document.getElementById('search-btn');
const searchIdInput = document.getElementById('search-id');
const searchResult = document.getElementById('search-result');

let editingId = null;

// Carregar produtos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
});

// Event Listeners
produtoForm.addEventListener('submit', handleFormSubmit);
cancelBtn.addEventListener('click', cancelarEdicao);
refreshBtn.addEventListener('click', carregarProdutos);
searchBtn.addEventListener('click', buscarPorId);

// Função para carregar todos os produtos
async function carregarProdutos() {
    try {
        loading.style.display = 'block';
        produtosList.innerHTML = '';
        errorMessage.classList.remove('show');

        const url = getApiBaseUrl();
        const response = await fetch(url);
        const result = await response.json();

        loading.style.display = 'none';

        if (result.success) {
            if (result.data.length === 0) {
                produtosList.innerHTML = `
                    <div class="empty-state">
                        <p>📭 Nenhum produto cadastrado ainda.</p>
                        <p>Use o formulário acima para cadastrar seu primeiro produto!</p>
                    </div>
                `;
            } else {
                result.data.forEach(produto => {
                    produtosList.appendChild(criarCardProduto(produto));
                });
            }
        } else {
            mostrarErro(result.error || 'Erro ao carregar produtos');
        }
    } catch (error) {
        loading.style.display = 'none';
        mostrarErro('Erro ao conectar com o servidor: ' + error.message);
    }
}

// Função para criar card de produto
function criarCardProduto(produto) {
    const card = document.createElement('div');
    card.className = 'produto-card';
    card.innerHTML = `
        <div class="produto-header">
            <div class="produto-info">
                <h3>${produto.nome}</h3>
                <span class="produto-id">ID: ${produto.id}</span>
            </div>
        </div>
        <div class="produto-details">
            <p><strong>Descrição:</strong> ${produto.descricao || 'N/A'}</p>
            <p><strong>Preço:</strong> R$ ${parseFloat(produto.preco).toFixed(2)}</p>
            <p><strong>Quantidade:</strong> ${produto.quantidade} unidades</p>
        </div>
        <div class="produto-actions">
            <button class="btn btn-warning" onclick="editarProduto(${produto.id})">✏️ Editar</button>
            <button class="btn btn-danger" onclick="deletarProduto(${produto.id})">🗑️ Deletar</button>
        </div>
    `;
    return card;
}

// Função para buscar produto por ID
async function buscarPorId() {
    const id = searchIdInput.value.trim();

    if (!id) {
        mostrarErro('Por favor, digite um ID válido');
        return;
    }

    try {
        searchResult.classList.remove('show');
        searchResult.innerHTML = '<p>Buscando...</p>';

        const url = getApiBaseUrl();
        const response = await fetch(`${url}/${id}`);
        const result = await response.json();

        if (result.success) {
            const produto = result.data;
            searchResult.innerHTML = `
                <div class="search-result show">
                    <h3>${produto.nome}</h3>
                    <p><strong>ID:</strong> ${produto.id}</p>
                    <p><strong>Descrição:</strong> ${produto.descricao || 'N/A'}</p>
                    <p><strong>Preço:</strong> R$ ${parseFloat(produto.preco).toFixed(2)}</p>
                    <p><strong>Quantidade:</strong> ${produto.quantidade} unidades</p>
                    <div style="margin-top: 15px;">
                        <button class="btn btn-warning" onclick="editarProduto(${produto.id})">✏️ Editar</button>
                        <button class="btn btn-danger" onclick="deletarProduto(${produto.id})">🗑️ Deletar</button>
                    </div>
                </div>
            `;
            searchResult.classList.add('show');
        } else {
            searchResult.innerHTML = `<p style="color: #dc3545;">${result.error || 'Produto não encontrado'}</p>`;
            searchResult.classList.add('show');
        }
    } catch (error) {
        searchResult.innerHTML = `<p style="color: #dc3545;">Erro ao buscar produto: ${error.message}</p>`;
        searchResult.classList.add('show');
    }
}

// Função para editar produto
async function editarProduto(id) {
    try {
        const url = getApiBaseUrl();
        const response = await fetch(`${url}/${id}`);
        const result = await response.json();

        if (result.success) {
            const produto = result.data;
            
            // Preencher formulário
            document.getElementById('produto-id').value = produto.id;
            document.getElementById('nome').value = produto.nome;
            document.getElementById('descricao').value = produto.descricao || '';
            document.getElementById('preco').value = produto.preco;
            document.getElementById('quantidade').value = produto.quantidade;

            // Alterar modo do formulário
            editingId = produto.id;
            formTitle.textContent = 'Editar Produto';
            submitBtn.textContent = 'Atualizar';
            cancelBtn.style.display = 'block';

            // Scroll para o formulário
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        } else {
            mostrarErro(result.error || 'Erro ao carregar produto para edição');
        }
    } catch (error) {
        mostrarErro('Erro ao carregar produto: ' + error.message);
    }
}

// Função para cancelar edição
function cancelarEdicao() {
    produtoForm.reset();
    document.getElementById('produto-id').value = '';
    editingId = null;
    formTitle.textContent = 'Cadastrar Novo Produto';
    submitBtn.textContent = 'Cadastrar';
    cancelBtn.style.display = 'none';
}

// Função para lidar com submit do formulário
async function handleFormSubmit(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const preco = document.getElementById('preco').value;
    const quantidade = document.getElementById('quantidade').value;

    if (!nome || !descricao || !preco || !quantidade) {
        mostrarErro('Por favor, preencha todos os campos');
        return;
    }

    const produtoData = {
        nome,
        descricao,
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade)
    };

    try {
        let response;
        let result;
        const url = getApiBaseUrl();

        if (editingId) {
            // Atualizar produto existente
            response = await fetch(`${url}/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produtoData)
            });
            result = await response.json();

            if (result.success) {
                mostrarSucesso('Produto atualizado com sucesso!');
                cancelarEdicao();
            } else {
                mostrarErro(result.error || 'Erro ao atualizar produto');
            }
        } else {
            // Cadastrar novo produto
            response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produtoData)
            });
            result = await response.json();

            if (result.success) {
                mostrarSucesso('Produto cadastrado com sucesso!');
                produtoForm.reset();
            } else {
                mostrarErro(result.error || 'Erro ao cadastrar produto');
            }
        }

        // Recarregar lista de produtos
        carregarProdutos();
    } catch (error) {
        mostrarErro('Erro ao salvar produto: ' + error.message);
    }
}

// Função para deletar produto
async function deletarProduto(id) {
    if (!confirm('Tem certeza que deseja deletar este produto?')) {
        return;
    }

    try {
        const url = getApiBaseUrl();
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (result.success) {
            mostrarSucesso('Produto deletado com sucesso!');
            carregarProdutos();
            
            // Limpar resultado da busca se o produto deletado estava sendo exibido
            if (searchIdInput.value == id) {
                searchResult.classList.remove('show');
                searchIdInput.value = '';
            }
        } else {
            mostrarErro(result.error || 'Erro ao deletar produto');
        }
    } catch (error) {
        mostrarErro('Erro ao deletar produto: ' + error.message);
    }
}

// Função para mostrar erro
function mostrarErro(mensagem) {
    errorMessage.textContent = mensagem;
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}

// Função para mostrar sucesso
function mostrarSucesso(mensagem) {
    // Criar elemento de sucesso se não existir
    let successMsg = document.getElementById('success-message');
    if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.id = 'success-message';
        successMsg.className = 'success-message';
        document.querySelector('.list-section').insertBefore(successMsg, produtosList);
    }
    
    successMsg.textContent = mensagem;
    successMsg.classList.add('show');
    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 3000);
}


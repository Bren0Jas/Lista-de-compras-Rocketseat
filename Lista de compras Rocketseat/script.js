// ==================== DOM Elements ====================
const itemInput = document.getElementById('itemInput');
const btnAdd = document.getElementById('btnAdd');
const shoppingList = document.getElementById('shoppingList');
const alertBox = document.getElementById('alert');
const btnBack = document.querySelector('.btn-back');

// ==================== Initial Data ====================
const initialItems = [
    'Pão de forma',
    'Leite',
    'Ovos',
    'Café preto',
    'Suco de laranja',
    'Bolacha',
];

let shoppingItems = [...initialItems];

// ==================== Init ====================
document.addEventListener('DOMContentLoaded', () => {
    renderList();
    setupEventListeners();
});

// ==================== Event Listeners ====================
function setupEventListeners() {
    btnAdd.addEventListener('click', addItem);
    itemInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addItem();
    });
    btnBack.addEventListener('click', goBack);
}

// ==================== Add Item ====================
function addItem() {
    const itemText = itemInput.value.trim();

    // Validation
    if (itemText === '') {
        showAlert('Por favor, digite um item', 'error');
        itemInput.focus();
        return;
    }

    if (itemText.length > 50) {
        showAlert('O item não pode ter mais de 50 caracteres', 'error');
        return;
    }

    // Add item
    shoppingItems.push(itemText);
    itemInput.value = '';
    itemInput.focus();
    renderList();
    showAlert(`"${itemText}" adicionado à lista`, 'success');
}

// ==================== Delete Item ====================
function deleteItem(index) {
    const itemName = shoppingItems[index];
    shoppingItems.splice(index, 1);
    renderList();
    showAlert(`"${itemName}" removido da lista`, 'error');
}

// ==================== Toggle Completion ====================
function toggleComplete(index) {
    // For this version, we'll use a simple approach with data attributes
    const checkbox = document.querySelector(`input[data-index="${index}"]`);
    const listItem = document.querySelector(`li[data-index="${index}"]`);
    
    if (checkbox.checked) {
        listItem.classList.add('completed');
    } else {
        listItem.classList.remove('completed');
    }
}

// ==================== Render List ====================
function renderList() {
    shoppingList.innerHTML = '';

    if (shoppingItems.length === 0) {
        shoppingList.innerHTML = `
            <div class="empty-state">
                <p>📋 Sua lista está vazia!</p>
                <p style="font-size: 13px; margin-top: 8px;">Adicione itens para começar a fazer compras</p>
            </div>
        `;
        return;
    }

    shoppingItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'list-item';
        li.setAttribute('data-index', index);
        
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="checkbox" 
                data-index="${index}"
                aria-label="Marcar como concluído: ${item}"
            >
            <span class="item-text">${escapeHtml(item)}</span>
            <button 
                class="btn-delete" 
                data-index="${index}"
                aria-label="Remover: ${item}"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"/>
                </svg>
            </button>
        `;

        // Events
        li.querySelector('input').addEventListener('change', () => toggleComplete(index));
        li.querySelector('.btn-delete').addEventListener('click', () => deleteItem(index));

        shoppingList.appendChild(li);
    });
}

// ==================== Show Alert ====================
function showAlert(message, type = 'success') {
    alertBox.textContent = message;
    alertBox.className = `alert show ${type}`;

    // Auto-hide after 3 seconds
    setTimeout(() => {
        alertBox.classList.add('hide');
        alertBox.classList.remove('show');
    }, 3000);
}

// ==================== Go Back ====================
function goBack() {
    // You can customize this behavior
    // For demo, it shows an alert and could navigate elsewhere
    if (confirm('Deseja sair da lista de compras?')) {
        window.history.back();
    }
}

// ==================== Utility Functions ====================
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

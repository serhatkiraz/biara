// ===============================
// DATA & ELEMENTS
// ===============================
let db = {
  todo: JSON.parse(localStorage.getItem('baira_todo')) || [],
  buy: JSON.parse(localStorage.getItem('baira_buy')) || []
};

const taskInput = document.getElementById('taskInput');
const listTodo = document.getElementById('list-todo');
const listBuy = document.getElementById('list-buy');
const countTodo = document.getElementById('count-todo');
const countBuy = document.getElementById('count-buy');

// ===============================
// UTILITY FUNCTIONS
// ===============================
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function saveToLocalStorage() {
  localStorage.setItem('baira_todo', JSON.stringify(db.todo));
  localStorage.setItem('baira_buy', JSON.stringify(db.buy));
}

function updateCounts() {
  countTodo.textContent = `(${db.todo.length})`;
  countBuy.textContent = `(${db.buy.length})`;
}

// ===============================
// RENDER FUNCTIONS
// ===============================
function renderList(type, container) {
  const items = db[type];
  container.innerHTML = '';
  
  if (items.length === 0) {
    const emptyMsg = type === 'todo' 
      ? '<div class="empty-state"><i class="fas fa-clipboard-list"></i><p>No tasks added yet</p></div>'
      : '<div class="empty-state"><i class="fas fa-shopping-basket"></i><p>No items to buy yet</p></div>';
    container.innerHTML = emptyMsg;
    return;
  }
  
  items.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = `item item-${type}`;
    
    itemEl.innerHTML = `
      <div class="item-text">${item.text}</div>
      <button class="item-btn" onclick="removeItem('${type}', '${item.id}')">
        <i class="fas fa-trash"></i> Delete
      </button>
    `;
    
    container.appendChild(itemEl);
  });
}

function renderAll() {
  renderList('todo', listTodo);
  renderList('buy', listBuy);
  updateCounts();
}

// ===============================
// MAIN FUNCTIONS
// ===============================
function addTask(type) {
  const val = taskInput.value.trim();
  if (!val) {
    taskInput.focus();
    return;
  }
  
  const newItem = {
    id: uid(),
    text: val,
    createdAt: new Date().toISOString()
  };
  
  db[type].unshift(newItem); // Add to beginning
  saveToLocalStorage();
  taskInput.value = '';
  taskInput.focus();
  renderAll();
  
  // Visual feedback
  const btn = type === 'todo' ? document.querySelector('.btn-todo') : document.querySelector('.btn-buy');
  const originalColor = btn.style.background;
  btn.style.background = type === 'todo' ? '#6a30a9' : '#ffcc33';
  setTimeout(() => {
    btn.style.background = originalColor;
  }, 300);
}

function removeItem(type, id) {
  if (!confirm('Are you sure you want to delete this item?')) return;
  
  db[type] = db[type].filter(item => item.id !== id);
  saveToLocalStorage();
  renderAll();
}

function resetAll() {
  if (!confirm('Are you sure you want to delete all lists? This action cannot be undone.')) return;
  
  db = { todo: [], buy: [] };
  localStorage.removeItem('baira_todo');
  localStorage.removeItem('baira_buy');
  renderAll();
  
  // Visual feedback
  const resetBtn = document.querySelector('.btn-reset');
  resetBtn.innerHTML = '<i class="fas fa-check"></i> CLEARED!';
  resetBtn.style.background = 'rgba(76, 175, 80, 0.3)';
  
  setTimeout(() => {
    resetBtn.innerHTML = '<i class="fas fa-trash-alt"></i> CLEAR ALL';
    resetBtn.style.background = '';
  }, 2000);
}

// ===============================
// KEYBOARD SHORTCUTS & EVENT LISTENERS
// ===============================
taskInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    addTask('todo');
  }
});

document.addEventListener('keydown', function(e) {
  // Ctrl+Enter for BUY
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    addTask('buy');
  }
  
  // Escape to clear input
  if (e.key === 'Escape') {
    taskInput.value = '';
    taskInput.focus();
  }
  
  // Ctrl+Shift+Delete to reset all
  if (e.ctrlKey && e.shiftKey && e.key === 'Delete') {
    resetAll();
  }
});

// Focus input on page load
window.addEventListener('load', function() {
  taskInput.focus();
  renderAll();
});

// ===============================
// DRAG & DROP (Bonus feature - optional)
// ===============================
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const element = document.getElementById(data);
  ev.target.appendChild(element);
}

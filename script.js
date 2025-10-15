// Struktur File JS Memenuhi Ketentuan
document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const dateInput = document.getElementById('date-input');
    const todoList = document.getElementById('todo-list');
    const filterStatus = document.getElementById('filter-status');
    
    // Inisialisasi daftar todo dari localStorage atau array kosong
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // --- UTILITY FUNCTIONS ---

    // Simpan daftar todo ke Local Storage
    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    // Render daftar todo ke DOM
    const renderTodos = (filter = 'all') => {
        todoList.innerHTML = ''; // Kosongkan daftar saat ini

        const filteredTodos = todos.filter(todo => {
            if (filter === 'completed') return todo.completed;
            if (filter === 'pending') return !todo.completed;
            return true;
        });

        filteredTodos.forEach(todo => {
            // Membuat elemen LI baru
            const listItem = document.createElement('li');
            listItem.classList.toggle('completed', todo.completed);
            listItem.dataset.id = todo.id;

            // Konten detail todo
            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('todo-details');
            
            const textSpan = document.createElement('span');
            textSpan.classList.add('todo-text');
            textSpan.textContent = todo.text;
            
            const dateSpan = document.createElement('span');
            dateSpan.classList.add('todo-date');
            dateSpan.textContent = `Deadline: ${todo.date}`;

            detailsDiv.appendChild(textSpan);
            detailsDiv.appendChild(dateSpan);
            
            // Kontainer Aksi (Tombol)
            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('actions');

            // Tombol Complete
            const completeBtn = document.createElement('button');
            completeBtn.classList.add('complete-btn');
            completeBtn.textContent = todo.completed ? 'Batal Selesai' : 'Selesaikan';
            completeBtn.addEventListener('click', () => toggleComplete(todo.id));

            // Tombol Delete
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Hapus';
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

            actionsDiv.appendChild(completeBtn);
            actionsDiv.appendChild(deleteBtn);
            
            listItem.appendChild(detailsDiv);
            listItem.appendChild(actionsDiv);
            todoList.appendChild(listItem);
        });
    };

    // --- FEATURE IMPLEMENTATION ---

    // 1. ADD: Menambahkan kegiatan baru
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const text = todoInput.value.trim();
        const date = dateInput.value;

        // 4. VALIDATE INPUT FORM
        if (!text || !date) {
            alert('Mohon isi semua kolom kegiatan dan tanggal!');
            return;
        }

        const newTodo = {
            id: Date.now(), // ID unik berdasarkan timestamp
            text: text,
            date: date,
            completed: false
        };

        todos.push(newTodo);
        saveTodos();
        
        // Render ulang daftar dengan filter saat ini
        renderTodos(filterStatus.value); 

        // Reset form
        todoInput.value = '';
        dateInput.value = '';
    });

    // 2. DELETE: Menghapus kegiatan
    const deleteTodo = (id) => {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos(filterStatus.value);
    };

    // 3. COMPLETE: Mengubah status kegiatan
    const toggleComplete = (id) => {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();
        renderTodos(filterStatus.value);
    };

    // 4. FILTER: Menerapkan filter
    filterStatus.addEventListener('change', (e) => {
        renderTodos(e.target.value);
    });

    // Inisialisasi tampilan saat halaman pertama kali dimuat
    renderTodos();
});
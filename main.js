const input = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("todoList");
const themeToggle = document.getElementById("themeToggle");
const filterButtons = document.querySelectorAll("#filters button");
let currentFilter = "all";

// MENTÉS
function saveTodos() {
    const items = [];

    document.querySelectorAll("#todoList li").forEach(li => {
        items.push({
            text: li.querySelector(".task-text").textContent,
            done: li.classList.contains("done")
        });
    });

    localStorage.setItem("todos", JSON.stringify(items));
}

// BETÖLTÉS
function loadTodos() {
    const data = JSON.parse(localStorage.getItem("todos")) || [];

    data.forEach(item => {
        createTodoElement(item.text, item.done);
    });

    updateCounter();
}

// EGY FELADAT LÉTREHOZÁSA
function createTodoElement(text, done = false) {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const textSpan = document.createElement("span");
    textSpan.classList.add("task-text");
    textSpan.textContent = text;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Törlés";

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(deleteBtn);

    setTimeout(() => li.classList.add("show"));

    if (done) {
        li.classList.add("done");
        checkbox.checked = true;
    }

    // Checkbox → kész állapot
    checkbox.addEventListener("click", (event) => {
        event.stopPropagation();
        li.classList.toggle("done");
        saveTodos();
        applyFilter();
    });

    // Törlés
    deleteBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        li.classList.add("hide");

        setTimeout(() => {
            li.remove();
            updateCounter();
            saveTodos();
        }, 250);
    });

    // SZERKESZTÉS – dupla kattintás a szövegre
    textSpan.addEventListener("dblclick", () => {
        const originalText = textSpan.textContent;

        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = originalText;
        editInput.classList.add("edit-input");

        li.replaceChild(editInput, textSpan);
        editInput.focus();

        editInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") finishEdit();
            if (e.key === "Escape") cancelEdit();
        });

        editInput.addEventListener("blur", finishEdit);

        function finishEdit() {
            const newText = editInput.value.trim() || originalText;
            textSpan.textContent = newText;
            li.replaceChild(textSpan, editInput);
            saveTodos();
        }

        function cancelEdit() {
            li.replaceChild(textSpan, editInput);
        }
    });

    list.appendChild(li);
}

// HOZZÁADÁS
function addTodo() {
    const text = input.value.trim();

    if (text === "") {
        alert("Írj be egy feladatot!");
        return;
    }

    createTodoElement(text);
    input.value = "";

    updateCounter();
    saveTodos();
}

// SZÁMLÁLÓ
function updateCounter() {
    const count = document.querySelectorAll("#todoList li").length;
    document.getElementById("counter").textContent = "Összes feladat: " + count;
}

// SZŰRÉS
function applyFilter() {
    document.querySelectorAll("#todoList li").forEach(li => {
        const isDone = li.classList.contains("done");

        if (currentFilter === "all") {
            li.classList.remove("filtered-out");
        } else if (currentFilter === "active") {
            li.classList.toggle("filtered-out", isDone);
        } else if (currentFilter === "completed") {
            li.classList.toggle("filtered-out", !isDone);
        }
    });
}

// ESEMÉNYEK
addBtn.addEventListener("click", addTodo);

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTodo();
    }
});

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;

        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        applyFilter();
    });
});

// TÉMA
function loadTheme() {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
        document.body.classList.add("dark");
        themeToggle.textContent = "☀️ Világos mód";
    } else {
        themeToggle.textContent = "🌙 Sötét mód";
    }
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️ Világos mód";
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙 Sötét mód";
    }
});

// INDULÁSKOR
loadTheme();
loadTodos();
applyFilter();

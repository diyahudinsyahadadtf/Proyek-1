/* ==========================================
   STUDYFLOW - SCRIPT.JS
   ========================================== */

/* 1. MENGAMBIL ELEMEN HTML */

const taskForm = document.getElementById("task-form");
const taskIdInput = document.getElementById("task-id");
const taskTitleInput = document.getElementById("task-title");
const taskSubjectInput = document.getElementById("task-subject");
const taskDeadlineInput = document.getElementById("task-deadline");
const taskPriorityInput = document.getElementById("task-priority");

const taskList = document.getElementById("task-list");
const taskSearch = document.getElementById("task-search");
const taskFilter = document.getElementById("task-filter");
const sortTasks = document.getElementById("sort-tasks");

const totalTasks = document.getElementById("total-tasks");
const pendingTasks = document.getElementById("pending-tasks");
const completedTasks = document.getElementById("completed-tasks");

const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");

const formTitle = document.getElementById("form-title");
const submitTaskButton = document.getElementById("submit-task");
const cancelEditButton = document.getElementById("cancel-edit");

const scheduleDateInput = document.getElementById("schedule-date");
const scheduleHeading = document.getElementById("schedule-heading");
const scheduleList = document.getElementById("schedule-list");

const themeToggle = document.getElementById("theme-toggle");

/* 2. PENYIMPANAN DATA */

const TASK_STORAGE_KEY = "studyflow_tasks";
const THEME_STORAGE_KEY = "studyflow_theme";

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(TASK_STORAGE_KEY);

        if (!savedTasks) {
            return [];
        }

        const parsedTasks = JSON.parse(savedTasks);

        if (!Array.isArray(parsedTasks)) {
            return [];
        }

        // Pastikan data yang dibaca memiliki struktur yang benar.
        return parsedTasks.filter(task =>
            task &&
            typeof task.id === "string" &&
            typeof task.title === "string" &&
            typeof task.subject === "string" &&
            typeof task.deadline === "string" &&
            ["Rendah", "Sedang", "Tinggi"].includes(task.priority) &&
            typeof task.completed === "boolean"
        );
    } catch (error) {
        console.error("Gagal membaca data tugas:", error);
        return [];
    }
}

let tasks = loadTasks();

function saveTasks() {
    try {
        localStorage.setItem(
            TASK_STORAGE_KEY,
            JSON.stringify(tasks)
        );
        return true;
    } catch (error) {
        console.error("Gagal menyimpan tugas:", error);
        alert("Data gagal disimpan. Periksa penyimpanan browser.");
        return false;
    }
}

/* 3. FUNGSI BANTUAN */

function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    return Date.now().toString(36) +
        Math.random().toString(36).slice(2);
}

function formatDate(dateString) {
    if (!dateString) {
        return "Tanggal belum ditentukan";
    }

    const date = new Date(dateString + "T00:00:00");

    if (Number.isNaN(date.getTime())) {
        return "Tanggal tidak valid";
    }

    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date);
}

function getPriorityRank(priority) {
    const ranks = {
        "Tinggi": 3,
        "Sedang": 2,
        "Rendah": 1
    };

    return ranks[priority] || 0;
}

/* 4. MENAMBAH DAN MENGEDIT TUGAS */

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = taskTitleInput.value.trim();
    const subject = taskSubjectInput.value.trim();
    const deadline = taskDeadlineInput.value;
    const priority = taskPriorityInput.value;
    const existingId = taskIdInput.value;

    if (!title || !subject || !deadline) {
        alert("Lengkapi semua informasi tugas terlebih dahulu.");
        return;
    }

    if (!["Rendah", "Sedang", "Tinggi"].includes(priority)) {
        alert("Pilih prioritas tugas yang valid.");
        return;
    }

    if (existingId) {
        const index = tasks.findIndex(task => task.id === existingId);

        if (index === -1) {
            alert("Tugas tidak ditemukan. Silakan coba lagi.");
            resetTaskForm();
            return;
        }

        const oldTask = tasks[index];

        tasks[index] = {
            ...oldTask,
            title,
            subject,
            deadline,
            priority
        };
    } else {
        const newTask = {
            id: createId(),
            title,
            subject,
            deadline,
            priority,
            completed: false,
            createdAt: Date.now()
        };

        tasks.push(newTask);
    }

    if (!saveTasks()) {
        tasks = loadTasks();
        renderAll();
        return;
    }

    resetTaskForm();
    renderAll();
});

function editTask(id) {
    const task = tasks.find(item => item.id === id);

    if (!task) {
        return;
    }

    taskIdInput.value = task.id;
    taskTitleInput.value = task.title;
    taskSubjectInput.value = task.subject;
    taskDeadlineInput.value = task.deadline;
    taskPriorityInput.value = task.priority;

    formTitle.textContent = "Edit Tugas";
    submitTaskButton.textContent = "Simpan Perubahan";
    cancelEditButton.hidden = false;

    document.getElementById("tasks").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    taskTitleInput.focus({ preventScroll: true });
}

function resetTaskForm() {
    taskForm.reset();
    taskIdInput.value = "";

    taskPriorityInput.value = "Sedang";

    formTitle.textContent = "Tambah Tugas Baru";
    submitTaskButton.textContent = "+ Tambah Tugas";
    cancelEditButton.hidden = true;
}

cancelEditButton.addEventListener("click", resetTaskForm);

/* 5. MENANDAI TUGAS SELESAI */

function toggleTask(id) {
    const task = tasks.find(item => item.id === id);

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    if (!saveTasks()) {
        tasks = loadTasks();
    }

    renderAll();
}

/* 6. MENGHAPUS TUGAS */

function deleteTask(id) {
    const task = tasks.find(item => item.id === id);

    if (!task) {
        return;
    }

    const confirmed = confirm(
        `Hapus tugas "${task.title}"?`
    );

    if (!confirmed) {
        return;
    }

    const previousTasks = tasks;
    tasks = tasks.filter(item => item.id !== id);

    if (!saveTasks()) {
        tasks = previousTasks;
        renderAll();
        return;
    }

    if (taskIdInput.value === id) {
        resetTaskForm();
    }

    renderAll();
}

/* 7. MEMBUAT ELEMEN TEKS DENGAN AMAN */

function createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    // textContent mencegah teks tugas dianggap sebagai HTML.
    element.textContent = text;

    return element;
}

/* 8. MENAMPILKAN DAFTAR TUGAS */

function renderTasks() {
    taskList.replaceChildren();

    const searchTerm = taskSearch.value.trim().toLowerCase();
    const filterValue = taskFilter.value;
    const sortValue = sortTasks.value;

    let visibleTasks = tasks.filter(task => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm) ||
            task.subject.toLowerCase().includes(searchTerm);

        const matchesStatus =
            filterValue === "all" ||
            (filterValue === "pending" && !task.completed) ||
            (filterValue === "completed" && task.completed);

        return matchesSearch && matchesStatus;
    });

    visibleTasks.sort((a, b) => {
        if (sortValue === "priority") {
            return getPriorityRank(b.priority) -
                getPriorityRank(a.priority);
        }

        return a.deadline.localeCompare(b.deadline);
    });

    if (visibleTasks.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";

        emptyState.append(
            createTextElement("span", "", "📝"),
            createTextElement(
                "h3",
                "",
                tasks.length === 0
                    ? "Belum ada tugas"
                    : "Tugas tidak ditemukan"
            ),
            createTextElement(
                "p",
                "",
                tasks.length === 0
                    ? "Tambahkan tugas pertamamu melalui formulir di atas."
                    : "Coba ubah kata pencarian atau filter."
            )
        );

        taskList.appendChild(emptyState);
        return;
    }

    visibleTasks.forEach(task => {
        const card = document.createElement("article");
        card.className = "task-card";

        if (task.completed) {
            card.classList.add("completed");
        }

        const info = document.createElement("div");
        info.className = "task-info";

        info.append(
            createTextElement("h3", "task-title", task.title),
            createTextElement(
                "p",
                "task-subject",
                "📚 " + task.subject
            ),
            createTextElement(
                "p",
                "task-deadline",
                "📅 Deadline: " + formatDate(task.deadline)
            )
        );

        const badges = document.createElement("div");
        badges.className = "task-badges";

        const priorityClass = {
            "Rendah": "priority-low",
            "Sedang": "priority-medium",
            "Tinggi": "priority-high"
        }[task.priority];

        badges.appendChild(
            createTextElement(
                "span",
                "badge " + priorityClass,
                "Prioritas " + task.priority
            )
        );

        badges.appendChild(
            createTextElement(
                "span",
                task.completed
                    ? "badge badge-done"
                    : "badge badge-pending",
                task.completed ? "Selesai" : "Belum selesai"
            )
        );

        info.appendChild(badges);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeButton = createTextElement(
            "button",
            "",
            task.completed ? "↩ Batalkan" : "✓ Selesai"
        );
        completeButton.type = "button";
        completeButton.addEventListener("click", () => {
            toggleTask(task.id);
        });

        const editButton = createTextElement(
            "button",
            "",
            "✎ Edit"
        );
        editButton.type = "button";
        editButton.addEventListener("click", () => {
            editTask(task.id);
        });

        const deleteButton = createTextElement(
            "button",
            "delete-task",
            "🗑 Hapus"
        );
        deleteButton.type = "button";
        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        actions.append(
            completeButton,
            editButton,
            deleteButton
        );

        card.append(info, actions);
        taskList.appendChild(card);
    });
}

/* 9. MEMPERBARUI DASHBOARD */

function renderDashboard() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    const progress = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    totalTasks.textContent = total;
    pendingTasks.textContent = pending;
    completedTasks.textContent = completed;

    progressText.textContent = progress + "%";
    progressBar.style.width = progress + "%";

    progressBar.setAttribute(
        "aria-label",
        `Progres tugas ${progress}%`
    );
}

/* 10. JADWAL BERDASARKAN TANGGAL */

function renderSchedule() {
    const selectedDate = scheduleDateInput.value;

    scheduleList.replaceChildren();

    if (!selectedDate) {
        scheduleHeading.textContent = "Tugas pada tanggal pilihan";
        scheduleList.appendChild(
            createTextElement(
                "p",
                "empty-message",
                "Pilih tanggal untuk melihat tugas yang harus dikerjakan."
            )
        );
        return;
    }

    scheduleHeading.textContent =
        "Tugas tanggal " + formatDate(selectedDate);

    const dayTasks = tasks
        .filter(task => task.deadline === selectedDate)
        .sort((a, b) =>
            getPriorityRank(b.priority) - getPriorityRank(a.priority)
        );

    if (dayTasks.length === 0) {
        scheduleList.appendChild(
            createTextElement(
                "p",
                "empty-message",
                "Tidak ada tugas pada tanggal ini. Kamu bisa memakai waktu untuk belajar atau beristirahat."
            )
        );
        return;
    }

    dayTasks.forEach(task => {
        const item = document.createElement("article");
        item.className = "schedule-item";

        if (task.completed) {
            item.style.opacity = "0.7";
        }

        item.append(
            createTextElement("h4", "", task.title),
            createTextElement(
                "p",
                "",
                `${task.subject} • Prioritas ${task.priority}`
            ),
            createTextElement(
                "p",
                "",
                task.completed ? "✓ Sudah selesai" : "○ Belum selesai"
            )
        );

        scheduleList.appendChild(item);
    });
}

/* 11. FILTER DAN PENCARIAN */

taskSearch.addEventListener("input", renderTasks);
taskFilter.addEventListener("change", renderTasks);
sortTasks.addEventListener("change", renderTasks);
scheduleDateInput.addEventListener("change", renderSchedule);

/* 12. MODE TERANG DAN GELAP */

function applyTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark-mode", isDark);

    themeToggle.textContent = isDark ? "☀️" : "🌙";
    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"
    );

    themeToggle.title = isDark
        ? "Ganti ke mode terang"
        : "Ganti ke mode gelap";
}

function saveTheme(theme) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
        console.error("Tema tidak dapat disimpan:", error);
    }
}

function loadTheme() {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY) === "dark"
            ? "dark"
            : "light";
    } catch (error) {
        return "light";
    }
}

applyTheme(loadTheme());

themeToggle.addEventListener("click", function () {
    const newTheme = document.body.classList.contains("dark-mode")
        ? "light"
        : "dark";

    applyTheme(newTheme);
    saveTheme(newTheme);
});

/* 13. FOCUS TIMER */

const timerDisplay = document.getElementById("timer-display");
const timerMode = document.getElementById("timer-mode");
const timerMessage = document.getElementById("timer-message");

const timerStartButton = document.getElementById("timer-start");
const timerPauseButton = document.getElementById("timer-pause");
const timerResetButton = document.getElementById("timer-reset");
const timerApplyButton = document.getElementById("timer-apply");

const focusDurationInput = document.getElementById("focus-duration");
const breakDurationInput = document.getElementById("break-duration");

let focusMinutes = 25;
let breakMinutes = 5;

let timerModeValue = "focus";
let remainingSeconds = focusMinutes * 60;
let timerInterval = null;
let timerEndTime = null;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return String(minutes).padStart(2, "0") +
        ":" +
        String(remaining).padStart(2, "0");
}

function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(remainingSeconds);

    timerMode.textContent = timerModeValue === "focus"
        ? "Waktu Fokus"
        : "Waktu Istirahat";

    timerMessage.textContent = timerModeValue === "focus"
        ? "Fokus pada satu tugas dan lakukan yang terbaik."
        : "Istirahat sejenak sebelum kembali belajar.";

    document.title =
        formatTime(remainingSeconds) + " - StudyFlow";
}

function stopTimerInterval() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    timerEndTime = null;
}

function resetTimer() {
    stopTimerInterval();

    remainingSeconds = (
        timerModeValue === "focus"
            ? focusMinutes
            : breakMinutes
    ) * 60;

    updateTimerDisplay();
}

function startTimer() {
    if (timerInterval !== null) {
        return;
    }

    timerEndTime = Date.now() + remainingSeconds * 1000;

    timerInterval = setInterval(() => {
        remainingSeconds = Math.max(
            0,
            Math.ceil((timerEndTime - Date.now()) / 1000)
        );

        updateTimerDisplay();

        if (remainingSeconds <= 0) {
            stopTimerInterval();

            // Beralih otomatis antara fokus dan istirahat.
            timerModeValue = timerModeValue === "focus"
                ? "break"
                : "focus";

            remainingSeconds = (
                timerModeValue === "focus"
                    ? focusMinutes
                    : breakMinutes
            ) * 60;

            updateTimerDisplay();

            timerMessage.textContent = timerModeValue === "break"
                ? "Sesi fokus selesai! Saatnya istirahat."
                : "Waktu istirahat selesai! Siap fokus kembali?";

            alert(
                timerModeValue === "break"
                    ? "Sesi fokus selesai! Saatnya istirahat."
                    : "Waktu istirahat selesai! Saatnya fokus kembali."
            );
        }
    }, 250);
}

timerStartButton.addEventListener("click", startTimer);

timerPauseButton.addEventListener("click", function () {
    if (timerInterval === null) {
        return;
    }

    remainingSeconds = Math.max(
        0,
        Math.ceil((timerEndTime - Date.now()) / 1000)
    );

    stopTimerInterval();
    updateTimerDisplay();
});

timerResetButton.addEventListener("click", resetTimer);

timerApplyButton.addEventListener("click", function () {
    const newFocus = Number(focusDurationInput.value);
    const newBreak = Number(breakDurationInput.value);

    if (
        !Number.isInteger(newFocus) ||
        !Number.isInteger(newBreak) ||
        newFocus < 1 ||
        newFocus > 120 ||
        newBreak < 1 ||
        newBreak > 60
    ) {
        alert(
            "Durasi fokus harus 1–120 menit dan istirahat 1–60 menit."
        );
        return;
    }

    focusMinutes = newFocus;
    breakMinutes = newBreak;

    resetTimer();

    alert("Durasi timer berhasil diperbarui.");
});

/* 14. MENJALANKAN SEMUA TAMPILAN */

function renderAll() {
    renderDashboard();
    renderTasks();
    renderSchedule();
}

renderAll();
updateTimerDisplay();

/* ==========================================
   STUDYFLOW SELESAI DIMUAT
   ========================================== */

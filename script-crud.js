const taskListContainer = document.querySelector('.app__section-task-list');
const formTask = document.querySelector('.app__form-add-task');
const toggleFormTaskButton = document.querySelector('.app__button--add-task');
const formLabel = document.querySelector('.app__form-label');
const textArea = document.querySelector('.app__form-textarea');
const cancelFormButton = document.querySelector('.app__form-footer__button--cancel');
const taskActiveDescription = document.querySelector('.app__section-active-task-description');
const buttonCancel = document.querySelector('.app__form-footer__button--cancel');
const localStorageTask = localStorage.getItem('tarefas');
const buttonDelete = document.querySelector('.app__form-footer__button--delete');
const buttonDeleteCompleted = document.querySelector('#btn-remover-concluidas');
const buttonDeleteAll = document.querySelector('#btn-remover-todas');

let tarefas = localStorageTask ? JSON.parse(localStorageTask) : []

const taskIconSvg = `<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
    <path
        d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
        fill="#01080E" />
</svg>`

let selectedTask = null;
let selectedTaskItem = null;
let editTask = null;
let editParagraph = null;

const selectTask = (tarefa, elemento) => {
    if (tarefa.concluida) {
        return
    }
    document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
        button.classList.remove('app__section-task-list-item-active')
})
    if(selectedTask == tarefa) {
        taskActiveDescription.textContent = null;
        selectedTaskItem = null;
        selectedTask = null;
        return;
    }

    selectedTask = tarefa;
    selectedTaskItem = elemento;
    taskActiveDescription.textContent = tarefa.descricao;
    elemento.classList.add('app__section-task-list-item-active');
}

const clearForm = () => {
    editTask = null;
    editParagraph = null;
    textArea.value ='';
    formTask.classList = ('hidden');
}

const selectTaskToEdit = (tarefa, elemento) => {
    if(editTask == tarefa) {
        clearForm()
        return;
    }

    formLabel.textContent = 'Editando Tarefa';
    editTask = tarefa;
    editParagraph = elemento;
    textArea.value = tarefa.descricao;
    formTask.classList.remove('hidden');
}

const removerTarefas = (somenteConcluidas) => {
    const seletor = somenteConcluidas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach((element) => {
        element.remove();
    });
tarefas = somenteConcluidas ? tarefas.filter(t => !t.concluida) : []
    updateLocalStorage()
}
buttonDeleteCompleted.addEventListener('click', () => removerTarefas(true));
buttonDeleteAll.addEventListener('click', () => removerTarefas(false));

function createTask (tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svgIcon = document.createElement('svg');
    svgIcon.innerHTML = taskIconSvg; 

    const paragraph = document.createElement('p');
    paragraph.classList.add('app__section-task-list-item-description');

    paragraph.textContent = tarefa.descricao;

    const button = document.createElement('button');

    button.classList.add('app_button-edit');
    const editIcon = document.createElement('img');
    editIcon.setAttribute('src', 'imagens/edit.png');

    button.appendChild(editIcon);

    button.addEventListener('click', (evento) => {
        evento.stopPropagation()
        selectTaskToEdit(tarefa, paragraph)
    })

    li.onclick = () => {
        selectTask(tarefa, li);
    }

    svgIcon.addEventListener('click', (evento) => {
        if (tarefa == selectedTask) {
            evento.stopPropagation()
            button.setAttribute('disabled', true)
            li.classList.add('app__section-task-list-item-complete')
            selectedTask.concluida = true
            updateLocalStorage()
        }
       
    })

    if(tarefa.concluida) {
        button.setAttribute('disabled', true)
        li.classList.add('app__section-task-list-item-complete')
    }

    li.appendChild(svgIcon);
    li.appendChild(paragraph);
    li.appendChild(button);

    return li;
}

tarefas.forEach(task => {
    const taskItem = createTask(task);
    taskListContainer.appendChild(taskItem);
});

cancelFormButton.addEventListener('click', () => {
    formTask.classList.toggle('hidden');
});

buttonCancel.addEventListener('click', clearForm);

buttonDelete.addEventListener('click', () => {
    if(selectedTask) {
        const index = tarefas.indexOf(selectedTask)

        if(index !== -1) {
            tarefas.splice(index, 1)
        }

        selectedTaskItem.remove()
        tarefas.filter( t => t!= selectedTask)
        selectedTaskItem = null
        selectedTask = null
    }
    updateLocalStorage()
    clearForm()
})

toggleFormTaskButton.addEventListener('click', () => {
    formLabel.textContent = 'Adicionando tarefas';
    formTask.classList.toggle('hidden');
});

const updateLocalStorage = () => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

formTask.addEventListener('submit', (evento) => {
    evento.preventDefault()
    if(editTask) {
        editTask.descricao = textArea.value
        editParagraph.textContent = textArea.value
    } 
    
    else {

    const task = {
        descricao: textArea.value,
        concluida: false
    }

    tarefas.push(task);
    const taskItem = createTask(task);
    taskListContainer.appendChild(taskItem);
}
    updateLocalStorage();
    clearForm();
});

document.addEventListener('TarefaFinalizada', function(e) {
    if (selectedTask) {
        selectedTask.concluida = true
        selectedTaskItem.classList.add('app__section-task-list-item-complete')
        selectedTaskItem.querySelector('button').setAttribute('disabled', true)
        updateLocalStorage()
    }
})




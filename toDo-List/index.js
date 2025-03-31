//let tasks = [
//    {id: 1 , description:`Comprar pão` , checked: false},
//    {id: 2 , description:`Passear com o cachorro` , checked: false},
//    {id: 3 , description:`Fazer o almoço` , checked:false}
//] Agora Estou Usando a memória Local para salvar altearações recentes, 
// Não mais a lista chumbada!

//const checkboxes = document.querySelectorAll('.onCheckboxClick'); // Seleciona os checkboxes
//const contadorElement = document.querySelector('#contador'); // Elemento para exibir a contagem
//let contador = 0;
//
//checkboxes.forEach(checkbox => {
//    checkbox.addEventListener('change', () => {
//        contador = document.querySelectorAll('.checkbox-tarefa:checked').length;
//        contadorElement.textContent = `Tarefas concluídas: ${contador}`;
//    });
//});



const renderTaskProgressData = (tasks) => {
    let tasksProgress;
    const tasksProgressDOM = document.getElementById('tasks-progress');

    if(tasksProgressDOM) tasksProgress = tasksProgressDOM;
    else{
        const newTasksProgressDOM = document.createElement('div');
        newTasksProgressDOM.id = 'tasks-progress';
        document.getElementsByTagName('footer')[0].appendChild(newTasksProgressDOM);
        tasksProgress = newTasksProgressDOM;
    }

    const doneTasks = tasks.filter (({checked}) => checked).length
    const totalTasks = tasks.length;
    tasksProgress.textContent = `${doneTasks}/${totalTasks} concluídas `

}

const getTasksFromLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'));
    return localTasks ? localTasks : [];
}

const setTasksInLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
}

const removeTask = (taskId) => {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter(( {id} ) => parseInt(id) !== parseInt(taskId));
    setTasksInLocalStorage(updatedTasks);
    renderTaskProgressData(updatedTasks);
    

    document
        .getElementById("todo-list")
        .removeChild(document.getElementById(taskId))
        
}

const removeDoneTasks = () => {
    const tasks = getTasksFromLocalStorage()
    const taskstoRemove = tasks
        .filter(({ checked }) => checked)
        .map(({id}) => id)

    const updatedTasks = tasks.filter(({checked}) => !checked);
    setTasksInLocalStorage(updatedTasks);
    renderTaskProgressData(updatedTasks);
    
    taskstoRemove.forEach((taskstoRemove) => {
        document
        .getElementById('todo-list')
        .removeChild(document.getElementById(taskstoRemove))
      })
}

const createTaskListItem = (task, checkbox) => {
        const list = document.getElementById('todo-list');
        const toDo = document.createElement('li');

        const removeTaskButton = document.createElement('button');
        removeTaskButton.textContent = 'x';
        removeTaskButton.ariaLabel = 'Remover tarefa';

        removeTaskButton.onclick = () => removeTask(task.id);

        toDo.id = task.id;
        toDo.appendChild(checkbox);
        toDo.appendChild(removeTaskButton)
        list.appendChild(toDo);

        return toDo;
};

const onCheckboxClick = (event) => {
    const [id] = event.target.id.split('-');
    const tasks = getTasksFromLocalStorage();
    

    const updatedTasks = tasks.map((task) => {
        return parseInt(task.id) === parseInt(id)
        ? {...task, checked: event.target.checked}
        : task
    }) 

    setTasksInLocalStorage(updatedTasks)
    renderTaskProgressData(updatedTasks)
}

const getCheckBoxInput = ({id, description, checked}) => {
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const wrapper = document.createElement('div');
    const checkboxId =`${id}-checkbox`;

    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = checked || false;
    checkbox.addEventListener('change', onCheckboxClick)

    label.textContent = description;
    label.htmlfor = checkboxId;

    wrapper.className = 'checkbox-label-container';

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);

    return wrapper;

}
const getNewTaskId = () => {
    const tasks = getTasksFromLocalStorage()
    const lastId = tasks[tasks.length - 1]?.id;
    return lastId ? lastId + 1 : 1;

}

const getNewTasKData = (event) => {
    const description = event.target.elements.description.value;
    const id = getNewTaskId();

    return { description, id }
}

const getCreatedTaskInfo = (event) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(getNewTasKData(event))
    }, 3000)
})

const createTask = async (event) => {
    event.preventDefault();
    document.getElementById('save-task').setAttribute('disabled', true);
    const newTasKData = await getCreatedTaskInfo(event);

    const checkbox = getCheckBoxInput(newTasKData)
    createTaskListItem(newTasKData, checkbox);
    
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = [
        ...tasks,
        {id: newTasKData.id, description: newTasKData.description, checked:false}
    ]
    setTasksInLocalStorage(updatedTasks)
    renderTaskProgressData(updatedTasks)  
    document.getElementById('description' ).value = ''
    document.getElementById('save-task').removeAttribute('disabled');
    
}

window.onload = function() {
    const form = document.getElementById('create-todo-form');
    form.addEventListener('submit', createTask)
    
    const tasks = getTasksFromLocalStorage();
    tasks.forEach((task) => {
        const checkbox = getCheckBoxInput(task);
        createTaskListItem(task, checkbox)

        //toDo.textContent = task.description;

        
    })
    renderTaskProgressData(tasks)
}
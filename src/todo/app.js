import todoStore, { Filter } from '../store/todo.store';
import html from './app.html?raw'; // se exporta en crudo (vite)
import { renderTodos, renderPending } from './uses-cases';


const elementIds = {
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    ClearCompleted: '.clear-completed',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count',
}


/**
 * //en esta funcion se va crear la aplicacion, lo que va a renderizar en pantalla 
 * @param {String} elementId 
 */
export const App = ( elementId ) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos( elementIds.TodoList, todos );
        updatePendingCount();
    }


    const updatePendingCount = () =>{
        renderPending(elementIds.PendingCountLabel);
    }
    
    //funcion anonima autoinvocada
    //cuando la funcion App() se llama 
    (() => {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector( elementId ).append(app);
        displayTodos();
    })();


    //Referencia HTML
    const newDescriptionInput = document.querySelector (elementIds.NewTodoInput);
    const todoListUL = document.querySelector ( elementIds.TodoList );
    const clearCompletedButton = document.querySelector ( elementIds.ClearCompleted);
    const filterLi = document.querySelectorAll ( elementIds.TodoFilters); // esto crea un array con los botones 

    //Listeners

    newDescriptionInput.addEventListener ('keyup', ( event ) => {
        if ( event.keyCode !== 13 ) return;
        if ( event.target.value.trim().length === 0 ) return;

        todoStore.addTodo( event.target.value );
        displayTodos();
        event.target.value = '';
    })

    todoListUL.addEventListener ( 'click', (event) => {
        const element = event.target.closest( '[data-id]');
        todoStore.toggleTodo( element.getAttribute('data-id'));
        displayTodos();
    } )

    todoListUL.addEventListener( 'click', (event) => {
        const isDestroyElement = event.target.className === 'destroy';
        const element = event.target.closest( '[data-id]');
        if ( !element || !isDestroyElement ) return;
        todoStore.deleteTodo( element.getAttribute('data-id'));
        displayTodos();
    })

    clearCompletedButton.addEventListener( 'click', () => {
        todoStore.deleteCompleted();
        displayTodos();
    })

    filterLi.forEach( element =>{

        element.addEventListener('click', (element) =>{
            filterLi.forEach(ele => ele.classList.remove('selected'));
            element.target.classList.add('selected');

            switch(element.target.text){
                case 'Todos':
                    todoStore.setFilter(Filter.All)
                    break;
                case 'Pendientes':
                    todoStore.setFilter(Filter.Pending)
                    break;
                case 'Completados':
                    todoStore.setFilter(Filter.Completed)
                    break;    
            }

            displayTodos();
            
        })
    })



}
import { Todo } from "../todo/models/todo.models";

export const Filter = {
    All: 'all',
    Completed: 'Completed',
    Pending:'Pending'
}

const state = {
    todos: [
        new Todo('Piedra del alma'),
        new Todo('Piedra del infinito'),
        new Todo('Piedra del tiempo'),
        new Todo('Piedra del realidad'),
        new Todo('Piedra del poder'),
    ],

    filter: Filter.All,

}

const initStore = () => {
    loadStore();
    console.log('Init Store');
}

const loadStore = () =>{
    if (!localStorage.getItem('state') ) return;
    
    const { todos = [], filter = Filter.All} = JSON.parse( localStorage.getItem('state') );
    state.todos = todos;
    state.filter = filter;

}

const saveStateToLocalStorage = () => {
    localStorage.setItem('state',JSON.stringify(state));
}

const getTodos = ( filter = Filter.All) => {
    switch( filter ){
        case Filter.All:
            return [...state.todos];

        case Filter.Completed:
             return state.todos.filter( todo => todo.done );

        case Filter.Pending:
            return state.todos.filter( todo => !todo.done );

        default:
            throw new Error (`Opcion ${ filter } no es valido`);

    }
}


const addTodo = ( description ) => {
    if ( !description ) throw new Error('Descripcion es requerida');
    state.todos.push( new Todo(description) );

    saveStateToLocalStorage();
    
}

const toggleTodo = ( todoId ) => {
    state.todos = state.todos.map( todo => {
        if( todo.id === todoId ){
            todo.done = !todo.done;
        }
        return todo;
    })

    saveStateToLocalStorage();
}

const deleteTodo = ( todoId ) => {
    state.todos = state.todos.filter( todo => todo.id !== todoId );

    saveStateToLocalStorage();
}


const deleteCompleted = () => {
    state.todos = state.todos.filter( todo => !todo.done );
    saveStateToLocalStorage();
}

const setFilter = ( newFilter = Filter.All ) => {
    state.filter = newFilter;
    saveStateToLocalStorage();
}

const getCurrentFilter = () => {
    return state.filter;

}



export default {
    initStore,
    loadStore,
    addTodo, 
    toggleTodo,
    deleteTodo, 
    deleteCompleted,
    setFilter,
    getCurrentFilter,
    getTodos,
}
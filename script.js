class Model {
  constructor() {
    this.todos = [];
    // this.todos = [
    //   {
    //     id: '1',
    //     property: {
    //       title: 'title1',
    //       text: 'text1',
    //       label: 'label1',
    //       isFinished: false,
    //       isArchived: false,
    //     },
    //   },
    //   {
    //     id: '2',
    //     property: {
    //       title: 'title2',
    //       text: 'text2',
    //       label: 'label2',
    //       isFinished: true,
    //       isArchived: false,
    //     },
    //   },
    // ];
  }

  bindTodoListChanged(callback) {
    this.onTodoListChanged = callback;
  }

  addTodo(todoObj) {
    const todo = {
      id: todoObj.id,
      property: {
        title: todoObj.property.title,
        text: todoObj.property.text,
        label: todoObj.property.label,
        isFinished: todoObj.property.isFinished,
        isArchived: todoObj.property.isArchived,
      },
    };
    this.todos.push(todo);
    // this.onTodoListChanged(this.todos);
  }

  editTodo(id, updatedText) {
    this.todos = this.todos.map((todo) => {
      todo.id === id
        ? {
            id: todo.id,
            property: {
              title: todo.property.id,
              text: updatedText,
              label: todo.property.label,
              isFinished: todo.property.isFinished,
              isArchived: todo.propertyisArchived,
            },
          }
        : todo;
    });
  }

  archivedTodo(id) {
    this.todos = this.todos.map((todo) => {
      todo.id === id
        ? {
            id: todo.id,
            property: {
              title: todo.property.id,
              text: updatedText,
              label: todo.property.label,
              isFinished: todo.property.isFinished,
              isArchived: true,
            },
          }
        : todo;
    });
  }

  toggleTodo(id) {
    this.todos = this.todos.map((todo) => {
      todo.id === id
        ? {
            id: todo.id,
            property: {
              title: todo.property.id,
              text: updatedText,
              label: todo.property.label,
              isFinished: !todo.property.isFinished,
              isArchived: todo.propertyisArchived,
            },
          }
        : todo;
    });
  }
}

class View {
  constructor() {
    this.app = this.getElement('#root');
    this.title = this.createElement('h1');
    this.title.textContent = 'Todo List';
    // The form, with a [type="text"] input, and a submit button
    this.form = this.createElement('form');
    this.inputTitle = this.createElement('input');
    this.inputTitle.type = 'text';
    this.inputTitle.placeholder = 'Add title';
    this.input = this.createElement('textarea');
    this.input.placeholder = 'Add todo';
    this.input.name = 'todo';
    this.submitButton = this.createElement('button');
    this.submitButton.textContent = 'Submit';
    // The visual representation of the todo list
    this.todoList = this.createElement('ul', ['todo-list']);

    // Append the input and submit button to the form
    this.form.append(this.inputTitle, this.input, this.submitButton);

    // Append the title, form, and todo list to the app
    this.app.append(this.title, this.form, this.todoList);
  }

  //public methods
  createElement(tag, arrClassName, objAttributes) {
    const element = document.createElement(tag);
    if (arrClassName) element.classList.add(...arrClassName);
    return element;
  }

  getElement(selector) {
    const element = document.querySelector(selector);
    return element;
  }
  //private methods
  _resetInput() {
    this.form.reset();
  }

  _getTodoText(e) {
    const title = this.inputTitle.value;
    const text = this.input.value;
    const timeStamp = e.timeStamp.toLocaleString();

    if (title && text) {
      const item = {
        id: timeStamp,
        property: {
          title: title,
          text: text,
          label: 'test',
          isFinished: false,
          isArchived: false,
        },
      };
      return item;
    }
    return null;
  }

  //   get _todotext() {
  //     return this.input.value;
  //   }

  bindAddTodo(handler) {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (this._getTodoText(e)) {
        handler(this._getTodoText(e));
        this._resetInput();
      }
    });
  }

  displayTodos(todos) {
    //delete all nodes
    while (this.todoList.firstChild) {
      this.todoList.remove(this.todoList.firstChild);
    }
    //show default message
    if (todos.length === 0) {
      const p = this.createElement('p');
      p.textContent = 'Nothing to do? Add a task?';
      this.todoList.append(p);
    } else {
      const items = todos.map((todo) => {
        const li = this.createElement('li');
        const divWrapper = this.createElement('div');
        const divContainer = this.createElement('div');
        const title = this.createElement('p');
        title.textContent = todo.property.title;
        const checkbox = this.createElement('input');
        checkbox.type = 'checkbox';
        const span = this.createElement('span');
        span.textContent = todo.property.text;
        const button = this.createElement('button');
        button.textContent = 'Delete';
        button.type = 'button';

        divContainer.append(checkbox, span, button);
        divWrapper.append(title, divContainer);
        li.append(divWrapper);
        return li;
      });
      this.todoList.append(...items);
    }
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    //Explicit 'this' binding
    this.model.bindTodoListChanged(this.onTodoListChanged);
    this.view.bindAddTodo(this.handleAddTodo);
    //Display initial
    this.onTodoListChanged(this.model.todos);
  }

  //   onTodoListChanged(todos) {
  //     this.view.displayTodos(todos);
  //   }

  onTodoListChanged = (todos) => {
    this.view.displayTodos(todos);
  };

  //   handleAddTodo(todoObj) {
  //     console.log(this);
  //     this.model.addTodo(todoObj);
  //   }
  handleAddTodo = (todoObj) => {
    this.model.addTodo(todoObj);
  };

  handleEditTodo = (id, todoText) => {
    this.model.editTodo(id, todoText);
  };

  handleDeleteTodo = (id) => {
    this.model.toggleTodo(id);
  };
}

const app = new Controller(new Model(), new View());

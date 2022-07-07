class Model {
  constructor() {
    this.todos = [
      {
        id: Date.now().toString(),
        title: 'text',
        text: 'text',
        label: 'label',
        isFinished: false,
        isArchived: false,
      },
    ];
  }

  bindTodoListChanged(callback) {
    this.onTodoListChanged = callback;
  }

  addTodo(todoObj) {
    const todo = {
      id: todoObj.id,
      title: todoObj.title,
      text: todoObj.text,
      label: todoObj.label,
      isFinished: false,
      isArchived: false,
    };

    this.todos.push(todo);
    this.onTodoListChanged(this.todos);
  }

  toggleTodo(id) {
    this.todos = this.todos.map((todo) => {
      return todo.id == id
        ? {
            id: todo.id,
            title: todo.title,
            text: todo.text,
            label: todo.label,
            isFinished: !todo.isFinished,
            isArchived: todo.isArchived,
          }
        : todo;
    });
    console.log(this.todos);
    this.onTodoListChanged(this.todos);
  }

  archivedTodo(id) {
    this.todos = this.todos.map((todo) => {
      return todo.id == id
        ? {
            id: todo.id,
            title: todo.title,
            text: todo.text,
            label: todo.label,
            isFinished: todo.isFinished,
            isArchived: !todo.isArchived,
          }
        : todo;
    });
    // console.log(this.todos);
    this.onTodoListChanged(this.todos);
  }

  editTodo(id, updatedTexts) {
    this.todos = this.todos.map((todo) => {
      return todo.id === id
        ? {
            id: todo.id,
            title: updatedTexts.title ? updatedTexts.title : todo.title,
            text: updatedTexts.text ? updatedTexts.text : todo.text,
            label: todo.label,
            isFinished: todo.isFinished,
            isArchived: todo.isArchived,
          }
        : todo;
    });
    console.log(this.todos);
    this.onTodoListChanged(this.todos);
  }
}

class View {
  constructor() {
    this.app = this._getElement('root');
    this.app.classList.add(
      'h-screen',
      'w-3/4',
      'bg-zinc-50',
      'mx-auto',
      'my-2',
      'rounded-lg'
    );
    this.inputDiv = this._createElement('div', ['container', 'mx-auto', 'p-4']);

    this.form = this._createElement('form');
    this.titleInput = this._createElement('input', [
      'mt-2',
      'bg-zinc-50',
      'p-2',
      'border-b-4',
      'focus:ring-sky-200',
      'focus:outline-none',
      'focus:border-sky-500',
      'focus:ring-1',
      'focus:ring-sky-500',
      'rounded-md',
      'placeholder:text-gray-500',
      'text-gray-700',
    ]);
    this.titleInput.type = 'text';
    this.titleInput.placeholder = 'Add todo title...';

    this.textInput = this._createElement('input', [
      'bg-zinc-50',
      'p-2',
      'grow',
      'border-b-4',
      'focus:ring-sky-200',
      'focus:outline-none',
      'focus:border-sky-500',
      'focus:ring-1',
      'focus:ring-sky-500',
      'rounded-md',
      'placeholder:text-gray-500',
      'text-gray-700',
    ]);
    this.textInput.type = 'text';
    // // this.textInput.setAttribute('word-break', 'break-word');
    // // this.textInput.setAttribute('rows', 5);
    this.div = this._createElement('div', ['flex', 'justify-between', 'gap-2']);
    this.textInput.placeholder = 'Add todo text...';

    this.submitButton = this._createElement('button', [
      'p-2',
      'bg-sky-400',
      'rounded',
      'text-zinc-50',
      'hover:bg-sky-500',
    ]);
    this.div.append(this.textInput, this.submitButton);
    this.submitButton.type = 'submit';
    this.submitButton.textContent = 'Submit';

    this.form.append(this.titleInput, this.div);
    this.header = this._createElement('h1', [
      'text-3xl',
      'uppercase',
      'font-bold',
    ]);

    this.header.textContent = 'Todos';
    this.ul = this._createElement('ul', [
      'container',
      'flex-col',
      'gap-2',
      'py-2',
    ]);

    this.ul.classList.add('todo-list');
    this.inputDiv.append(this.header, this.form);
    this.app.append(this.inputDiv, this.ul);
    this._temporaryTodoText = { title: '', text: '' };
    this._initLocalListeners();
  }

  getTodoText() {
    const id = Date.now().toString();
    const title = this.titleInput.value;
    const text = this.textInput.value;
    const label = 'unlabelled';

    if (title && text) {
      return {
        id: id,
        title: title,
        text: text,
        label: label,
        isFinished: false,
        isArchived: false,
      };
    }
    return null;
  }

  _resetInput() {
    this.form.reset();
  }

  _createElement(tag, classArr) {
    const element = document.createElement(tag);
    if (classArr) {
      element.classList.add(...classArr);
    }
    return element;
  }

  _getElement(id, classArr) {
    const element = document.getElementById(id);
    if (classArr) {
      element.classList.add(...classArr);
    }
    return element;
  }

  displayTodos(todos) {
    // Delete all nodes
    while (this.ul.firstChild) {
      this.ul.removeChild(this.ul.firstChild);
    }

    //container
    const todosEl = todos
      .filter((todo) => !todo.isArchived)
      .map((todo) => {
        //list item
        const li = this._createElement('li', [
          'p-2',
          'm-2',
          'rounded-md',
          'bg-zinc-50',
          'border-y-2',
          'transition-all',
        ]);
        li.setAttribute('id', todo.id);
        //title
        const headerDiv = this._createElement('div', [
          'flex',
          'justify-between',
          'border-b',
          'py-2',
        ]);
        const h4 = this._createElement('h4', [
          'editable-title',
          'pl-5',
          'grow',
          'uppercase',
          'font-bold',
          'py-2',
          'focus:ring-sky-200',
          'focus:outline-none',
          'focus:border-sky-500',
          'focus:ring-1',
          'focus:ring-sky-500',
          'rounded-md',
          'focus:border-b-4',
        ]);
        h4.setAttribute('contenteditable', true);
        h4.textContent = todo.title;
        //date
        const dateSpan = this._createElement('span', [
          'text-xs',
          'font-light',
          'py-3',
        ]);
        const date = new Date(Number(todo.id)).toDateString();
        dateSpan.textContent = date;
        headerDiv.append(h4, dateSpan);
        //content
        const contentDiv = this._createElement('div', [
          'flex',
          'gap-2',
          'items-center',
          'my-2',
        ]);
        //checkbox
        const checkbox = this._createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.isFinished;
        //span
        const spanDiv = this._createElement('div', [
          'flex',
          'grow',
          'text-gray-700',
        ]);
        const span = this._createElement('span', [
          'editable-text',
          'grow',
          'py-2',
          'focus:ring-sky-200',
          'focus:outline-none',
          'focus:border-sky-500',
          'focus:ring-1',
          'focus:ring-sky-500',
          'rounded-md',
          'focus:border-b-4',
          'px-2',
        ]);
        span.setAttribute('contenteditable', true);
        span.textContent = todo.text;

        if (todo.isFinished) {
          const strike = this._createElement('s', ['flex', 'grow']);
          strike.append(span);
          spanDiv.append(strike);
        } else {
          spanDiv.append(span);
        }
        //button
        const button = this._createElement('button', [
          'px-2',
          'py-4',
          'bg-rose-300',
          'rounded-md',
          'flex-none',
          'hover:bg-rose-400',
        ]);
        button.type = 'button';
        button.textContent = 'Delete';
        //
        contentDiv.append(checkbox, spanDiv, button);
        li.append(headerDiv, contentDiv);

        return li;
      });
    this.ul.append(...todosEl);
  }

  //HANDLERS
  bindAddTodo(handler) {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.getTodoText()) {
        handler(this.getTodoText());
        this._resetInput();
      }
    });
  }

  bindToggleTodo(handler) {
    this.ul.addEventListener('click', (e) => {
      if (e.target.type === 'checkbox') {
        // console.log(e.target.closest('li').id);
        handler(e.target.closest('li').id);
      }
    });
  }

  bindArchivedTodo(handler) {
    this.ul.addEventListener('click', (e) => {
      if (e.target.type === 'button') {
        // console.log(e.target.closest('li').id);
        handler(e.target.closest('li').id);
      }
    });
  }

  _initLocalListeners() {
    // this.textInput.addEventListener('blur')
    this.ul.addEventListener('input', (e) => {
      if (e.target.className === 'editable-title') {
        this._temporaryTodoText.title = e.target.innerText;
      } else if (e.target.className === 'editable-text') {
        this._temporaryTodoText.text = e.target.innerText;
      }
      return;
    });
  }

  // Send the completed value to the model
  bindEditTodo(handler) {
    this.ul.addEventListener('focusout', (e) => {
      // e.preventDefault();
      if (this._temporaryTodoText) {
        console.log(this._temporaryTodoText);
        const id = e.target.closest('li').id;
        console.log(id);
        handler(id, this._temporaryTodoText);
        this._temporaryTodoText = { title: '', text: '' };
      }
    });
  }

  // bindEditTodo(handler) {
  //   this.ul.addEventListener('focusout', (e) => {
  //     if (e.target.type === 'button') {
  //       // console.log(e.target.closest('li').id);
  //       handler(e.target.closest('li').id);
  //     }
  //   });
  // }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    // Explicit this binding
    this.model.bindTodoListChanged(this.onTodoListChanged);
    this.view.bindAddTodo(this.handleAddTodo);
    this.view.bindToggleTodo(this.handleToggleTodo);
    this.view.bindArchivedTodo(this.handleArchivedTodo);
    this.view.bindEditTodo(this.handleEditTodo);
    // Display initial todos
    this.onTodoListChanged(this.model.todos);
  }

  onTodoListChanged = (todos) => {
    this.view.displayTodos(todos);
  };
  handleAddTodo = (todoText) => {
    this.model.addTodo(todoText);
  };

  handleToggleTodo = (id) => {
    this.model.toggleTodo(id);
  };

  handleArchivedTodo = (id) => {
    this.model.archivedTodo(id);
  };

  handleEditTodo = (id, updatedTexts) => {
    this.model.editTodo(id, updatedTexts);
  };
}

const app = new Controller(new Model(), new View());

import './style.css'

class ToDo {
  static list = [];
 
   constructor(description, complete = false) {
     this.description = description;
     this.complete = complete;
     this.index = ToDo.list.length;
     ToDo.list.push(this);
     this.getList = () => ToDo.list;
   }
 
   update() {
     if (this.complete) {
       this.complete = false;
     } else {
       this.complete = true;
     }
   }
 }
 
 
 // Add items to UI
 function populateList() {
   const todoList = document.getElementById('todo-list');
   todoList.innerHTML = '';
 
   ToDo.list.forEach((item) => {
     const listItem = document.createElement('li');
     listItem.setAttribute('id', item.index);
     listItem.classList = 'item-container';
 
     listItem.innerHTML = `
     <input class="checkbox" type="checkbox">
     <span>${item.description}</span>
     <textarea class="text-area" maxlength="30">${item.description}</textarea>
     <button class="cancel-btn">u</button>
     `;
 
     todoList.appendChild(listItem);
 
     const checkbox = listItem.querySelector('input');
     const text = listItem.querySelector('span');
     const textInput = listItem.querySelector('textarea');
     const deleteButton = listItem.querySelector('button');
 
     // Update
     checkbox.addEventListener('change', () => {
       const index = parseInt(listItem.id, 10);
       ToDo.list[index].update();
       text.classList.toggle('complete');
       textInput.classList.toggle('complete');
       localStorage.setItem('todoList', JSON.stringify(ToDo.list));
     });
 
     // Edit functionality
     text.addEventListener('click', () => {
       text.style.display = 'none';
       textInput.classList.toggle('edit-item');
     });
 
     textInput.addEventListener('keydown', (e) => {
       // Follow value
       text.innerHTML = textInput.value;
 
       // Update list
       const index = parseInt(listItem.id, 10);
       ToDo.list[index].description = text.innerHTML;
 
       // Update local storage
       localStorage.setItem('todoList', JSON.stringify(ToDo.list));
 
       if (e.code === 'Enter') {
         // Update UI
         text.style.display = 'block';
         textInput.classList.toggle('edit-item');
       }
     });
 
     // Delete functionality
     deleteButton.addEventListener('click', () => {
       // Update list
       const index = parseInt(listItem.id, 10);
       ToDo.list = ToDo.list.filter((item) => item !== ToDo.list[index]);
       // Update indexes
       ToDo.list.forEach((item, i) => { item.index = i; });
       // Update local storage
       localStorage.setItem('todoList', JSON.stringify(ToDo.list));
       // Update UI
       populateList();
     });
 
     if (item.complete) {
       checkbox.checked = true;
       text.classList = 'complete';
     }
   });
 }
 
 // Add functionality
 function add(e) {
   if (e.code === 'Enter') {
     // Create new item
     const newItem = new ToDo(this.value, false);
 
     // Update local storage
     localStorage.setItem('todoList', JSON.stringify(newItem.getList()));
 
     // Update UI
     this.value = '';
     populateList();
   }
 }
 
 // Clear completed functionality
 function deleteAllCompleted() {
   // Update list
   ToDo.list = ToDo.list.filter((item) => item.complete === false);
   // Update indexes
   ToDo.list.forEach((item, i) => { item.index = i; });
   // Update local storage
   localStorage.setItem('todoList', JSON.stringify(ToDo.list));
   // Update UI
   populateList();
 }
 
 // Window load
 const list = JSON.parse(localStorage.getItem('todoList'));
 if (list) {
   list.forEach((item) => new ToDo(item.description, item.complete));
 }
 
 // Add
 const addInput = document.getElementById('add-input');
 addInput.addEventListener('keydown', add);
 
 // Delete all completed
 const clearButton = document.getElementById('clear-btn');
 clearButton.addEventListener('click', deleteAllCompleted);
 
 // Populate UI
 populateList();
 
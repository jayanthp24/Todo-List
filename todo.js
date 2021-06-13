const addForm = document.querySelector('.add');
const list = document.querySelector('.todos');
const search = document.querySelector('.search input');

const addTemplate = (todo, id) => {
    const html=`
        <li data-id="${id}" class="list-group-item d-flex justify-content-between align-items-center text-light">
            <span>${todo.todo}</span>
            <i class="far fa-trash-alt delete"></i>
        </li>
    `;
    list.innerHTML += html;
};

addForm.addEventListener('submit', e => {
    e.preventDefault();
    const todo = {
        todo: addForm.add.value.trim(),
    };
    db.collection('todos').add(todo).then(() => {
        alert("New task added successfully");
    }).catch(err => {
        alert(err);
    });
    addForm.reset();
    setInterval(function () {
        window.location.reload();
    }, 2000)
});

db.collection('todos').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        addTemplate(doc.data(), doc.id);
    });
        }).catch(err => {
    console.log(err);
});

list.addEventListener('click', e => {
    if(e.target.classList.contains('delete')) {
        const id = e.target.parentElement.getAttribute('data-id');
        db.collection('todos').doc(id).delete().then(() => {
            alert("Task deleted successfully");
        }).catch(err => {
            alert(err);
        })
    };
    setInterval(function () {
        window.location.reload();
    }, 2000)
});

const filterList = (term) => {
    Array.from(list.children)
        .filter((todo) => !todo.textContent.toLowerCase().includes(term))
        .forEach((todo) => todo.classList.add('filtered'));

    Array.from(list.children)
        .filter((todo) => todo.textContent.toLowerCase().includes(term))
        .forEach((todo) => todo.classList.remove('filtered'));  
};

search.addEventListener('keyup', e => {
    const term = search.value.trim().toLowerCase();
    filterList(term);
});
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


const deleteTemplate = (id) => {
    const tasks = document.querySelectorAll('li');
    tasks.forEach(task => {
        if(task.getAttribute('data-id') === id){
            task.remove();
        }
    });
};

db.collection('todos').onSnapshot(snapshot => {
    console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change => {
        const doc = change.doc;
        if(change.type === 'added'){
            addTemplate(doc.data(), doc.id);
        } else if (change.type === 'removed'){
            deleteTemplate(doc.id);
        }
    });
});

addForm.addEventListener('submit', e => {
    e.preventDefault();
    const todo = {
        todo: addForm.add.value.trim(),
    };
    db.collection('todos').add(todo).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: true,
        });
    }).catch(err => {
        alert(err);
    });
    addForm.reset();
});

list.addEventListener('click', e => {
    if(e.target.classList.contains('delete')) {
        Swal.fire({
            title: 'Are you sure?',
            text: "Have you really completed the task and proceed to delete?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                    const id = e.target.parentElement.getAttribute('data-id');
                    db.collection('todos').doc(id).delete().then(() => {
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                    }).catch(err => {
                        alert(err);
                    });
                };  
        });
    };
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

var db = firebase.firestore()
const $form = document.querySelector('#form')
const $imgBack = document.querySelector('#imgBack')
const $contentList = document.querySelector('.content-list')

let editStatus = false
let id = ''

const getTasks = () => db.collection("tasks").get();
const onGetImg = (callback) => db.collection("gallery").onSnapshot(callback);
const onGetTask = (callback) => db.collection("tasks").onSnapshot(callback);
const deleteTask = (id) => db.collection("tasks").doc(id).delete();
const getTask = (id) => db.collection("tasks").doc(id).get();
const updateTask = (id, updatedTask) => db.collection('tasks').doc(id).update(updatedTask);

onGetImg(querySnapshot=>{
    querySnapshot.forEach((doc) => {
        const imgs = doc.data();
        $imgBack.src = imgs.img
    })
})

const saveTask = (title, description) =>
  db.collection("tasks").add({
    title,
    description,
  });







$form.addEventListener('submit',async (ev)=>{
    ev.preventDefault()
    
    const title = $form['title']
    const description =  $form['description']

    try {
        if (!editStatus) {
          await saveTask(title.value, description.value);
        } else {
          await updateTask(id, {
            title:title.value,
            description: description.value,
          })
    
          editStatus = false;
          id = '';
          
        }
    
        $form.reset();
        title.focus();
      } catch (error) {
        console.log(error);
      }
    

})


window.addEventListener("DOMContentLoaded", async (e) => {
    
     onGetTask(querySnapshot=>{
        
            $contentList.innerHTML =""

        querySnapshot.forEach((doc) => {
            
            const task = doc.data();
            
            $contentList.innerHTML += `<div class="taskGet">
            <div class="td">
                <h3 class="h5">${task.title}</h3>
                <p>${task.description}</p>
            </div>
           
              <button class="btn btn-delete" data-id="${doc.id}">
                🗑 Delete
              </button>
              <button class="btn btn-edit" data-id="${doc.id}">
                🖉 Edit
              </button>
            
          </div>`

         

            })

    
    const btnsDelete = $contentList.querySelectorAll(".btn-delete");
    console.log(btnsDelete)
    btnsDelete.forEach((btn) =>
    btn.addEventListener("click", async (e) => {
        console.log(e.target.dataset.id);
        try {
          await deleteTask(e.target.dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    )

    const btnsEdit = $contentList.querySelectorAll(".btn-edit");
    console.log(btnsEdit)

    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getTask(e.target.dataset.id);
          const task = doc.data();
          $form["title"].value = task.title;
          $form["description"].value = task.description;

          editStatus = true;
          id = doc.id;
          $form["btn-form"].innerText = "Update";

        } catch (error) {
          console.log(error);
        }
      });
    });
})
  

})
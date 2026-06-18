const cl = console.log;

const postform = document.getElementById('postform')
const titlecontrol = document.getElementById('title')
const bodycontrol = document.getElementById('body')
const userIdcontrol = document.getElementById('userId')
const addpost = document.getElementById('addpost')
const updateBtn = document.getElementById('updateBtn')
const postcontainer = document.getElementById('postcontainer')
const spinner = document.getElementById('spinner')

let base_url= "https://jsonplaceholder.typicode.com"; 
let post_url =`${base_url}/posts`; 

function snackbar(msg,icon){
    swal.fire({
        title:msg,
        icon:icon,
        timer:3000
    })
}
function createcard(arr){
    let res=' ';
    arr.forEach(ele => {
        res += `<div class="col-md-4 my-4" id=${ele.id}>
                    <div class="card h-100">
                            <div class="card-header" data-toggle="tooltip" data-placement="top" title="${ele.title}">
                                <h3>${ele.title}</h3>
                            </div>
                            <div class="card-body">
                                ${ele.body}
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button onclick="onEdit(this)" class="btn btn-outline-primary btn-sm">Edit</button>
                                <button  onclick="onRemove(this)" class="btn btn-outline-danger btn-sm">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>`
    });

    postcontainer.innerHTML = res;
}

function fetchposts(){
    spinner.classList.remove('d-none')
    let xhr = new XMLHttpRequest()
    xhr.open('GET', post_url, true)
    xhr.send(null)
    xhr.onload = function(){
        cl(xhr.response)
        cl(xhr.status)
        let res = ' ';
        if(xhr.status>=200 && xhr.status <= 299){
            let data = JSON.parse(xhr.response)
            cl(data)
            createcard(data)
        }else{
            cl('api is failed')
        }
         spinner.classList.add('d-none')
    }
}
fetchposts()


function onPostSubmit(eve){ 
    eve.preventDefault(); 
 spinner.classList.remove('d-none')
 let postObj = { 
           title:titlecontrol.value ,
           body:bodycontrol.value,
           userId:userIdcontrol.value        
        }
  
        
       let xhr= new XMLHttpRequest() ; 
          
       xhr.open('POST', post_url);
       xhr.send(JSON.stringify(postObj)); 

        xhr.onload = function(){ 
         if(xhr.status>=200 && xhr.status<=299){ 
          let resp =JSON.parse(xhr.response); 
              postform.reset();
         
           let col=document.createElement('div');
               col.className  = 'col-md-4 my-4'; 
               col.id         = resp.id;
               col.innerHTML  = ` <div class="card h-100">
                                 <div class="card-header" data-toggle="tooltip" data-placement="top" title="${postObj.title}">
                                 <H3>${postObj.title} </H3>                           
                                  </div>
                                   <div class="card-body">
                                     ${postObj.body}
                                    </div>
                                 <div class="card-footer d-flex justify-content-between">
                                  <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-primary btn-sm">Edit</button>
                                  <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger btn-sm">Remove</button>
                                 </div>
                                </div>` 

             let postcontainer = document.getElementById('postcontainer');
                 postcontainer.prepend(col);      
            
            
            }else{ 
                   snackbar('New post is not created', 'error');   
                 }
                  spinner.classList.add('d-none')
            }

      } 
      
function onRemove(ele){
    Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed){
                        spinner.classList.remove('d-none');
                    let removeId =  ele.closest('.col-md-4').id ;
                    let removeUrl=  `${base_url}/posts/${removeId}`
                    let xhr= new XMLHttpRequest(); 
                        xhr.open('DELETE', removeUrl);
                        xhr.send(null);
                
                    xhr.onload = function(){ 
                        if(xhr.status>=200 && xhr.status<=299){ 
                        ele.closest('.col-md-4').remove();
                        }else{
                            snackbar('Not  deleted','error')
                        } 
                        spinner.classList.add('d-none')
                    }
        
                } 
            });
}

function onEdit(ele){ 
    let editId= ele.closest('.col-md-4').id ;
    localStorage.setItem('EditId', editId);      
    let Edit_url = `${base_url}/posts/${editId}`;
    
    spinner.classList.remove('d-none');
    let xhr  = new XMLHttpRequest(); 
        xhr.open('GET', Edit_url);

        xhr.setRequestHeader('content-type', 'application/json') ;
        xhr.setRequestHeader('Autho','Get token from');
        xhr.send(null);
        document.querySelectorAll('.btn-outline-danger').forEach(btn=>{
            btn.disabled=true;
        });
        
        xhr.onload =function (){ 
          if(xhr.status>=200 && xhr.status<=299){
                       let EditObj=  JSON.parse(xhr.response)
                         console.log(xhr.response);
               
                titlecontrol.value  = EditObj.title ;
                bodycontrol.value   = EditObj.body ;
                userIdcontrol.value = EditObj.userId ;
               
                addpost.classList.add('d-none'); 
                updateBtn.classList.remove('d-none');  
                spinner.classList.add('d-none')
                 postform.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
              });
              }else{ 
                 snackbar('Data is not patched', 'error');
                spinner.classList.add('d-none')

              }
        } 


}

function onUpdate(){ 
    let updateId = localStorage.getItem('EditId');
    let updateUrl=`${base_url}/posts/${updateId}` 
    
    let updateObj= { 
        title:titlecontrol.value ,
        body:bodycontrol.value ,
        userId:userIdcontrol.value
    }
    
    spinner.classList.remove('d-none')

  let xhr= new XMLHttpRequest() ;

   xhr.open('PATCH', updateUrl);
   xhr.send(JSON.stringify(updateObj));
   xhr.onload = function (){ 
  
      if(xhr.status>=200 && xhr.status<=200){ 
       let res = xhr.response; 
           let col= document.getElementById(updateId); 
              col.innerHTML =` <div class="card h-100">
                                 <div class="card-header" data-toggle="tooltip" data-placement="top" title="${updateObj.title}">
                                 <H3>${updateObj.title} </H3>                           
                                  </div>
                                   <div class="card-body">
                                     ${updateObj.body}
                                    </div>
                                 <div class="card-footer d-flex justify-content-between">
                                  <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-primary">Edit</button>
                                  <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete</button>
                                 </div>
                                </div>`
           
                addpost.classList.remove('d-none'); 
                updateBtn.classList.add('d-none');  
                spinner.classList.add('d-none') 
                postform.reset()
                 document.querySelectorAll('.btn-outline-danger').forEach(btn=>{
                    btn.disabled=false;
                });
                snackbar('updated succesfully', 'success')
                col.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                  });

    col.classList.add('highlight');

    setTimeout(() => {
        col.classList.remove('highlight');
    }, 4000);

            console.log(res); 
            
       }else{  
            snackbar('updated failed', 'error')
           spinner.classList.add('d-none');   
       }
    }
  

}


postform.addEventListener('submit', onPostSubmit)
 updateBtn.addEventListener('click', onUpdate)
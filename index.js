const add_btn= document.querySelector('.add-btn');
const delete_btn= document.querySelector('.delete-btn');
const create_ticket=document.querySelector('.ticket-box');
const delete_btn_back=document.querySelector('.delete-btn-back');
const ticket_container=document.querySelector('.ticket-list');
const submit_task=document.querySelector('.submit-btn');
let add_toggle=false;
let delete_toggle=false;

let Alltickets_objects=[];


window.addEventListener("load",function(e){
    const tasks= JSON.parse(localStorage.getItem("DailyActivites"));
    tasks.forEach((ticket) =>{
        createtask(ticket.id,ticket.name,ticket.description,ticket.priority,ticket.tasklevel);
    });
});




add_btn.addEventListener("click", function(){
    if(!add_toggle){
        create_ticket.style.display="flex";
    }
    else{
        create_ticket.style.display="none";
    }
    add_toggle = !add_toggle;
});



delete_btn.addEventListener('click',()=>{
    if(!delete_toggle){
        alert("Delete option has been enabled. Please select a ticket to delete.");
        delete_btn_back.style.backgroundColor="#ff0000ff";
    }
    else{
        alert("Delete option has been disabled.");
        delete_btn_back.style.backgroundColor="#ffffff";
    }
    delete_toggle = !delete_toggle;
});




submit_task.addEventListener("click",function(e){
    let task_no_num=randomtasknum();
    const ticket_state_task=document.querySelector("#priority-level-name");
    const ticket_status_task=ticket_state_task.value.trim().toLowerCase();
    const ticket_name_task=document.querySelector("#activity-name");
    const ticket_name=ticket_name_task.value;
    const ticket_description_task=document.querySelector("#activity-description-box");
    const ticket_description_name=ticket_description_task.value;

    const state_object={
        red:"new",
        blue:"wip",
        yellow:"pending",
        green:"closed"
    }
    const ticket_level_name= state_object[ticket_status_task] || "all";

    console.log(ticket_level_name);

    createtask(task_no_num,ticket_name,ticket_description_name,ticket_status_task, ticket_level_name);
    create_ticket.style.display="none";
    add_toggle = !add_toggle;
    ticket_description_task.value="";
    ticket_name_task.value = "";

});




function createtask(task_no,ticket_name,ticket_desc,priority_color,task_level){
    const ticket_content=document.createElement('div');
    ticket_content.setAttribute("class","ticket-boxs-header");
    ticket_content.classList.add(task_level);
    ticket_content.setAttribute("draggable", "true");
    const shadow_color= priority_color+"_shadow";
    ticket_content.innerHTML=`<div class="ticket-head ${shadow_color}">
                                <div class="ticket-name ">
                                    <label for="ticket-name">${ticket_name}</label>
                                </div>
                                <div class="ticket-number" data-task-no="${task_no}">
                                    <label for="ticket-number" class="${priority_color}">${task_no}</label>
                                </div>
                                <i class="fa-solid fa-delete-left" style="height:30%"></i>
                            </div>
                            <div class="accordian-header">
                            <i class="fa-solid fa-angle-up accordian-dropdown"></i>
                            </div>
                            <div class="ticket-description ${priority_color}">
                                <div class="ticket-description-content">
                                    <div class="ticket-description-display">${ticket_desc}</div>
                                </div>
                                <button class="ticket-lock-btn">
                                    <i class="fa-solid fa-lock"></i>
                                </button>
                                </div>`
        
    ticket_container.appendChild(ticket_content);
    handledelete(ticket_content,task_no);
    handleLock(ticket_content,task_no);
    changethestateofticket();

    const ticketObj={
        id: task_no,
        name: ticket_name,
        description: ticket_desc,
        priority: priority_color,
        tasklevel: task_level
    };
    Alltickets_objects.push(ticketObj);
    updateLocalStorage();
}



function handledelete(ticket,task_no){
    const delete_task=ticket.querySelector(".fa-solid");
    delete_task.addEventListener("click",function(e){
        if(delete_toggle){
            ticket.remove();
            alert(`Ticket ${task_no} has been deleted.`);
            Alltickets_objects=Alltickets_objects.filter((obj) =>{
                return obj.id!== task_no;
            });
            updateLocalStorage();
        }
        else{
            alert("Please enable delete option to delete a ticket.");
        }
    });
}




function randomtasknum(){
    const day= gettingday().slice(0,3).toUpperCase();
    const key =`ticketcounter_${day}`;

    let count =parseInt(localStorage.getItem(key)) || 1;
    const num_pad =count.toString().padStart(3,'0');
    const task_num=day+ num_pad;
    localStorage.setItem(key,count+1);
    return task_num;
}



function gettingday(){
    const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const today=new Date();
    const current_day=days[today.getDay()];
    return current_day;
}


const accordian_dropdowns=document.querySelector(".ticket-list");
accordian_dropdowns.addEventListener("click",function(e){
    if(e.target.classList.contains("accordian-dropdown")){

        const dropdown_icon=e.target;
        const description=dropdown_icon.parentElement.nextElementSibling;

        if(description.style.display==="none"){
            description.style.display="block";
            dropdown_icon.classList.remove("fa-angle-down");
            dropdown_icon.classList.add("fa-angle-up");
        }
        else{
            description.style.display="none";
            dropdown_icon.classList.remove("fa-angle-up");
            dropdown_icon.classList.add("fa-angle-down");
        }
    }
})




const priority_color=document.querySelector("#priority-level-name");
priority_color.addEventListener("change",function(e){

    const color_map=e.target.value;
    const chosen_color=document.querySelectorAll(".chosen-color-priority .color");
    
    chosen_color.forEach((color)=>{
        color.classList.remove("red", "green", "blue", "yellow");
    });
    switch(color_map){
        case "red":
            chosen_color[0].classList.add("red");
            break;
        case "green":
            chosen_color[3].classList.add("green");
            break;  
        case "blue":
            chosen_color[1].classList.add("blue");
            break;
        case "yellow":
            chosen_color[2].classList.add("yellow");
            break;
    }
});





function handleLock(ticket,task_no){
    const lock_btn=ticket.querySelector(".ticket-lock-btn");
    const lock_btn_icon=lock_btn.children[0];

    const ticket_description_style=ticket.querySelector(".ticket-description");
    const lock_icon="fa-lock";
    const unlock_icon="fa-lock-open";

    lock_btn.addEventListener("click",function(){

        if(lock_btn_icon.classList.contains(lock_icon)){
            lock_btn_icon.classList.remove(lock_icon);
            lock_btn_icon.classList.add(unlock_icon);
            alert(`Ticket Number - ${task_no} is now unlocked. You can able to edit the description.`);
            ticket_description_style.setAttribute("contenteditable", "true");
            ticket_description_style.style.cssText="border: 2px solid #e5e7eb; border-radius:12px";
        }
        else{
            lock_btn_icon.classList.remove(unlock_icon);
            lock_btn_icon.classList.add(lock_icon);
            alert(`Ticket Number - ${task_no} is now locked. You cannot edit the description.`);
            ticket_description_style.setAttribute("contenteditable", "false");
            ticket_description_style.style.cssText="";
        }

        const ticket_area=ticket_description_style.querySelector(".ticket-description-display");

        const ticketObj=Alltickets_objects.find((obj)=>{
            return obj.id===task_no;
        });
        ticketObj.description=ticket_area.textContent;
        updateLocalStorage();

    });

}




function changethestateofticket(){

    const ticket_list_container=document.querySelectorAll(".ticket-boxs-header");

    ticket_list_container.forEach(ticket =>{

        ticket.addEventListener("dblclick",function(e){

            const target_buttons=e.key;
        
            const priority_color_level=document.querySelector("#priority").value;
            
            if(!priority_color_level || priority_color_level==="levels"){

                alert("Please select a valid color before clicking a task!!");  
            }
            const ticket_number_value=ticket.querySelector(".ticket-number");
            let taskNO="";
            if(ticket_number_value && ticket_number_value.dataset && ticket_number_value.dataset.taskNo){
                    taskNO=ticket_number_value.dataset.taskNo;
            }
            if(taskNO && priority_color_level!=="levels"){
                changestyle(taskNO, priority_color_level);
                changethestateofticket();
            }
        });
        
    });
}





function changestyle(ticket,priority){
    if(!ticket){
        return;
    }
    const ticket_head = document.querySelector(`[data-task-no="${ticket}"].ticket-number, [data-task-no="${ticket}"].ticket-head`);
    if (!ticket_head) return;
    const ticket_header_tag = ticket_head.closest(".ticket-boxs-header");
    if (!ticket_header_tag) return;

    const ticket_head_new = ticket_header_tag.querySelector(".ticket-head");
    const ticket_description_new = ticket_header_tag.querySelector(".ticket-description");
    const ticket_number_label_new = ticket_head.querySelector("label");
    const ticket_shadow_color=priority+"_shadow"
    
    if (ticket_head_new) ticket_head_new.className = `ticket-head ${ticket_shadow_color}`;
    if (ticket_description_new) ticket_description_new.className = `ticket-description ${priority}`;
    if (ticket_number_label_new) ticket_number_label_new.className = priority;

    const color_priority_level={
        red:"new",
        blue:"wip",
        yellow:"pending",
        green:"closed"
    }
    const state=color_priority_level[priority];
    const ticketclasses=ticket_header_tag.classList;

    const allstates=["new","wip","pending","closed"];
    allstates.forEach((e) =>{
        ticketclasses.remove(e);
    })
    if(state){
        ticketclasses.add(state);
    }

    const ticketObj= Alltickets_objects.find((obj)=>{
        return obj.id===ticket;
    });
    ticketObj.tasklevel=state;
    ticketObj.priority=priority;
    updateLocalStorage();

}





const priority_level_value=document.querySelector("#priority");

priority_level_value.addEventListener("change",function(e){
    const current_value=e.target.value;
        priority_level_value.className=current_value;
});




function updateLocalStorage(){
    localStorage.setItem("DailyActivites",JSON.stringify(Alltickets_objects));
}




const search_feild_input=document.querySelector(".search-field");
search_feild_input.addEventListener("keydown",function(e){
    console.log("key pressed entered");
    if(e.key==="Enter"){

        const target=e.target.value.toUpperCase();
        const allTickets=document.querySelectorAll(".ticket-boxs-header");
        
        let toggle=false;
        
        allTickets.forEach((event) =>{
            
            const Allticket_number=event.querySelector(".ticket-number");
            let taskNO="";
            if(Allticket_number && Allticket_number.dataset && Allticket_number.dataset.taskNo){
                taskNO=Allticket_number.dataset.taskNo.toUpperCase();
            }
            if (taskNO && taskNO === target) {
            event.classList.remove("hidden");
            event.classList.add("highlight-main-ticket");
            toggle = true;
            
            } 
            else{
                event.classList.add("hiddem");
                event.classList.remove("highlight-main-ticket");
            }
        });

        if(!toggle && target !==""){
            alert(`Ticket - ${target} not found. Kindly enter valid ticket number`);

            allTickets.forEach((events) =>{
                events.classList.remove("hidden");
                events.classList.remove("highlight-main-ticket");
            });
        }

    }
});





const ticket_caterogy=document.querySelector("#ticket-state");
ticket_caterogy.addEventListener("change",function(e){
    const caterogy_value=e.target.value;
    const allticket_lists=document.querySelectorAll(".ticket-boxs-header");
    allticket_lists.forEach((ticket_body)=>{
        if(caterogy_value==="all" || ticket_body.classList.contains(caterogy_value)){
            ticket_body.classList.remove("hidden");
        }
        else {
            ticket_body.classList.add("hidden");
        }
    })

});








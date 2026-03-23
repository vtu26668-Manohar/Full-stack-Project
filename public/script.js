const socket = io();

function placeOrder(){

let customer = document.getElementById("customer").value;
let product = document.getElementById("product").value;

// Prevent empty input
if(!customer || !product){
    alert("Please fill all fields");
    return;
}

// Send order
socket.emit("placeOrder",{customer,product});

// Clear inputs
document.getElementById("customer").value="";
document.getElementById("product").value="";
}

socket.on("orders",(orders)=>{

let container=document.getElementById("orders");
if(!container) return;

container.innerHTML="";

orders.forEach(order=>{

let div=document.createElement("div");
div.className="order-card";

// Status color
let statusColor="black";
if(order.status==="Processing") statusColor="orange";
if(order.status==="Shipped") statusColor="blue";
if(order.status==="Delivered") statusColor="green";

// Status icon
let statusIcon="🛒";
if(order.status==="Processing") statusIcon="⚙️";
if(order.status==="Shipped") statusIcon="🚚";
if(order.status==="Delivered") statusIcon="✅";

// Order details
div.innerHTML=`
<div class="order-title">📦 Order #${order.id}</div>
Customer: ${order.customer}<br>
Product: ${order.product}<br>
<div class="status-text" style="color:${statusColor}">
${statusIcon} ${order.status}
</div>
`;

// 🔥 Progress Bar
let progressContainer = document.createElement("div");
progressContainer.className = "progress-container";

let progressBar = document.createElement("div");
progressBar.className = "progress-bar";

let progress = 25;
if(order.status==="Processing") progress = 50;
if(order.status==="Shipped") progress = 75;
if(order.status==="Delivered") progress = 100;

progressBar.style.width = progress + "%";

progressContainer.appendChild(progressBar);
div.appendChild(progressContainer);

// Timeline
let timeline=document.createElement("div");
timeline.className="timeline";

let steps=["Order Placed","Processing","Shipped","Delivered"];

steps.forEach(step=>{

let s=document.createElement("div");
s.className="step";

let circle=document.createElement("div");
circle.className="circle";

let icon=document.createElement("span");

if(step==="Order Placed") icon.innerHTML="🛒";
if(step==="Processing") icon.innerHTML="⚙️";
if(step==="Shipped") icon.innerHTML="🚚";
if(step==="Delivered") icon.innerHTML="✅";

circle.appendChild(icon);

if(steps.indexOf(step)<=steps.indexOf(order.status))
circle.classList.add("active");

let label=document.createElement("div");
label.className="label";
label.innerText=step;

s.appendChild(circle);
s.appendChild(label);

timeline.appendChild(s);

});

div.appendChild(timeline);

// Admin buttons
if(window.location.pathname.includes("admin")){

let btn1=document.createElement("button");
btn1.innerText="Processing";
btn1.onclick=()=>socket.emit("updateStatus",{id:order.id,status:"Processing"});

let btn2=document.createElement("button");
btn2.innerText="Shipped";
btn2.onclick=()=>socket.emit("updateStatus",{id:order.id,status:"Shipped"});

let btn3=document.createElement("button");
btn3.innerText="Delivered";
btn3.onclick=()=>socket.emit("updateStatus",{id:order.id,status:"Delivered"});

div.appendChild(document.createElement("br"));
div.appendChild(btn1);
div.appendChild(btn2);
div.appendChild(btn3);
}

container.appendChild(div);

});
});
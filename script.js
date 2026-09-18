const STORAGE_KEY = "vyro_products";
const fallbackProducts = [
  {id:1,name:"Black Logo Tee",category:"basic",price:450,stock:10,image:"",active:true},
  {id:2,name:"Oversize Street",category:"oversize",price:550,stock:10,image:"",active:true},
  {id:3,name:"Minimal White",category:"basic",price:450,stock:10,image:"",active:true},
  {id:4,name:"Urban Oversize",category:"oversize",price:550,stock:10,image:"",active:true},
  {id:5,name:"Classic Black",category:"basic",price:425,stock:10,image:"",active:true},
  {id:6,name:"Graphic Oversize",category:"oversize",price:575,stock:10,image:"",active:true}
];
const products = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || fallbackProducts;
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let currentFilter = "all";

function renderProducts(){
  const grid=document.getElementById("productGrid");
  const list=products.filter(p=>p.active!==false&&(currentFilter==="all"||p.category===currentFilter));
  grid.innerHTML=list.map(p=>`<article class="product"><div class="product-img">${p.image?`<img src="${p.image}" alt="${p.name}">`:`<div class="placeholder">YOUR<br>BRAND</div>`}</div><div class="product-info"><h3>${p.name}</h3><p class="muted">${p.category}</p><div class="price">${p.price} ج.م</div><button class="add" onclick="addToCart(${p.id})">أضف للسلة</button></div></article>`).join("");
}
function addToCart(id){const p=products.find(x=>x.id===id);if(!p||p.stock<=0)return;const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();renderCart();toggleCart();}
function saveCart(){localStorage.setItem("cart",JSON.stringify(cart))}
function renderCart(){const box=document.getElementById("cartItems");let total=0,count=0;if(!cart.length)box.innerHTML="<p class='muted'>السلة فاضية حاليًا.</p>";else box.innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id);if(!p)return"";total+=p.price*item.qty;count+=item.qty;return `<div class="cart-row"><div class="mini">VYRO</div><div><b>${p.name}</b><div class="muted">${p.price} ج.م</div></div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button>${item.qty}<button onclick="changeQty(${p.id},1)">+</button></div></div>`}).join("");document.getElementById("cartTotal").textContent=`${total} ج.م`;document.getElementById("cartCount").textContent=count}
function changeQty(id,d){const x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);saveCart();renderCart()}
function toggleCart(force){const c=document.getElementById("cart"),o=document.getElementById("overlay");const open=force===true?true:!c.classList.contains("open");c.classList.toggle("open",open);o.classList.toggle("show",open)}
function checkout(){if(!cart.length)return alert("أضف منتجًا للسلة أولًا.");document.getElementById("orderMessage").textContent="";document.getElementById("orderModal").classList.add("open");document.getElementById("orderModal").setAttribute("aria-hidden","false")}
function closeOrderForm(){const modal=document.getElementById("orderModal");modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}
function submitOrder(event){event.preventDefault();if(!cart.length)return;const name=document.getElementById("customerName").value.trim();const phone=document.getElementById("customerPhone").value.trim();const address=document.getElementById("customerAddress").value.trim();const items=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `${p.name} x${item.qty}`;}).join("، ");const total=cart.reduce((sum,item)=>{const p=products.find(x=>x.id===item.id);return sum + p.price * item.qty;},0);const text=`طلب جديد%0Aالاسم: ${name}%0Aالهاتف: ${phone}%0Aالعنوان: ${address}%0Aالمنتجات: ${items}%0Aالإجمالي: ${total} ج.م`;window.open(`https://wa.me/201001648519?text=${text}`,"_blank");cart=[];saveCart();renderCart();closeOrderForm();toggleCart(false);}
document.getElementById("orderForm").addEventListener("submit",submitOrder);document.querySelectorAll(".filter").forEach(btn=>btn.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");currentFilter=btn.dataset.filter;renderProducts()});renderProducts();renderCart();

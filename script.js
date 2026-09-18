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
  grid.innerHTML=list.map(p=>`<article class="product"><div class="product-img">${p.image?`<img src="${p.image}" alt="${p.name}">`:`<div class="placeholder">VYRO</div>`}</div><div class="product-info"><h3>${p.name}</h3><div class="muted">${p.category==="oversize"?"Oversize":"Basic"} · ${p.stock>0?"متوفر":"غير متوفر"}</div><div class="price">${p.price} ج.م</div><button class="add" ${p.stock<=0?"disabled":""} onclick="addToCart(${p.id})">أضف للسلة</button></div></article>`).join("");
}
function addToCart(id){const p=products.find(x=>x.id===id);if(!p||p.stock<=0)return;const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();renderCart();toggleCart(true)}
function saveCart(){localStorage.setItem("cart",JSON.stringify(cart))}
function renderCart(){const box=document.getElementById("cartItems");let total=0,count=0;if(!cart.length)box.innerHTML="<p class='muted'>السلة فاضية حاليًا.</p>";else box.innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id);if(!p)return"";total+=p.price*item.qty;count+=item.qty;return `<div class="cart-row"><div class="mini">👕</div><div><b>${p.name}</b><div>${p.price} ج.م × ${item.qty}</div></div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${item.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div></div>`}).join("");document.getElementById("cartTotal").textContent=total+" ج.م";document.getElementById("cartCount").textContent=count}
function changeQty(id,d){const x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);saveCart();renderCart()}
function toggleCart(force){const c=document.getElementById("cart"),o=document.getElementById("overlay");const open=force===true?true:!c.classList.contains("open");c.classList.toggle("open",open);o.classList.toggle("show",open)}
function checkout(){if(!cart.length)return alert("أضف منتجًا للسلة أولًا.");document.getElementById("orderMessage").textContent="";document.getElementById("orderModal").classList.add("open");document.getElementById("orderModal").setAttribute("aria-hidden","false");document.getElementById("customerName").focus()}
function closeOrderForm(){const modal=document.getElementById("orderModal");modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}
function submitOrder(event){event.preventDefault();if(!cart.length)return;const name=document.getElementById("customerName").value.trim();const phone=document.getElementById("customerPhone").value.trim();const address=document.getElementById("customerAddress").value.trim();if(!name||!phone||!address)return;const receiver="201001648519";const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `- ${p.name} × ${i.qty} = ${p.price*i.qty} ج.م`});const total=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);const msg=`مرحبًا، أريد تأكيد طلب:%0Aالاسم: ${encodeURIComponent(name)}%0Aرقم الهاتف: ${encodeURIComponent(phone)}%0Aالعنوان: ${encodeURIComponent(address)}%0A%0Aالمنتجات:%0A${encodeURIComponent(lines.join("\n"))}%0Aالإجمالي: ${total} ج.م`;window.open(`https://wa.me/${receiver}?text=${msg}`,"_blank");closeOrderForm()}
document.getElementById("orderForm").addEventListener("submit",submitOrder);
document.querySelectorAll(".filter").forEach(btn=>btn.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");currentFilter=btn.dataset.filter;renderProducts()});
renderProducts();renderCart();

// =============================
// تعديل المنتجات من هنا بسهولة
// =============================
const products = [
  {id:1,name:"Black Logo Tee",category:"basic",price:450,image:""},
  {id:2,name:"Oversize Street",category:"oversize",price:550,image:""},
  {id:3,name:"Minimal White",category:"basic",price:450,image:""},
  {id:4,name:"Urban Oversize",category:"oversize",price:550,image:""},
  {id:5,name:"Classic Black",category:"basic",price:425,image:""},
  {id:6,name:"Graphic Oversize",category:"oversize",price:575,image:""}
];

let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let currentFilter = "all";

function renderProducts(){
  const grid=document.getElementById("productGrid");
  const list=products.filter(p=>currentFilter==="all"||p.category===currentFilter);
  grid.innerHTML=list.map(p=>`
    <article class="product">
      <div class="product-img">
        ${p.image ? `<img src="${p.image}" alt="${p.name}">` : `<div class="placeholder">YOUR<br>BRAND</div>`}
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="muted">${p.category==="oversize"?"Oversize":"Basic"} · متوفر</div>
        <div class="price">${p.price} ج.م</div>
        <button class="add" onclick="addToCart(${p.id})">أضف للسلة</button>
      </div>
    </article>`).join("");
}

function addToCart(id){
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++;
  else cart.push({id,qty:1});
  saveCart(); renderCart(); toggleCart(true);
}
function saveCart(){localStorage.setItem("cart",JSON.stringify(cart));}
function renderCart(){
  const box=document.getElementById("cartItems");
  let total=0,count=0;
  if(!cart.length) box.innerHTML="<p class='muted'>السلة فاضية حاليًا.</p>";
  else box.innerHTML=cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    total+=p.price*item.qty; count+=item.qty;
    return `<div class="cart-row"><div class="mini">👕</div><div><b>${p.name}</b><div>${p.price} ج.م × ${item.qty}</div></div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button> <button onclick="changeQty(${p.id},1)">+</button></div></div>`;
  }).join("");
  document.getElementById("cartTotal").textContent=total+" ج.م";
  document.getElementById("cartCount").textContent=count;
}
function changeQty(id,d){
  const x=cart.find(i=>i.id===id); if(!x)return;
  x.qty+=d; if(x.qty<=0)cart=cart.filter(i=>i.id!==id);
  saveCart();renderCart();
}
function toggleCart(force){
  const c=document.getElementById("cart"),o=document.getElementById("overlay");
  const open=force===true ? true : !c.classList.contains("open");
  c.classList.toggle("open",open);o.classList.toggle("show",open);
}
function checkout(){
  if(!cart.length)return alert("أضف منتجًا للسلة أولًا.");
  const phone="201001648519"; // 
  const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `- ${p.name} × ${i.qty} = ${p.price*i.qty} ج.م`});
  const total=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
  const msg=`مرحبًا، أريد طلب:%0A${encodeURIComponent(lines.join("\n"))}%0Aالإجمالي: ${total} ج.م`;
  window.open(`https://wa.me/${phone}?text=${msg}`,"_blank");
}
document.querySelectorAll(".filter").forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");currentFilter=btn.dataset.filter;renderProducts();
});
renderProducts();renderCart();

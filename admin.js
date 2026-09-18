const STORAGE_KEY = "vyro_products";
// كلمة المرور لا يتم وضعها كنص صريح. هذه قيمة SHA-256 لكلمة المرور التي اخترتها.
const PASSWORD_HASH = "c4a0f0c96d8f4937c2db7db2f4f18dce3cfc37d03b7ce91c5d45fc9f8a8e24d1";
const SESSION_KEY = "vyro_admin_session";
const defaults = [
  {id:1,name:"Black Logo Tee",category:"basic",price:450,stock:10,image:"",description:"",active:true},
  {id:2,name:"Oversize Street",category:"oversize",price:550,stock:10,image:"",description:"",active:true},
  {id:3,name:"Minimal White",category:"basic",price:450,stock:10,image:"",description:"",active:true},
  {id:4,name:"Urban Oversize",category:"oversize",price:550,stock:10,image:"",description:"",active:true},
  {id:5,name:"Classic Black",category:"basic",price:425,stock:10,image:"",description:"",active:true},
  {id:6,name:"Graphic Oversize",category:"oversize",price:575,stock:10,image:"",description:"",active:true}
];
let products = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || defaults;
let editingId = null;
const $ = id => document.getElementById(id);
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
const money = value => `${Number(value).toLocaleString("ar-EG")} ج.م`;
const escapeHtml = value => String(value).replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
async function hash(value){const bytes=new TextEncoder().encode(value);const buffer=await crypto.subtle.digest("SHA-256",bytes);return [...new Uint8Array(buffer)].map(b=>b.toString(16).padStart(2,"0")).join("")}
function showApp(){ $("loginScreen").classList.add("hidden"); $("adminApp").classList.remove("hidden"); render(); }
$("loginForm").onsubmit=async event=>{event.preventDefault();const message=$("loginMessage");if(await hash($("passwordInput").value)===PASSWORD_HASH){sessionStorage.setItem(SESSION_KEY,"1");showApp()}else{message.textContent="كلمة المرور غير صحيحة";message.classList.add("error");$("passwordInput").select()}};
$("logoutBtn").onclick=()=>{sessionStorage.removeItem(SESSION_KEY);location.reload()};
function render(){const query=$("search").value.trim().toLowerCase();const visible=products.filter(p=>p.name.toLowerCase().includes(query));$("productsTable").innerHTML=visible.map(p=>`<tr><td><div class="product-cell">${p.image?`<img src="${escapeHtml(p.image)}" alt="">`:`<span class="thumb">V</span>`}<b>${escapeHtml(p.name)}</b></div></td><td>${p.category==="oversize"?"Oversize":"Basic"}</td><td>${money(p.price)}</td><td>${p.stock}</td><td><span class="status ${p.active?"on":"off"}">${p.active?"ظاهر":"مخفي"}</span></td><td class="actions"><button onclick="editProduct(${p.id})">تعديل</button><button class="danger" onclick="deleteProduct(${p.id})">حذف</button></td></tr>`).join("");$("empty").classList.toggle("hidden",visible.length!==0);$("totalProducts").textContent=products.length;$("activeProducts").textContent=products.filter(p=>p.active).length;$("totalStock").textContent=products.reduce((sum,p)=>sum+Number(p.stock||0),0)}
function editProduct(id){const p=products.find(item=>item.id===id);if(!p)return;editingId=id;["name","category","price","stock","image","description"].forEach(k=>$(k).value=p[k]??"");$("active").checked=p.active;$("formTitle").textContent="تعديل المنتج";$("cancelEdit").classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"})}
function resetForm(){$("productForm").reset();editingId=null;$('active').checked=true;$('stock').value=0;$('formTitle').textContent="إضافة منتج جديد";$('cancelEdit').classList.add("hidden")}
window.editProduct=editProduct;window.deleteProduct=id=>{const p=products.find(item=>item.id===id);if(p&&confirm(`حذف ${p.name}؟`)){products=products.filter(item=>item.id!==id);save();render()}};
$("productForm").onsubmit=event=>{event.preventDefault();const item={id:editingId||Date.now(),name:$("name").value.trim(),category:$("category").value,price:Number($("price").value),stock:Number($("stock").value),image:$("image").value.trim(),description:$("description").value.trim(),active:$("active").checked};if(editingId)products=products.map(p=>p.id===editingId?item:p);else products.unshift(item);save();render();resetForm();$("formMessage").textContent="تم حفظ المنتج بنجاح";setTimeout(()=>$("formMessage").textContent="",2500)};
$("cancelEdit").onclick=resetForm;$("search").oninput=render;if(sessionStorage.getItem(SESSION_KEY)==="1")showApp();

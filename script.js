const STORAGE_KEY = "vyro_products";
const ADMIN_PASSWORD = "vyro246875319010vyro";
const SESSION_KEY = "vyro_admin_session";
const ORDERS_STORAGE_KEY = "vyro_orders";
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
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

const isSupabaseReady = typeof window !== "undefined" && window.supabase &&
  SUPABASE_URL && !SUPABASE_URL.includes("YOUR_PROJECT_ID") &&
  SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes("YOUR_");

const supabase = isSupabaseReady ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

function showApp() {
  $("loginScreen").classList.add("hidden");
  $("adminApp").classList.remove("hidden");
  render();
  loadOrders();
}

$("loginForm").onsubmit = event => {
  event.preventDefault();
  const message = $("loginMessage");
  const entered = $("passwordInput").value;

  if (entered === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "1");
    message.textContent = "";
    message.classList.remove("error");
    showApp();
  } else {
    message.textContent = "كلمة المرور غير صحيحة";
    message.classList.add("error");
    $("passwordInput").select();
  }
};

$("logoutBtn").onclick = () => {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
};

function render() {
  const query = $("search").value.trim().toLowerCase();
  const visible = products.filter(p => p.name.toLowerCase().includes(query));

  $("productsTable").innerHTML = visible.map(p => `
    <tr>
      <td>
        <div class="product-cell">
          ${p.image ? `<img src="${escapeHtml(p.image)}" alt="">` : `<span class="thumb">V</span>`}
          <b>${escapeHtml(p.name)}</b>
        </div>
      </td>
      <td>${p.category === "oversize" ? "Oversize" : "Basic"}</td>
      <td>${money(p.price)}</td>
      <td>${p.stock}</td>
      <td><span class="status ${p.active ? "on" : "off"}">${p.active ? "ظاهر" : "مخفي"}</span></td>
      <td class="actions">
        <button onclick="editProduct(${p.id})">تعديل</button>
        <button class="danger" onclick="deleteProduct(${p.id})">حذف</button>
      </td>
    </tr>
  `).join("");

  $("empty").classList.toggle("hidden", visible.length !== 0);
  $("totalProducts").textContent = products.length;
  $("activeProducts").textContent = products.filter(p => p.active).length;
  $("totalStock").textContent = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
}

function editProduct(id) {
  const p = products.find(item => item.id === id);
  if (!p) return;

  editingId = id;
  ["name", "category", "price", "stock", "image", "description"].forEach(k => $(k).value = p[k] ?? "");
  $("active").checked = p.active;
  $("formTitle").textContent = "تعديل المنتج";
  $("cancelEdit").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  $("productForm").reset();
  editingId = null;
  $("active").checked = true;
  $("stock").value = 0;
  $("formTitle").textContent = "إضافة منتج جديد";
  $("cancelEdit").classList.add("hidden");
}

window.editProduct = editProduct;
window.deleteProduct = id => {
  const p = products.find(item => item.id === id);
  if (p && confirm(`حذف ${p.name}؟`)) {
    products = products.filter(item => item.id !== id);
    save();
    render();
  }
};

$("productForm").onsubmit = event => {
  event.preventDefault();

  const item = {
    id: editingId || Date.now(),
    name: $("name").value.trim(),
    category: $("category").value,
    price: Number($("price").value),
    stock: Number($("stock").value),
    image: $("image").value.trim(),
    description: $("description").value.trim(),
    active: $("active").checked
  };

  if (editingId) {
    products = products.map(p => p.id === editingId ? item : p);
  } else {
    products.unshift(item);
  }

  save();
  render();
  resetForm();
  $("formMessage").textContent = "تم حفظ المنتج بنجاح";
  setTimeout(() => $("formMessage").textContent = "", 2500);
};

async function getOrdersFromStorage() {
  return JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || "[]");
}

function saveOrdersToStorage(orders) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

function normalizeItems(items) {
  if (!items) return [];
  if (typeof items === "string") {
    try { return JSON.parse(items); } catch (error) { return []; }
  }
  return Array.isArray(items) ? items : [];
}

function getStatusLabel(status) {
  return {
    new: "جديد",
    preparing: "قيد التجهيز",
    shipped: "تم الشحن",
    completed: "مكتمل"
  }[status] || "جديد";
}

function renderOrders(orders = []) {
  $("ordersTable").innerHTML = orders.map(order => {
    const items = normalizeItems(order.items).map(item => `${item.name} x${item.qty}`).join("<br>");
    const safeStatus = order.status || "new";
    const createdAt = order.created_at ? new Date(order.created_at).toLocaleString("ar-EG") : "-";

    return `
      <tr>
        <td>${escapeHtml(order.customer_name || "-")}</td>
        <td>${escapeHtml(order.customer_phone || "-")}</td>
        <td>${escapeHtml(order.customer_address || "-")}</td>
        <td>${items || "-"}</td>
        <td>${money(order.total || 0)}</td>
        <td>
          <select onchange="updateOrderStatus('${order.id}', this.value)">
            <option value="new" ${safeStatus === "new" ? "selected" : ""}>جديد</option>
            <option value="preparing" ${safeStatus === "preparing" ? "selected" : ""}>قيد التجهيز</option>
            <option value="shipped" ${safeStatus === "shipped" ? "selected" : ""}>تم الشحن</option>
            <option value="completed" ${safeStatus === "completed" ? "selected" : ""}>مكتمل</option>
          </select>
        </td>
        <td>${createdAt}</td>
      </tr>
    `;
  }).join("");

  $("emptyOrders").classList.toggle("hidden", orders.length !== 0);
}

async function loadOrders() {
  if (supabase) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      saveOrdersToStorage(data);
      renderOrders(data);
      return data;
    }
  }

  const localOrders = await getOrdersFromStorage();
  renderOrders(localOrders);
  return localOrders;
}

async function updateOrderStatus(orderId, status) {
  const currentOrders = await getOrdersFromStorage();

  if (supabase) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (!error) {
      const nextOrders = (await loadOrders()) || [];
      return nextOrders;
    }
  }

  const nextOrders = currentOrders.map(order => order.id === orderId ? { ...order, status } : order);
  saveOrdersToStorage(nextOrders);
  renderOrders(nextOrders);
  return nextOrders;
}

window.updateOrderStatus = updateOrderStatus;
window.loadOrders = loadOrders;

$("cancelEdit").onclick = resetForm;
$("search").oninput = render;

if (sessionStorage.getItem(SESSION_KEY) === "1") {
  showApp();
}

if (window.location.pathname.includes("admin.html") && !sessionStorage.getItem(SESSION_KEY)) {
  $("loginScreen").classList.remove("hidden");
}

<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VYRO | لوحة التحكم</title>
  <link rel="stylesheet" href="admin.css" />
</head>
<body>
  <div id="loginScreen" class="auth-screen">
    <div class="auth-card">
      <p class="eyebrow">VYRO CONTROL</p>
      <h1>تسجيل الدخول</h1>
      <form id="loginForm">
        <label>كلمة المرور
          <input id="passwordInput" type="password" placeholder="أدخل كلمة المرور" required />
        </label>
        <button type="submit" class="primary">دخول</button>
        <p id="loginMessage" class="message" aria-live="polite"></p>
      </form>
    </div>
  </div>

  <main id="adminApp" class="admin-shell hidden">
    <header class="admin-header">
      <div>
        <span class="eyebrow">VYRO CONTROL</span>
        <h1>إدارة المنتجات</h1>
      </div>
      <div class="header-actions">
        <a class="store-link" href="index.html">عرض المتجر</a>
        <button id="logoutBtn" class="secondary" type="button">تسجيل الخروج</button>
      </div>
    </header>

    <section class="stats">
      <article>
        <span>إجمالي المنتجات</span>
        <strong id="totalProducts">0</strong>
      </article>
      <article>
        <span>منتجات ظاهرة</span>
        <strong id="activeProducts">0</strong>
      </article>
      <article>
        <span>إجمالي المخزون</span>
        <strong id="totalStock">0</strong>
      </article>
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2 id="formTitle">إضافة منتج جديد</h2>
        <button id="cancelEdit" class="secondary hidden" type="button">إلغاء التعديل</button>
      </div>

      <form id="productForm">
        <input type="hidden" id="productId" />
        <div class="form-grid">
          <label>اسم المنتج
            <input id="name" required maxlength="80" placeholder="مثال: Black Logo Tee" />
          </label>

          <label>التصنيف
            <select id="category">
              <option value="basic">Basic</option>
              <option value="oversize">Oversize</option>
            </select>
          </label>

          <label>السعر (ج.م)
            <input id="price" required min="0" type="number" />
          </label>

          <label>المخزون
            <input id="stock" required min="0" type="number" value="0" />
          </label>

          <label class="wide">رابط الصورة
            <input id="image" type="url" placeholder="https://..." />
          </label>

          <label class="wide">الوصف
            <textarea id="description" rows="2" placeholder="وصف مختصر للمنتج"></textarea>
          </label>
        </div>

        <label class="check">
          <input id="active" type="checkbox" checked />
          <span>إظهار المنتج في المتجر</span>
        </label>

        <button class="primary" type="submit">حفظ المنتج</button>
        <p id="formMessage" class="message" aria-live="polite"></p>
      </form>
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2>المنتجات</h2>
        <input id="search" class="search" placeholder="ابحث عن منتج..." />
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>المنتج</th>
              <th>التصنيف</th>
              <th>السعر</th>
              <th>المخزون</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody id="productsTable"></tbody>
        </table>
      </div>

      <p id="empty" class="empty hidden">لا توجد منتجات مطابقة.</p>
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2>الطلبات</h2>
        <button class="secondary" type="button" onclick="loadOrders()">تحديث</button>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>العميل</th>
              <th>الهاتف</th>
              <th>العنوان</th>
              <th>المنتجات</th>
              <th>الإجمالي</th>
              <th>الحالة</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody id="ordersTable"></tbody>
        </table>
      </div>

      <p id="emptyOrders" class="empty hidden">لا توجد طلبات حتى الآن.</p>
    </section>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="admin.js"></script>
</body>
</html>

<p align="center">
  <img src="./public/logo.png" width="128" />
</p>

<h1 align="center">المستودع التقني</h1>

<p align="center">
  مدونة تقنية تهتم بشرح المفاهيم التقنية بشكل مبسط و باللغة العربية
</p>

---

## المميزات

- **مقالات عن البرمجيات مفتوحة المصدر** والنظم التي تبنى عليها: أنظمة التشغيل،
  أدوات المطوّرين، والبرمجة عمومًا.
- **نموذج نشر مزدوج:** مقالات رئيسية موسّعة + مقالات قصيرة مركزة مرتبطة بها.
## التقنيات

- [Astro](https://astro.build) 
- [Content Collections](https://docs.astro.build/en/guides/content-collections/) 
-  TypeScript

## التشغيل محليًا

```sh
npm install        # تثبيت الاعتماديات
npm run dev        # تشغيل خادم التطوير على http://localhost:4321
npm run build      # بناء الموقع إلى مجلد dist
npm run preview    # التأكد من النتيجة
npm run astro check  # فحص الكود
```

## بنية المشروع

```text
src/
├── content/
│   └── posts/          # المقالات (Markdown) — المصدر الوحيد للمحتوى
│       ├── main/       # مقالات رئيسية
│       └── small/      # مقالات قصيرة
├── pages/              # الصفحات والطرق (routes)
├── components/         # مكوّنات الواجهة
├── layouts/            # القوالب
└── utils/              # أدوات مساعدة
```

## كتابة مقال جديد

المقالات هي المصدر الوحيد للمحتوى؛ أضف ملف Markdown واحدًا فقط وستظهر صفحته
راجع [دليل المساهمة](./CONTRIBUTING.md) للتفاصيل.

## الرخص

رخصة [MIT](LICENSE)

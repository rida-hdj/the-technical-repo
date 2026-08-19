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
.
├── public/                  # الأصول الثابتة (الشعار logo.png، صور المقالات)
├── src/
│   ├── content/
│   │   └── posts/           # المقالات (Markdown) — المصدر الوحيد للمحتوى
│   │       ├── main/        # مقالات رئيسية
│   │       └── small/       # مقالات قصيرة
│   ├── pages/               # الصفحات والطرق (routes)
│   │   ├── posts/[slug].astro   # صفحة المقال
│   │   └── tags/[tag].astro     # صفحات الوسوم (توليد تلقائي)
│   ├── components/          # مكوّنات الواجهة (البطاقات، الهيدر، الفوتر)
│   ├── layouts/             # القوالب (BaseLayout, PostLayout)
│   ├── utils/               # أدوات مساعدة (روابط، بحث، وسوم)
│   └── styles/              # أنماط CSS العامة
├── .github/workflows/       # النشر التلقائي إلى GitHub Pages
├── astro.config.mjs         # إعدادات Astro (site + base)
└── package.json
```

## النشر

يُبنى الموقع ويُنشر تلقائيًا عبر GitHub Actions إلى GitHub Pages على:

```text
https://rida-hdj.github.io/the-technical-repo/
```

يُضبط ذلك في `astro.config.mjs` عبر `site` و `base`، وتحصل كل الروابط الداخلية
والأصول على البادئة الصحيحة تلقائيًا عبر `import.meta.env.BASE_URL` دون أي
تعديل يدوي عند تغيير الدومين لاحقًا.

## الرخص

رخصة [MIT](LICENSE)

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
- **تنقل متسلسل:** المقالات القصيرة مرتبطة ببعضها بتنقل سابق/تالي.

## التقنيات

- [Astro](https://astro.build)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- TypeScript

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
│   │       └── small/       # مقالات قصيرة (مجلد لكل مقال رئيسي)
│   │           └── {slug}/  # مجلد يحمل slug المقال الرئيسي
│   │               ├── 1.md # مقال قصير برقم ترتيب
│   │               └── 2.md
│   ├── pages/               # الصفحات والطرق (routes)
│   │   └── posts/[...slug].astro  # صفحة المقال (تدعم مسارات متداخلة)
│   ├── components/          # مكوّنات الواجهة (البطاقات، الهيدر، الفوتر)
│   ├── layouts/             # القوالب (BaseLayout, PostLayout)
│   ├── utils/               # أدوات مساعدة (روابط، بحث، وسوم، علاقات المقالات)
│   │   └── articles.ts      # منطق تحميل المقالات والعلاقات والتحقق
│   ├── styles/              # أنماط CSS العامة
│   └── content.config.ts    # مخطط مجموعات المحتوى (Zod discriminated union)
├── .github/workflows/       # النشر التلقائي إلى GitHub Pages
├── astro.config.mjs         # إعدادات Astro (site + base)
└── package.json
```

## النشر

يُبنى الموقع ويُنشر تلقائيًا عبر GitHub Actions إلى GitHub Pages على:

```text
https://rida-hdj.github.io/the-technical-repo/
```

## المساهمة
يمكن المساهمة من خلال [دليل المساهمة](/CONTRIBUTING.md)

## الرخص

رخصة [MIT](LICENSE)

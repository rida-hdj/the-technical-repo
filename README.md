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

## هيكل المحتوى

### المقالات الرئيسية

ملف واحد في `src/content/posts/main/`:

```text
src/content/posts/main/how-a-computer-work.md
```

البيانات الأساسية:

```yaml
title: "كيف يعمل الحاسوب"
type: "main"
small: "how-a-computer-work"  # يشير إلى مجلد المقالات القصيرة
```

### المقالات القصيرة

مجلد في `src/content/posts/small/` يحمل نفس slug المقال الرئيسي،
ويحتوي ملفات رقمية مرتبة بحقل `order`:

```text
src/content/posts/small/how-a-computer-work/
├── 1.md    # order: 1
├── 2.md    # order: 2
└── 3.md    # order: 3
```

البيانات الأساسية:

```yaml
title: "ما هو المعالج؟"
type: "small"
order: 1
```

### العلاقة بين المقالات

- المقال الرئيسي يشير إلى مجلد المقالات القصيرة عبر حقل `small`.
- العلاقة تُستنتج من بنية المجلدات (لا حاجة لحقل `parent`).
- المقالات القصيرة مرتبة بحقل `order` وليست بأسماء الملفات.
- المقال الرئيسي يربط بأول مقال قصير، والمقالات القصيرة لها تنقل سابق/تالي.

## النشر

يُبنى الموقع ويُنشر تلقائيًا عبر GitHub Actions إلى GitHub Pages على:

```text
https://rida-hdj.github.io/the-technical-repo/
```

## الرخص

رخصة [MIT](LICENSE)

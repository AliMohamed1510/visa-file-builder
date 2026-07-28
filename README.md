# Visa File Builder

## 🏛️ منصة احترافية لتجهيز ملفات التأشيرات

Visa File Builder هي منصة SaaS متكاملة مخصصة لمكاتب وشركات السياحة لتجهيز ملفات التأشيرات بشكل احترافي ومنظم.

---

## 🎯 المميزات الرئيسية

- ✅ دعم جميع دول الشنغن مع نماذج مخصصة لكل دولة
- ✅ استخراج بيانات تلقائي من المستندات (OCR)
- ✅ إنشاء ملف PDF نهائي جاهز للطباعة
- ✅ لوحة تحكم شاملة ومتكاملة
- ✅ نظام صلاحيات متعدد المستويات
- ✅ تصميم احترافي متجاوب مع الوضع الليلي
- ✅ قابل للنشر عبر Docker

---

## 🏗️ البنية التقنية

| الطبقة | التقنية |
|--------|---------|
| الواجهة الأمامية | Next.js 14 + TypeScript + Tailwind CSS |
| الواجهة الخلفية | NestJS + TypeScript |
| قاعدة البيانات | PostgreSQL |
| ORM | Prisma |
| المصادقة | JWT |
| OCR | Tesseract.js / Google Vision API |
| PDF | PDFKit / Puppeteer |
| التخزين | Local / S3 |

---

## 🚀 التشغيل السريع

### المتطلبات
- Docker & Docker Compose
- Node.js 20+
- PostgreSQL 15+

### التشغيل

```bash
# Clone the repository
git clone https://github.com/your-org/visa-file-builder.git
cd visa-file-builder

# Start all services
docker-compose up -d

# Or run individually
cd backend && npm install && npm run start:dev
cd frontend && npm install && npm run dev
```

---

## 📁 هيكل المشروع

```
visa-file-builder/
├── frontend/          # Next.js Application
├── backend/           # NestJS API
├── docker/            # Docker configurations
├── docs/              # Documentation
└── README.md
```

---

## 📄 الترخيص

MIT License - جميع الحقوق محفوظة

---

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى قراءة [CONTRIBUTING.md](docs/CONTRIBUTING.md) أولاً.

Proje Yönetim Mikroservisi (Project Service)
Bu mikroservis, bir mikroservis mimarisinin parçası olarak geliştirilmiş "Proje Servisi"dir. Temel amacı projelerin (Projects) ve bu projelere ait üyelerin (ProjectMembers) oluşturulmasını, yönetilmesini ve listelenmesini sağlamaktır.

Servis, kimlik doğrulama (Authentication), yetkilendirme (Authorization), girdi doğrulama (Validation) ve ölçeklenebilirlik (Pagination) gibi modern API geliştirme pratiklerini içermektedir.

🚀 Teknoloji Yığını
Node.js: Çalışma ortamı (Runtime).

Express.js: Web sunucusu ve API rotalama (routing) çatısı.

MySQL: Veritabanı.

Sequelize: Node.js için Promise tabanlı ORM (Veritabanı yönetim aracı).

ES Modules (ESM): Modern JavaScript (import/export) sözdizimi.

JSON Web Tokens (JWT): authMiddleware aracılığıyla kimlik doğrulama için.

express-validator: Girdi verilerini (body, params) doğrulamak için.

dotenv: Ortam değişkenlerini yönetmek için.

nodemon: Geliştirme ortamında sunucuyu otomatik yeniden başlatmak için.

✨ Temel Özellikler
Proje Yönetimi (CRUD): Yeni proje oluşturma, proje detaylarını görme ve proje silme.

Üye Yönetimi: Projelere üye ekleme, üye çıkarma ve mevcut üyelerin rolünü güncelleme.

Kimlik Doğrulama (Authentication): Korumalı rotalara erişim için Authorization: Bearer <token> başlığı (header) ile JWT doğrulaması.

Yetkilendirme (Authorization): Kritik işlemler (silme, üye yönetimi) sadece projenin Sahibi (Owner) veya "admin" rolündeki üyeleri tarafından yapılabilir.

Girdi Doğrulaması (Validation): Rotalara gelen verinin (örn: UUID formatı, metin uzunluğu, izin verilen roller) express-validator ile kontrol edilmesi.

Sayfalama (Pagination): Yüksek hacimli verilerle başa çıkabilmek için getAllProject (tüm projeler) ve getMyProjects (benim projelerim) rotalarında ?page=... ve ?limit=... desteği.

Kullanıcıya Özel Rota: Giriş yapan kullanıcının sadece kendi dahil olduğu projeleri listelemesi için /getMyProjects rotası.

🔧 Kurulum ve Başlatma
Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

1. Ön Gereksinimler
   Node.js (v18+ önerilir)

MySQL Veritabanı (veya XAMPP/WAMP gibi bir araç)

Postman (API testi için)

2. Kurulum Adımları
   Bağımlılıkları Yükleyin:

Bash

npm install
Veritabanı Oluşturun: MySQL arayüzünüze bağlanın ve projeniz için boş bir veritabanı oluşturun.

SQL

CREATE DATABASE projectservices;
.env Dosyasını Yapılandırın: Projenin ana dizininde .env adında bir dosya oluşturun. (Aşağıdaki .env.example'ı kopyalayabilirsiniz).

.env.example:

Ini, TOML

# Sunucu Portu
PORT=3000

# MySQL Veritabanı Bilgileri
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=sifreniz
DB_NAME=projectservices
DB_PORT=3306

# Kimlik Doğrulama (Auth Service ile aynı olmalı)
JWT_SECRET=auth_servisinizdeki_cok_gizli_anahtar
Veritabanı Tablolarını Oluşturun (Migration): Sequelize'in modellerinizi okuyup MySQL'de tabloları (Projects, ProjectMembers) oluşturması için aşağıdaki komutu çalıştırın:

Bash

npm run db:sync
(Bu komut, ana dizindeki sync-db.js script'ini çalıştırır.)

3. Projeyi Çalıştırma
   Sunucuyu nodemon (otomatik yeniden başlatma) ile geliştirme modunda başlatmak için:

Bash

npm run dev
Sunucunuz http://localhost:3000 (veya .env dosyanızda belirlediğiniz PORT) adresinde çalışmaya başlayacaktır.

🗺️ API Rotaları (Endpoints)
Tüm rotalar http://localhost:3000/api/projects öneki (prefix) altındadır.

Not: (Yetki: Admin/Sahip) yazan yerler, checkAdminPermission fonksiyonu tarafından korunmaktadır.

Metod	Rota (URL)	Koruma (Auth)	Açıklama
POST	/createProject	Gerekli	Yeni bir proje oluşturur. (Sahibi, istek atan token'dan alınır). body: name, description
GET	/getAllProject	İsteğe Bağlı	Sayfalamalı olarak sistemdeki tüm projeleri listeler. (?page=1&limit=10)
GET	/getMyProjects	Gerekli	Sayfalamalı olarak sadece giriş yapan kullanıcının üye olduğu projeleri listeler. (?page=1&limit=10)
GET	/getProjectId/:id	Gerekli	Belirtilen :id'ye sahip projenin detaylarını (üyeleriyle birlikte) getirir.
DELETE	/deleteProject/:id	Gerekli (Yetki: Admin/Sahip)	Belirtilen :id'ye sahip projeyi siler.
POST	/addMember/:projectId/members	Gerekli (Yetki: Admin/Sahip)	:projectId'li projeye yeni bir üye ekler. body: userId (UUID), role ("admin" veya "member")
DELETE	/removeMember/:projectId/members/:userId	Gerekli (Yetki: Admin/Sahip)	:userId'li üyeyi :projectId'li projeden çıkarır.
PUT	/updateMemberRole/:projectId/members/:userId	Gerekli (Yetki: Admin/Sahip)	:userId'li üyenin rolünü günceller. body: role ("admin" veya "member")
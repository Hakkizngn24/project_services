import {sequelize} from "./src/models/index.js";
try {
    await sequelize.sync({alter:true});
    console.log('Senkron başarıyla sonuçlandı !!');
} catch (err) {
    console.error('Senkron sırasında bir hata oluştu !!');
} finally {
    await sequelize.close()
    console.log('Veritabanı bağlantısı kapatıldı !!');
}
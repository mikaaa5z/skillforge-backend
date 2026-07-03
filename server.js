const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// ХРАНИЛИЩЕ
// ============================================

const users = [];

// ============================================
// НАСТРОЙКИ
// ============================================

app.use(cors());
app.use(express.json());

// ============================================
// ТЕСТ
// ============================================

app.get('/api/test', (req, res) => {
    res.json({ success: true, message: '✅ Сервер работает!' });
});

// ============================================
// РЕГИСТРАЦИЯ (БЕЗ ХЕШИРОВАНИЯ!)
// ============================================

app.post('/api/register', (req, res) => {
    console.log('📥 Регистрация:', req.body);

    const { name, password } = req.body;

    // Проверки
    if (!name || name.length < 2) {
        return res.status(400).json({ success: false, error: 'Имя слишком короткое' });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({ success: false, error: 'Пароль слишком короткий' });
    }

    // Проверка на дубликат
    if (users.find(u => u.name === name)) {
        return res.status(400).json({ success: false, error: 'Имя уже занято' });
    }

    // Сохраняем
    const user = { id: Date.now().toString(), name: name, password: password };
    users.push(user);

    console.log('✅ Пользователь создан:', name);
    console.log('📊 Всего пользователей:', users.length);

    res.json({
        success: true,
        user: { id: user.id, name: user.name },
        message: 'Аккаунт создан!'
    });
});

// ============================================
// ВХОД (БЕЗ ХЕШИРОВАНИЯ!)
// ============================================

app.post('/api/login', (req, res) => {
    console.log('📥 Вход:', req.body);

    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ success: false, error: 'Введите имя и пароль' });
    }

    const user = users.find(u => u.name === name);

    if (!user) {
        return res.status(404).json({ success: false, error: 'Пользователь не найден' });
    }

    if (user.password !== password) {
        return res.status(401).json({ success: false, error: 'Неверный пароль' });
    }

    console.log('✅ Вход выполнен:', name);

    res.json({
        success: true,
        user: { id: user.id, name: user.name },
        message: 'Добро пожаловать!'
    });
});

// ============================================
// ЗАПУСК
// ============================================

app.listen(PORT, () => {
    console.log(`\n🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`📝 GET  /api/test     - проверка`);
    console.log(`📝 POST /api/register - регистрация`);
    console.log(`📝 POST /api/login    - вход\n`);
});
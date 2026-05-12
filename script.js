document.addEventListener('DOMContentLoaded', () => {
    // 1. 読み込む外部ファイルのパス（必ず先頭に / をつける）
    const headerPath = '/header.html';
    const footerPath = '/footer.html';
    const sidebarPath = '/sidebar.html';

    // 2. Promise.allを使って、3つのファイルを同時に読み込み開始し、全部終わるまで待つ
    Promise.all([
        fetch(headerPath).then(response => {
            if (!response.ok) throw new Error('Header load failed');
            return response.text();
        }),
        fetch(footerPath).then(response => {
            if (!response.ok) throw new Error('Footer load failed');
            return response.text();
        }),
        fetch(sidebarPath).then(response => {
            if (!response.ok) throw new Error('Sidebar load failed');
            return response.text();
        })
    ])
    .then(([headerData, footerData, sidebarData]) => {
        // 3. 取得したHTMLデータを、それぞれの空の箱（プレースホルダー）に流し込む
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) headerPlaceholder.innerHTML = headerData;

        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) footerPlaceholder.innerHTML = footerData;

        const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
        if (sidebarPlaceholder) sidebarPlaceholder.innerHTML = sidebarData;

        // =========================================================
        // HTMLの流し込みが終わった後に機能を追加
        // =========================================================
        
        // ヘッダー内のモバイルメニューを設定
        setupMobileMenu();
        
        // メインコンテンツ内のタブ機能を設定（※メインコンテンツは各ページにある前提）
        setupTabs();
        
        // スクロールアニメーションの設定
        setupScrollAnimation();
    })
    .catch(error => {
        console.error('共通ファイルの読み込みに失敗しました。サーバー環境で実行しているか確認してください。', error);
    });
});

// ==========================================
// 各機能の設定関数
// ==========================================

// モバイルメニューの設定関数
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navItems = document.querySelectorAll('.nav-item');

    // 万が一、ヘッダーを読み込まないページがあった場合のエラー回避
    if (!mobileMenuBtn || !navMenu) return;

    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('is-open');
    });

    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        if (!link) return;
        
        link.addEventListener('click', (e) => {
            // CSSのメディアクエリ（768px未満）と完全に一致する判定方法に変更
            if (window.matchMedia('(max-width: 767px)').matches) {
                e.preventDefault();
                navItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('is-active');
                    }
                });
                item.classList.toggle('is-active');
            }
        });
    });
}

// ニュースタブの設定関数
function setupTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    const newsItems = document.querySelectorAll('.news-item');

    if (tabs.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('is-active'));
            e.target.classList.add('is-active');
            
            const targetCategory = e.target.getAttribute('data-target');

            newsItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (targetCategory === 'all' || itemCategory === targetCategory) {
                    item.style.display = 'flex'; 
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// スクロールアニメーションの設定関数
function setupScrollAnimation() {
    const fadeElements = document.querySelectorAll('.fade-up');
    if (fadeElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. モバイル用メニューの開閉処理
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navItems = document.querySelectorAll('.nav-item');

    // 全体のメニュー開閉
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('is-open');
    });

    // スマホ表示時、親メニュータップでドロップダウンを開閉する
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        link.addEventListener('click', (e) => {
            // 画面幅が768px未満（スマホ表示）の時だけ動作させる
            if (window.innerWidth < 768) {
                e.preventDefault(); // リンクの遷移を無効化
                
                // 他のメニューが開いていたら閉じる
                navItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('is-active');
                    }
                });
                
                // クリックしたメニューの開閉を切り替え
                item.classList.toggle('is-active');
            }
        });
    });

    // 3. タブ切り替えとリストのフィルタリング機能
    const tabs = document.querySelectorAll('.filter-tab');
    const newsItems = document.querySelectorAll('.news-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // 全タブの is-active クラスを外す
            tabs.forEach(t => t.classList.remove('is-active'));
            
            // クリックされたタブに is-active クラスを付ける
            e.target.classList.add('is-active');
            
            const targetCategory = e.target.getAttribute('data-target');

            // リストの表示・非表示を切り替え
            newsItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                // 素のCSSに合わせて display プロパティを操作
                if (targetCategory === 'all' || itemCategory === targetCategory) {
                    // PC/スマホで display: flex を維持するため空文字ではなく flex を指定
                    item.style.display = 'flex'; 
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 4. スクロールアニメーション（Intersection Observer）
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // 要素が15%画面に入ったら発火
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // 一度発火したら監視を解除
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });
});
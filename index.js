// loading
const hasLoaded = sessionStorage.getItem('hasLoaded');
const loadingEl = document.getElementById('loading');

if (!hasLoaded && loadingEl) {
    loadingEl.classList.add('is-first-time');
    document.body.style.overflow = 'hidden'; // 初回ローディングがある時だけ禁止
}

// 日・英表示定義
var lang = localStorage.getItem('selectedLang') ? parseInt(localStorage.getItem('selectedLang')) : 0;

// header ランダム画像定義

// header, footer
const fetchHeader = fetch('header.html').then(r => r.text());
const fetchFooter = fetch('footer.html').then(r => r.text());

// 全部終わってから
Promise.all([fetchHeader, fetchFooter]).then(([headerData, footerData]) => {
    
    // header, footerの取り付け
    document.getElementById('header_fetch_target').innerHTML = headerData;
    document.getElementById('footer_fetch_target').innerHTML = footerData;

    // 初期言語設定
    applyLanguage(lang, false);
    defaultLanguageSet();

    if (document.querySelector('.sort_var')) {
        categorySort('category_all', false);
    }

    const loadingScreen = document.getElementById('loading');
    const header = document.getElementById('header_fetch_target');
    const contents = document.querySelector('.contents_fadein');
    const loadingVideo = document.getElementById('loading_video');

    const hasLoaded = sessionStorage.getItem('hasLoaded');

    if (loadingScreen && loadingVideo && !hasLoaded){

        // 3秒笑って〜〜〜
        loadingVideo.onended  = () => {

            // loading_textを切り替える
            const loadText = document.getElementById('loading_text');
            if (loadText) {
                loadText.innerHTML = "Ayaka Yabuki";
                loadText.classList.add('ready');
            }

            // クリックOKにする
            const unlockLoading = () => {
                //レイアウト調整時コメントアウト
                if (!loadingScreen.classList.contains('loaded')){
                    loadingScreen.classList.add('loaded');
                    
                    if (header) header.classList.add('show');
                    if (contents) contents.classList.add('show');

                    const footer = document.getElementById('footer_fetch_target');
                    if (footer) footer.classList.add('show');

                    document.body.style.overflow='';
                    sessionStorage.setItem('hasLoaded', 'true');
                    clearTimeout(autoUnlock);
                }
                //ここまで
            };

            const autoUnlock = setTimeout (() => {
                unlockLoading();
            }, 2000)

            if (loadingScreen) {
                loadingScreen.style.cursor = "pointer";
                loadingScreen.onclick = unlockLoading;
            }
        }//, 5000);

    } else {
        if (header) header.classList.add('show');
        if (contents) contents.classList.add('show');
        const footer = document.getElementById('footer_fetch_target');
        if (footer) footer.classList.add('show');
        document.body.style.overflow = '';
    }
});


// 言語設定
function defaultLanguageSet(){
    const toEnBtns = ["langToggleToEn", "langToggleToEn_Mob"]
    const toJaBtns = ["langToggleToJa", "langToggleToJa_Mob"]

    toEnBtns.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.onclick = function() {
                if (lang == 0) {
                    lang = 1;
                    localStorage.setItem('selectedLang', 1);
                    applyLanguage(1, true);
                    closeLangMenu();
                }
            }
        }
    })

    toJaBtns.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
        btn.onclick = function() {
            if (lang == 1) {
                lang = 0;
                localStorage.setItem('selectedLang', 0);
                applyLanguage(0, true);
                closeLangMenu();
            }
        }
    }
    })
}

// 言語メニュー閉じる
function closeLangMenu() {
    const check = document.getElementById('lang-btn-check');
    if (check) check.checked = false;
}

// 言語表示処理共通
function applyLanguage(currentLang, isAnimated) {
    const navJa = document.getElementsByClassName("nav-ja");
    const navEn = document.getElementsByClassName("nav-en");
    const langJa = document.getElementsByClassName("lang_ja");
    const langEn = document.getElementsByClassName("lang_en");

    const showEls = (currentLang === 1) ? langEn : langJa;
    const hideEls = (currentLang === 1) ? langJa : langEn;

    // ナビの色変更
    for (let nav of navJa) nav.style.color = (currentLang === 0) ? "#444" : "#aaa";
    for (let nav of navEn) nav.style.color = (currentLang === 1) ? "#444" : "#aaa";

    // 非表示処理
    for (let el of hideEls) {
        el.style.display = "none";
        el.style.opacity = 0;
    }

    // 表示処理
    for (let el of showEls) {
        el.style.display = "block";
        if (isAnimated) {
            el.style.opacity = 0;
            setTimeout(() => {
                el.style.transition = "opacity 1s ease";
                el.style.opacity = 1;
            }, 50);
        } else {
            el.style.transition = "none";
            el.style.opacity = 1;
        }
    }

    // news_detail
    const detailJa = document.getElementById('detail_content');
    const detailEn = document.getElementById('detail_content_en');
    if(detailJa) detailJa.style.display = (currentLang === 0) ? "block" : "none";
    if(detailEn) detailEn.style.display = (currentLang === 1) ? "block" : "none";
}

// news, archivesのソート
function categorySort(targetCategory, isAnimated=true){
    // すべてのナビ要素を配列として取得
    const sortAll = document.querySelectorAll(".sort_all");
    const sortInfo = document.querySelectorAll(".sort_info");
    const sortLive = document.querySelectorAll(".sort_live");
    const sortMV = document.querySelectorAll(".sort_mv");
    const sortPlay = document.querySelectorAll(".sort_play");

    // 全言語分のナビの色を一括で変更する
    sortAll.forEach(nav => nav.style.color = (targetCategory === 'category_all') ? "#444" : "#aaa");
    sortInfo.forEach(nav => nav.style.color = (targetCategory === 'category_info') ? "#444" : "#aaa");
    sortLive.forEach(nav => nav.style.color = (targetCategory === 'category_live') ? "#444" : "#aaa");
    sortMV.forEach(nav => nav.style.color = (targetCategory === 'category_mv') ? "#444" : "#aaa");
    sortPlay.forEach(nav => nav.style.color = (targetCategory === 'category_play') ? "#444" : "#aaa");

    const allBlocks = document.getElementsByClassName("sort_all_block");
    for (let el of allBlocks) {
        const showEls = (targetCategory === 'category_all' || el.classList.contains(targetCategory));

        if (showEls) {
            if (isAnimated) {
                el.style.transition = "opacity 0.5s ease";
                el.style.opacity = 0;
                setTimeout(() => {
                    if (el.style.opacity == 0) el.style.display = "";
                }, 500);
                setTimeout(() => {
                    el.style.transition = "opacity 0.8s ease";
                    el.style.opacity = 1;
                }, 800);
            } else {
                el.style.display = ""; // デフォルト表示用
                el.style.opacity = 1;
            }
        } else {
            if (isAnimated) {
                el.style.transition = "opacity 0.5s ease";
                el.style.opacity = 0;
                setTimeout(() => {
                    if (el.style.opacity == 0) el.style.display = "none";
                }, 500);
            } else {
                el.style.display = "none";
                el.style.opacity = 0;
            }
        }
    }
}

// index_news
const indexNewsJa = document.getElementById('index_news_list_ja');
const indexNewsEn = document.getElementById('index_news_list_en');

if (indexNewsJa || indexNewsEn) {
    fetch('news_data.json')
        .then(response => response.json())
        .then(data => {
            // 最新の3件だけ取得
            const latestPosts = data.slice(0, 3);

            latestPosts.forEach(post => {

                const categoryClass = post.category === 'category_info' ? 'info' : 'live';

                // 日本語版
                const liJa = `
                    <li>
                        <div style="display:flex; gap:10px; align-items:center;">
                            <p class="date">${post.date}</p>
                            <p class="${categoryClass}"></p>
                        </div>
                        <a href="news_detail.html?id=${post.id}">
                            <p class="text_bold index_title">${post.title_ja}</p>
                        </a>
                    </li>`;
                
                // 英語版
                const liEn = `
                    <li>
                        <div style="display:flex; gap:10px; align-items:center;">
                            <p class="date">${post.date}</p>
                            <p class="${categoryClass}"></p>
                        </div>
                        <a href="news_detail.html?id=${post.id}">
                            <p class="text_bold index_title">${post.title_en}</p>
                        </a>
                    </li>`;

                if (indexNewsJa) indexNewsJa.insertAdjacentHTML('beforeend', liJa);
                if (indexNewsEn) indexNewsEn.insertAdjacentHTML('beforeend', liEn);
            });
        })
        .catch(err => console.error("News load error:", err));
}
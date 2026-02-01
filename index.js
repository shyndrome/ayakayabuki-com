// 日・英表示定義
var lang = localStorage.getItem('selectedLang') ? parseInt(localStorage.getItem('selectedLang')) : 0;

// 3秒笑って〜〜〜〜
const wait3sec = new Promise(resolve => setTimeout(resolve, 3000));

// header ランダム画像定義

// header, footer
const fetchHeader = fetch('header.html').then(r => r.text());
const fetchFooter = fetch('footer.html').then(r => r.text());

// 全部終わってから
Promise.all([wait3sec, fetchHeader, fetchFooter]).then(([_, headerData, footerData]) => {
    
    // header, footerの取り付け
    document.getElementById('header_fetch_target').innerHTML = headerData;
    document.getElementById('footer_fetch_target').innerHTML = footerData;

    // 初期言語設定
    applyLanguage(lang, false);
    defaultLanguageSet();

    // loading_textを切り替える
    const loadText = document.getElementById('loading_text');
    if (loadText) {
        loadText.innerHTML = "Ayaka Yabuki";
        loadText.classList.add('ready');
    }

    // クリックOKにする
    const loadingScreen = document.getElementById('loading');

    const unlockLoading = () => {
        if (!loadingScreen.classList.contains('loaded')){
            loadingScreen.classList.add('loaded');
            const contents = document.querySelector('.contents_fadein');
            if (contents) contents.classList.add('show');
            document.body.style.overflow='';

            clearTimeout(autoUnlock);
        }
    };

    const autoUnlock = setTimeout (() => {
        unlockLoading();
    }, 4000)

    if (loadingScreen) {
        loadingScreen.style.cursor = "pointer";
        loadingScreen.onclick = function() {
            unlockLoading();
        };
    }
}).catch(err => {
    console.error("Error:", err);
});

document.body.style.overflow = 'hidden';

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
}

// news, archivesのソート
function categorySort(targetCategory, isAnimated=true){
    const allBlocks = document.getElementsByClassName("sort_all_block");
    const sortAll = document.getElementsByClassName("sort_all");
    const sortInfo = document.getElementsByClassName("sort_info");
    const sortLive = document.getElementsByClassName("sort_live");
    const sortMV = document.getElementsByClassName("sort_mv");
    const sortPlay = document.getElementsByClassName("sort_play");

    // ナビの色変更
    for (let nav of sortAll) nav.style.color = (targetCategory === 'category_all') ? "#444" : "#aaa";
    for (let nav of sortInfo) nav.style.color = (targetCategory === 'category_info') ? "#444" : "#aaa";
    for (let nav of sortLive) nav.style.color = (targetCategory === 'category_live') ? "#444" : "#aaa";
    for (let nav of sortMV) nav.style.color = (targetCategory === 'category_mv') ? "#444" : "#aaa";
    for (let nav of sortPlay) nav.style.color = (targetCategory === 'category_play') ? "#444" : "#aaa";

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
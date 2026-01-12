// 日・英表示定義
var lang = localStorage.getItem('selectedLang') ? parseInt(localStorage.getItem('selectedLang')) : 0;

// ★共通の適用関数を定義（onclickの中身をここにまとめました）
function applyLanguage(currentLang, isAnimated) {
    const navJa = document.getElementsByClassName("nav-ja");
    const navEn = document.getElementsByClassName("nav-en");
    const langJa = document.getElementsByClassName("lang_ja");
    const langEn = document.getElementsByClassName("lang_en");

    const showEls = (currentLang === 1) ? langEn : langJa;
    const hideEls = (currentLang === 1) ? langJa : langEn;

    // ナビの色変更
    for (let nav of navJa) nav.style.color = (currentLang === 0) ? "#444" : "#bbb";
    for (let nav of navEn) nav.style.color = (currentLang === 1) ? "#444" : "#bbb";

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

// header.htmlの読み込み
document.addEventListener('DOMContentLoaded', () => {
  fetch('header.html')
    .then(response => response.text()) 
    .then(data => {
      document.getElementById('header_fetch_target').innerHTML = data;

      // ★ページを読み込んだ瞬間に、保存されている言語を反映させる
      applyLanguage(lang, false);
      
      const langToggleToEn = document.getElementById("langToggleToEn");
      if (langToggleToEn) {
        langToggleToEn.onclick = function() {
            if (lang == 0) {
                lang = 1; // 変数を更新
                localStorage.setItem('selectedLang', 1); // ブラウザに保存
                applyLanguage(1, true); // アニメーションありで実行
            }
        }
      }

      const langToggleToJa = document.getElementById("langToggleToJa");
      if (langToggleToJa) {
        langToggleToJa.onclick = function() {
            if (lang == 1) {
                lang = 0; // 変数を更新
                localStorage.setItem('selectedLang', 0); // ブラウザに保存
                applyLanguage(0, true); // アニメーションありで実行
            }
        }
      }
    })
    .catch(error => console.error('Error loading header:', error));
});

// footer.htmlの読み込み
document.addEventListener('DOMContentLoaded', () => {
  fetch('footer.html')
    .then(response => response.text()) 
    .then(data => {
      document.getElementById('footer_fetch_target').innerHTML = data;
    })
    .catch(error => console.error('Error loading footer:', error));
});
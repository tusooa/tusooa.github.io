/* global global */

if (! window.Tusooa) {
  window.Tusooa = {};
}

if (! window.Tusooa.LanguageSwitcher) {
  'use strict';
  window.Tusooa.LanguageSwitcher = {};
  const s = window.Tusooa.LanguageSwitcher;
  s.SUCCESS = true;
  s.FAILED = false;

  s.availableLangs = ['en', 'zh-CN'];
  s.langNames = {
    en: 'English',
    'zh-CN': '官话(简体中文)',
  };

  if (s.availableLangs.includes(navigator.language)) {
    // If the user's primary language is supported,
    // only show that language.
    s.displayedLangs = [navigator.language];
  } else {
    // Otherwise, displayed languages default to all the languages that is
    // (1) supported (in `availableLangs`) and
    // (2) preferred by the user (in `navigator.languages`).
    s.displayedLangs = s.availableLangs.reduce(
      (a, lang) => navigator.languages.includes(lang) ? a.concat(lang) : a, []);

    // If there is no language that satisfies those two,
    // enable all languages.
    if (s.displayedLangs.length === 0) {
      s.displayedLangs = [...s.availableLangs];
    }
  }
  s.langSelectorPrefix = '.ts-lang-';
  s.shownLangClass = 'ts-langs-show';
  s.checkBoxNamePrefix = 'ts-langs-checkbox-';
  s.langSwitchClass = 'ts-langswitch-btn';
  s.langSwitchEnabledClass = 'ts-langswitch-enabled';
  s.langSwitchDisabledClass = 'ts-langswitch-disabled';
  // Initialize the switcher
  s.create = (id, saveLangsCallback) => {
    const elem = document.getElementById(id);
    if (! elem) {
      // There is no such element
      return;
    }

    // Show languages only in displayedLangs
    for (const lang of s.availableLangs) {
      if (! s.displayedLangs.includes(lang)) {
        s.hide(lang, /* force = */ true);
      }
    }

    const checkBoxList = document.createElement('div');

    // Add checkboxes
    for (const lang of s.availableLangs) {
      const input = document.createElement('div');
      input.classList.add(s.langSwitchClass);
      input.classList.add(s.displayedLangs.includes(lang)
                          ? s.langSwitchEnabledClass
                          : s.langSwitchDisabledClass);
      input.innerText = s.langNames[lang] || lang;
      //input.type = 'checkbox';
      //input.name = `${s.checkBoxNamePrefix}${lang}`;
      //input.id = `${s.checkBoxNamePrefix}${lang}`;
      //input.checked = s.displayedLangs.includes(lang);
      input.addEventListener('mouseup', e => {
        //console.log(`${lang} is gonna change!`);
        if (! s.displayedLangs.includes(lang)) {
          if (s.show(lang) === s.SUCCESS) {
            input.classList.remove(s.langSwitchDisabledClass);
            input.classList.add(s.langSwitchEnabledClass);
            if (typeof(saveLangsCallback) === 'function') {
              saveLangsCallback(s.displayedLangs);
            }
          }
        } else {
          if (s.hide(lang) === s.SUCCESS) {
            input.classList.remove(s.langSwitchEnabledClass);
            input.classList.add(s.langSwitchDisabledClass);
            if (typeof(saveLangsCallback) === 'function') {
              saveLangsCallback(s.displayedLangs);
            }
          }
        }
        e.preventDefault();
      });
      //const label = document.createElement('label');
      //label.for = input.id;
      //label.innerText = lang;
      checkBoxList.appendChild(input);
      //checkBoxList.appendChild(label);
    }
    elem.appendChild(checkBoxList);
  };

  s.show = lang => {
    if (s.displayedLangs.includes(lang)) {
      // This language is already shown
      return s.FAILED;
    }

    const languageNodes = document.querySelectorAll(`${s.langSelectorPrefix}${lang}`);

    for (const node of languageNodes) {
      node.classList.add(s.shownLangClass);
    }

    s.displayedLangs.push(lang);
    return s.SUCCESS;
  };

  s.hide = (lang, force) => {
    if ((!s.displayedLangs.includes(lang)
         // Do not allow to turn off all languages
         || s.displayedLangs.length <= 1)
        && !force) {
      // This language is not shown
      return s.FAILED;
    }

    const languageNodes = document.querySelectorAll(`${s.langSelectorPrefix}${lang}`);

    for (const node of languageNodes) {
      node.classList.remove(s.shownLangClass);
    }

    s.displayedLangs = s.displayedLangs.filter(k => k !== lang);

    return s.SUCCESS;
  };
};

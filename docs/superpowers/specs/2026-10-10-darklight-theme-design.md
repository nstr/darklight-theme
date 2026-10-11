# Darklight — дизайн темы для VS Code

Дата: 2026-10-10
Статус: черновик на ревью

## 1. Цель

Darklight — новая тема для VS Code на основе Nest Theme (`nesterman.material-nest-theme` 1.0.40, репозиторий `vscode-nest-theme`, последний коммит 2019-01-20). Главная особенность Nest сохраняется: тема ни тёмная, ни светлая. Рамка интерфейса тёмно-синяя, редактор белый.

### Что сказал автор

- Новая тема на основе Nest, называется Darklight.
- Сохранить характер «тёмная рамка + светлый редактор».
- Починить накопившиеся баги.
- Цвета остаются авторскими, но становятся читаемыми на белом. Без смены палитры.
- Основной язык: TypeScript и React.
- Издатель `nstr`. Публикация в VS Code Marketplace и Open VSX, но сначала локальная обкатка через `.vsix`.
- Активная вкладка тёмная, чуть светлее полосы вкладок, а не белая.
- Репозиторий: https://github.com/nstr/darklight-theme (MIT).

### Допущения

- Darklight — отдельное расширение. Nest Theme не обновляется и не снимается с публикации.
- Код Nest не переносится в новый репозиторий как история. Он служит источником цветов.

### Критерии готовности

1. `npm run check` проходит без ошибок (раздел 7).
2. В редакторе нет невидимых и почти невидимых элементов. Каждый ключ «поверхности редактора» (раздел 5) задан явно.
3. Основной код на белом читается с контрастом не ниже 4.5:1. Комментарии и операторы не ниже 3.5:1.
4. Каждая строка таблицы раздела 6 подтверждена через «Developer: Inspect Editor Tokens and Scopes» на `samples/`.
5. Чек-лист поверхностей (раздел 8) пройден вживую.
6. Автор поставил `.vsix` локально и подтвердил, что тема готова к публикации.

### Вне объёма

- Публикация в Marketplace и Open VSX. Это отдельный шаг после обкатки, нужна регистрация издателя `nstr` в обоих каталогах.
- Дополнительные варианты темы (полностью тёмный, полностью светлый, высококонтрастный).
- Тема иконок файлов.
- Тонкая настройка языков, кроме TypeScript, JavaScript, React, JSON и Markdown. Остальные получают общие правила TextMate без отдельной проверки.

## 2. Найденные баги Nest, которые закрывает Darklight

| # | Баг | Как закрываем |
|---|---|---|
| 1 | `"type": "dark"` при белом редакторе: все незаданные ключи получают тёмные цвета VS Code по умолчанию (поиск, diff, inlay hints, скобки, sticky scroll, ghost text) | Ключи поверхности редактора задаются явно, проверка в `check.mjs` |
| 2 | Висячая запятая в `theme.json` (строка 266), невалидный JSON | Тема генерируется из JS, `check.mjs` проверяет строгий JSON |
| 3 | Цвет `"##597078"` в правиле «Brace» | Формат цвета проверяется (`#RRGGBB` / `#RRGGBBAA`) |
| 4 | Пустое значение `"editorWidget.border": ""` | То же |
| 5 | Символ `\|` внутри селектора заголовков Markdown, правило не работает, заголовки красные | Селекторы задаются массивом, без `\|` |
| 6 | Правило без селектора задаёт цвет текста по умолчанию `#FFFFFF` (белый на белом) | Правила без селектора нет |
| 7 | `constant.other.color` белый на белом | Цвет из палитры |
| 8 | `#E7EAEC` для цитат, языка блока кода и разделителей в Markdown (контраст 1.2) | Цвет комментариев |
| 9 | Правило «Function name» перекрашивает объявления функций в серый | Правило удалено |
| 10 | Контраст подсветки на белом 1.75–3.9 | Палитра из раздела 4 |
| 11 | Номера строк `#CFD8DC` (1.45) | `#8A96A2` |
| 12 | Курсор `#FFCC00` на белом почти невидим | `#009098` |
| 13 | Предупреждения зелёные (`#C3E88D70`) | `#BA5100` |
| 14 | `focusBorder` прозрачный, фокус клавиатуры не виден | `#80CBC480` |
| 15 | Вторичный текст рамки `#757CA1` / `#676E95` (3.3–4.1) | `#8B93B9` |
| 16 | Hover тёмный, а код в нём раскрашен цветами для белого фона | Hover и другие виджеты с кодом светлые (раздел 5) |
| 17 | Нет семантической подсветки | `semanticHighlighting: true` + `semanticTokenColors` |
| 18 | Устаревшая сборка: `vsce` 1.x, `nodemon`, `tasks.json` со скриптом `compile`, `engines ^1.12` | Новая сборка (раздел 3) |
| 19 | Локальные правки в установленной Nest (~40 ключей: кнопки, выпадающие списки, профили, Settings, Welcome) не попали в репозиторий | Переносятся в `workbench.mjs` |

## 3. Структура и сборка

```
darklight-theme/
├─ src/
│  ├─ palette.mjs      именованные цвета
│  ├─ workbench.mjs    ключи интерфейса → цвета палитры, по группам
│  └─ syntax.mjs       tokenColors (TextMate) + semanticTokenColors
├─ scripts/
│  ├─ build.mjs        собирает themes/darklight-color-theme.json
│  ├─ check.mjs        проверки, при ошибке ненулевой код выхода
│  └─ required-keys.mjs  список обязательных ключей поверхности редактора
├─ themes/darklight-color-theme.json   сгенерирован, лежит в git
├─ samples/            react.tsx, types.ts, README.md, data.json, patch.diff
├─ docs/superpowers/specs/   спецификация
├─ package.json  README.md  CHANGELOG.md  icon.png  .vscodeignore  LICENSE
└─ .vscode/launch.json      «Launch Extension»
```

- `palette.mjs` экспортирует объект с именованными цветами. Только он содержит шестнадцатеричные значения. Прозрачность задаётся функцией `alpha(color, 0..1)`.
- `workbench.mjs` экспортирует плоский объект `ключ VS Code → цвет`, собранный из групп: рамка, вкладки, поверхность редактора, виджеты над редактором, виджеты управления, diff и git, терминал, кнопки, поля ввода и списки, Settings и прочие редакторы без кода.
- `syntax.mjs` экспортирует `tokenColors` (массив правил с селекторами-массивами) и `semanticTokenColors`.
- `build.mjs` собирает объект темы (`name: "Darklight"`, `type: "dark"`, `semanticHighlighting: true`), пишет JSON с отступом 2 и переводом строки в конце.
- Окружение: Node 20 или новее, ES-модули, без зависимостей во время работы. Для разработки только `@vscode/vsce` и `ovsx`.

### package.json

- `name: "darklight-theme"`, `displayName: "Darklight"`, `publisher: "nstr"`, `version: "0.1.0"` (при публикации 1.0.0).
- `engines.vscode: "^1.85.0"`, `categories: ["Themes"]`.
- `contributes.themes`: один элемент `{ "label": "Darklight", "uiTheme": "vs-dark", "path": "./themes/darklight-color-theme.json" }`.
- `repository`, `bugs`, `license: "MIT"`, `galleryBanner: { color: "#1B1E2B", theme: "dark" }`, `icon: "icon.png"`.
- Скрипты:
  - `build` → `node scripts/build.mjs`
  - `check` → `node scripts/check.mjs`
  - `package` → `npm run build && npm run check && vsce package`

`.vscodeignore` исключает `src/`, `scripts/`, `samples/`, `docs/`, `.vscode/`, `node_modules/`.

`icon.png` 256×256: квадрат, разделённый по диагонали на `#1B1E2B` и `#FFFFFF`, с бирюзовой акцентной линией `#80CBC4`. Генерируется из SVG, исходник `icon.svg` в репозитории.

## 4. Палитра

Оттенок и насыщенность каждого цвета Nest сохраняются. Меняется только светлота (в OKLCH), пока цвет не достигнет целевого контраста на `#FFFFFF` и на текущей строке `#F4F5F7`.

### 4.1 Подсветка

| Имя в палитре | Роль | Nest | Darklight | Контраст (белый / текущая строка) |
|---|---|---|---|---|
| `syntax.fg` | текст, переменные, параметры, свойства | `#597078` | `#455A64` (0.2.2) | 7.2 / 6.6 |
| `syntax.comment` | комментарии (курсив) | `#90A4AE` | `#72858F` | 3.8 / 3.5 |
| `syntax.keyword` | ключевые слова, storage | `#945EB8` | `#8F59B3` | 4.9 / 4.5 |
| `syntax.function` | функции, методы, `this`, ключи JSON | `#6182B8` | `#5171A6` | 4.9 / 4.5 |
| `syntax.tag` | теги JSX и HTML | `#5379B7` | `#4B71AE` | 4.9 / 4.5 |
| `syntax.string` | строки | `#FB8C00` | `#E37600` (0.2.2, оттенок Nest, чуть темнее) | 3.1 / 2.8 |
| `syntax.type` | классы, типы, интерфейсы | `#FF5370` | `#D62750` | 4.9 / 4.5 |
| `syntax.constant` | числа, литералы, члены enum | `#4F99B8` | `#2C7896` | 5.0 / 4.6 |
| `syntax.attribute` | атрибуты JSX, заголовки Markdown | `#91B859` | `#587B15` | 4.9 / 4.5 |
| `syntax.cssClass` | CSS-классы, атрибуты HTML, адреса ссылок | `#FFB62C` | `#A46000` | 4.9 / 4.5 |
| `syntax.cssProperty` | свойства CSS | `#8796B0` | `#63718A` | 4.9 / 4.5 |
| `syntax.operator` | операторы, `${}`, скобки тегов, escape | `#39ADB5`, `#3FB3A8` | `#009098` | 3.9 / 3.5 |
| `syntax.special` | регулярные выражения, код в Markdown, `markup.changed` | `#7C4DFF` | `#7C4DFF` | 4.8 / 4.4 |
| `syntax.invalid` | `invalid`, `markup.deleted` | `#E53935` | `#D72929` | 5.0 / 4.5 |

**0.2.0.** По итогам обкатки автор выбрал более тёмный основной текст и жёлтые строки, как привык в Nest. Читаемый жёлтый на белом может быть только золотистым: у строк порог 3.5, у текста на подсветках (выделение, поиск, diff) допускается запас 0.6 от порога цвета. CSS-классы и атрибуты HTML получили бывший оранжевый цвет строк, чтобы не сливаться со строками.

**0.2.1.** Автор вернул строкам оранжевый цвет Nest `#FB8C00` (порог для строк 2.1), CSS-классы и атрибуты HTML вернулись к янтарному `#A46000`.

**0.2.2.** Строки чуть затемнены до `#E37600` (порог 2.8), основной текст стал `#455A64`: светлее `#37474F`, темнее `#597078` из Nest.

Цвет `syntax.special` на текущей строке даёт 4.4. Это допустимое отклонение: регулярные выражения и код в Markdown встречаются редко. `check.mjs` применяет для него порог 4.3.

Ключи JSON всех уровней получают `syntax.function` (синий). Чередование цветов по уровням вложенности убрано.

### 4.2 Рамка

| Имя | Значение | Где |
|---|---|---|
| `ui.bg` | `#1B1E2B` | заголовок окна, панель активности, боковая панель, полоса вкладок, неактивные вкладки, статус-бар, нижняя панель |
| `ui.surface` | `#292D3E` | активная вкладка, breadcrumbs, выпадающие списки, меню, уведомления, панель поиска |
| `ui.input` | `#333747` | поля ввода |
| `ui.fg` | `#A6ACCD` | основной текст рамки |
| `ui.fgStrong` | `#EEFFFF` | текст активной вкладки, поля ввода |
| `ui.fgMuted` | `#8B93B9` | вторичный текст: неактивные вкладки, проводник, статус-бар, описания |
| `ui.accent` | `#80CBC4` | акцент: полоска активной вкладки, выбранный элемент, бейджи, прогресс |
| `ui.border` | `#00000060` | границы между областями рамки |
| `ui.borderLight` | `#FFFFFF10` | границы полей ввода и виджетов на тёмном |

Контраст `ui.fgMuted` на `ui.bg` и `ui.surface` не ниже 4.5.

### 4.3 Редактор

| Имя | Значение |
|---|---|
| `editor.bg` | `#FFFFFF` |
| `editor.lineHighlight` | `#F4F5F7` |
| `editor.widgetBg` | `#FAFBFC` |
| `editor.widgetBorder` | `#D8DCE3` |
| `editor.subtleBg` | `#F0F2F5` (inlay hints, выбранный пункт автодополнения) |
| `editor.stickyBg` | `#F7F8FA` |

Терминал остаётся на `ui.bg`. ANSI-цвета Nest (`#82AAFF`, `#C3E88D`, `#FF5370`, `#FFCB6B`, `#C792EA`, `#89DDFF`) сохраняются, на тёмном фоне они читаются.

## 5. Интерфейс и поверхность редактора

### 5.1 Правило светлого и тёмного

- **Светлые** (`editor.widgetBg`, рамка `editor.widgetBorder`, тень `#1B1E2B33`): всё, где VS Code раскрашивает код цветами темы. Это `editorHoverWidget.*` (hover и подсказки параметров), `editorSuggestWidget.*`, `peekView*`, `inlineChat.*`, `editorStickyScroll.*`.
- **Тёмные** (`ui.surface`): элементы управления с полями ввода. Это `editorWidget.*` (поиск и замена, переименование), `quickInput.*`, `menu.*`, `notifications.*`, `editorActionList.*`.

### 5.2 Вкладки

- Полоса вкладок и неактивные вкладки: `ui.bg`, текст `ui.fgMuted`. Граница между вкладками `#00000040`.
- Активная вкладка: `ui.surface`, текст `ui.fgStrong`, `tab.activeBorderTop` `ui.accent`.
- Активная вкладка неактивной группы: фон `ui.surface`, текст `ui.fg`, `tab.unfocusedActiveBorderTop` `ui.accent` с прозрачностью 40%.
- Точка изменённого файла: `ui.fg`.
- `breadcrumb.background` `ui.surface`, текст `ui.fgMuted`, фокус `ui.fg`, выбранный `ui.accent`.

### 5.3 Значения поверхности редактора

| Ключи VS Code | Значение |
|---|---|
| `editorCursor.foreground` | `#009098` |
| `editor.lineHighlightBackground`, `editor.lineHighlightBorder` | `#F4F5F7`, прозрачная рамка |
| `editorLineNumber.foreground` / `activeForeground` | `#8A96A2` / `#597078` |
| `editor.selectionBackground` | `#80CBC4` с прозрачностью 35% |
| `editor.inactiveSelectionBackground` | `#80CBC4` с прозрачностью 20% |
| `editor.selectionHighlightBackground` | `#80CBC4` с прозрачностью 20% |
| `editor.wordHighlightBackground` | `#A6ACCD` с прозрачностью 20% |
| `editor.wordHighlightStrongBackground` | `#8F59B3` с прозрачностью 15% |
| `editor.findMatchBackground`, `editor.findMatchBorder` | `#FFB62C` с прозрачностью 45%, рамка `#A46000` |
| `editor.findMatchHighlightBackground` | `#FFB62C` с прозрачностью 25% |
| `editor.findRangeHighlightBackground` | `#80CBC4` с прозрачностью 10% |
| `editorBracketMatch.background` / `border` | `#80CBC4` с прозрачностью 20% / `#009098` |
| `editorBracketHighlight.foreground1..3` | `#8F59B3`, `#5171A6`, `#009098` |
| `editorBracketHighlight.unexpectedBracket.foreground` | `#D72929` |
| `editorIndentGuide.background1` / `activeBackground1` | `#E8EAED` / `#B0BEC5` |
| `editorWhitespace.foreground` | `#B4BCC5` |
| `editorRuler.foreground` | `#E8EAED` |
| `editorInlayHint.foreground` / `background` | `#72858F` / `#F0F2F5` |
| `editorGhostText.foreground` | `#8E9AA6` |
| `editorCodeLens.foreground` | `#72858F` |
| `editorLink.activeForeground` | `#5171A6` |
| `editorError.foreground` / `editorWarning.foreground` / `editorInfo.foreground` / `editorHint.foreground` | `#D72929` / `#BA5100` / `#5171A6` / `#72858F` |
| `editorGutter.background` | `#FFFFFF` |
| `editorGutter.addedBackground` / `modifiedBackground` / `deletedBackground` | `#587B15` / `#5171A6` / `#D72929` |
| `diffEditor.insertedLineBackground` / `insertedTextBackground` | `#587B15` с прозрачностью 8% / 16% |
| `diffEditor.removedLineBackground` / `removedTextBackground` | `#D72929` с прозрачностью 7% / 13% |
| `diffEditor.diagonalFill` | `#1B1E2B` с прозрачностью 10% |
| `merge.*` (current / incoming / common) | `#587B15` / `#5171A6` / `#72858F`: заголовки 25%, содержимое 10% |
| `editorOverviewRuler.*` | ошибки `#D72929`, предупреждения `#BA5100`, поиск `#A46000`, выделение `#80CBC4`, граница `#E8EAED` |
| `scrollbarSlider.background` / `hoverBackground` / `activeBackground` | `#1B1E2B` с прозрачностью 15% / 25% / 35% |
| `minimap.background`, `minimap.selectionHighlight`, `minimap.findMatchHighlight` | `#FFFFFF`, `#80CBC4`, `#FFB62C` |
| `minimapSlider.*` | как `scrollbarSlider.*` |
| `editorStickyScroll.background` / `shadow` / `editorStickyScrollHover.background` | `#F7F8FA` / `#1B1E2B` с прозрачностью 15% / `#EEF0F3` |
| `editorSuggestWidget.selectedBackground` / `highlightForeground` / `focusHighlightForeground` | `#F0F2F5` / `#009098` / `#009098` |
| `focusBorder` | `#80CBC4` с прозрачностью 50% |
| `editorUnnecessaryCode.opacity` | `#000000A0` |

### 5.4 Редакторы без кода

**Решение по итогам обкатки (0.1.1).** VS Code всегда рисует Settings, Welcome, Keybindings и модальные окна на `editor.background`, поэтому они светлые целиком:

- **Поля ввода.** Все поля ввода (`input.*`, `settings.*`) светлые везде, включая поиск в боковой панели и палитру команд. Правило: всё, во что печатаешь, светлое, как редактор.
- **Общий текст.** `foreground`, `descriptionForeground` и `icon.foreground` = `ui.fgShared` `#7E86AD`. Контраст 3.6 на белом и 4.7 на `ui.bg`. Один цвет с контрастом 4.5 на обоих фонах подобрать невозможно.
- **Ссылки.** `textLink.*` = `ui.linkShared` `#009098`: 3.9 на белом, 4.3 на `ui.bg`.
- **Плашки.** Inline-код, цитаты, блоки кода, сочетания клавиш и бейджи получают собственный фон, поэтому читаются на любой поверхности.
- **Output.** Панель Output получает `editor.bg`: её текст раскрашен светлой палитрой подсветки.
- **Активная вкладка.** В Modern UI VS Code со стилем вкладок «connected» активная вкладка всегда окрашена в `editor.background`. Тёмная вкладка требует пользовательской настройки `workbench.colorCustomizations["[Darklight]"]["tab.activeBackground"]`, она описана в README.

- **Классический интерфейс.** В Modern UI внутренний слой карточки редактора скруглён на 8px внутри рамки 1px. В верхних углах просвечивает белый фон карточки (`editor.background`), и тема не может это изменить. Рекомендуемая настройка: `"workbench.experimental.modernUI": false`. Она описана в README.

Исходный план раздела:

Settings, Keybindings, страница расширения, Welcome и предпросмотр Markdown рисуются на `editor.bg`, но берут общие ключи (`foreground`, `descriptionForeground`, `input.*`, `textLink.*`). Нужные значения устанавливаются при обкатке (раздел 8, шаг 3). Отправная точка — правки из установленной Nest: поля Settings на `ui.input` с текстом `ui.fgStrong`. Найденные проблемы чинятся в рамках этой работы. Принятые значения записываются в `workbench.mjs`, группа «Редакторы без кода».

## 6. Подсветка TypeScript и React

### 6.1 Соответствие конструкций

| Конструкция | Пример | Цвет | Селекторы TextMate (основные) |
|---|---|---|---|
| Ключевые слова, модификаторы, управление | `import` `export` `const` `async` `await` `return` `if` `new` `typeof` `=>` | `syntax.keyword` | `keyword`, `keyword.control`, `storage.type`, `storage.modifier` |
| Функции: объявления и вызовы | `UserCard` `useState()` `user.save()` | `syntax.function` | `entity.name.function`, `meta.function-call`, `variable.function`, `support.function` |
| Типы | `Props` `Error` `T` `string` `number` | `syntax.type` | `entity.name.type`, `entity.name.class`, `entity.other.inherited-class`, `support.type`, `support.class` |
| Переменные, параметры, свойства, импорты | `open` `id` `user.name` | `syntax.fg` | `variable`, `variable.parameter`, `meta.object-literal.key`, `variable.other.readwrite.alias` |
| Строки, шаблоны, пути импорта | `'react'` `` `User ${id}` `` | `syntax.string` | `string`, `punctuation.definition.string` |
| Подстановки и операторы | `${ }` `=` `===` `&&` `?.` `...` | `syntax.operator` | `keyword.operator`, `punctuation.definition.template-expression` |
| Числа, литералы | `42` `true` `null` `undefined` | `syntax.constant` | `constant.numeric`, `constant.language`, `support.constant` |
| `this`, `super` | | `syntax.function` | `variable.language` |
| Регулярные выражения | `/\d+/g` | `syntax.special` | `string.regexp` |
| Escape-последовательности | `\n` | `syntax.operator` | `constant.character.escape` |
| Теги JSX: HTML-теги и компоненты | `<div>` `<Card>` | `syntax.tag` | `entity.name.tag`, `support.class.component` |
| Скобки тегов | `<` `/>` | `syntax.operator` | `punctuation.definition.tag` |
| Атрибуты JSX | `onClick` `size` | `syntax.attribute` | `entity.other.attribute-name` |
| Текст в JSX, `{ }` выражений | | `syntax.fg` | `meta.jsx.children`, `punctuation.section.embedded` |
| Комментарии | `// …` `/** … */` | `syntax.comment`, курсив | `comment`, `punctuation.definition.comment` |
| JSDoc: теги / типы / имена | `@param` `{string}` `id` | `syntax.keyword` / `syntax.type` / `syntax.fg` | `storage.type.class.jsdoc`, `entity.name.type.instance.jsdoc`, `variable.other.jsdoc` |
| Декораторы | `@Component` | `syntax.function` | `meta.decorator`, `punctuation.decorator` |

Курсивом выделяются только комментарии. Жирный шрифт в коде не используется, только в Markdown.

### 6.2 Семантическая подсветка

`semanticHighlighting: true`. Значения `semanticTokenColors`:

| Токены | Цвет |
|---|---|
| `class`, `interface`, `enum`, `type`, `typeParameter`, `namespace` | `syntax.type` |
| `function`, `method` | `syntax.function` |
| `enumMember` | `syntax.constant` |
| `variable`, `parameter`, `property` | `syntax.fg` |
| `*.deprecated` | `{ "strikethrough": true }` |

### 6.3 JSON и Markdown

- **JSON.** Ключи всех уровней `syntax.function`. Строки `syntax.string`. Числа и литералы `syntax.constant`.
- **Markdown:**
  - заголовки `syntax.attribute`, жирный;
  - жирный и курсив `syntax.type`;
  - ссылки `syntax.function`, адрес ссылки `syntax.cssClass`;
  - код и блоки кода `syntax.special`;
  - цитаты, язык блока кода, разделитель `syntax.comment`;
  - маркеры списков `syntax.operator`;
  - `markup.inserted` `syntax.attribute`, `markup.deleted` `syntax.invalid`, `markup.changed` `syntax.special`.

## 7. Автоматические проверки (`scripts/check.mjs`)

1. **Формат.** `themes/darklight-color-theme.json` парсится через `JSON.parse`. Каждое значение цвета соответствует `^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$`. Пустых строк нет. У каждого правила `tokenColors` есть непустой `scope`, ни один селектор не содержит `|`.
2. **Покрытие.** Каждый ключ из `scripts/required-keys.mjs` задан в `colors`. В список входят все ключи раздела 5.3 и ключи виджетов из раздела 5.1, сверенные с [Theme Color reference](https://code.visualstudio.com/api/references/theme-color).
3. **Контраст подсветки.** Каждый `foreground` из `tokenColors` и `semanticTokenColors` проверяется на `editor.bg` и `editor.lineHighlight`. Порог 4.5. Исключения: `syntax.comment` и `syntax.operator` 3.5, `syntax.special` 4.3. Порог определяется по имени цвета в палитре.
4. **Контраст на подсветках.** `syntax.fg`, `syntax.string` и `syntax.keyword` проверяются поверх выделения, текущего совпадения поиска и вставленной и удалённой строки diff. Полупрозрачный фон смешивается с `editor.bg`. Порог 3.5.
5. **Контраст рамки.** `ui.fg`, `ui.fgMuted` и `ui.fgStrong` на `ui.bg` и `ui.surface`. Порог 4.5.

При нарушении скрипт печатает ключ, цвет, фон, полученный контраст и порог, затем завершается с кодом 1.

## 8. Ручная проверка

1. `npm run check` проходит.
2. Окно с темой (F5, «Launch Extension») открывает `samples/`. На каждой строке таблицы 6.1 и пунктах 6.3 запускается «Developer: Inspect Editor Tokens and Scopes», цвет сверяется со спецификацией.
3. Чек-лист поверхностей:
   - hover и подсказки параметров;
   - автодополнение с документацией;
   - peek (Go to References);
   - поиск и замена;
   - переименование;
   - diff editor;
   - merge editor;
   - inlay hints (включены `typescript.inlayHints.*`);
   - ghost text (Copilot);
   - sticky scroll;
   - цветные скобки;
   - Settings, Keybindings, страница расширения, Welcome;
   - предпросмотр Markdown;
   - терминал;
   - Quick Open;
   - уведомления;
   - панель Claude Code.
4. Скриншоты «до и после» (Nest и Darklight) на `samples/react.tsx` и `samples/README.md`.
5. `npm run package`, затем установка в VS Code автора через `code --install-extension darklight-theme-0.1.0.vsix` (выполняет агент). Тему автор включает сам через «Preferences: Color Theme», Nest остаётся установленной для сравнения. Дальше обкатка у автора: замечания исправляются, `.vsix` пересобирается и ставится заново. После подтверждения автора тема готова к публикации.

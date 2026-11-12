(() => {
  "use strict";
  const MRPC_ME = {};
  window.__mrpcActive = MRPC_ME;
  const mrpcIsMe = () => window.__mrpcActive === MRPC_ME;
  const FIXED_STYLE = "editorial";
  const DEFAULT_ORNAMENT = "star-s";
  const DEFAULT_PALETTE = "slate";
  const STORAGE_KEY_ORNAMENT = "mrpc.ornament";
  const STORAGE_KEY_PALETTE = "mrpc.palette";
  const VARIANT_BASE = { "m-window-b": "m-window", "m-lamp-b": "m-lamp-m", "n-chime-b": "n-chime-t", "z-light-b": "z-light", "z-pond-b": "z-pond-f", "g-cross-b": "g-cross-n", "n-chime-t": "n-chime", "z-pond-f": "z-pond", "g-cross": "z-obj", "moon-r": "moon-s", "y-sji-n": "y-sji", "r-stars-t": "r-stars", "m-lamp-m": "m-lamp", "x-opera-q": "x-opera-n", "f-scene-p": "f-scene", "t-forecast-p": "t-forecast", "k-daily-p": "k-daily", "k-station-p": "k-station", "x-opera-n": "x-opera", "z-light": "z-obj", "z-pond": "z-obj", "z-boat": "z-obj", "z-tt": "z-doc", "z-slate": "z-doc", "k-daily-ol": "k-daily-p", "x-opera-ol": "x-opera-q", "x-opera-c": "x-opera-q", "k-station-w": "k-station-p", "g-cross-n": "g-cross" };
  const ORNAMENT_OPTIONS = [
    ["star-s", "별", "날짜·장소가 제목"],
    ["moon-r", "달"],
    ["p-wxmove", "날씨"],
    ["n-dropcap", "큰 머리글자"],
    ["n-rubric", "색 머리글자"],
    ["f-scene-p", "시나리오"],
    ["z-slate", "슬레이트"],
    ["z-tt", "시간표"],
    ["r-stars", "별자리", "위에 그림"],
    ["r-stars-t", "망원경 별자리"],
    ["s-flower", "이달의 꽃"],
    ["s-hourglass", "모래시계"],
    ["y-sji-n", "청사초롱"],
    ["u-hanja", "승정원일기"],
    ["m-pinwheel", "바람개비"],
    ["m-window", "창문", "옆에 그림"],
    ["m-window-b", "큰 창문"],
    ["m-lamp-m", "가로등"],
    ["m-lamp-b", "큰 가로등"],
    ["n-chime-t", "풍경"],
    ["n-chime-b", "큰 풍경"],
    ["n-balloon", "열기구"],
    ["z-light", "등대"],
    ["z-light-b", "큰 등대"],
    ["z-pond-f", "개구리 연못"],
    ["z-pond-b", "큰 개구리 연못"],
    ["g-cross-n", "건널목"],
    ["g-cross-b", "큰 건널목"],
    ["t-forecast-p", "일기예보", "칸 나뉜 표"],
    ["w-score", "악보"],
    ["k-daily-p", "일력"],
    ["k-daily-ol", "옅은 일력"],
    ["k-station-p", "역명판"],
    ["k-station-w", "옅은 역명판"],
    ["x-opera-ol", "공연 표"],
    ["x-opera-c", "투명 공연 표"],
    ["v-stamp", "소인 우표", "빈티지 소품"],
    ["v-lp", "LP 슬리브"],
    ["v-scrap", "스크랩북"],
    ["v-chart", "별자리 차트"],
    ["v-board", "탑승권"],
    ["v-post", "엽서"],
    ["v-film", "필름"],
    ["v-match", "성냥갑"],
    ["v-tarot", "타로"],
    ["v-log", "관측 일지"],
    ["v-spec", "나비 표본"],
    ["v-exlib", "장서표"],
    ["v-receipt", "영수증"],
    ["v-tag", "수하물 태그"],
    ["v-key", "호텔 열쇠"],
    ["v-slide", "슬라이드 필름"],
    ["v-bookmark", "책갈피"],
  ];
  const PALETTE_OPTIONS = [
    ["cream", "크림"],
    ["sage", "세이지"],
    ["slate", "슬레이트"],
    ["rose", "로즈"],
    ["ink", "먹"],
    ["night", "밤하늘"],
    ["snow", "달빛"],
  ];
  const RAW_META = /§\s*RP\s*[|｜]\s*(?:(\d{4}|\d{2})(\d{2})(\d{2})|(\d{4}|\d{2})\s*(?:년|[.\-/])\s*(\d{1,2})\s*(?:월|[.\-/])\s*(\d{1,2})\s*일?)(?:\s*\([^()\r\n]*\))?\s*[|｜]\s*((?:[01]\d|2[0-3])\s*[:：]\s*[0-5]\d)\s*[|｜]\s*([^|｜§\r\n]+?)\s*(?:[|｜]\s*([^§\r\n]+?)\s*)?§/iu;
  const cleanupCallbacks = [];
  // 빈티지 소품 모양 스타일 (마리나라의 확장 CSS 256KB 제한 때문에 JS에서 넣음)
  const VINTAGE_CSS = "\n/* ── 빈티지 소품 모양 (v-*) ── */\n.mrpc-card.mrpc-vhide{display:none!important}\n.mrpc-vx{--sf:var(--mrpc-local-surface,#fff);--soft:var(--mrpc-local-surface-soft,#f2ead8);--tx:var(--mrpc-local-text,#1d1d1d);--mu:var(--mrpc-local-muted,#7a7a7a);--bd:var(--mrpc-local-border,#dedcd7);--ac:var(--mrpc-local-text,#1d1d1d);--ln:color-mix(in srgb,var(--mrpc-local-border,#dedcd7) 40%,var(--mrpc-local-text,#1d1d1d));--mu2:color-mix(in srgb,var(--mrpc-local-text,#1d1d1d) 72%,var(--mrpc-local-surface,#fff));--tape:color-mix(in srgb,var(--mrpc-local-surface-soft,#f2ead8) 88%,transparent);--mrpc-bfly:url(\"data:image/webp;base64,UklGRmwqAABXRUJQVlA4WAoAAAAQAAAAlQAAdwAAQUxQSEgeAAABDAVt2zAJf9jtDoSImADOih5UURcm4eCAarEyaDAx2AuxbHw4cyByo7KiAC9s1gItbJsNSdIXEaere+zGescza9u2bdu2bdu2bdu2u8dmVWbGRVdVV53q3uuImAD///+vk5L9/xofM6/ZpcMWsQ+lOw44BDsIu5WQtBtUTMSgbMokFAGLVkq6l0aWRdgglthle2d3dmZez+fzcfthZjnO8/SMiAngf2HAC3lBqTYI/w8DniQGaqTWuObBDg2g/wcCnkitXqN+mL3p7/QsH/PNiY1Il6eINLxrN9U73NuORYuoStckhlww6iQ438bTcq1TNM37pEEAIoAG6XoUNnyrCAxQseogybMsvzgQYNk1GgGTLibQ/+yJKRYq9x+ibPUre3CUt7nPXQSEluuSrO3hA4eBSReixiLfezoH0qZty/3z89KnnitzjiOfe1ZYmoD0zcEZoGJSY5GQdBUm8mIxxrH8+hf3svuT34Hhu0hq24r0BgvgK3njGgsmXYEql/wIzvBhk3VgihxPjn/poZgfVofVASIvuxjrB770HolHnx8EJp2dGOxaWpypln3Scqa1wK0i8jsLnvbB8J3I8+riHdu92PyWWYv9Cvj7hAXAOjeDkQ/7jkHHHJtaSJs/cJqbdfMVD/QvoiKsYHWSSG/UFcYoby3do7MGnXD/7/ieqHRmzHtZwe/qvhu+CZ01uWL7KSjM0zKqtwyQoLcWS7wCPVZJ7IcL95vg/u5KYJ2VULftlz7r3HNPseOLc27PYcnrJSiAH1dQRcm/RELyOkZBARyjGPaMe3L7UMQ6JQlyv/vbB9zpxx6RC6bCtGOgDgq3k6hRjM4Uz5PrUcDqN8NPYfnqqN5rvOE+4UAw6XxM2NYLh+86xo+sKc8dwnwkP/hxMJEtdfp+5qMolqcDIVTu9sQd5t592UI1kHXf+UujsKGbiPf/jSd13q7Y8viwOEOkVRrA9aEMOLX05rmLA3fdV4JCmo3th2Asl2XuFUWwolWBWgsnNhSoperDsyUY7FSCctM+5r92mBPXycslGE4uvV42Lhh5X5NlNn8zyQt+GgqIveuJV5ZaS6EFnFLtgdtFTDoPT4ZVmRkrYemlMg3QuT8fuLblss/WR4qwVGv9clEBAud5wRMdUeNQZhfiOFAGLGkF2lmE5A5ihzJgQi15D9+uypg9Y+yCSqqPxQHH1zkRAGOt6UmWgEbBQYnBsqbPAqDokkZC5+DJnXm22KGVL739Dj6xvu98v0kB4pVZc9/tdXvnwyhON8EoatzuhQTL3Fv2YBVAyez/UAb45wuh2gkEeRocYN9bt88pGqUMylcuXzfho1bniIg8i8OyXpXioi2fuAMcf5/XcBMogIOFnV9X9zFHgNVcYDBR3/njn2rfKxNHzjVXLDixcELHc+/v8HpeZubysVNOOMBV3ICVQFmoFQWUvF82T81BAZxP8YhbXnL3FxZDpUMatJQFk2oZOzPjuSiviQwoxhlek/py+6u71h4izplalotSZmAjYxVQ4KM/cQlg4dezfiNG4RDBOqCAFBMArU5I7nYfDT3GJ/UX/QbOWfv3wiO//vIc4DRuLdgYmvByIJRDYCoGQB2gJFXUkNXpFZyyoD9WlrDyySORIux0/I7zodUISRffLrYskdcAFDg0j/eu/sU5R+JPD9/VajEWTDPRskQuylEHEJ+aDlYTUBSKe7xTCfy0OVaGyCl5/7UJAam/3d0nnIxVLijNjsaLoegyb7fvvvqDOb9/2XCcWV4EFRy8ffTulQ1FmmSqWmZLkPJN7sUqqBvTuP9JEqNl4Bb9Znnrssezo57uhpUQhhQ878ugBI70wt9/uB+JVSooV2eSv5+1TeVzJbZ4cVEruXETwLL89CNTe1w64LVLn5uYjsPymIQ6gCev4xTg6Ftt3s4ySnj4XnV7bpwLaWOPk2R+HCYlev+Q+ZfdEZSl//HHNrxuou9HqEwgWG8rBnKbNX6syjzTcunw9k9vA7LGdqz/4f7TJfiWMKAoZZdIoCMSlG9RCxY2LysqAgo//FFxVSTPEr8ElXaIvpX5WQRAWbk1+/SD1As7YJWQkMzBOHu0oyyCp0VEUr7HN8NqS789DrAkxh04lkpAOhwIyksxHKgBnKL4xTgAZxT3tOA3INIucJD79RiA0rRIn3m2fd/HDhatQJARWAvXytmZHGvmhbw68/KN4SlZAM63RsN7tk55MhfFMCYQ+u9EgnJNBg6nMyYUgUEBlDPN+5WoACLdvi2F0j6c7w9TAWNI3DrKxtQ4fzizzq8hKYHgLoyxB5ZjLImzUlOkRxWK41H5HyEwYoKqakbLlPHlAMoZKiejxHkHU8DYz08lFEFUJMBLvhTaEU9a+VjSLqqzocRFLpKGIQlOxwDsq4D1k5bMfjQg3sOYmKfe1oRUhByHYlFKnwo1+8lXElWTON3WIQe4RVBQGpM3gxQraqzkZ2EdCATqbbAlrKmbugay9s6dHd359VrgxLLvZ7+3Y+fy52esXb5w0Bc7szmd6wV/FKGyos3lqjjY07pxmWoCuATw+/XPnYY/NRADsXeywaLliPRp+70eKSvghRaweoM5cMFo7MmL32LXSnbYn8Of15FQh80H0sOceSE7VUKFMIZjQS2RX0tRUArysCjhXDi8Wn5M/cNBKMZGfiFWDsapvjJWlidjWVRmmd0hHrPhnXtW/rXxq0e/mJ9R66IFpw1QUqolsHeMj4JnvjlWKVH5EUtSA6B6auQhnGrlpzsdmU3kQ/cPB6JI7tOZg9FylOaZ5xDK8eRpRr+lvNVuvgLkvrrwjW4LpywwbzUa/2CLezvcPeXPyOCe6Zu+OBJHyfzPvkilkECdfTgl8xAogGVDr1WgFE+MO4503HXmXP+wP2ps5K90MylDqB/3CFpGUC4OkwEDO5yCb2dh9fDobX8feH90/CcRufbl0b+u7PNKTjc557y+Lg4Fvxel8iEZhbF8Wqf9ARRAiYy667g6AId94V/P+/09RVVf9v0JZaDy4I9K6UAwuIo8GC3P+UwX+UMpWLHt5f1Td0RaXj87m0Rbysb+7Vos5lC2y9JFqhMYigW7690u6SiAg/lHUVXA4e5p5u82qMnCv0xaVLWMwNn5AUgJT8Zhc1kUaDTLfye1sQy1agsP7fJ9IkvKwZYZ68BBPK7EF1b4uShV9KRfApA+pQAFUEBJrk4pPQlTxPOkWfFyCWUY20/tX8pkEPHTFHXgdj9nxBF7HrLUxsGBmtyyo6u2srEKUBRAgffqVKoRlI4GBadQpZyp0QTUWnPfeJgowRTpZu8iV85W2aJoEZWWlcdjfkYL2Szzuw9bZL8b3wTUhQ0QY93ELZUKoOx5pG8Wvs+JBKpzZRWK6sQvo6AJSs7K8hhn6JZInygfSDBF+p8chZVQlkl3x9qJMu/URi3qIOd/5u/sC717vzJrpMWB2fVXfObjw97IRcHyhojs2zccfwXRqojUzMDh2HLdoM8KUcCRPnzs/e/vQVFOTz1NeEXoFp9JEkyRV6dsRCgm1LXuVkw5hajl2Nm3rvOHGqhjqc9/bjwXyB3eNaVG08BOkivL7r13IrkHiI2iSkH5DUvi6a8+OJ2Q6Of/uCBBcxp1SoeV/bF8Kl5IzveDqSv12xkEQG2RvCrHj7wQLTw2R47TvbX3Fva07H6JSMgTuXPz4p0JyRUc22HVCclIDKBAcXmsLEGVai2b5dzvgTIDIyTF4wLfglCsT3ZbkcB1bjT/qmWZ3IMZ6/rH6+/E/+ilQZL0hhXFeYXJDDhUDddUKyi3oSSqQ61NADRuEtQxtqYMjJptvdLQwZISuCHbFi3SNz2tnbDV1LzPiKYnIn0kqHT/feL17xKPOri/6X3DX1x01JDcMvWODThwvBOkOgGpnYMmEItz5uqcoobnRVbC+nsrKGsvQeRt3wYDZbFkZwyR+f7K/jJ8fJxjVwZMudLHukf3pRPx4xHgKxmC0WTPyB0JSlt3pCood3tS5PT7oyvPIP00SY3Nn9m6eS5sHFTK8eYEGfTL3HVQjM18JzwJyViwTJ+Jv79tMNWbgo9z0QJzMgKg8Z8f2a/WKYSdu+/xY6rg9PeGqskSs5MkgaL9fjWqT/x7xOTdOeGdYFgUvHi7Ze7TRWw3rWMT/6mviLGRb4MXlCbFa2dG0z5xPo9JinyOJbk5vnXZL78dghNRAD2eY83fYADLnihVNk70QoJSrSrK7knP5vf7pt2wPJS/GqWWOTbOclyJBQ71CzBjq2QwwWCNee7g/lN5RpnXQOTuEus2LVvtyP3hs2uCIlL3uVfrfZ2zbEOM3COQu90HlMWoVEu07jm3AKrJqnUc2nautPohL8b+HsVYDMZPxZT3Zw+XwPpf1xOSV7EAqh+KNFkLxL86CqPOFREJBIIinVZseeDxzs/HKrPXj60lg45pRSS/EULVRfq8ilOSqhIrTAecw1Vx8EaROnsdiQqapFtQx9p+Gt109w9BQhnqVMHFuqWOKiGx7Ltht4mEAiJBT4LyIKU7VlUU+iXxwjk/zR6+iZj2FSNCgbdxNglEl5XmxSwYY6OO+O/jHy3FKUldwd/so9rw/V8N8O7nqoGrI9YpB2eyudZEWNh9DW7vxKF9x7aU+vWDIoFaPX+NZx2ZyZlaFognMSAqL4EFJfO0s2DUjwFFGifR2SQKnn3QQh3r+WnLrTnxPLpLH4wquRPiv9RcvvBe6b4fR+KJP09VrPvqgXXZuvg/UXCU7uKH5ifxHbZdyCNOCUrPNFAIV1IUPlVJ8WMjvrzv/JvbDpo0Kz0MOABd93PmdxEs94//N9sfH0aDHepA7e4T11017nI5byuWZPBXwaadUPLCLNS6g1OuukekT7Ya84b8H1bC6XPTDOBQtnWQNzMkyWu06Dczn4jGKtlTpKd4QeSGfCzKkf8sQgE1BVNnnGTvNeMu+MgVZhxe/P2G1QeL+43p/wWJFQa7dvq3i4d8crjS6vphswakRoMJ63rqSKrYyFNSIyU1xfM8EZEGk6Ds2uXYdRsrYs0HGp58/7iJ4SqOkTRiIM6OgT+n2RWfNhQJnNPg2m6NL7zwtnta12x95VgcZxgH+mGxIIEzHYtVE3eOHSP6BCR5IDUk8mSExe+WUVYBxYobIg+X3pIZd5EkzgFE86aPebz3Pb0klOpJ9XeOaX3ZH9ZtezE/HLOKr85FqRqMxIIou+RhT2upJemGVx8ZUE/ObpAqEkyVrnML1vaY4quq7xz+txfcJPc7R/UZEx5p0f7qJg3qXd6qroik3HpFY2l0y4Mt7nnw7OnEmfqaQdH8iZXAqSWNEYHyr2VYzVt6JII1lsIirpdNByffcoUknvPBO3VGYFyeAWXXOcEmERTwowffu/HS2177MRwnXGr5/J2vv9xL2uk/8iH248i11pCoVmOfn5zxrZtwnkQexHstrLG8guOAus1z9dtpNvuBz+Ir7ni2tUjNVz96tpDkhlNrDgA4ttzcsPGXeRiSKjmngX0GStWRVA1qSZqW2kokIHER9OQhC1CVYx3+ttzytAINH9wIfNy4johI1xVFSXBUH8/aasGqoiioqzLGFlm1FtQaP6ZgItivTzLzBFvOD3oSfSAkqzCqRQcr8jnx+urRLcrJ37T9eAS/dM0bzz4x4qmXX1xeoj6gziVLtICWOygMg68kumi5Rfk7zeWNu6rFxpPyDu27Ox6QfwDGpknigFPCY7fO/mn95mXh01vyt1i/mKSxkrgznLk6a40ti1qFuHGa9ndEFSp276sEfKNHx428QK6WZoyTT+8ST/6JyrOeoErEQXQJvx4tKiiJuWM+WBstza7if9rEY05JevTEHEeicobHVlxxyTSO1p7+VSMJ/iNkkbZMgRKLcVEfIFYFqEK0pNw3/406sKt+3nEawFin8ZjBVyIVaBJlxzYF9uxB6T6VrMskWAMYR6aWap1aiir9KhRnQFXBVcWdPQNQoj9NfPuhB95e5kiM4oCqHCWpcyOld//VsQNYKi8aCdsuDkoNBNnHzwDl4LGIJVGdBQ69fE27bKpX9h3Akbj4yfbXDJu0Z+9+n0qDRsIUnbQOwM0UeapXaucC7IjQFngglKsB0YGXanVqyTOogjog67d3G4l0ZetKNIljRedS1NgTB4FVbw4cMPTOv9Q51fkHiVaCb+LHLEtuEpGn/LgWd7mywt0hqMbHoL3iJaoOcOA48kYlKLj0ieeLSLDx0RUNZSU2QTH1XsyMofu63PP2Gh8gE3wgYmd1u+rX57Mg7Mrf6ZzqPbgJlOIZEbv57bWJXhjZ6q4SwFnM22XE98eKrDK1Wy2RYI1A3VUs3tN0WrlTUFcUHiY1elYpuRO61JbGgxamdV166L15VaWgSx9uJf8e/3mec9PF886p3XcHluQPLiYalyd9qHJQWg4cuEGufyWC7otX3iYiXjAkDVbgo9en+6qKUjR671iRJVjg4Mf1RWoEg7WEBRfa7cK7P59K1js/fZIHfCZJ1wC/D8r18345Ia6gdCetBPy47nr6X+LJheXO7LSTJRgMeiJttnCcjC4XV6CgWEbVXzVUOhRbdH+fKZ+N7S0i4hlF+966BMgq+G47y3qkBLtOKSw6MUwGV5kZ/kMvkahCocvD1gHELxWRmn2OoQr3pqQGROo+U87Tdfcslpc4Yj85gqKa2/PL2rJDTxXbfXc0vGbZhmeuqi/t1QSpubSCkoKh0224m3QohzF15SlKd0/99+MWogqKyEIsoPrtsE8+3wYKecXDRKTTmwdgtMg07fyy/uWvfOAEipJ2g3fZXvIjQNZztW79Y+Wab7bqM6g5R9FL/gCwlX8OGk9UT8l5Vceaps7XR4k6KNd+sakMdUq1DiAez5nc46OdR+E9SQ38wIaXGbWKnV9FnWIpvnTisOyfw6rDHo4eH/Po5bU77z/ffmcNx3p0u6WLjNPSPBxgfVWGvcAeT2IPSPNiztAaBxhFAd57aExe+DkJejJb8ztNlsmW9M9wYFjZZf7uV75CZ9c9bxbkvRoCMC77Kb/i2VrpcKyi6nAOgAOr0QskJxKTyhWHiTvgj2wUZWS//m1vKC+uQhe2khtghKQEPBlNeZ9PL/yVMuZ8igEYN4QJN6sjPrPpvXPg0I5gQQ73Sr9f6AW36ecyjvWcsuKDHFRx7ttU1KIKzscAlE7/GwW9XqRrmlZuJ6O2XJYbfTwQCkhQOlbl3Tbnt5Mn8HluIoYTR3hyxubAbxhKli6+/20ff2wkCM8pc0UWlj06asK2jAYiV25Ta6yyYz2QeJRLK60qyuEooFSc03HDabDHOV7X+4lHRAFl2TlFl48ufe9ZzBcH7vwGV1xuj2xdJqO0hIwurV6tvZkoZZMvC765J24YExqGLe0yihuk5lnLfAV1ZE9sjkYj1C/BkugcgJuUQ6UDKBqfxjMSAggc6cfP/9eke6/D7X3sZJN0ks6S1/h5A5H7UuTRSgwc3UOJTyEDr6EAGzE7mkhvCI9/qut+V/DJLUgsiAyJkKhUHwdQLIyQUEAAY6fsZH2pLxe/MJiBU7Y3P+Uoz3F7gv+KrGuUj13+jDT/0kzdTdlK+PHSds16hcviYJmdet3JkZ1E7oq6ZE66GxYNIv+5fbxTqndU778uQREUVBZIwucGxDurk2Tnn5U5biJ+ea5dGZTZEWlTxo1TvxXJG1t/6J+vPzHyiVoiMtxZp/hkFPr9ROql49x9u6g8kQZFaDWqc4cVooDTOwOhQGgBROo4KMuqLSky4nu5j0X/Xt+HxAO1Ao8ztHMFj0rzkDf4+NaWTXfN8yQY8u7aiYIj6bYeF8bhx2+u7IVEJJ534RlYvpaXIpqg9qZQijw74wxyrJf4t6khufFQO5EVfBOQh9cqv3cLyAXl22eiB5uIlyJtiFwg/cfWkxT5kPcHPFeQPScHrGJWG76tbyDykDynhuTKX/NJ7rSn1Lh4r/uu7POXz777jpRr2ZJaw3vKMSNV5IZHRQKejHUZOAruEpGPLV9f0f9KCXqX73KPt+v3ZNXGix+zqANKLkVM4vJkOtUlWrVVFhyrPtuV65L8Pze7+/uX1JEeP3YWkdeIMdALiQSCEgy0iRyLAYz7zzhcnEoy2wXlHnyqWP/owZ3Sc706a2y8DyrEHZCV1p6BM1apIHnRzRUkFvZ8JjK5+665+X/0nZKD6XtWIKAGoDyaXUTG/DEbwVqjGL6Uy9c6o8SLvr5oWENpUEVi/LaeKrFtQrW6xA3Zf4RRjL/1V45POMXMxjKJWAWJFut3kKAUF6lRjs1t3nWv+iSWjzo/8DWKKsr34jX5Rou2FeUt/HjfA7HY7phbjqIKquQtfUtqP1uiCvEc/E6X5Q++/KmUhZzEOWwuwLwzQIP9iwwznsbnQC7hvMIuIq/ZCgDrIm3lfRgdPD9l2okrP2hGokocVuEoKcTh61aR2otJbtx38sfXsnOLfFE0Qa3VLQ0G5u0tjv5bgiUIykJc9OxF6J1tY0QoeDn4cHp6VlEcjOZ362C1pwSeMLgfhEXmhWQczlooAH/pi79gNInj4T50r8mzKX7eNuPz7dnSOKPZdpYEz8ALPESMz+v/xTdnN3mzwsGejV/8vX30/vIyLHnLlbSzhwJJ9lc/JK5A4LJSFPjzq8VhAAfOkljp9PtX3A+DcOCHPxYvbZ78rfQQKyFBbyWG7tfCsZE1emBjUdSnKlLebzWJjlFzXHjClCTdGI3LC16vCtgJpdesxjeORE2o3rHjrRt3jQgEBzUJZcDjEkoFAhdMVt2d0mkNHJIx5HcrwJSzMe3T1HvC+Kg7mc9Budb9Diwy+RSrzip8+AhOUaILF6EKCqpYYxkqgzIv9ESkxn7CzUVLiSfNo5ZFlzVqe8eAYC9s22brqFSTuayWdNuFtQaYExx0+s+Xo1Epm81KLYDVjbIRCy7Sp+4RKkmqFJ5SJnWsbC3SukHDF/6xULbm3vI8JvP2S1OlfTn7G1yajoPDjwfkvE1A/CirBbp3I27jPk8I711eoeQ3mJ3EPCpXHaN6VTg5r7jR8MXPC43/ZheKlcfyP7sB7JFlW+Mus4NcOso6YLzI5beO+a7L/fA+OWI3Vp9SWNmmhszDMOEwihL7dESo6YCVVYofIalS/glFdcXu8EnNSFkITc9j1AE4BkuKyFRWFsDPq06+LSLfqc+BmESGsMjyIp58gFGqj9/zmAyOOMVXUAvE0/m1Poe6/1ZPRwPNB3EoqGWiBL1Qo+3/uS7bAnwtNU5g+a8f0SEgwZBMweI0mS3P0qYtVquLgFFQc18GJ82Lvb/Nkj2wjqBcVYClKteo4/pAqie1z5EH8a36jHvYRHzrRxGiQ1XEk+8wnPkL8gtpN/0SJla+HPNxYfkuej7p2S0YHTfpEcHtnR1Ww3RJeuHvWECBgXNdtjMWX/uQfFiNakJMMx7MY5jIA9/t/qVGJqDYAndfSrQCeHLdCZI6Xuz7wZ3NRh5FSXSWXk/SOi9SK2OSKWCtVRJHp4pIvYZn+zO2WhLzZyNUNCQ3n6xY+nE5SmIM1LoEDO/Vz52Rq513k3EqC8ChqhrfNf7XGZdKjbseOsL2Bz6P/7oCQoWNvvOyWrFDnUWxChgFlAM1rzw51M7oJJUHDv3l3n1oOlZBSSzuLr3nHBnQVaRFE0rFFTgBi8JxaxRdmkGiErtCateT57Aof80B/4vL5QfAsfj7cmDrs6eKCno0qO0JShVFpXc2StahqV9jNDvQ+NlDOFTttYFczQTlNhRQrA/6i7xdphxvJG1eXR4GDhTxax3xhOoGRmJfDEgDGa8cri9tTqiC416xGmofVeUM35D74QFJvOjFCs0uY18tCVBlkwepuuySD78cd2uvA67rD6D80wJS+xQJ+vf0Xh/vIn7fJEqvnzJ/3S8vifQ1YLhLvGopV1SSVfrNmCPszKaY5OpuFa2h+qdRHOtrikjofYDIPoDY8y1kGQ4+l1C1hLpZwEuSsg0Utg6xqBI+T6SG6hxHMbwjqV5IZBUxwPeNr1RedmmOObjyNglWC4Jb8aseCEmPtRFsuKNMwzp2pAZqB+NGL3iWrC0GqsO/8yRJvP2cbHvGThxMjMrNafY8IshSbX4w+hXGskQC1G5gH088yfYlAMKAK9197DdvfT/H08kXTPa9qIvAWMX9UVVE2Xdr6ngLZ5gpwRpSRs5yL/j5RVA44cGtG3PSsOjV7l5IDyFEAHrQpNZ6BBTEeMRZn7ckVENI+CxNk2wvrB2ilD5xgrvvGIkwcluKqomGtRijr/6zjDN9dvpfP6QImJoIosa8B/360wAkCowyBRuWgeWxf5ZI80/up6J0XKFff6JVK9W+3i033lVbArWE0HjraYhUAAkg0XTQk/8PhSqKUKMBz/P+BwBWUDgg/gsAAPAwAJ0BKpYAeAA+bS6SRqQioaEs1A0ogA2JZT6fCFPBQJnLyH1orRz9R9AH8+/tvXUeiAORqDJsxX/3OBjfBelr/FbrLnlvR95IHWAfth7AH6Z9ZP/bP+x+0Xs5//b2AP//rt34AfqBwi2IJvPtN/f8zex35zs1mTx/xfCu+6/6z2AP43/S/+r6wmff619gX+Sf0//l9jT9wPYv/V4m7jiX+T/dTb1aoWA+wrF4BqzSrCM8MvEtzGJt7K9t0w3RFQ4wNOlKD1PRK1EZCqfnVuGXFvI+6Msc7aPgaOv75aCN0XYWy9bNcLAERWp16/UPgOSMK3G318ucd0fBgLLNGpJXEY4t0HFBS2J4C/J+wF8Sz0/aLL/5nSX+CU9/cFbx1Teus2yryC9OxrH+5qpeHZF708C7GUFT+Kj8Hr7nrDWF1CsT1j9BXqfhB25amJHdpAuQkfbZhtUNnrfw6xUaPBhszenr0842C6w2UNbTr2xSzNkGDOhE4i6Nbp2Hhtj5Rlf1l8VJW+jvYjeuQZ4z/gAA/vrAJ34r8FRKxAhaoiRMi1QV5nmH9+MYAx67VL9ue/vPnR6mqYwx7/HR//6v0LjcuG+evdLkkeJPF6TnhwwlWT+uaBweQu0tIr/+sEjuABFf1NotgMHK9Fxo8eN3Zje5j7oBM16ioeM5nOpcNKCc9bxHTZ8H7FmT+EX2pzqh/KcB/p1zMhgE95qDEZ0+hfuqZVr8lZmn0YL+RhiZ41A3cFfsUpHz4h1rRA8lcxwhSERyLEEIa+ZD8fbIj0biZy5xQdZk1C8+ec9jokuUzfxhEu/uQj/gFvd+9hgH7XcXJa+6y235j9+9t3/38zki8Huv6n4qbif+6zYkOkeRY5MdTXv0OPUXBE+BKv6RHu1qCoKX5A+4HNag9zUy97RbyDk/5ifvcooVSd4stFXbChtqWTAENDaUz/sR5DwPbZtxxFn+IspC4jZVLs1y1yQK1VTpqyadU2DM/TUc4kYRGDyYgfPN00liribFJj6wBOYxQbd8I/7To4vh+s13LUYuVVze5oCH2CWFM1nBFuP67eb9oR2j407w+aMhKYeLcAvvu/W5BDorThXj1oXe3dzi3eIul8V0aDs0UHtPwnHPhMW6onv9aX+NgiCXjL2ouw6jp1/900tIoXH12YjpWsHPlHqphWmpaxBBzoZUImScD5ya7Baoa3JBwM90NRCO2+DEbsJSTSNL0S0NMcNcFF9OsGutmQt3uuay4+oYEMLdiF504VXYlLieDIKMzAlGDqWqEUcbg5bondlmaPDOOyZIl4H96OY104tYsd364Xqn6zoMpuh6+vfYZUxAF9EecWIUrmfI0ub+GXol/IG20J62Zr/SNhXMkXpMmdxvI8Rrl72D47Q3LFkYmbdSrP2y4qxzEoDvQ3lIweyHOTz0v1v/Z9F/EXZJrji1I/j1wMX3uIKFEwlO35uyqL44fJ+vnBxG2fOUD59mKlrkngqWJQ7zc9SlGE9OF8cAbNKZ5/Dc3L6j/1y8fh1Ruq6UrPx/mJ9GXgKH/eOjV5Twbh4GIzxw6wUUj1qp9aD9XGvFdikOsLQAqIrlKidifSkKkjDuxSg0p6FsQx8ftkDgOKpT/o1/u0sdVAZIgaPuamXe4k5mZK7Q1BEzsqlz89P7J38IJEbWma3cHbhK452kT8o5hqEN18/aTA/+go7yNMvM1QcS3SE/+0EvWuU0IlRF1aVig/NquHz9J3sbb0w6Zh8jNTq6u2PdLUcdYF/8Esxs6iBETSudfpYRfRweCX5uh8vEYTpe5WTY8HsZ+exIaulT6Z/oAI1aHo6QkIFwvYjI+pYNN19lf7NPCqpB/jFGVz/DjJsmDWO8pNtRkYqywbKuEFpX/yx+cT903V0yP57EObDfC7BcZy57Hgxl/Wjkl9trmy6kBwzhu/6hcWL//aFEGUYoyFpM35Kmx+qtOQBqQOX2/7wWn7vltN3d+FYRsqZUJGIe5sCaBdfFKCgIUDZ7LL9OMoN4/UjcdjLFox1KdP0cmpp6XAfv9lV0vsPTKdQzxH/nJtzzPMR2D4g4Z4T0YEZryDQzAwdUoo2NRbwfoeCIee97lwJR4I2L4wmuKOpSH/7VWT9f8vokzLmD4f29hM7IVpMsjDJaJhVl87LsKv8KftHmi8Sscf3RzZ1MyyQOjAMJHEc+sQoNk+OPKNvtcOkG/KP1ABDVfYs7TGRWCYp+udR5KOZ//yFGB/8K5JG29j8RYH1kjET0jQ+0cdhZ/6BV9u3TeD0VJXgW/uq2NPyIRqkYnul/Xk6PsgSTl5wS/IBcdxUuYxIaAhoKHXrdioCZ24kLIPzirRvpySbOle+tx9xQ8zWX/sXR7yOmddLA/uVkiO95N2HwH0wzlv072NCt5DRpt/Z8cR/0fqyrlV8wbe1iy4Ys/eze6EukM+febJfmOREnwABA/DahlBYE724jmaKA+vmwP92ISowDo7IBcdJgUEep4m6Q/JpEiZwkVwyooMUg8Tnt9+KBgzefjhUmLCm1qqy7DGfVPERalUMex8YmXjH8+cPQXQ5X9hLhpzaO/nbdu7TcLSq74970zmLpqxtwm0ccSqH+BSOFv0yBzlv+JiBfjoWFQUmAywvwEeZncb6jLOBrvF9lHOYXYKyc4qTaIc773tZDQwHJLsM4GcHnps2To2BesQBcpoSs6xUiuQEWmJ0yADc376PK58RZ2K93knKM7UxgATytXy/o4xDewTrgUOMMc2Ko7PiJ4kuIULN06TnIe9CgiZ3dd69l4cDqc9JaX0nJFQd9oAl4kvXkx84+UfxPt0ShrIp2gfc2rFjR9X8afkgMVgxUBlRkwH/pennVmMGSGnPOGH56cGOUfu09DrSOtPXGkMvNs6p+0klvpR9pgbxRtdRjS6s5YoM3NwJaw2QaccfTCbVEwC7dQha1cNMo6moZOAeGjy+aUILZSWqFCWvy7zJrxCR7QTHKZjlnZfyJg21Sl7acT+GXc9oHPnYo+MHHB3c368r66gOI8TPuQdxsJWUv6xgwL1izaRYwcStql+5SAiudkfoqs34HFFVpAWVQND5GHS/BuqfZc+KmZ2D4oxsl1hx3+IuQ9ea0gmgkA6skJW4j1D7vx01HQ3oc67hLbVXm29JmBMB1STRsl8Px6q6Q74sNnWX8VQLMGW4xMBJdQGVmhBIbmVBqHAc2LUJk+JFzghuvRv6JMqjgyq81sxraEJMFzPaHcQ2C/gb5r/s8Hp454UXD8UGcwCFG9yf7GqvVICu8EmPcXDRWhuQ/Fvu6EvI8V/LXu+8iWSfXAY+n9KpFn39leTzKZHjHxzEJYntcJ6lY9EKBeGyA2ocxulLU2VE2iEgQvg/ftR58tJXHSHTT719/8sjxN6sNYTjJFH64AAlCPs+J4P2QoXx9SpmjRXWyQby0A7ljRTMGv2CiA220Cic8UTreqRRZMiBD2veQWeL0Div8lYEQZ2JkA8IAZyjr/XnQeE78KQW9mFa3bOyn+QYM4sSqceqpzNQXFx1j3fN0PnLr8MhVsJdwMW/LZzQijnQ0lfga4ID5ppbhdmmWbUL+2jWtMCsqHl11weZYhA3v/4iOjaDmDR4BIWo5cSsw4ivnfXlc4Vr/0t1KtZI4Kk8FHKzknhQm6+12xCaAm9N6cJcLUo6yD8harNPV6wXYyq8dvfoAUAR9bIQwud5mv1S7LGlZpdb9pc9dtcnNCzXEdQVbqJC1gCHde01Ex7vx8xIQXzCyX4CCxeqpf1oB8ie0+ko9EMMTxQv2fbs8qfzhKKRNuK+DsOQAwypy1k0mb0pNn2qOV0ZkuemUIOQc+sOoeEXZiXJQb3KclqXy1skvoauKS6taXbwfxm6dBZWvlCsOzdJVL/YLyB3D7DfMpsbik5irnEU4U2P7qyt3wmM5IKAHj5WB4APo+dbsyFUqT79vIuFRaby4qIIAFvfvqzp9cuKdzlYUUNa3uP9hvDHR1ctPkQ9KoPCRAbD/e0QCevJgcye7+IDjosU+Emlm972jst2U0yq/lJzNmQEgcnlhC1kptwmyNTL2xgrGQ9f5aTr8f/ysi03gVvxJLYUeOm6ICCCUSsewQRQpWpgAAAA=\");\n display:block!important;box-sizing:border-box;width:100%;max-width:32em;margin-left:auto;margin-right:auto;color:var(--tx);font-family:\"Gowun Batang\",\"Nanum Myeongjo\",serif;font-size:15px;line-height:1.7;font-weight:400;text-align:left;white-space:normal;word-break:keep-all;overflow-wrap:anywhere;letter-spacing:normal;text-indent:0}\n.mrpc-vx *,.mrpc-vx *::before,.mrpc-vx *::after{box-sizing:border-box}\n.mrpc-vx b{color:inherit;font-weight:700}\n.mrpc-vx [hidden]{display:none!important}\n.mrpc-vx svg{display:block}\n.mrpc-vx table{border-spacing:0}\n.mrpc-vv{margin-top:8px;margin-bottom:6px;cursor:pointer;-webkit-tap-highlight-color:transparent}\n.mrpc-cast.mrpc-vx{margin-top:12px;margin-bottom:18px;font-size:15px}\n.mrpc-cast.mrpc-vx .chips{display:flex!important;flex-wrap:wrap;justify-content:center;gap:8px;align-items:center}\n.mrpc-cast.mrpc-vx .panels{display:block}\n.mrpc-cast.mrpc-vx .vpanel{display:block}\n:where(.mrpc-cast.mrpc-vx) button.mrpc-cast-chip{appearance:none;-webkit-appearance:none;border:0;background:none;padding:0;border-radius:0;margin:0;font:inherit;font-size:.86em;line-height:1.7;color:var(--tx);cursor:pointer;-webkit-tap-highlight-color:transparent;text-align:left}\n:where(.mrpc-cast.mrpc-vx) button.mrpc-cast-chip:focus-visible{outline:2px solid var(--tx);outline-offset:2px}\n.mrpc-cast.mrpc-vx button.stw{background:none;border:0;padding:0}\n.mrpc-cast.mrpc-vx .vpanel{animation:mrpc-cast-in .22s ease-out}\n@media (prefers-reduced-motion:reduce){.mrpc-cast.mrpc-vx .vpanel{animation:none}}\n.mrpc-vx .k{color:var(--ac);white-space:nowrap}\n.mrpc-vx .mono{font-family:\"Courier Prime\",\"Gowun Batang\",monospace}\n.mrpc-vx .lb{font:700 9px/1.95 \"Courier Prime\",monospace;letter-spacing:.1em;color:var(--mu);white-space:nowrap}\n.mrpc-vx .row{display:grid;grid-template-columns:2.5em minmax(0,1fr);gap:.4em}\n.mrpc-vx .fields{font-size:.9em;line-height:1.6}\n.mrpc-vx .mk{display:inline-block;font:700 8.5px/1.4 \"Courier Prime\",monospace;letter-spacing:.2em;color:var(--mu)}\n.mrpc-vx .ser{font-family:\"Cormorant Garamond\",\"Gowun Batang\",serif}\n.mrpc-vx .tw{font-family:\"Courier Prime\",\"Gowun Batang\",monospace}\n.mrpc-vx .bfi{display:inline-block;-webkit-mask:var(--mrpc-bfly) center/contain no-repeat;mask:var(--mrpc-bfly) center/contain no-repeat;background:currentColor;aspect-ratio:150/120;translate:-4.5% 0}\n/* v-stamp */\n.mrpc-vx.mrpc-v-stamp .stw{display:inline-block;filter:drop-shadow(0 0 .6px var(--ln)) drop-shadow(0 0 .6px var(--ln)) drop-shadow(0 1px 1px rgba(0,0,0,.12))}\n.mrpc-vx.mrpc-v-stamp .st{position:relative;display:inline-block;padding:4px;background:var(--sf);font-size:.86em;-webkit-mask:linear-gradient(#000 0 0) content-box,radial-gradient(circle 2.4px at 50% 0,#0000 95%,#000) top/8px 4px round no-repeat,radial-gradient(circle 2.4px at 50% 100%,#0000 95%,#000) bottom/8px 4px round no-repeat,radial-gradient(circle 2.4px at 0 50%,#0000 95%,#000) left/4px 8px no-repeat round,radial-gradient(circle 2.4px at 100% 50%,#0000 95%,#000) right/4px 8px no-repeat round}\n.mrpc-vx.mrpc-v-stamp .st>span.i{display:inline-flex;align-items:center;gap:.35em;padding:4px 10px;border:1px dashed var(--bd)}\n.mrpc-vx.mrpc-v-stamp .st b{font-weight:700;letter-spacing:.03em}\n.mrpc-vx.mrpc-v-stamp .on>.st{background:var(--tx);color:var(--sf)}\n.mrpc-vx.mrpc-v-stamp .on>.st>span.i{border-color:var(--mu2)}\n.mrpc-vx.mrpc-v-stamp .on>.st .k{color:var(--soft)}\n.mrpc-vx.mrpc-v-stamp .stpw{margin:12px 2px 0;filter:drop-shadow(0 0 .6px var(--ln)) drop-shadow(0 0 .6px var(--ln)) drop-shadow(0 1px 2px rgba(0,0,0,.12))}\n.mrpc-vx.mrpc-v-stamp .stp{position:relative;padding:5px;background:var(--sf);-webkit-mask:linear-gradient(#000 0 0) content-box,radial-gradient(circle 3px at 50% 0,#0000 95%,#000) top/10px 5px round no-repeat,radial-gradient(circle 3px at 50% 100%,#0000 95%,#000) bottom/10px 5px round no-repeat,radial-gradient(circle 3px at 0 50%,#0000 95%,#000) left/5px 10px no-repeat round,radial-gradient(circle 3px at 100% 50%,#0000 95%,#000) right/5px 10px no-repeat round}\n.mrpc-vx.mrpc-v-stamp .stp .in{position:relative;display:grid;grid-template-columns:5.6em minmax(0,1fr);gap:12px;padding:12px 14px;margin:4px;border:1px solid var(--ln);background:var(--sf)}\n.mrpc-vx.mrpc-v-stamp .pm{position:relative;width:5.4em;height:5.4em;border:1.5px solid var(--ac);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--ac);transform:rotate(-8deg);align-self:center}\n.mrpc-vx.mrpc-v-stamp .pm::before{content:\"\";position:absolute;inset:3px;border:1px solid var(--ac);border-radius:50%;opacity:.6}\n.mrpc-vx.mrpc-v-stamp .pm b{font-size:.98em;color:var(--tx)}\n.mrpc-vx.mrpc-v-stamp .pm span{font:700 8px \"Courier Prime\",monospace;letter-spacing:.12em}\n.mrpc-vx.mrpc-v-stamp .wave{position:absolute;left:4.2em;top:50%;margin-top:-13px;width:44px;opacity:.55;color:var(--ac)}\n.mrpc-vx.mrpc-v-stamp .bf{position:absolute;right:12px;bottom:8px;width:26px;color:var(--ac);opacity:.7}\n.mrpc-vx.mrpc-v-stamp .val{font-size:.95em;color:var(--mu2);letter-spacing:.06em}\n.mrpc-vx.mrpc-v-stamp .c1w{margin:4px 0 0;filter:drop-shadow(0 0 .6px var(--ln)) drop-shadow(0 0 .6px var(--ln)) drop-shadow(0 1px 2px rgba(0,0,0,.14))}\n.mrpc-vx.mrpc-v-stamp .c1{position:relative;padding:6px;background:var(--sf);-webkit-mask:linear-gradient(#000 0 0) content-box,radial-gradient(circle 3.4px at 50% 0,#0000 95%,#000) top/12px 6px round no-repeat,radial-gradient(circle 3.4px at 50% 100%,#0000 95%,#000) bottom/12px 6px round no-repeat,radial-gradient(circle 3.4px at 0 50%,#0000 95%,#000) left/6px 12px no-repeat round,radial-gradient(circle 3.4px at 100% 50%,#0000 95%,#000) right/6px 12px no-repeat round}\n.mrpc-vx.mrpc-v-stamp .c1 .in{position:relative;display:grid;grid-template-columns:6.2em minmax(0,1fr);gap:14px;margin:4px;padding:14px 16px 12px;border:1px solid var(--ln)}\n.mrpc-vx.mrpc-v-stamp .c1 .art{border:1px solid var(--bd);background:var(--soft);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:10px 4px;color:var(--ac)}\n.mrpc-vx.mrpc-v-stamp .c1 .art svg{width:46px}\n.mrpc-vx.mrpc-v-stamp .c1 .art span{font:700 9px \"Courier Prime\",monospace;letter-spacing:.16em;color:var(--mu)}\n.mrpc-vx.mrpc-v-stamp .c1 .dt{font:700 1.9em/1 \"Cormorant Garamond\",serif;letter-spacing:.04em}\n.mrpc-vx.mrpc-v-stamp .c1 .dt small{font:700 .5em \"Gowun Batang\",serif;margin-left:.3em}\n.mrpc-vx.mrpc-v-stamp .c1 .tm{font:700 12px \"Courier Prime\",monospace;letter-spacing:.18em;color:var(--mu);margin:6px 0 2px}\n.mrpc-vx.mrpc-v-stamp .c1 .pl{font-size:1.08em;font-weight:700}\n.mrpc-vx.mrpc-v-stamp .c1 .val{position:absolute;right:14px;bottom:10px;font:600 italic 15px \"Cormorant Garamond\",serif;color:var(--ac)}\n.mrpc-vx.mrpc-v-stamp .c1 .pm2{position:absolute;right:-6px;top:-12px;width:4.6em;height:4.6em;border:1.5px solid var(--ac);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--ac);transform:rotate(12deg);opacity:.75;font:700 8px \"Courier Prime\",monospace;letter-spacing:.12em;line-height:1.5;text-align:center}\n.mrpc-vx.mrpc-v-stamp .c1 .pm2::before{content:\"\";position:absolute;inset:3px;border:1px solid var(--ac);border-radius:50%;opacity:.6}\n.mrpc-vx.mrpc-v-stamp .c1 .pm2 b{font:700 11px \"Gowun Batang\",serif;letter-spacing:.05em}\n.mrpc-vx.mrpc-v-stamp .c1 .wv{position:absolute;right:52px;top:6px;width:64px;color:var(--ac);opacity:.45}\n.mrpc-vx.mrpc-v-stamp .c1 .art{background:var(--sf)!important;border:1px solid var(--tx)!important;gap:8px!important}\n.mrpc-vx.mrpc-v-stamp .c1 .art .bfi{width:58px;color:var(--tx)}\n.mrpc-vx.mrpc-v-stamp .c1 .art span{margin-top:2px}\n.mrpc-vx.mrpc-v-stamp .bf.bfi{position:absolute;right:12px;bottom:8px;width:34px;color:var(--ac);opacity:.8}\n/* v-lp */\n.mrpc-vx.mrpc-v-lp .lp{display:inline-flex;align-items:center;gap:.5em;padding:.3em .9em .3em .35em;border:1px solid var(--ln);border-radius:999px;background:var(--sf);font-size:.86em}\n.mrpc-vx.mrpc-v-lp .disc{flex:none;border-radius:50%;background:radial-gradient(circle,var(--soft) 0 17%,#141210 18% 21%,#1d1a17 22% 100%);position:relative;overflow:hidden}\n.mrpc-vx.mrpc-v-lp .disc::after{content:\"\";position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 25deg,#0000 0 14deg,rgba(255,255,255,.75) 15deg 17deg,#0000 18deg 22deg,rgba(255,255,255,.45) 23deg 24deg,#0000 25deg 194deg,rgba(255,255,255,.7) 195deg 197deg,#0000 198deg 201deg,rgba(255,255,255,.4) 202deg 203deg,#0000 204deg);-webkit-mask:radial-gradient(circle,#0000 0 30%,#000 31% 92%,#0000 93%)}\n.mrpc-vx.mrpc-v-lp .disc.s{width:1.7em;height:1.7em}\n.mrpc-vx.mrpc-v-lp .lp.on{background:var(--tx);color:var(--sf);border-color:var(--tx)}\n.mrpc-vx.mrpc-v-lp .lp.on .k{color:var(--soft)}\n.mrpc-vx.mrpc-v-lp .lpw{position:relative;margin:12px 0 0}\n.mrpc-vx.mrpc-v-lp .lpw>.disc.b{position:absolute;left:0;top:50%;width:92px;height:92px;margin-top:-46px}\n.mrpc-vx.mrpc-v-lp .sleeve{position:relative;margin:0 0 0 46px;padding:14px 16px 14px 20px;background:var(--sf);border:1px solid var(--ln);border-radius:4px}\n.mrpc-vx.mrpc-v-lp .sleeve .disc.b{position:absolute;left:-46px;top:50%;width:92px;height:92px;margin-top:-46px;z-index:-1}\n.mrpc-vx.mrpc-v-lp .sleeve .hd{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid var(--bd);padding-bottom:4px;margin-bottom:6px}\n.mrpc-vx.mrpc-v-lp .sleeve .hd b{font-size:1.05em;letter-spacing:.04em}\n.mrpc-vx.mrpc-v-lp .sleeve .hd span{font:700 9px \"Courier Prime\",monospace;letter-spacing:.2em;color:var(--mu)}\n.mrpc-vx.mrpc-v-lp .trk{display:grid;grid-template-columns:2em minmax(0,1fr);gap:.3em;font-size:.9em;line-height:1.6}\n.mrpc-vx.mrpc-v-lp .trk i{font:700 10px/1.9 \"Courier Prime\",monospace;font-style:normal;color:var(--ac)}\n.mrpc-vx.mrpc-v-lp .c2{position:relative;margin:6px 46px 0 0}\n.mrpc-vx.mrpc-v-lp .c2 .disc.b{position:absolute;right:-46px;top:50%;width:112px;height:112px;margin-top:-56px}\n.mrpc-vx.mrpc-v-lp .c2 .disc.b i{position:absolute;inset:39%;border-radius:50%;background:var(--soft);display:flex;align-items:center;justify-content:center;font:700 7px \"Courier Prime\",monospace;font-style:normal;color:var(--tx);z-index:2;letter-spacing:.05em}\n.mrpc-vx.mrpc-v-lp .c2 .sl{position:relative;padding:16px 70px 14px 18px;background:var(--sf);border:1px solid var(--ln);border-radius:4px}\n.mrpc-vx.mrpc-v-lp .c2 .sl .t{display:flex;justify-content:space-between}\n.mrpc-vx.mrpc-v-lp .c2 .pl{font-size:1.35em;font-weight:700;letter-spacing:.03em;line-height:1.35;margin:8px 0 8px}\n.mrpc-vx.mrpc-v-lp .c2 .meta{display:flex;flex-wrap:wrap;gap:4px 14px;border-top:1px solid var(--bd);padding-top:8px;font:700 11px \"Courier Prime\",\"Gowun Batang\",monospace;letter-spacing:.1em;color:var(--mu)}\n.mrpc-vx.mrpc-v-lp .c2 .meta b{color:var(--tx)}\n.mrpc-vx.mrpc-v-lp .c2{margin-right:78px!important}\n.mrpc-vx.mrpc-v-lp .c2 .disc.b{right:-78px!important}\n.mrpc-vx.mrpc-v-lp .c2 .disc.b i{inset:36%!important;font-size:7.5px!important}\n/* v-scrap */\n.mrpc-vx.mrpc-v-scrap .sc{position:relative;display:inline-flex;gap:.35em;align-items:center;padding:8px 14px 7px;background:var(--sf);font-family:\"Courier Prime\",\"Gowun Batang\",monospace;font-size:.86em;box-shadow:0 1px 2px rgba(0,0,0,.16);\n clip-path:polygon(0 3px,12% 0,25% 2px,40% 0,55% 3px,70% 0,85% 2px,100% 0,100% calc(100% - 2px),88% 100%,72% calc(100% - 3px),58% 100%,42% calc(100% - 2px),27% 100%,13% calc(100% - 3px),0 100%)}\n.mrpc-vx.mrpc-v-scrap .sc:nth-child(1){transform:rotate(-2deg)}\n.mrpc-vx.mrpc-v-scrap .sc:nth-child(2){transform:rotate(1.6deg)}\n.mrpc-vx.mrpc-v-scrap .sc b{letter-spacing:.06em}\n.mrpc-vx.mrpc-v-scrap .sc.on{background:var(--tx);color:var(--sf)}\n.mrpc-vx.mrpc-v-scrap .sc.on .k{color:var(--soft)}\n.mrpc-vx.mrpc-v-scrap .tape{position:absolute;width:64px;height:15px;background:var(--tape)}\n.mrpc-vx.mrpc-v-scrap .note{position:relative;margin:16px 6px 0;padding:24px 18px 16px;background:var(--sf) repeating-linear-gradient(#0000 0 25px,var(--bd) 25px 26px) 0 21px;transform:rotate(-.5deg);box-shadow:0 1px 3px rgba(0,0,0,.14);\n clip-path:polygon(0 4px,5% 0,11% 3px,18% 0,26% 4px,34% 1px,42% 4px,50% 0,58% 3px,66% 0,74% 4px,82% 1px,90% 4px,96% 0,100% 3px,100% calc(100% - 3px),94% 100%,86% calc(100% - 4px),77% 100%,68% calc(100% - 3px),59% 100%,50% calc(100% - 4px),41% 100%,32% calc(100% - 3px),23% 100%,14% calc(100% - 4px),6% 100%,0 calc(100% - 3px));\n font-family:\"Courier Prime\",\"Gowun Batang\",monospace;font-size:.88em;line-height:26px;word-spacing:-.25em}\n.mrpc-vx.mrpc-v-scrap .note .tape{top:3px;left:50%;margin-left:-32px;transform:rotate(-2deg)}\n.mrpc-vx.mrpc-v-scrap .note b{letter-spacing:.12em}\n.mrpc-vx.mrpc-v-scrap .note .k{word-spacing:0}\n.mrpc-vx.mrpc-v-scrap .c3{position:relative;margin:10px 8px 0;padding:26px 20px 18px;background:var(--sf);transform:rotate(.6deg);box-shadow:0 1px 3px rgba(0,0,0,.16);\n clip-path:polygon(0 3px,6% 0,13% 4px,21% 1px,29% 4px,37% 0,45% 3px,53% 0,61% 4px,69% 1px,77% 4px,85% 0,93% 3px,100% 1px,100% calc(100% - 4px),93% 100%,85% calc(100% - 3px),77% 100%,69% calc(100% - 4px),61% 100%,53% calc(100% - 3px),45% 100%,37% calc(100% - 4px),29% 100%,21% calc(100% - 3px),13% 100%,6% calc(100% - 4px),0 100%)}\n.mrpc-vx.mrpc-v-scrap .c3 .tape{top:4px;left:18px;transform:rotate(-4deg)}\n.mrpc-vx.mrpc-v-scrap .c3 .tape.r{left:auto;right:18px;transform:rotate(5deg)}\n.mrpc-vx.mrpc-v-scrap .c3 .ds{display:inline-block;padding:3px 8px;border:1.5px solid var(--ac);border-radius:3px;color:var(--ac);font:700 13px \"Courier Prime\",monospace;letter-spacing:.14em;transform:rotate(-3deg)}\n.mrpc-vx.mrpc-v-scrap .c3 .pl{font-size:1.25em;font-weight:700;margin:12px 0 4px;letter-spacing:.02em}\n.mrpc-vx.mrpc-v-scrap .c3 .ln{font:400 12px \"Courier Prime\",\"Gowun Batang\",monospace;letter-spacing:.06em;color:var(--mu2)}\n.mrpc-vx.mrpc-v-scrap .c3 .stk{position:absolute;right:18px;top:22px;width:58px;height:58px;border-radius:50%;background:var(--soft);border:1px dashed var(--ln);display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(8deg);color:var(--ac)}\n.mrpc-vx.mrpc-v-scrap .c3 .stk svg{width:24px}\n.mrpc-vx.mrpc-v-scrap .c3 .stk span{font-size:11px;font-weight:700;color:var(--tx)}\n.mrpc-vx.mrpc-v-scrap .c3w{position:relative;margin:14px 8px 0;transform:rotate(.6deg)}\n.mrpc-vx.mrpc-v-scrap .c3w .c3{margin:0;transform:none}\n.mrpc-vx.mrpc-v-scrap .c3w .tp{position:absolute;top:-7px;width:70px;height:18px;background:var(--tape);z-index:2}\n.mrpc-vx.mrpc-v-scrap .c3w .tp.l{left:-12px;transform:rotate(-32deg);top:2px}\n.mrpc-vx.mrpc-v-scrap .c3w .tp.r{right:-12px;transform:rotate(32deg);top:2px}\n.mrpc-vx.mrpc-v-scrap .c3 .stk{display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:2px;line-height:1;top:26px!important}\n.mrpc-vx.mrpc-v-scrap .c3 .stk svg{display:block;width:24px;height:24px}\n.mrpc-vx.mrpc-v-scrap .c3 .stk span{line-height:1;margin:0}\n.mrpc-vx.mrpc-v-scrap .notew{position:relative;margin:16px 6px 0}\n.mrpc-vx.mrpc-v-scrap .notew .note{margin:0}\n.mrpc-vx.mrpc-v-scrap .notew .tp{position:absolute;left:50%;top:-8px;width:70px;height:18px;margin-left:-35px;background:var(--tape);transform:rotate(-3deg);z-index:2}\n.mrpc-vx.mrpc-v-scrap .c3 .stk span{font-size:11px;font-weight:700;color:var(--tx)}\n.mrpc-vx.mrpc-v-scrap .c3.nostk{padding-right:20px}\n/* v-chart */\n.mrpc-vx.mrpc-v-chart .sr{display:inline-flex;align-items:center;gap:.4em;padding:.3em .9em;border:1px solid var(--ln);border-radius:999px;background:var(--sf);font-size:.86em}\n.mrpc-vx.mrpc-v-chart .sr .str{color:var(--ac);font-size:.9em}\n.mrpc-vx.mrpc-v-chart .sr.on{background:var(--tx);color:var(--sf);border-color:var(--tx)}\n.mrpc-vx.mrpc-v-chart .sr.on .k,.mrpc-vx.mrpc-v-chart .sr.on .str{color:var(--soft)}\n.mrpc-vx.mrpc-v-chart .chips.cons{position:relative}\n.mrpc-vx.mrpc-v-chart .chart{position:relative;margin:12px 0 0;padding:14px 16px;border:1px solid var(--ln);border-radius:14px;background:var(--sf);overflow:hidden}\n.mrpc-vx.mrpc-v-chart .chart::before{content:\"\";position:absolute;inset:5px;border:1px solid var(--bd);border-radius:10px;pointer-events:none}\n.mrpc-vx.mrpc-v-chart .chart .hd{position:relative;display:flex;align-items:baseline;gap:.6em;margin-bottom:6px}\n.mrpc-vx.mrpc-v-chart .chart .hd b{font-size:1.1em;letter-spacing:.04em}\n.mrpc-vx.mrpc-v-chart .chart .hd span{font:600 italic 12px \"Cormorant Garamond\",serif;letter-spacing:.18em;color:var(--mu)}\n.mrpc-vx.mrpc-v-chart .chart svg.c{position:absolute;right:14px;top:9px;width:66px;color:var(--ac)}\n.mrpc-vx.mrpc-v-chart .chart .fields{position:relative}\n.mrpc-vx.mrpc-v-chart .c4{position:relative;margin:4px 0 0;padding:18px 18px 16px;border:1px solid var(--ln);border-radius:16px;background:var(--sf);overflow:hidden;text-align:center}\n.mrpc-vx.mrpc-v-chart .c4::before{content:\"\";position:absolute;inset:5px;border:1px solid var(--bd);border-radius:12px}\n.mrpc-vx.mrpc-v-chart .c4 svg.bg{position:absolute;inset:0;width:100%;height:100%;color:var(--ac);opacity:.5}\n.mrpc-vx.mrpc-v-chart .c4 .r{position:relative}\n.mrpc-vx.mrpc-v-chart .c4 .dt{font:700 2em/1.1 \"Cormorant Garamond\",serif;letter-spacing:.06em;margin-top:4px}\n.mrpc-vx.mrpc-v-chart .c4 .dt small{font:700 .5em \"Gowun Batang\",serif}\n.mrpc-vx.mrpc-v-chart .c4 .tm{font:600 italic 15px \"Cormorant Garamond\",serif;letter-spacing:.14em;color:var(--mu)}\n.mrpc-vx.mrpc-v-chart .c4 .pl{font-size:1.08em;font-weight:700;margin-top:4px}\n.mrpc-vx.mrpc-v-chart .c4 .co{font:600 italic 11px \"Cormorant Garamond\",serif;letter-spacing:.2em;color:var(--mu);margin-top:6px}\n/* v-board */\n.mrpc-vx.mrpc-v-board .bd{display:inline-flex;align-items:center;gap:.45em;padding:.3em .85em;border:1px solid var(--ln);border-radius:8px;background:var(--sf);font-size:.86em}\n.mrpc-vx.mrpc-v-board .bd i{font:700 9px \"Courier Prime\",monospace;font-style:normal;letter-spacing:.1em;color:var(--mu)}\n.mrpc-vx.mrpc-v-board .bd.on{background:var(--tx);color:var(--sf);border-color:var(--tx)}\n.mrpc-vx.mrpc-v-board .bd.on .k,.mrpc-vx.mrpc-v-board .bd.on i{color:var(--soft)}\n.mrpc-vx.mrpc-v-board .bp{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 4.2em;margin:12px 0 0;border:1px solid var(--ln);border-radius:12px;background:var(--sf);\n -webkit-mask:radial-gradient(circle 7px at calc(100% - 4.2em) 0,#0000 98%,#000) top/100% 51% no-repeat,radial-gradient(circle 7px at calc(100% - 4.2em) 100%,#0000 98%,#000) bottom/100% 51% no-repeat}\n.mrpc-vx.mrpc-v-board .bp .n1,.mrpc-vx.mrpc-v-board .bp .n2{position:absolute;right:calc(4.2em - 8px);width:16px;height:16px;border:1px solid var(--ln);border-radius:50%}\n.mrpc-vx.mrpc-v-board .bp .n1{top:-8px}\n.mrpc-vx.mrpc-v-board .bp .n2{bottom:-8px}\n.mrpc-vx.mrpc-v-board .bp .main{padding:0 0 12px}\n.mrpc-vx.mrpc-v-board .bp .band{display:flex;justify-content:space-between;padding:7px 14px;border-bottom:1px solid var(--bd);font:700 9px \"Courier Prime\",monospace;letter-spacing:.2em;color:var(--mu)}\n.mrpc-vx.mrpc-v-board .bp .ps{padding:8px 14px 4px}\n.mrpc-vx.mrpc-v-board .bp .ps span{font:700 8px \"Courier Prime\",monospace;letter-spacing:.16em;color:var(--mu);display:block}\n.mrpc-vx.mrpc-v-board .bp .ps b{font-size:1.15em;letter-spacing:.04em}\n.mrpc-vx.mrpc-v-board .bp .fields{padding:0 14px}\n.mrpc-vx.mrpc-v-board .bp .stub{border-left:1.5px dashed var(--ln);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:10px 0}\n.mrpc-vx.mrpc-v-board .bc{width:30px;height:74px;background:repeating-linear-gradient(var(--tx) 0 2px,#0000 2px 4px,var(--tx) 4px 5px,#0000 5px 8px,var(--tx) 8px 11px,#0000 11px 13px)}\n.mrpc-vx.mrpc-v-board .bp .stub span{font:700 8px \"Courier Prime\",monospace;letter-spacing:.1em;color:var(--mu);writing-mode:vertical-rl}\n.mrpc-vx.mrpc-v-board .c5{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 4.6em;margin:4px 0 0;border:1px solid var(--ln);border-radius:12px;background:var(--sf);\n -webkit-mask:radial-gradient(circle 7px at calc(100% - 4.6em) 0,#0000 98%,#000) top/100% 51% no-repeat,radial-gradient(circle 7px at calc(100% - 4.6em) 100%,#0000 98%,#000) bottom/100% 51% no-repeat}\n.mrpc-vx.mrpc-v-board .c5 .n1,.mrpc-vx.mrpc-v-board .c5 .n2{position:absolute;right:calc(4.6em - 8px);width:16px;height:16px;border:1px solid var(--ln);border-radius:50%}\n.mrpc-vx.mrpc-v-board .c5 .n1{top:-8px}\n.mrpc-vx.mrpc-v-board .c5 .n2{bottom:-8px}\n.mrpc-vx.mrpc-v-board .c5 .band{display:flex;justify-content:space-between;padding:8px 14px;border-bottom:1px solid var(--bd)}\n.mrpc-vx.mrpc-v-board .c5 .pl{padding:10px 14px 2px}\n.mrpc-vx.mrpc-v-board .c5 .pl b{display:block;font-size:1.3em;letter-spacing:.03em}\n.mrpc-vx.mrpc-v-board .c5 .grid{display:grid;grid-template-columns:repeat(3,auto);justify-content:space-between;gap:4px 10px;padding:8px 14px 12px}\n.mrpc-vx.mrpc-v-board .c5 .grid b{display:block;font:700 1.02em \"Cormorant Garamond\",\"Gowun Batang\",serif;letter-spacing:.04em}\n.mrpc-vx.mrpc-v-board .c5 .stub{border-left:1.5px dashed var(--ln);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:12px 0}\n.mrpc-vx.mrpc-v-board .c5 .stub span{font:700 8px \"Courier Prime\",monospace;letter-spacing:.12em;color:var(--mu);writing-mode:vertical-rl}\n.mrpc-vx.mrpc-v-board .c5 .pl{padding-top:8px!important}\n.mrpc-vx.mrpc-v-board .c5 .pl .mk{display:block;margin-bottom:2px}\n.mrpc-vx.mrpc-v-board .c5 .band .mk{line-height:1}\n.mrpc-vx.mrpc-v-board .c5,.mrpc-vx.mrpc-v-board .bp{overflow:hidden}\n.mrpc-vx.mrpc-v-board .c5 .n1,.mrpc-vx.mrpc-v-board .c5 .n2{right:calc(4.6em - 9px)!important}\n.mrpc-vx.mrpc-v-board .bp .n1,.mrpc-vx.mrpc-v-board .bp .n2{right:calc(4.2em - 9px)!important}\n.mrpc-vx.mrpc-v-board .c5 .n1,.mrpc-vx.mrpc-v-board .bp .n1{top:-9px!important}\n.mrpc-vx.mrpc-v-board .c5 .n2,.mrpc-vx.mrpc-v-board .bp .n2{bottom:-9px!important}\n.mrpc-vx.mrpc-v-board .c5 .n1,.mrpc-vx.mrpc-v-board .c5 .n2,.mrpc-vx.mrpc-v-board .bp .n1,.mrpc-vx.mrpc-v-board .bp .n2{box-sizing:border-box}\n/* v-post */\n.mrpc-vx.mrpc-v-post .ch{display:inline-flex;align-items:center;gap:.4em;padding:.3em .9em;border:1px solid var(--ln);border-radius:999px;background:var(--sf);font-size:.86em}\n.mrpc-vx.mrpc-v-post .ch b{letter-spacing:.03em}\n.mrpc-vx.mrpc-v-post .ch.on{background:var(--tx);color:var(--sf);border-color:var(--tx)}\n.mrpc-vx.mrpc-v-post .ch.on .k,.mrpc-vx.mrpc-v-post .ch.on i{color:var(--soft)}\n.mrpc-vx.mrpc-v-post .pc{position:relative;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);background:var(--sf);border:1px solid var(--ln);border-radius:6px;padding:14px 0;box-shadow:0 1px 2px rgba(0,0,0,.1)}\n.mrpc-vx.mrpc-v-post .pc .l{padding:0 14px;border-right:1px solid var(--bd)}\n.mrpc-vx.mrpc-v-post .pc .r{position:relative;padding:0 14px}\n.mrpc-vx.mrpc-v-post .pc .ttl{font:600 italic 20px/1 \"Cormorant Garamond\",serif;letter-spacing:.08em;color:var(--ac);margin-bottom:10px}\n.mrpc-vx.mrpc-v-post .pc .msg{font-size:.95em;line-height:1.75}\n.mrpc-vx.mrpc-v-post .pc .smp{position:absolute;right:12px;top:0;width:44px;height:52px;padding:3px;background:var(--soft);filter:drop-shadow(0 0 .5px var(--ln)) drop-shadow(0 0 .5px var(--ln));-webkit-mask:linear-gradient(#000 0 0) content-box,radial-gradient(circle 2.2px at 50% 0,#0000 95%,#000) top/7px 3px round no-repeat,radial-gradient(circle 2.2px at 50% 100%,#0000 95%,#000) bottom/7px 3px round no-repeat,radial-gradient(circle 2.2px at 0 50%,#0000 95%,#000) left/3px 7px no-repeat round,radial-gradient(circle 2.2px at 100% 50%,#0000 95%,#000) right/3px 7px no-repeat round}\n.mrpc-vx.mrpc-v-post .pc .smp div{width:100%;height:100%;border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;color:var(--ac)}\n.mrpc-vx.mrpc-v-post .pc .smp svg{width:26px}\n.mrpc-vx.mrpc-v-post .pc .pmk{position:absolute;right:38px;top:20px;width:52px;height:52px;border:1.3px solid var(--ac);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--ac);font:700 7px \"Courier Prime\",monospace;letter-spacing:.08em;transform:rotate(-14deg);opacity:.8;line-height:1.4}\n.mrpc-vx.mrpc-v-post .pc .adr{margin-top:66px}\n.mrpc-vx.mrpc-v-post .pc .adr div{border-bottom:1px dotted var(--ln);font-size:.86em;padding:2px 0;min-height:1.8em}\n.mrpc-vx.mrpc-v-post .pcb{position:relative;background:var(--sf);border:1px solid var(--ln);border-radius:6px;padding:12px 16px;background-image:repeating-linear-gradient(#0000 0 25px,var(--bd) 25px 26px);background-position:0 39px}\n.mrpc-vx.mrpc-v-post .pcb .dear{font:600 italic 17px/26px \"Cormorant Garamond\",\"Gowun Batang\",serif;color:var(--ac)}\n.mrpc-vx.mrpc-v-post .pcb .fields{line-height:26px;font-size:.9em}\n.mrpc-vx.mrpc-v-post .pc .smp{background:var(--sf)!important}\n.mrpc-vx.mrpc-v-post .pc .smp div{border-color:var(--tx)!important}\n.mrpc-vx.mrpc-v-post .pc .smp .bfi{width:32px;color:var(--ac)}\n.mrpc-vx.mrpc-v-post .pc .pmk{right:58px!important;top:8px!important}\n.mrpc-vx.mrpc-v-post .pc .pmk b{font:700 9px \"Gowun Batang\",serif}\n.mrpc-vx.mrpc-v-post .pc .adr{margin-top:70px!important}\n.mrpc-vx.mrpc-v-post .pc .adr div{padding:6px 0 1px!important;line-height:1.3;min-height:0!important}\n.mrpc-cast.mrpc-vx.mrpc-v-post .vpanel{padding-top:12px}\n/* v-film */\n.mrpc-vx.mrpc-v-film .fm{position:relative;background:var(--tx);padding:16px 10px;border-radius:3px}\n.mrpc-vx.mrpc-v-film .fm::before,.mrpc-vx.mrpc-v-film .fm::after{content:\"\";position:absolute;left:8px;right:8px;height:7px;background:repeating-linear-gradient(90deg,var(--sf) 0 8px,#0000 8px 16px);border-radius:1px}\n.mrpc-vx.mrpc-v-film .fm::before{top:5px}\n.mrpc-vx.mrpc-v-film .fm::after{bottom:5px}\n.mrpc-vx.mrpc-v-film .fm .fr{background:var(--sf);border-radius:2px;padding:14px 16px;position:relative}\n.mrpc-vx.mrpc-v-film .fm .no{position:absolute;right:10px;top:-14px;font:700 8px \"Courier Prime\",monospace;letter-spacing:.14em;color:var(--soft)}\n.mrpc-vx.mrpc-v-film .fm .dt{font:700 1.7em/1 \"Cormorant Garamond\",serif;letter-spacing:.05em}\n.mrpc-vx.mrpc-v-film .fm .tm{font:700 11px \"Courier Prime\",monospace;letter-spacing:.18em;color:var(--mu);margin:6px 0 2px}\n.mrpc-vx.mrpc-v-film .fm .pl{font-weight:700;font-size:1.08em}\n.mrpc-vx.mrpc-v-film .fch{display:inline-flex;align-items:center;gap:.4em;padding:5px 11px;background:var(--sf);border:1px solid var(--ln);border-radius:3px;font-size:.86em;box-shadow:inset 0 3px 0 -1px var(--tx),inset 0 -3px 0 -1px var(--tx)}\n.mrpc-vx.mrpc-v-film .fch.on{background:var(--tx);color:var(--sf)}\n.mrpc-vx.mrpc-v-film .fch.on .k,.mrpc-vx.mrpc-v-film .fch.on i{color:var(--soft)}\n.mrpc-vx.mrpc-v-film .fch i{font:700 8px \"Courier Prime\",monospace;font-style:normal;letter-spacing:.08em;color:var(--mu)}\n.mrpc-vx.mrpc-v-film .fm .dt small{font:700 .5em \"Gowun Batang\",serif}\n.mrpc-cast.mrpc-vx.mrpc-v-film .vpanel{padding-top:12px}\n/* v-match */\n.mrpc-vx.mrpc-v-match .mb{position:relative;background:var(--sf);border:1px solid var(--ln);border-radius:4px;padding:10px 26px;box-shadow:0 1px 2px rgba(0,0,0,.12)}\n.mrpc-vx.mrpc-v-match .mb::before,.mrpc-vx.mrpc-v-match .mb::after{content:\"\";position:absolute;top:8px;bottom:8px;width:12px;background:repeating-linear-gradient(45deg,var(--mu2) 0 2px,var(--tx) 2px 4px);border-radius:2px}\n.mrpc-vx.mrpc-v-match .mb::before{left:7px}\n.mrpc-vx.mrpc-v-match .mb::after{right:7px}\n.mrpc-vx.mrpc-v-match .mb .lab{border:2px solid var(--tx);padding:3px;border-radius:3px}\n.mrpc-vx.mrpc-v-match .mb .in{border:1px solid var(--tx);padding:10px 10px 8px;text-align:center}\n.mrpc-vx.mrpc-v-match .mb .sm{font:700 8px \"Courier Prime\",monospace;letter-spacing:.3em;color:var(--mu)}\n.mrpc-vx.mrpc-v-match .mb .arc{font:700 22px/1.15 \"Cormorant Garamond\",\"Gowun Batang\",serif;letter-spacing:.06em;margin:5px 0}\n.mrpc-vx.mrpc-v-match .mb .bar{display:flex;justify-content:center;gap:10px;align-items:center;border-top:1px solid var(--tx);border-bottom:1px solid var(--tx);padding:3px 0;margin:4px 0;font:700 10px \"Courier Prime\",\"Gowun Batang\",monospace;letter-spacing:.12em}\n.mrpc-vx.mrpc-v-match .mb .bar span+span::before{content:\"✦\";margin-right:10px;color:var(--ac);font-size:8px}\n.mrpc-vx.mrpc-v-match .mch{display:inline-flex;align-items:center;gap:.4em;padding:3px 10px;border:2px solid var(--tx);border-radius:3px;box-shadow:inset 0 0 0 2px var(--sf),inset 0 0 0 3px var(--tx);background:var(--sf);font-size:.86em}\n.mrpc-vx.mrpc-v-match .mch.on{background:var(--tx);color:var(--sf);box-shadow:inset 0 0 0 2px var(--tx),inset 0 0 0 3px var(--sf)}\n.mrpc-vx.mrpc-v-match .mch.on .k{color:var(--soft)}\n.mrpc-vx.mrpc-v-match .mbp{background:var(--sf);border:2px solid var(--tx);border-radius:3px;padding:3px}\n.mrpc-vx.mrpc-v-match .mbp .in{border:1px solid var(--tx);padding:8px 12px}\n.mrpc-vx.mrpc-v-match .mbp .t{text-align:center;font-weight:700;letter-spacing:.06em;border-bottom:1px solid var(--tx);padding-bottom:3px;margin-bottom:5px}\n.mrpc-cast.mrpc-vx.mrpc-v-match .vpanel{padding-top:12px}\n/* v-tarot */\n.mrpc-vx.mrpc-v-tarot .tr{position:relative;width:15.5em;margin:0 auto;background:var(--sf);border:1px solid var(--ln);border-radius:12px;padding:6px;box-shadow:0 2px 4px rgba(0,0,0,.12)}\n.mrpc-vx.mrpc-v-tarot .tr .in{border:1px solid var(--ac);border-radius:8px;padding:8px 10px 0;text-align:center;overflow:hidden}\n.mrpc-vx.mrpc-v-tarot .tr .num{font:700 16px \"Cormorant Garamond\",serif;letter-spacing:.2em;color:var(--ac)}\n.mrpc-vx.mrpc-v-tarot .tr svg{width:110px;display:block;margin:4px auto 6px;color:var(--ac)}\n.mrpc-vx.mrpc-v-tarot .tr .nm{margin:0 -10px;border-top:1px solid var(--ac);padding:6px 0 4px;font-weight:700;font-size:1.05em;letter-spacing:.06em}\n.mrpc-vx.mrpc-v-tarot .tr .ft{margin:0 -10px;border-top:1px solid var(--bd);padding:4px 0 6px;font:700 9px \"Courier Prime\",\"Gowun Batang\",monospace;letter-spacing:.12em;color:var(--mu)}\n.mrpc-vx.mrpc-v-tarot .tch{display:inline-flex;flex-direction:column;align-items:center;gap:0;min-width:4.4em;padding:5px 9px 4px;border:1px solid var(--ln);border-radius:7px;background:var(--sf);font-size:.84em;line-height:1.35;box-shadow:inset 0 0 0 2px var(--sf),inset 0 0 0 3px var(--bd)}\n.mrpc-vx.mrpc-v-tarot .tch i{font:700 10px \"Cormorant Garamond\",serif;font-style:normal;letter-spacing:.14em;color:var(--ac)}\n.mrpc-vx.mrpc-v-tarot .tch.on{background:var(--tx);color:var(--sf);box-shadow:none}\n.mrpc-vx.mrpc-v-tarot .tch.on .k,.mrpc-vx.mrpc-v-tarot .tch.on i{color:var(--soft)}\n.mrpc-vx.mrpc-v-tarot .trp{display:grid;grid-template-columns:4.6em minmax(0,1fr);gap:12px;background:var(--sf);border:1px solid var(--ln);border-radius:12px;padding:6px}\n.mrpc-vx.mrpc-v-tarot .trp .mini{border:1px solid var(--ac);border-radius:7px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:6px 2px;color:var(--ac)}\n.mrpc-vx.mrpc-v-tarot .trp .mini svg{width:40px}\n.mrpc-vx.mrpc-v-tarot .trp .mini b{font:700 12px \"Cormorant Garamond\",serif;letter-spacing:.14em}\n.mrpc-vx.mrpc-v-tarot .trp .mini span{font-size:.8em;color:var(--tx);font-weight:700}\n.mrpc-vx.mrpc-v-tarot .trp .fields{padding:6px 8px 6px 0}\n.mrpc-vx.mrpc-v-tarot .tch{flex-direction:row!important;gap:.4em!important;min-width:0!important;padding:.3em .9em!important;line-height:1.5!important}\n.mrpc-cast.mrpc-vx.mrpc-v-tarot .vpanel{padding-top:12px}\n/* v-log */\n.mrpc-vx.mrpc-v-log .ob{position:relative;background:var(--sf);border:1px solid var(--ln);border-radius:3px;padding:12px 14px 12px 26px;box-shadow:0 1px 2px rgba(0,0,0,.1)}\n.mrpc-vx.mrpc-v-log .ob::before{content:\"\";position:absolute;left:14px;top:0;bottom:0;border-left:1px solid var(--bd)}\n.mrpc-vx.mrpc-v-log .ob .hd{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1.5px solid var(--tx);padding-bottom:4px}\n.mrpc-vx.mrpc-v-log .ob .hd b{font:700 15px \"Cormorant Garamond\",serif;letter-spacing:.18em}\n.mrpc-vx.mrpc-v-log .ob table{width:100%;border-collapse:collapse;margin-top:6px;font-size:.86em}\n.mrpc-vx.mrpc-v-log .ob th{width:4.2em;text-align:left;font:700 8.5px \"Courier Prime\",monospace;letter-spacing:.14em;color:var(--mu);padding:5px 0;border-bottom:1px solid var(--bd);vertical-align:top}\n.mrpc-vx.mrpc-v-log .ob td{padding:4px 0 4px 8px;border-bottom:1px solid var(--bd);border-left:1px solid var(--bd)}\n.mrpc-vx.mrpc-v-log .ob .hand{font:700 13px \"Courier Prime\",\"Gowun Batang\",monospace;letter-spacing:.04em}\n.mrpc-vx.mrpc-v-log .ob svg{position:absolute;right:12px;bottom:10px;width:64px;color:var(--ac);opacity:.75}\n.mrpc-vx.mrpc-v-log .och{display:inline-flex;align-items:center;gap:.4em;padding:.3em .9em;border:1px solid var(--ln);border-radius:999px;background:var(--sf);font-size:.86em}\n.mrpc-vx.mrpc-v-log .och i{width:7px;height:7px;border:1.3px solid var(--ac);border-radius:50%}\n.mrpc-vx.mrpc-v-log .och.on{background:var(--tx);color:var(--sf);border-color:var(--tx)}\n.mrpc-vx.mrpc-v-log .och.on .k{color:var(--soft)}\n.mrpc-vx.mrpc-v-log .och.on i{border-color:var(--soft)}\n.mrpc-vx.mrpc-v-log .ob .hand.site{font-family:\"Gowun Batang\",serif;font-size:15px}\n.mrpc-vx.mrpc-v-log .ob .hd b.who{font-family:\"Gowun Batang\",serif;letter-spacing:.04em}\n.mrpc-cast.mrpc-vx.mrpc-v-log .vpanel{padding-top:12px}\n/* v-spec */\n.mrpc-vx.mrpc-v-spec .sp{position:relative;padding:8px;background:var(--tx);border-radius:4px}\n.mrpc-vx.mrpc-v-spec .sp .in{position:relative;background:var(--sf);border-radius:2px;padding:18px 14px 14px;display:grid;grid-template-columns:8.4em minmax(0,1fr);gap:14px;align-items:center;background-image:linear-gradient(var(--bd) 1px,#0000 1px),linear-gradient(90deg,var(--bd) 1px,#0000 1px);background-size:14px 14px;background-position:-1px -1px}\n.mrpc-vx.mrpc-v-spec .sp .bug{position:relative;display:flex;justify-content:center;align-items:center;height:7em;background:var(--sf);border:1px solid var(--bd)}\n.mrpc-vx.mrpc-v-spec .sp .bug .bfi{width:100px;color:var(--tx)}\n.mrpc-vx.mrpc-v-spec .sp .pin{position:absolute;left:50%;top:50%;width:5px;height:5px;margin:-12px 0 0 -2.5px;border-radius:50%;background:var(--tx);box-shadow:0 0 0 1.5px var(--sf)}\n.mrpc-vx.mrpc-v-spec .lab{background:var(--sf);border:1px solid var(--tx);padding:7px 10px;font:700 11.5px/1.75 \"Courier Prime\",\"Gowun Batang\",monospace;letter-spacing:.04em;transform:rotate(-.6deg)}\n.mrpc-vx.mrpc-v-spec .lab .sn{font:600 italic 14px/1.3 \"Cormorant Garamond\",serif;letter-spacing:.04em;border-bottom:1px solid var(--tx);margin-bottom:3px;padding-bottom:2px}\n.mrpc-vx.mrpc-v-spec .lab .pl{font-family:\"Gowun Batang\",serif;font-size:14px}\n.mrpc-vx.mrpc-v-spec .tagc{display:inline-flex;align-items:center;gap:.4em;padding:.28em .85em .28em 1.2em;border:1px solid var(--tx);border-radius:3px 10px 10px 3px;background:var(--sf);font-size:.86em;position:relative}\n.mrpc-vx.mrpc-v-spec .tagc::before{content:\"\";position:absolute;left:.42em;top:50%;width:5px;height:5px;margin-top:-2.5px;border-radius:50%;border:1px solid var(--tx)}\n.mrpc-vx.mrpc-v-spec .tagc.on{background:var(--tx);color:var(--sf)}\n.mrpc-vx.mrpc-v-spec .tagc.on::before{border-color:var(--soft)}\n.mrpc-vx.mrpc-v-spec .tagc.on .k{color:var(--soft)}\n.mrpc-vx.mrpc-v-spec .lab.big{transform:none;font-size:12.5px;padding:10px 14px}\n.mrpc-vx.mrpc-v-spec .lab.big .sn{font-family:\"Gowun Batang\",serif;font-style:normal;font-weight:700}\n.mrpc-vx.mrpc-v-spec .lab.big .sn .mk{float:right}\n.mrpc-cast.mrpc-vx.mrpc-v-spec .vpanel{padding-top:12px}\n/* v-exlib */\n.mrpc-vx.mrpc-v-exlib .ex{position:relative;padding:6px;background:var(--sf);border:1px solid var(--tx)}\n.mrpc-vx.mrpc-v-exlib .ex .in{position:relative;border:3px double var(--tx);padding:14px 14px 12px;text-align:center}\n.mrpc-vx.mrpc-v-exlib .ex .co{position:absolute;font-size:10px;line-height:1;color:var(--tx);background:var(--sf);padding:2px}\n.mrpc-vx.mrpc-v-exlib .ex .c1{left:-7px;top:-7px}\n.mrpc-vx.mrpc-v-exlib .ex .c2{right:-7px;top:-7px}\n.mrpc-vx.mrpc-v-exlib .ex .c3{left:-7px;bottom:-7px}\n.mrpc-vx.mrpc-v-exlib .ex .c4{right:-7px;bottom:-7px}\n.mrpc-vx.mrpc-v-exlib .ex .bfi{width:78px;color:var(--tx)}\n.mrpc-vx.mrpc-v-exlib .ex .el{font:700 12px \"Cormorant Garamond\",serif;letter-spacing:.42em;margin:2px 0}\n.mrpc-vx.mrpc-v-exlib .ex .pl{font-size:1.25em;font-weight:700;letter-spacing:.04em}\n.mrpc-vx.mrpc-v-exlib .ex .ft{display:flex;justify-content:center;gap:10px;font:700 10px \"Courier Prime\",\"Gowun Batang\",monospace;letter-spacing:.12em;color:var(--mu);margin-top:6px;border-top:1px solid var(--bd);padding-top:6px}\n.mrpc-vx.mrpc-v-exlib .ov{display:inline-flex;align-items:center;gap:.4em;padding:.25em 1em;border:1px solid var(--tx);border-radius:50%/100%;background:var(--sf);font-size:.86em;box-shadow:inset 0 0 0 2px var(--sf),inset 0 0 0 3px var(--bd)}\n.mrpc-vx.mrpc-v-exlib .ov.on{background:var(--tx);color:var(--sf);box-shadow:none}\n.mrpc-vx.mrpc-v-exlib .ov.on .k{color:var(--soft)}\n.mrpc-vx.mrpc-v-exlib .ex .in.left{text-align:left}\n.mrpc-vx.mrpc-v-exlib .ex .in.left .el{text-align:center}\n.mrpc-cast.mrpc-vx.mrpc-v-exlib .vpanel{padding-top:12px}\n/* ── 빈티지 소품 2차 ── */\n/* v-receipt */\n.mrpc-vx.mrpc-v-receipt .rcw{filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.16))}\n.mrpc-vx.mrpc-v-receipt .rc{position:relative;width:17em;margin:6px auto 0;padding:18px 18px 22px;background:var(--sf);font:400 12.5px/1.65 \"Courier Prime\",\"Gowun Batang\",monospace;box-shadow:0 1px 3px rgba(0,0,0,.12);\n -webkit-mask:linear-gradient(#000 0 0) top/100% calc(100% - 19px) no-repeat,url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%20600%2020%27%20preserveAspectRatio%3D%27none%27%3E%3Cpath%20d%3D%27M0%200%20L0.0%202.85%20L2.3%204.02%20L4.7%204.14%20L7.0%203.59%20L9.4%205.19%20L11.7%205.37%20L14.1%205.62%20L16.4%207.66%20L18.8%208.33%20L21.1%208.13%20L23.4%206.83%20L25.8%207.68%20L28.1%207.04%20L30.5%207.59%20L32.8%207.83%20L35.2%209.49%20L37.5%206.91%20L39.8%207.25%20L42.2%205.88%20L44.5%206.46%20L46.9%206.92%20L49.2%207.03%20L51.6%208.58%20L53.9%207.24%20L56.2%207.63%20L58.6%208.71%20L60.9%208.99%20L63.3%208.11%20L65.6%2010.67%20L68.0%209.38%20L70.3%207.10%20L72.7%207.56%20L75.0%206.70%20L77.3%207.10%20L79.7%208.97%20L82.0%208.02%20L84.4%209.32%20L86.7%207.80%20L89.1%206.35%20L91.4%208.23%20L93.8%206.60%20L96.1%207.17%20L98.4%207.49%20L100.8%207.50%20L103.1%206.92%20L105.5%205.37%20L107.8%205.44%20L110.2%205.19%20L112.5%205.73%20L114.8%204.53%20L117.2%204.89%20L119.5%204.44%20L121.9%206.17%20L124.2%206.31%20L126.6%204.10%20L128.9%204.85%20L131.2%204.95%20L133.6%206.06%20L135.9%205.90%20L138.3%205.20%20L140.6%205.79%20L143.0%208.76%20L145.3%209.13%20L147.7%209.38%20L150.0%209.00%20L152.3%209.41%20L154.7%208.62%20L157.0%207.90%20L159.4%205.89%20L161.7%207.07%20L164.1%205.12%20L166.4%205.38%20L168.8%204.94%20L171.1%205.97%20L173.4%206.54%20L175.8%207.01%20L178.1%205.11%20L180.5%206.59%20L182.8%205.54%20L185.2%206.87%20L187.5%207.63%20L189.8%208.42%20L192.2%206.80%20L194.5%207.98%20L196.9%205.92%20L199.2%208.95%20L201.6%208.23%20L203.9%207.76%20L206.2%209.10%20L208.6%2010.21%20L210.9%208.79%20L213.3%2010.08%20L215.6%2010.48%20L218.0%209.65%20L220.3%208.17%20L222.7%207.95%20L225.0%208.47%20L227.3%2010.23%20L229.7%2010.64%20L232.0%2010.27%20L234.4%207.77%20L236.7%206.48%20L239.1%206.34%20L241.4%207.55%20L243.8%207.60%20L246.1%207.43%20L248.4%207.26%20L250.8%208.92%20L253.1%209.68%20L255.5%2010.50%20L257.8%2010.02%20L260.2%2010.23%20L262.5%2010.51%20L264.8%209.35%20L267.2%209.29%20L269.5%2011.52%20L271.9%209.99%20L274.2%2011.93%20L276.6%2010.63%20L278.9%2011.96%20L281.2%2012.21%20L283.6%2011.75%20L285.9%2012.67%20L288.3%2014.68%20L290.6%2016.74%20L293.0%2016.65%20L295.3%2015.25%20L297.7%2017.29%20L300.0%2017.34%20L302.3%2017.91%20L304.7%2018.04%20L307.0%2018.45%20L309.4%2018.52%20L311.7%2018.30%20L314.1%2017.66%20L316.4%2016.85%20L318.8%2017.16%20L321.1%2016.64%20L323.4%2016.71%20L325.8%2016.91%20L328.1%2016.41%20L330.5%2016.18%20L332.8%2016.80%20L335.2%2018.08%20L337.5%2019.32%20L339.8%2018.08%20L342.2%2016.18%20L344.5%2016.81%20L346.9%2016.16%20L349.2%2016.93%20L351.6%2016.67%20L353.9%2015.40%20L356.2%2014.24%20L358.6%2014.34%20L360.9%2014.88%20L363.3%2014.54%20L365.6%2015.84%20L368.0%2015.85%20L370.3%2016.46%20L372.7%2015.13%20L375.0%2014.97%20L377.3%2014.98%20L379.7%2015.06%20L382.0%2015.97%20L384.4%2015.09%20L386.7%2014.43%20L389.1%2013.51%20L391.4%2014.12%20L393.8%2014.49%20L396.1%2015.85%20L398.4%2014.29%20L400.8%2014.84%20L403.1%2016.47%20L405.5%2017.53%20L407.8%2017.47%20L410.2%2015.85%20L412.5%2015.92%20L414.8%2014.84%20L417.2%2014.41%20L419.5%2015.01%20L421.9%2013.68%20L424.2%2013.44%20L426.6%2013.17%20L428.9%2013.39%20L431.2%2012.74%20L433.6%2011.76%20L435.9%2012.11%20L438.3%2010.39%20L440.6%2010.72%20L443.0%2010.82%20L445.3%2011.54%20L447.7%2011.31%20L450.0%2011.48%20L452.3%2013.37%20L454.7%2013.26%20L457.0%2013.71%20L459.4%2011.71%20L461.7%2012.29%20L464.1%2011.42%20L466.4%2012.41%20L468.8%2011.21%20L471.1%2012.64%20L473.4%2012.90%20L475.8%2011.65%20L478.1%2010.09%20L480.5%209.78%20L482.8%2010.42%20L485.2%208.39%20L487.5%207.69%20L489.8%207.44%20L492.2%208.51%20L494.5%207.15%20L496.9%207.74%20L499.2%207.35%20L501.6%208.53%20L503.9%208.55%20L506.2%209.20%20L508.6%208.25%20L510.9%207.47%20L513.3%207.16%20L515.6%207.93%20L518.0%209.08%20L520.3%208.01%20L522.7%209.61%20L525.0%2011.35%20L527.3%2010.99%20L529.7%2012.88%20L532.0%2011.04%20L534.4%2010.85%20L536.7%2010.99%20L539.1%2011.87%20L541.4%2012.16%20L543.8%2011.90%20L546.1%2012.79%20L548.4%2014.63%20L550.8%2014.76%20L553.1%2014.93%20L555.5%2013.65%20L557.8%2013.17%20L560.2%2012.09%20L562.5%2012.55%20L564.8%2013.23%20L567.2%2013.00%20L569.5%2011.66%20L571.9%2012.62%20L574.2%2010.34%20L576.6%2010.47%20L578.9%209.71%20L581.2%2010.29%20L583.6%207.66%20L585.9%206.57%20L588.3%208.02%20L590.6%207.02%20L593.0%206.04%20L595.3%205.19%20L597.7%205.64%20L600.0%205.83%20L600%200Z%27%20fill%3D%27black%27/%3E%3C/svg%3E\") bottom/100% 20px no-repeat;mask:linear-gradient(#000 0 0) top/100% calc(100% - 19px) no-repeat,url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%20600%2020%27%20preserveAspectRatio%3D%27none%27%3E%3Cpath%20d%3D%27M0%200%20L0.0%202.85%20L2.3%204.02%20L4.7%204.14%20L7.0%203.59%20L9.4%205.19%20L11.7%205.37%20L14.1%205.62%20L16.4%207.66%20L18.8%208.33%20L21.1%208.13%20L23.4%206.83%20L25.8%207.68%20L28.1%207.04%20L30.5%207.59%20L32.8%207.83%20L35.2%209.49%20L37.5%206.91%20L39.8%207.25%20L42.2%205.88%20L44.5%206.46%20L46.9%206.92%20L49.2%207.03%20L51.6%208.58%20L53.9%207.24%20L56.2%207.63%20L58.6%208.71%20L60.9%208.99%20L63.3%208.11%20L65.6%2010.67%20L68.0%209.38%20L70.3%207.10%20L72.7%207.56%20L75.0%206.70%20L77.3%207.10%20L79.7%208.97%20L82.0%208.02%20L84.4%209.32%20L86.7%207.80%20L89.1%206.35%20L91.4%208.23%20L93.8%206.60%20L96.1%207.17%20L98.4%207.49%20L100.8%207.50%20L103.1%206.92%20L105.5%205.37%20L107.8%205.44%20L110.2%205.19%20L112.5%205.73%20L114.8%204.53%20L117.2%204.89%20L119.5%204.44%20L121.9%206.17%20L124.2%206.31%20L126.6%204.10%20L128.9%204.85%20L131.2%204.95%20L133.6%206.06%20L135.9%205.90%20L138.3%205.20%20L140.6%205.79%20L143.0%208.76%20L145.3%209.13%20L147.7%209.38%20L150.0%209.00%20L152.3%209.41%20L154.7%208.62%20L157.0%207.90%20L159.4%205.89%20L161.7%207.07%20L164.1%205.12%20L166.4%205.38%20L168.8%204.94%20L171.1%205.97%20L173.4%206.54%20L175.8%207.01%20L178.1%205.11%20L180.5%206.59%20L182.8%205.54%20L185.2%206.87%20L187.5%207.63%20L189.8%208.42%20L192.2%206.80%20L194.5%207.98%20L196.9%205.92%20L199.2%208.95%20L201.6%208.23%20L203.9%207.76%20L206.2%209.10%20L208.6%2010.21%20L210.9%208.79%20L213.3%2010.08%20L215.6%2010.48%20L218.0%209.65%20L220.3%208.17%20L222.7%207.95%20L225.0%208.47%20L227.3%2010.23%20L229.7%2010.64%20L232.0%2010.27%20L234.4%207.77%20L236.7%206.48%20L239.1%206.34%20L241.4%207.55%20L243.8%207.60%20L246.1%207.43%20L248.4%207.26%20L250.8%208.92%20L253.1%209.68%20L255.5%2010.50%20L257.8%2010.02%20L260.2%2010.23%20L262.5%2010.51%20L264.8%209.35%20L267.2%209.29%20L269.5%2011.52%20L271.9%209.99%20L274.2%2011.93%20L276.6%2010.63%20L278.9%2011.96%20L281.2%2012.21%20L283.6%2011.75%20L285.9%2012.67%20L288.3%2014.68%20L290.6%2016.74%20L293.0%2016.65%20L295.3%2015.25%20L297.7%2017.29%20L300.0%2017.34%20L302.3%2017.91%20L304.7%2018.04%20L307.0%2018.45%20L309.4%2018.52%20L311.7%2018.30%20L314.1%2017.66%20L316.4%2016.85%20L318.8%2017.16%20L321.1%2016.64%20L323.4%2016.71%20L325.8%2016.91%20L328.1%2016.41%20L330.5%2016.18%20L332.8%2016.80%20L335.2%2018.08%20L337.5%2019.32%20L339.8%2018.08%20L342.2%2016.18%20L344.5%2016.81%20L346.9%2016.16%20L349.2%2016.93%20L351.6%2016.67%20L353.9%2015.40%20L356.2%2014.24%20L358.6%2014.34%20L360.9%2014.88%20L363.3%2014.54%20L365.6%2015.84%20L368.0%2015.85%20L370.3%2016.46%20L372.7%2015.13%20L375.0%2014.97%20L377.3%2014.98%20L379.7%2015.06%20L382.0%2015.97%20L384.4%2015.09%20L386.7%2014.43%20L389.1%2013.51%20L391.4%2014.12%20L393.8%2014.49%20L396.1%2015.85%20L398.4%2014.29%20L400.8%2014.84%20L403.1%2016.47%20L405.5%2017.53%20L407.8%2017.47%20L410.2%2015.85%20L412.5%2015.92%20L414.8%2014.84%20L417.2%2014.41%20L419.5%2015.01%20L421.9%2013.68%20L424.2%2013.44%20L426.6%2013.17%20L428.9%2013.39%20L431.2%2012.74%20L433.6%2011.76%20L435.9%2012.11%20L438.3%2010.39%20L440.6%2010.72%20L443.0%2010.82%20L445.3%2011.54%20L447.7%2011.31%20L450.0%2011.48%20L452.3%2013.37%20L454.7%2013.26%20L457.0%2013.71%20L459.4%2011.71%20L461.7%2012.29%20L464.1%2011.42%20L466.4%2012.41%20L468.8%2011.21%20L471.1%2012.64%20L473.4%2012.90%20L475.8%2011.65%20L478.1%2010.09%20L480.5%209.78%20L482.8%2010.42%20L485.2%208.39%20L487.5%207.69%20L489.8%207.44%20L492.2%208.51%20L494.5%207.15%20L496.9%207.74%20L499.2%207.35%20L501.6%208.53%20L503.9%208.55%20L506.2%209.20%20L508.6%208.25%20L510.9%207.47%20L513.3%207.16%20L515.6%207.93%20L518.0%209.08%20L520.3%208.01%20L522.7%209.61%20L525.0%2011.35%20L527.3%2010.99%20L529.7%2012.88%20L532.0%2011.04%20L534.4%2010.85%20L536.7%2010.99%20L539.1%2011.87%20L541.4%2012.16%20L543.8%2011.90%20L546.1%2012.79%20L548.4%2014.63%20L550.8%2014.76%20L553.1%2014.93%20L555.5%2013.65%20L557.8%2013.17%20L560.2%2012.09%20L562.5%2012.55%20L564.8%2013.23%20L567.2%2013.00%20L569.5%2011.66%20L571.9%2012.62%20L574.2%2010.34%20L576.6%2010.47%20L578.9%209.71%20L581.2%2010.29%20L583.6%207.66%20L585.9%206.57%20L588.3%208.02%20L590.6%207.02%20L593.0%206.04%20L595.3%205.19%20L597.7%205.64%20L600.0%205.83%20L600%200Z%27%20fill%3D%27black%27/%3E%3C/svg%3E\") bottom/100% 20px no-repeat,96.7% calc(100% - 3.8px),93.9% calc(100% - 6.0px),85.1% calc(100% - 3.9px),82.0% calc(100% - 6.7px),81.0% calc(100% - 3.9px),78.8% calc(100% - 4.4px),69.5% calc(100% - 3.6px),67.7% calc(100% - 3.1px),64.8% calc(100% - 4.3px),63.6% calc(100% - 2.6px),62.5% calc(100% - 0.7px),58.4% calc(100% - 3.4px),58.0% calc(100% - 4.2px),57.6% calc(100% - 2.2px),57.3% calc(100% - 0.5px),54.7% calc(100% - 5.1px),53.5% calc(100% - 3.9px),50.7% calc(100% - 1.5px),45.4% calc(100% - 6.1px),43.5% calc(100% - 2.9px),42.9% calc(100% - 4.2px),42.6% calc(100% - 1.7px),39.9% calc(100% - 2.1px),37.5% calc(100% - 4.8px),36.8% calc(100% - 1.2px),32.7% calc(100% - 1.5px),31.8% calc(100% - 3.1px),31.2% calc(100% - 0.4px),30.4% calc(100% - 2.1px),29.4% calc(100% - 4.8px),24.9% calc(100% - 2.8px),22.9% calc(100% - 7.2px),21.2% calc(100% - 4.0px),18.7% calc(100% - 4.1px),15.8% calc(100% - 6.6px),15.1% calc(100% - 5.5px),13.1% calc(100% - 1.1px),12.5% calc(100% - 5.4px),9.9% calc(100% - 0.9px),8.1% calc(100% - 0.5px),7.8% calc(100% - 3.2px),7.2% calc(100% - 1.6px),6.8% calc(100% - 2.1px),6.7% calc(100% - 4.3px),5.6% calc(100% - 2.5px),4.7% calc(100% - 5.9px),0% calc(100% - 1.6px))}\n.mrpc-vx.mrpc-v-receipt .rc .t{text-align:center;font-weight:700;letter-spacing:.24em;font-size:13px}\n.mrpc-vx.mrpc-v-receipt .rc .s{text-align:center;font-size:10px;letter-spacing:.14em;color:var(--mu);margin-bottom:6px}\n.mrpc-vx.mrpc-v-receipt .rc .hr{border-top:1px dashed var(--tx);margin:6px 0}\n.mrpc-vx.mrpc-v-receipt .rc .ln{display:flex;justify-content:space-between;gap:10px}\n.mrpc-vx.mrpc-v-receipt .rc .ln b{font-weight:400}\n.mrpc-vx.mrpc-v-receipt .rc .tot{display:flex;justify-content:space-between;font-weight:700;font-size:14px;letter-spacing:.06em}\n.mrpc-vx.mrpc-v-receipt .rc .pl{font:700 15px \"Gowun Batang\",serif;text-align:center;margin:4px 0 2px}\n.mrpc-vx.mrpc-v-receipt .rc .bc{width:70%;height:26px;margin:8px auto 2px;background:repeating-linear-gradient(90deg,var(--tx) 0 1px,#0000 1px 3px,var(--tx) 3px 5px,#0000 5px 6px,var(--tx) 6px 7px,#0000 7px 10px,var(--tx) 10px 12px,#0000 12px 13px)}\n.mrpc-vx.mrpc-v-receipt .rc .ty{text-align:center;font-size:10px;letter-spacing:.2em;color:var(--mu)}\n.mrpc-vx.mrpc-v-receipt .rcc{filter:drop-shadow(0 1px 1px rgba(0,0,0,.16));display:inline-flex;align-items:center;gap:.4em;padding:4px 12px 7px;background:var(--sf);font:400 12.5px \"Courier Prime\",\"Gowun Batang\",monospace;box-shadow:0 1px 2px rgba(0,0,0,.14);-webkit-mask:linear-gradient(#000 0 0) top/100% calc(100% - 8px) no-repeat,url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%20160%209%27%20preserveAspectRatio%3D%27none%27%3E%3Cpath%20d%3D%27M0%200%20L0.0%202.79%20L2.5%203.73%20L5.0%203.18%20L7.5%203.88%20L10.0%204.44%20L12.5%205.52%20L15.0%205.31%20L17.5%205.85%20L20.0%206.42%20L22.5%208.07%20L25.0%207.77%20L27.5%208.48%20L30.0%208.14%20L32.5%208.41%20L35.0%208.00%20L37.5%208.16%20L40.0%206.73%20L42.5%205.95%20L45.0%205.55%20L47.5%204.57%20L50.0%205.00%20L52.5%204.70%20L55.0%205.49%20L57.5%204.23%20L60.0%204.09%20L62.5%204.10%20L65.0%204.46%20L67.5%204.34%20L70.0%204.72%20L72.5%205.26%20L75.0%205.88%20L77.5%205.03%20L80.0%206.38%20L82.5%205.72%20L85.0%204.61%20L87.5%205.04%20L90.0%205.11%20L92.5%205.18%20L95.0%205.11%20L97.5%205.74%20L100.0%206.13%20L102.5%206.57%20L105.0%207.11%20L107.5%206.79%20L110.0%205.80%20L112.5%205.86%20L115.0%205.87%20L117.5%206.09%20L120.0%206.41%20L122.5%205.23%20L125.0%206.41%20L127.5%207.01%20L130.0%206.41%20L132.5%206.84%20L135.0%207.52%20L137.5%207.28%20L140.0%206.84%20L142.5%206.51%20L145.0%205.77%20L147.5%204.76%20L150.0%204.10%20L152.5%203.50%20L155.0%203.67%20L157.5%202.87%20L160.0%203.48%20L160%200Z%27%20fill%3D%27black%27/%3E%3C/svg%3E\") bottom/100% 9px no-repeat;mask:linear-gradient(#000 0 0) top/100% calc(100% - 8px) no-repeat,url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%20160%209%27%20preserveAspectRatio%3D%27none%27%3E%3Cpath%20d%3D%27M0%200%20L0.0%202.79%20L2.5%203.73%20L5.0%203.18%20L7.5%203.88%20L10.0%204.44%20L12.5%205.52%20L15.0%205.31%20L17.5%205.85%20L20.0%206.42%20L22.5%208.07%20L25.0%207.77%20L27.5%208.48%20L30.0%208.14%20L32.5%208.41%20L35.0%208.00%20L37.5%208.16%20L40.0%206.73%20L42.5%205.95%20L45.0%205.55%20L47.5%204.57%20L50.0%205.00%20L52.5%204.70%20L55.0%205.49%20L57.5%204.23%20L60.0%204.09%20L62.5%204.10%20L65.0%204.46%20L67.5%204.34%20L70.0%204.72%20L72.5%205.26%20L75.0%205.88%20L77.5%205.03%20L80.0%206.38%20L82.5%205.72%20L85.0%204.61%20L87.5%205.04%20L90.0%205.11%20L92.5%205.18%20L95.0%205.11%20L97.5%205.74%20L100.0%206.13%20L102.5%206.57%20L105.0%207.11%20L107.5%206.79%20L110.0%205.80%20L112.5%205.86%20L115.0%205.87%20L117.5%206.09%20L120.0%206.41%20L122.5%205.23%20L125.0%206.41%20L127.5%207.01%20L130.0%206.41%20L132.5%206.84%20L135.0%207.52%20L137.5%207.28%20L140.0%206.84%20L142.5%206.51%20L145.0%205.77%20L147.5%204.76%20L150.0%204.10%20L152.5%203.50%20L155.0%203.67%20L157.5%202.87%20L160.0%203.48%20L160%200Z%27%20fill%3D%27black%27/%3E%3C/svg%3E\") bottom/100% 9px no-repeat,96.9% calc(100% - 2.6px),94.2% calc(100% - 2.2px),85.6% calc(100% - 2.0px),77.3% calc(100% - 1.5px),76.6% calc(100% - 3.0px),69.2% calc(100% - 1.0px),54.2% calc(100% - 2.5px),53.2% calc(100% - 2.5px),52.8% calc(100% - 2.5px),36.9% calc(100% - 0.9px),33.3% calc(100% - 0.8px),26.6% calc(100% - 1.8px),17.4% calc(100% - 2.2px),16.8% calc(100% - 1.8px),15.4% calc(100% - 0.6px),3.7% calc(100% - 2.4px),3.3% calc(100% - 2.1px),0% calc(100% - 0.8px))}\n.mrpc-vx.mrpc-v-receipt .rcc.on{background:var(--tx);color:var(--sf)}\n.mrpc-vx.mrpc-v-receipt .rcc.on .k{color:var(--soft)}\n.mrpc-vx.mrpc-v-receipt .rcp{position:relative;margin:12px 6px 0;padding:14px 16px 18px;background:var(--sf);font:400 12.5px/1.7 \"Courier Prime\",\"Gowun Batang\",monospace;box-shadow:0 1px 3px rgba(0,0,0,.12);-webkit-mask:linear-gradient(#000 0 0) top/100% calc(100% - 19px) no-repeat,url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%20600%2020%27%20preserveAspectRatio%3D%27none%27%3E%3Cpath%20d%3D%27M0%200%20L0.0%208.81%20L2.3%2010.19%20L4.7%209.35%20L7.0%2010.04%20L9.4%208.83%20L11.7%209.61%20L14.1%207.46%20L16.4%208.60%20L18.8%208.29%20L21.1%209.30%20L23.4%208.84%20L25.8%208.39%20L28.1%208.20%20L30.5%208.08%20L32.8%207.57%20L35.2%206.10%20L37.5%207.14%20L39.8%207.51%20L42.2%207.88%20L44.5%207.14%20L46.9%206.12%20L49.2%207.38%20L51.6%205.97%20L53.9%207.18%20L56.2%206.79%20L58.6%206.29%20L60.9%207.22%20L63.3%206.92%20L65.6%206.93%20L68.0%206.92%20L70.3%208.10%20L72.7%207.48%20L75.0%206.29%20L77.3%207.71%20L79.7%205.48%20L82.0%203.80%20L84.4%204.27%20L86.7%204.94%20L89.1%204.34%20L91.4%204.97%20L93.8%204.03%20L96.1%203.36%20L98.4%204.63%20L100.8%204.70%20L103.1%202.17%20L105.5%203.80%20L107.8%203.61%20L110.2%203.87%20L112.5%204.46%20L114.8%204.51%20L117.2%205.34%20L119.5%203.89%20L121.9%205.14%20L124.2%206.77%20L126.6%207.52%20L128.9%206.75%20L131.2%206.45%20L133.6%207.88%20L135.9%206.64%20L138.3%207.44%20L140.6%208.02%20L143.0%206.76%20L145.3%207.02%20L147.7%206.23%20L150.0%206.48%20L152.3%207.12%20L154.7%205.16%20L157.0%205.46%20L159.4%206.64%20L161.7%206.91%20L164.1%208.07%20L166.4%207.12%20L168.8%208.21%20L171.1%206.82%20L173.4%207.33%20L175.8%206.64%20L178.1%207.61%20L180.5%208.68%20L182.8%208.68%20L185.2%2010.03%20L187.5%209.84%20L189.8%2011.00%20L192.2%2010.49%20L194.5%2010.08%20L196.9%209.29%20L199.2%209.05%20L201.6%209.63%20L203.9%2010.68%20L206.2%2011.67%20L208.6%2010.54%20L210.9%2011.43%20L213.3%2011.50%20L215.6%2011.31%20L218.0%2010.63%20L220.3%2011.69%20L222.7%2013.17%20L225.0%2013.40%20L227.3%2012.07%20L229.7%2012.30%20L232.0%2013.49%20L234.4%2012.05%20L236.7%2012.17%20L239.1%2013.47%20L241.4%2013.53%20L243.8%2013.74%20L246.1%2013.63%20L248.4%2013.04%20L250.8%2012.80%20L253.1%2012.35%20L255.5%2013.64%20L257.8%2012.88%20L260.2%2012.08%20L262.5%2013.16%20L264.8%2012.60%20L267.2%2014.08%20L269.5%2014.13%20L271.9%2015.44%20L274.2%2018.18%20L276.6%2017.17%20L278.9%2018.18%20L281.2%2018.09%20L283.6%2018.60%20L285.9%2017.01%20L288.3%2018.44%20L290.6%2018.42%20L293.0%2017.52%20L295.3%2017.49%20L297.7%2017.54%20L300.0%2018.91%20L302.3%2017.40%20L304.7%2019.15%20L307.0%2018.20%20L309.4%2017.00%20L311.7%2016.40%20L314.1%2016.88%20L316.4%2015.36%20L318.8%2015.49%20L321.1%2015.69%20L323.4%2016.02%20L325.8%2015.46%20L328.1%2013.97%20L330.5%2012.71%20L332.8%2012.97%20L335.2%2011.91%20L337.5%2012.23%20L339.8%2013.80%20L342.2%2012.33%20L344.5%2012.99%20L346.9%2012.45%20L349.2%2014.01%20L351.6%2013.55%20L353.9%2013.73%20L356.2%2014.69%20L358.6%2015.17%20L360.9%2015.91%20L363.3%2014.45%20L365.6%2014.13%20L368.0%2013.92%20L370.3%2013.58%20L372.7%2014.89%20L375.0%2013.16%20L377.3%2013.00%20L379.7%2012.47%20L382.0%2013.77%20L384.4%2013.93%20L386.7%2012.56%20L389.1%2012.44%20L391.4%2012.43%20L393.8%2014.38%20L396.1%2013.62%20L398.4%2013.24%20L400.8%2013.92%20L403.1%2013.70%20L405.5%2014.70%20L407.8%2015.98%20L410.2%2015.12%20L412.5%2015.55%20L414.8%2014.90%20L417.2%2016.20%20L419.5%2015.30%20L421.9%2015.47%20L424.2%2014.66%20L426.6%2015.72%20L428.9%2016.40%20L431.2%2016.83%20L433.6%2016.24%20L435.9%2016.60%20L438.3%2017.28%20L440.6%2017.54%20L443.0%2016.24%20L445.3%2014.99%20L447.7%2015.02%20L450.0%2015.44%20L452.3%2017.07%20L454.7%2015.61%20L457.0%2015.38%20L459.4%2015.74%20L461.7%2015.20%20L464.1%2013.93%20L466.4%2015.21%20L468.8%2015.20%20L471.1%2015.69%20L473.4%2013.97%20L475.8%2014.17%20L478.1%2014.64%20L480.5%2013.77%20L482.8%2013.28%20L485.2%2012.40%20L487.5%2011.96%20L489.8%2011.63%20L492.2%209.54%20L494.5%208.53%20L496.9%208.90%20L499.2%2010.44%20L501.6%2011.10%20L503.9%2010.20%20L506.2%209.49%20L508.6%209.55%20L510.9%207.72%20L513.3%208.86%20L515.6%209.11%20L518.0%209.43%20L520.3%208.53%20L522.7%209.47%20L525.0%208.17%20L527.3%208.53%20L529.7%209.80%20L532.0%208.13%20L534.4%209.18%20L536.7%207.35%20L539.1%207.49%20L541.4%207.61%20L543.8%207.71%20L546.1%207.39%20L548.4%208.43%20L550.8%208.26%20L553.1%208.87%20L555.5%207.78%20L557.8%207.85%20L560.2%208.78%20L562.5%208.32%20L564.8%209.78%20L567.2%209.03%20L569.5%2010.12%20L571.9%2010.89%20L574.2%2010.63%20L576.6%209.58%20L578.9%209.38%20L581.2%208.76%20L583.6%209.08%20L585.9%206.89%20L588.3%208.23%20L590.6%207.68%20L593.0%207.31%20L595.3%208.27%20L597.7%208.45%20L600.0%208.98%20L600%200Z%27%20fill%3D%27black%27/%3E%3C/svg%3E\") bottom/100% 20px no-repeat;mask:linear-gradient(#000 0 0) top/100% calc(100% - 19px) no-repeat,url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%20600%2020%27%20preserveAspectRatio%3D%27none%27%3E%3Cpath%20d%3D%27M0%200%20L0.0%208.81%20L2.3%2010.19%20L4.7%209.35%20L7.0%2010.04%20L9.4%208.83%20L11.7%209.61%20L14.1%207.46%20L16.4%208.60%20L18.8%208.29%20L21.1%209.30%20L23.4%208.84%20L25.8%208.39%20L28.1%208.20%20L30.5%208.08%20L32.8%207.57%20L35.2%206.10%20L37.5%207.14%20L39.8%207.51%20L42.2%207.88%20L44.5%207.14%20L46.9%206.12%20L49.2%207.38%20L51.6%205.97%20L53.9%207.18%20L56.2%206.79%20L58.6%206.29%20L60.9%207.22%20L63.3%206.92%20L65.6%206.93%20L68.0%206.92%20L70.3%208.10%20L72.7%207.48%20L75.0%206.29%20L77.3%207.71%20L79.7%205.48%20L82.0%203.80%20L84.4%204.27%20L86.7%204.94%20L89.1%204.34%20L91.4%204.97%20L93.8%204.03%20L96.1%203.36%20L98.4%204.63%20L100.8%204.70%20L103.1%202.17%20L105.5%203.80%20L107.8%203.61%20L110.2%203.87%20L112.5%204.46%20L114.8%204.51%20L117.2%205.34%20L119.5%203.89%20L121.9%205.14%20L124.2%206.77%20L126.6%207.52%20L128.9%206.75%20L131.2%206.45%20L133.6%207.88%20L135.9%206.64%20L138.3%207.44%20L140.6%208.02%20L143.0%206.76%20L145.3%207.02%20L147.7%206.23%20L150.0%206.48%20L152.3%207.12%20L154.7%205.16%20L157.0%205.46%20L159.4%206.64%20L161.7%206.91%20L164.1%208.07%20L166.4%207.12%20L168.8%208.21%20L171.1%206.82%20L173.4%207.33%20L175.8%206.64%20L178.1%207.61%20L180.5%208.68%20L182.8%208.68%20L185.2%2010.03%20L187.5%209.84%20L189.8%2011.00%20L192.2%2010.49%20L194.5%2010.08%20L196.9%209.29%20L199.2%209.05%20L201.6%209.63%20L203.9%2010.68%20L206.2%2011.67%20L208.6%2010.54%20L210.9%2011.43%20L213.3%2011.50%20L215.6%2011.31%20L218.0%2010.63%20L220.3%2011.69%20L222.7%2013.17%20L225.0%2013.40%20L227.3%2012.07%20L229.7%2012.30%20L232.0%2013.49%20L234.4%2012.05%20L236.7%2012.17%20L239.1%2013.47%20L241.4%2013.53%20L243.8%2013.74%20L246.1%2013.63%20L248.4%2013.04%20L250.8%2012.80%20L253.1%2012.35%20L255.5%2013.64%20L257.8%2012.88%20L260.2%2012.08%20L262.5%2013.16%20L264.8%2012.60%20L267.2%2014.08%20L269.5%2014.13%20L271.9%2015.44%20L274.2%2018.18%20L276.6%2017.17%20L278.9%2018.18%20L281.2%2018.09%20L283.6%2018.60%20L285.9%2017.01%20L288.3%2018.44%20L290.6%2018.42%20L293.0%2017.52%20L295.3%2017.49%20L297.7%2017.54%20L300.0%2018.91%20L302.3%2017.40%20L304.7%2019.15%20L307.0%2018.20%20L309.4%2017.00%20L311.7%2016.40%20L314.1%2016.88%20L316.4%2015.36%20L318.8%2015.49%20L321.1%2015.69%20L323.4%2016.02%20L325.8%2015.46%20L328.1%2013.97%20L330.5%2012.71%20L332.8%2012.97%20L335.2%2011.91%20L337.5%2012.23%20L339.8%2013.80%20L342.2%2012.33%20L344.5%2012.99%20L346.9%2012.45%20L349.2%2014.01%20L351.6%2013.55%20L353.9%2013.73%20L356.2%2014.69%20L358.6%2015.17%20L360.9%2015.91%20L363.3%2014.45%20L365.6%2014.13%20L368.0%2013.92%20L370.3%2013.58%20L372.7%2014.89%20L375.0%2013.16%20L377.3%2013.00%20L379.7%2012.47%20L382.0%2013.77%20L384.4%2013.93%20L386.7%2012.56%20L389.1%2012.44%20L391.4%2012.43%20L393.8%2014.38%20L396.1%2013.62%20L398.4%2013.24%20L400.8%2013.92%20L403.1%2013.70%20L405.5%2014.70%20L407.8%2015.98%20L410.2%2015.12%20L412.5%2015.55%20L414.8%2014.90%20L417.2%2016.20%20L419.5%2015.30%20L421.9%2015.47%20L424.2%2014.66%20L426.6%2015.72%20L428.9%2016.40%20L431.2%2016.83%20L433.6%2016.24%20L435.9%2016.60%20L438.3%2017.28%20L440.6%2017.54%20L443.0%2016.24%20L445.3%2014.99%20L447.7%2015.02%20L450.0%2015.44%20L452.3%2017.07%20L454.7%2015.61%20L457.0%2015.38%20L459.4%2015.74%20L461.7%2015.20%20L464.1%2013.93%20L466.4%2015.21%20L468.8%2015.20%20L471.1%2015.69%20L473.4%2013.97%20L475.8%2014.17%20L478.1%2014.64%20L480.5%2013.77%20L482.8%2013.28%20L485.2%2012.40%20L487.5%2011.96%20L489.8%2011.63%20L492.2%209.54%20L494.5%208.53%20L496.9%208.90%20L499.2%2010.44%20L501.6%2011.10%20L503.9%2010.20%20L506.2%209.49%20L508.6%209.55%20L510.9%207.72%20L513.3%208.86%20L515.6%209.11%20L518.0%209.43%20L520.3%208.53%20L522.7%209.47%20L525.0%208.17%20L527.3%208.53%20L529.7%209.80%20L532.0%208.13%20L534.4%209.18%20L536.7%207.35%20L539.1%207.49%20L541.4%207.61%20L543.8%207.71%20L546.1%207.39%20L548.4%208.43%20L550.8%208.26%20L553.1%208.87%20L555.5%207.78%20L557.8%207.85%20L560.2%208.78%20L562.5%208.32%20L564.8%209.78%20L567.2%209.03%20L569.5%2010.12%20L571.9%2010.89%20L574.2%2010.63%20L576.6%209.58%20L578.9%209.38%20L581.2%208.76%20L583.6%209.08%20L585.9%206.89%20L588.3%208.23%20L590.6%207.68%20L593.0%207.31%20L595.3%208.27%20L597.7%208.45%20L600.0%208.98%20L600%200Z%27%20fill%3D%27black%27/%3E%3C/svg%3E\") bottom/100% 20px no-repeat,96.7% calc(100% - 3.8px),93.9% calc(100% - 6.0px),85.1% calc(100% - 3.9px),82.0% calc(100% - 6.7px),81.0% calc(100% - 3.9px),78.8% calc(100% - 4.4px),69.5% calc(100% - 3.6px),67.7% calc(100% - 3.1px),64.8% calc(100% - 4.3px),63.6% calc(100% - 2.6px),62.5% calc(100% - 0.7px),58.4% calc(100% - 3.4px),58.0% calc(100% - 4.2px),57.6% calc(100% - 2.2px),57.3% calc(100% - 0.5px),54.7% calc(100% - 5.1px),53.5% calc(100% - 3.9px),50.7% calc(100% - 1.5px),45.4% calc(100% - 6.1px),43.5% calc(100% - 2.9px),42.9% calc(100% - 4.2px),42.6% calc(100% - 1.7px),39.9% calc(100% - 2.1px),37.5% calc(100% - 4.8px),36.8% calc(100% - 1.2px),32.7% calc(100% - 1.5px),31.8% calc(100% - 3.1px),31.2% calc(100% - 0.4px),30.4% calc(100% - 2.1px),29.4% calc(100% - 4.8px),24.9% calc(100% - 2.8px),22.9% calc(100% - 7.2px),21.2% calc(100% - 4.0px),18.7% calc(100% - 4.1px),15.8% calc(100% - 6.6px),15.1% calc(100% - 5.5px),13.1% calc(100% - 1.1px),12.5% calc(100% - 5.4px),9.9% calc(100% - 0.9px),8.1% calc(100% - 0.5px),7.8% calc(100% - 3.2px),7.2% calc(100% - 1.6px),6.8% calc(100% - 2.1px),6.7% calc(100% - 4.3px),5.6% calc(100% - 2.5px),4.7% calc(100% - 5.9px),0% calc(100% - 1.6px))}\n.mrpc-vx.mrpc-v-receipt .rcp .it{display:grid;grid-template-columns:3.2em minmax(0,1fr);gap:.4em;padding:2px 0}\n.mrpc-vx.mrpc-v-receipt .rcp .it span:first-child{color:var(--mu)}\n/* v-tag */\n.mrpc-vx.mrpc-v-tag .lt::after,.mrpc-vx.mrpc-v-tag .ltp::after{content:\"\";position:absolute;inset:1px;z-index:-1;background:var(--sf);clip-path:polygon(21.4px 0,100% 0,100% 100%,21.4px 100%,0 calc(100% - 21.4px),0 21.4px)}\n.mrpc-vx.mrpc-v-tag .lt{position:relative;display:grid;grid-template-columns:4.4em minmax(0,1fr);margin:6px 0 0 18px;background:var(--ln);isolation:isolate;\n clip-path:polygon(22px 0,100% 0,100% 100%,22px 100%,0 calc(100% - 22px),0 22px)}\n.mrpc-vx.mrpc-v-tag .ltw{position:relative}\n.mrpc-vx.mrpc-v-tag .ltw .str{position:absolute;left:-2px;top:50%;width:40px;height:1.2px;background:var(--tx);transform:rotate(-14deg);transform-origin:right}\n.mrpc-vx.mrpc-v-tag .lt .hole{position:absolute;left:12px;top:50%;width:16px;height:16px;margin-top:-8px;border-radius:50%;background:transparent;box-shadow:0 0 0 1px var(--ln),0 0 0 4px var(--soft),0 0 0 5px var(--ln)}\n.mrpc-vx.mrpc-v-tag .lt .side{border-right:1px dashed var(--ln);display:flex;align-items:center;justify-content:center}\n.mrpc-vx.mrpc-v-tag .lt .side span{writing-mode:vertical-rl;transform:rotate(180deg);font:700 9px \"Courier Prime\",monospace;letter-spacing:.3em;color:var(--mu);margin-left:26px}\n.mrpc-vx.mrpc-v-tag .lt .main{padding:12px 16px 12px 14px}\n.mrpc-vx.mrpc-v-tag .lt .main .mk{display:block}\n.mrpc-vx.mrpc-v-tag .lt .to{font-size:1.25em;font-weight:700;letter-spacing:.03em;border-bottom:1px solid var(--tx);padding-bottom:2px;margin:2px 0 8px}\n.mrpc-vx.mrpc-v-tag .lt .g{display:grid;grid-template-columns:repeat(3,auto);justify-content:space-between;gap:4px}\n.mrpc-vx.mrpc-v-tag .lt .g b{display:block;font:700 1em \"Cormorant Garamond\",\"Gowun Batang\",serif;letter-spacing:.04em}\n.mrpc-vx.mrpc-v-tag .ltc{display:inline-flex;align-items:center;gap:.45em;padding:.28em .9em .28em 1.5em;background:var(--sf);border:1px solid var(--ln);font-size:.86em;position:relative;clip-path:polygon(9px 0,100% 0,100% 100%,9px 100%,0 50%)}\n.mrpc-vx.mrpc-v-tag .ltc::before{content:\"\";position:absolute;left:8px;top:50%;width:5px;height:5px;margin-top:-2.5px;border-radius:50%;border:1px solid var(--tx)}\n.mrpc-vx.mrpc-v-tag .ltc.on{background:var(--tx);color:var(--sf)}\n.mrpc-vx.mrpc-v-tag .ltc.on::before{border-color:var(--soft)}\n.mrpc-vx.mrpc-v-tag .ltc.on .k{color:var(--soft)}\n.mrpc-vx.mrpc-v-tag .ltp{position:relative;margin:12px 0 0 18px;padding:12px 16px 12px 40px;background:var(--ln);isolation:isolate;clip-path:polygon(22px 0,100% 0,100% 100%,22px 100%,0 calc(100% - 22px),0 22px)}\n.mrpc-vx.mrpc-v-tag .ltp .hole{position:absolute;left:12px;top:50%;width:14px;height:14px;margin-top:-7px;border-radius:50%;background:transparent;box-shadow:0 0 0 1px var(--ln)}\n.mrpc-vx.mrpc-v-tag .ltp .who{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid var(--tx);padding-bottom:2px;margin-bottom:6px}\n.mrpc-vx.mrpc-v-tag .lt{-webkit-mask:radial-gradient(circle 8px at 20px 50%,#0000 98%,#000);mask:radial-gradient(circle 8px at 20px 50%,#0000 98%,#000)}\n.mrpc-vx.mrpc-v-tag .ltp{-webkit-mask:radial-gradient(circle 7px at 19px 50%,#0000 98%,#000);mask:radial-gradient(circle 7px at 19px 50%,#0000 98%,#000)}\n/* v-key */\n.mrpc-vx.mrpc-v-key .kt{display:grid;grid-template-columns:auto minmax(0,1fr);gap:16px;align-items:center;padding:4px 4px}\n.mrpc-vx.mrpc-v-key .fob{position:relative;width:96px;height:132px;background:var(--tx);color:var(--sf);border-radius:48px 48px 14px 14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}\n.mrpc-vx.mrpc-v-key .fob{-webkit-mask:radial-gradient(circle 7px at 50% 17px,#0000 98%,#000);mask:radial-gradient(circle 7px at 50% 17px,#0000 98%,#000)}\n.mrpc-vx.mrpc-v-key .fobw{position:relative;margin-top:22px}\n.mrpc-vx.mrpc-v-key .fobw .ring{position:absolute;z-index:1;top:-24px;left:50%;width:30px;height:30px;margin-left:-15px;border:2.5px solid var(--ln);border-radius:50%}\n.mrpc-vx.mrpc-v-key .fob .rn{font:700 34px/1 \"Cormorant Garamond\",serif;letter-spacing:.02em;margin-top:10px}\n.mrpc-vx.mrpc-v-key .fob .mk{color:var(--soft)}\n.mrpc-vx.mrpc-v-key .fob .bfi{width:30px;color:var(--soft);margin-top:4px}\n.mrpc-vx.mrpc-v-key .kt .info .ttl{font:700 9px \"Courier Prime\",monospace;letter-spacing:.28em;color:var(--mu)}\n.mrpc-vx.mrpc-v-key .kt .info .pl{font-size:1.25em;font-weight:700;letter-spacing:.03em;line-height:1.3;margin:2px 0 8px}\n.mrpc-vx.mrpc-v-key .kt .info .ln{display:flex;justify-content:space-between;border-top:1px dotted var(--ln);padding:4px 0;font-size:.9em}\n.mrpc-vx.mrpc-v-key .kt .info .ln span:first-child{font:700 9px/2 \"Courier Prime\",monospace;letter-spacing:.16em;color:var(--mu)}\n.mrpc-vx.mrpc-v-key .kc{display:inline-flex;align-items:center;gap:.45em;padding:.3em .9em .3em .5em;border:1px solid var(--ln);border-radius:999px 8px 8px 999px;background:var(--sf);font-size:.86em}\n.mrpc-vx.mrpc-v-key .kc i{display:inline-flex;align-items:center;justify-content:center;min-width:2.1em;height:1.5em;padding:0 4px;border-radius:999px 4px 4px 999px;background:var(--tx);color:var(--sf);font:700 11px \"Cormorant Garamond\",serif;font-style:normal}\n.mrpc-vx.mrpc-v-key .kc.on{background:var(--tx);color:var(--sf);border-color:var(--tx)}\n.mrpc-vx.mrpc-v-key .kc.on i{background:var(--sf);color:var(--tx)}\n.mrpc-vx.mrpc-v-key .kc.on .k{color:var(--soft)}\n.mrpc-vx.mrpc-v-key .ktp{display:grid;grid-template-columns:4.6em minmax(0,1fr);gap:12px;margin-top:12px;padding:10px 14px 10px 10px;background:var(--sf);border:1px solid var(--ln);border-radius:10px}\n.mrpc-vx.mrpc-v-key .ktp .mini{background:var(--tx);color:var(--sf);border-radius:24px 24px 8px 8px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:14px 2px 8px}\n.mrpc-vx.mrpc-v-key .ktp .mini b{font:700 22px/1 \"Cormorant Garamond\",serif}\n.mrpc-vx.mrpc-v-key .ktp .mini span{font-size:.78em;margin-top:4px}\n/* v-slide */\n.mrpc-vx.mrpc-v-slide .sl{display:grid;grid-template-columns:132px minmax(0,1fr);gap:16px;align-items:center}\n.mrpc-vx.mrpc-v-slide .mount{position:relative;width:132px;height:132px;background:var(--sf);border:1px solid var(--ln);border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.14);display:flex;align-items:center;justify-content:center}\n.mrpc-vx.mrpc-v-slide .mount .win{width:84px;height:58px;border-radius:6px;background:var(--tx);display:flex;align-items:center;justify-content:center;color:var(--soft);overflow:hidden;position:relative}\n.mrpc-vx.mrpc-v-slide .mount .win .bfi{width:46px}\n.mrpc-vx.mrpc-v-slide .mount .t{position:absolute;left:0;right:0;top:12px;text-align:center;font:700 8px \"Courier Prime\",monospace;letter-spacing:.22em;color:var(--mu)}\n.mrpc-vx.mrpc-v-slide .mount .b{position:absolute;left:0;right:0;bottom:10px;text-align:center;font:700 10.5px \"Gowun Batang\",serif;letter-spacing:.02em}\n.mrpc-vx.mrpc-v-slide .mount .l{position:absolute;left:8px;top:50%;transform:translateY(-50%) rotate(180deg);writing-mode:vertical-rl;font:700 7.5px \"Courier Prime\",monospace;letter-spacing:.2em;color:var(--mu)}\n.mrpc-vx.mrpc-v-slide .mount .r{position:absolute;right:8px;top:50%;transform:translateY(-50%);writing-mode:vertical-rl;font:700 7.5px \"Courier Prime\",monospace;letter-spacing:.2em;color:var(--mu)}\n.mrpc-vx.mrpc-v-slide .sl .info .ttl{font:700 9px \"Courier Prime\",monospace;letter-spacing:.28em;color:var(--mu)}\n.mrpc-vx.mrpc-v-slide .sl .info .pl{font-size:1.2em;font-weight:700;line-height:1.3;margin:3px 0 6px}\n.mrpc-vx.mrpc-v-slide .sl .info .d{font:700 1.3em/1.1 \"Cormorant Garamond\",serif;letter-spacing:.05em}\n.mrpc-vx.mrpc-v-slide .sl .info .tm{font:700 11px \"Courier Prime\",\"Gowun Batang\",monospace;letter-spacing:.14em;color:var(--mu);margin-top:3px}\n.mrpc-vx.mrpc-v-slide .slc{display:inline-flex;align-items:center;gap:.45em;padding:4px 10px 4px 5px;border:1px solid var(--ln);border-radius:6px;background:var(--sf);font-size:.86em}\n.mrpc-vx.mrpc-v-slide .slc i{width:18px;height:14px;border-radius:3px;background:var(--tx);box-shadow:inset 0 0 0 3px var(--sf),inset 0 0 0 4px var(--ln)}\n.mrpc-vx.mrpc-v-slide .slc.on{background:var(--tx);color:var(--sf);border-color:var(--tx)}\n.mrpc-vx.mrpc-v-slide .slc.on i{background:var(--soft);box-shadow:inset 0 0 0 3px var(--tx),inset 0 0 0 4px var(--soft)}\n.mrpc-vx.mrpc-v-slide .slc.on .k{color:var(--soft)}\n.mrpc-vx.mrpc-v-slide .slp{margin-top:12px;padding:10px;background:var(--sf);border:1px solid var(--ln);border-radius:8px;display:grid;grid-template-columns:4.4em minmax(0,1fr);gap:12px}\n.mrpc-vx.mrpc-v-slide .slp .w{background:var(--tx);color:var(--soft);border-radius:5px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:.8em;padding:6px 2px;text-align:center}\n/* v-bookmark */\n.mrpc-vx.mrpc-v-bookmark .bm{display:grid;grid-template-columns:64px minmax(0,1fr);gap:16px;align-items:start}\n.mrpc-vx.mrpc-v-bookmark .bmk{position:relative;width:64px;height:176px;background:var(--tx);color:var(--soft);clip-path:polygon(0 0,100% 0,100% 100%,50% calc(100% - 16px),0 100%);display:flex;flex-direction:column;align-items:center;padding-top:16px;gap:8px}\n.mrpc-vx.mrpc-v-bookmark .bmk::before{content:\"\";position:absolute;inset:4px 4px 0;border:1px solid color-mix(in srgb,var(--soft) 55%,#0000);clip-path:polygon(0 0,100% 0,100% calc(100% - 4px),50% calc(100% - 18px),0 calc(100% - 4px))}\n.mrpc-vx.mrpc-v-bookmark .bmk .bfi{width:40px}\n.mrpc-vx.mrpc-v-bookmark .bmk .v{writing-mode:vertical-rl;font:700 10px \"Courier Prime\",monospace;letter-spacing:.3em}\n.mrpc-vx.mrpc-v-bookmark .bmk .hole{width:8px;height:8px;flex:none}\n.mrpc-vx.mrpc-v-bookmark .bmk{-webkit-mask:radial-gradient(circle 4px at 50% 20px,#0000 98%,#000);mask:radial-gradient(circle 4px at 50% 20px,#0000 98%,#000)}\n.mrpc-vx.mrpc-v-bookmark .bmw{position:relative;margin-top:20px}\n.mrpc-vx.mrpc-v-bookmark .bmw .tas{position:absolute;left:28px;top:-20px;width:8px;height:22px;border-left:1.5px solid var(--tx);border-right:1.5px solid var(--tx)}\n.mrpc-vx.mrpc-v-bookmark .bm .pg{padding-top:8px}\n.mrpc-vx.mrpc-v-bookmark .bm .q{font:600 italic 16px/1.5 \"Cormorant Garamond\",\"Gowun Batang\",serif;color:var(--mu)}\n.mrpc-vx.mrpc-v-bookmark .bm .pl{font-size:1.3em;font-weight:700;letter-spacing:.03em;margin:4px 0 8px;line-height:1.3}\n.mrpc-vx.mrpc-v-bookmark .bm .ln{display:flex;gap:8px;align-items:baseline;font-size:.9em;padding:3px 0;border-top:1px dotted var(--ln)}\n.mrpc-vx.mrpc-v-bookmark .bm .ln span:first-child{font:700 9px \"Courier Prime\",monospace;letter-spacing:.16em;color:var(--mu);width:5.6em}\n.mrpc-vx.mrpc-v-bookmark .bm .pgn{font:700 10px \"Courier Prime\",monospace;letter-spacing:.2em;color:var(--mu);margin-top:6px}\n.mrpc-vx.mrpc-v-bookmark .bmc{display:inline-flex;align-items:center;gap:.45em;padding:.3em .9em .3em .6em;border:1px solid var(--ln);background:var(--sf);font-size:.86em;clip-path:polygon(0 0,100% 0,calc(100% - 8px) 50%,100% 100%,0 100%);padding-right:1.4em}\n.mrpc-vx.mrpc-v-bookmark .bmc i{width:6px;height:16px;background:var(--tx);clip-path:polygon(0 0,100% 0,100% 100%,50% 75%,0 100%)}\n.mrpc-vx.mrpc-v-bookmark .bmc.on{background:var(--tx);color:var(--sf);border-color:var(--tx)}\n.mrpc-vx.mrpc-v-bookmark .bmc.on i{background:var(--soft)}\n.mrpc-vx.mrpc-v-bookmark .bmc.on .k{color:var(--soft)}\n.mrpc-vx.mrpc-v-bookmark .bmp{margin-top:12px;display:grid;grid-template-columns:28px minmax(0,1fr);gap:12px;padding:10px 14px 10px 10px;background:var(--sf);border:1px solid var(--ln);border-radius:4px}\n.mrpc-vx.mrpc-v-bookmark .bmp .rib{background:var(--tx);clip-path:polygon(0 0,100% 0,100% 100%,50% calc(100% - 10px),0 100%)}\n.mrpc-vx.mrpc-v-bookmark .bmp .h{font-weight:700;letter-spacing:.04em;border-bottom:1px solid var(--tx);padding-bottom:2px;margin-bottom:6px}\n.mrpc-vx.mrpc-v-receipt .rcp .hd2{display:flex;justify-content:space-between;font-weight:700;border-bottom:1px dashed var(--tx);padding-bottom:3px;margin-bottom:4px}.mrpc-vx.mrpc-v-receipt .rcp .hd2 span:first-child{font-family:\"Gowun Batang\",serif}\n.mrpc-vx.mrpc-v-slide .slp .w .bfi{width:34px}.mrpc-vx.mrpc-v-slide .sl .info .d small{font:700 .55em \"Gowun Batang\",serif}\n.mrpc-vx.mrpc-v-key .kt .info .ln span:last-child{font-weight:400}\n.mrpc-vx.mrpc-v-tag .ltc{background:var(--ln);border:0;isolation:isolate}\n.mrpc-vx.mrpc-v-tag .ltc::after{content:\"\";position:absolute;inset:1px;z-index:-1;background:var(--sf);clip-path:polygon(8.5px 0,100% 0,100% 100%,8.5px 100%,0 50%)}\n.mrpc-vx.mrpc-v-tag .ltc.on::after{background:var(--tx)}\n.mrpc-vx.mrpc-v-bookmark .bmc{background:var(--ln);border:0;isolation:isolate;position:relative}\n.mrpc-vx.mrpc-v-bookmark .bmc::after{content:\"\";position:absolute;inset:1px;z-index:-1;background:var(--sf);clip-path:polygon(0 0,100% 0,calc(100% - 7.5px) 50%,100% 100%,0 100%)}\n.mrpc-vx.mrpc-v-bookmark .bmc.on::after{background:var(--tx)}\n.mrpc-vx.mrpc-v-receipt .rc{padding-bottom:34px}.mrpc-vx.mrpc-v-receipt .rcp{padding-bottom:30px}.mrpc-vx.mrpc-v-receipt .rcc{padding-bottom:10px}\n";
  {
    document.getElementById("mrpc-vintage-style")?.remove();
    const style = document.createElement("style");
    style.id = "mrpc-vintage-style";
    style.textContent = VINTAGE_CSS;
    (document.head || document.documentElement).append(style);
    cleanupCallbacks.push(() => style.remove());
  }
  function clean(value) {
    return String(value || "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+/g, " ")
      .trim();
  }
  function weatherIconName(weather) {
    const value = clean(weather).toLowerCase();
    if (!value) return "cloud";
    if (/천둥|번개|폭풍|뇌우|storm|thunder/.test(value)) return "storm";
    if (/눈|진눈깨비|설|snow|sleet/.test(value)) return "snow";
    if (/비|소나기|장마|이슬비|rain|shower|drizzle/.test(value)) return "rain";
    if (/안개|박무|연무|fog|mist|haze/.test(value)) return "fog";
    if (/바람|강풍|돌풍|wind|gust|breez|gale/.test(value)) return "wind";
    if (/맑|쾌청|햇빛|화창|sun|clear/.test(value)) return "sun";
    return "cloud";
  }
  function readChoice(key, fallback, options) {
    try {
      const value = localStorage.getItem(key);
      return options.some(([option]) => option === value) ? value : fallback;
    } catch {
      return fallback;
    }
  }
  function saveChoice(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }
  const ORNAMENT_ALIAS = { "n-chime": "n-chime-t", "z-pond-s": "z-pond-f", "z-pond-d": "z-pond-f", "z-pond-j": "z-pond-f", "z-pond": "z-pond-f", "typewriter": "f-scene-p", "m-lamp": "m-lamp-m", "moon-s": "moon-r", "x-opera": "x-opera-n", "y-program": "x-opera-n", "y-program-n": "x-opera-n", "f-scene": "f-scene-p", "t-forecast": "t-forecast-p", "k-daily": "k-daily-p", "k-station": "k-station-p", "r-stars-p": "r-stars", "k-station-c": "k-station-p", "k-station-ol": "k-station-p", "k-daily-w": "k-daily-p", "g-cross": "g-cross-n" };
  function currentOrnament() {
    try { const raw = localStorage.getItem(STORAGE_KEY_ORNAMENT); if (ORNAMENT_ALIAS[raw]) return ORNAMENT_ALIAS[raw]; } catch {}
    return readChoice(STORAGE_KEY_ORNAMENT, DEFAULT_ORNAMENT, ORNAMENT_OPTIONS);
  }
  function currentPalette() {
    return readChoice(STORAGE_KEY_PALETTE, DEFAULT_PALETTE, PALETTE_OPTIONS);
  }
  function parseStatus(text) {
    const value = String(text || "");
    const match = RAW_META.exec(value);
    if (match) {
      const year = match[1] ? (match[1].length === 4 ? match[1] : `20${match[1]}`) : (match[4].length === 4 ? match[4] : `20${match[4]}`);
      return {
        index: match.index,
        length: match[0].length,
        raw: match[0],
        weekday: (match[0].match(/\(\s*([월화수목금토일])(?:요일)?\s*\)/u) || [])[1] || null,
        year,
        month: match[1] ? match[2] : match[5].padStart(2, "0"),
        day: match[1] ? match[3] : match[6].padStart(2, "0"),
        time: match[7].replace(/\s+/g, "").replace("：", ":"),
        weather: clean(match[9]),
        location: clean(match[8]),
      };
    }
    return null;
  }
  function dropBlankText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const blanks = [];
    while (walker.nextNode()) if (!walker.currentNode.nodeValue.trim()) blanks.push(walker.currentNode);
    blanks.forEach((node) => node.remove());
  }
  function item(value, extraClass = "") {
    const element = document.createElement("span");
    element.className = `mrpc-item ${extraClass}`.trim();
    element.innerHTML = `
      <span class="mrpc-item-copy">
        <span class="mrpc-item-value"></span>
      </span>
    `;
    element.querySelector(".mrpc-item-value").textContent = value;
    dropBlankText(element);
    return element;
  }
  const INITIAL_ORNAMENTS = ["n-dropcap", "n-rubric"];
  function markHangul(card) {
    const host = card.closest(CONTENT_SELECTOR);
    const text = (host ? host.textContent : "") + " " + [...card.querySelectorAll(".mrpc-location .mrpc-item-value, .mrpc-weather .mrpc-item-value")].map((el) => el.textContent).join(" ");
    card.dataset.hangul = /[가-힣]/.test(text) ? "yes" : "no";
  }
  function setInitial(card, on, text = card.__mrpcLocation) {
    const value = card.querySelector(".mrpc-location .mrpc-item-value");
    if (!value || typeof text !== "string") return;
    const initial = on && /^([\s"'“‘(\[「『〈《]*)([A-Za-z]|[^\s"'“‘(\[「『〈《]+)/u.exec(text);
    value.textContent = text;
    delete card.dataset.initial;
    card.__mrpcInitText = text;
    if (!initial) return;
    card.dataset.initial = "letter";
  }
  function applyCardClasses(card) {
    const palette = currentPalette();
    const ornament = currentOrnament();
    for (const [value] of PALETTE_OPTIONS) card.classList.remove(`mrpc-palette-${value}`);
    for (const [value] of ORNAMENT_OPTIONS) card.classList.remove(`mrpc-ornament-${value}`);
    for (const value of Object.values(VARIANT_BASE)) card.classList.remove(`mrpc-ornament-${value}`);
    card.classList.add(`mrpc-theme-${FIXED_STYLE}`);
    card.classList.add(`mrpc-palette-${palette}`);
    for (const cls of [...card.classList]) if (cls.startsWith("mrpc-ornament-") || cls.startsWith("mo-")) card.classList.remove(cls);
    card.classList.add(`mrpc-ornament-${ornament}`, `mo-${ornament}`);
    for (let base = VARIANT_BASE[ornament], n = 0; base && n < 4; base = VARIANT_BASE[base], n += 1) card.classList.add(`mrpc-ornament-${base}`, `mo-${base}`);
    card.dataset.ornament = ornament;
    card.dataset.palette = palette;
    if (card.__mrpcCast) {
      renderCast(card.__mrpcCast, ornament, card);
      for (const [value] of PALETTE_OPTIONS) card.__mrpcCast.classList.remove(`mrpc-palette-${value}`);
      card.__mrpcCast.classList.add(`mrpc-palette-${palette}`);
    }
    syncVintage(card, ornament);
    if (INITIAL_ORNAMENTS.includes(ornament) || card.dataset.initial) setInitial(card, INITIAL_ORNAMENTS.includes(ornament));
    card.querySelector(".mrpc-proof-ins")?.remove();
    ensureWx(card, wantsWx(ornament));
    card.querySelectorAll(".mrpc-names").forEach((box) => box.remove());
  }
  const FX_ORNAMENTS = ["s-hourglass", "r-stars", "t-forecast", "k-daily", "m-pinwheel", "m-lamp", "m-window", "y-sji", "n-chime", "n-balloon", "z-obj"];
  const rootsOf = (o) => { const r = [o]; for (let b = VARIANT_BASE[o], n = 0; b && n < 4; b = VARIANT_BASE[b], n += 1) r.push(b); return r; };
  const wantsWx = (ornament) => rootsOf(ornament).some((o) => o === "p-wxmove" || FX_ORNAMENTS.includes(o));
  function ensureWx(card, wanted) {
    let keep = null;
    for (const box of card.querySelectorAll(".mrpc-wx")) {
      if (wanted && !keep && box.parentElement === card && box.children.length === 3) keep = box;
      else box.remove();
    }
    if (!wanted || keep) return;
    const box = document.createElement("span");
    box.className = "mrpc-wx";
    box.setAttribute("aria-hidden", "true");
    box.append(document.createElement("i"), document.createElement("i"), document.createElement("i"));
    card.append(box);
  }
  function createCard(meta, sourceText) {
    const card = document.createElement("span");
    card.className = "mrpc-card";
    card.setAttribute("role", "group");
    card.setAttribute(
      "aria-label",
      `작중 정보: ${meta.year}년 ${meta.month}월 ${meta.day}일, ${meta.time}, ${meta.weather || "날씨 미상"}, ${meta.location}`,
    );
    card.__mrpcSourceText = sourceText;
    card.__mrpcMeta = meta;
    const date = document.createElement("span");
    date.className = "mrpc-date";
    date.innerHTML = `
      <span class="mrpc-date-copy">
        <strong class="mrpc-date-value"></strong>
      </span>
    `;
    dropBlankText(date);
    const dateValue = date.querySelector(".mrpc-date-value");
    const weekdayKo = meta.weekday || "일월화수목금토"[new Date(Date.UTC(Number(meta.year), Number(meta.month) - 1, Number(meta.day))).getUTCDay()];
    card.__mrpcDate = `${meta.year}.${meta.month}.${meta.day} (${weekdayKo})`;
    dateValue.append(document.createTextNode(`${meta.year}.${meta.month}.${meta.day} `));
    const weekdayNode = document.createElement("span");
    weekdayNode.className = "mrpc-weekday";
    weekdayNode.textContent = `(${weekdayKo})`;
    dateValue.append(weekdayNode);
    dateValue.setAttribute("translate", "no"); dateValue.classList.add("notranslate");
    const details = document.createElement("span");
    details.className = "mrpc-details";
    details.append(item(meta.time, "mrpc-time"));
    if (meta.weather) {
      details.append(item(meta.weather, "mrpc-weather"));
    }
    details.append(item(meta.location, "mrpc-location"));
    card.__mrpcLocation = meta.location;
    card.dataset.hangul = /[가-힣]/.test(`${meta.location} ${meta.weather || ""}`) ? "yes" : "no";
    const hour = Number(meta.time.slice(0, 2));
    card.dataset.period = hour < 5 ? "night" : hour < 8 ? "dawn" : hour < 17 ? "day" : hour < 20 ? "dusk" : "night";
    card.dataset.sji = String(Math.floor(((hour + 1) % 24) / 2));
    {
      const mo = Number(meta.month);
      const st = [["Orion","오리온자리"],["Canis Major","큰개자리"],["Gemini","쌍둥이자리"],["Leo","사자자리"],["Boötes","목동자리"],["Scorpius","전갈자리"],["Lyra","거문고자리"],["Cygnus","백조자리"],["Sagittarius","궁수자리"],["Pegasus","페가수스자리"],["Andromeda","안드로메다자리"],["Perseus","페르세우스자리"]][mo - 1] || ["",""];
      card.dataset.starEn = st[0]; card.dataset.starKo = st[1];
    }
    {
      const y = Number(meta.year), mo = Number(meta.month), d = Number(meta.day), mm = Number(meta.time.slice(3, 5)) || 0, t = hour + mm / 60;
      const F = [["Camellia","동백"],["Plum Blossom","매화"],["Daffodil","수선화"],["Cherry Blossom","벚꽃"],["Rose","장미"],["Hydrangea","수국"],["Lotus","연꽃"],["Sunflower","해바라기"],["Balloon Flower","도라지꽃"],["Cosmos","코스모스"],["Chrysanthemum","국화"],["Poinsettia","포인세티아"]][mo - 1] || ["",""];
      card.dataset.flEn = F[0]; card.dataset.flKo = F[1]; card.dataset.mon = String(mo);
      card.style.setProperty("--burn", (mm / 60).toFixed(3));
    }
    card.dataset.weather = meta.weather ? weatherIconName(meta.weather) : "none";
    card.dataset.heavy = /heavy|torrential|downpour|pouring|폭우|호우|장대비|큰비|강한 ?비|집중 ?호우/i.test(meta.weather || "") ? "yes" : "no";
    {
      const y = Number(meta.year), mo = Number(meta.month), d = Number(meta.day), mm = Number(meta.time.slice(3, 5)) || 0;
      const wd = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
      details.dataset.wdKo = "일월화수목금토"[wd] + "요일"; details.dataset.wdEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][wd];
      card.dataset.sunday = wd === 0 ? "yes" : "no";
      {
        const t = hour * 60 + mm, P = [[0, 510, "등교 전", "Before school"], [510, 540, "조회", "Homeroom"], [540, 590, "1교시", "Period 1"], [600, 650, "2교시", "Period 2"], [660, 710, "3교시", "Period 3"], [720, 770, "4교시", "Period 4"], [770, 820, "점심시간", "Lunch"], [820, 870, "5교시", "Period 5"], [880, 930, "6교시", "Period 6"], [940, 990, "7교시", "Period 7"], [990, 1080, "방과 후", "After school"], [1080, 1320, "야간 자율 학습", "Evening study"], [1320, 1440, "하교 후", "After hours"]];
        const slot = P.find((x) => t >= x[0] && t < x[1]) || ["", "", "쉬는 시간", "Break"];
        card.dataset.ttKo = slot[2]; card.dataset.ttEn = slot[3];
        const wi = (wd + 6) % 7, mark = (arr) => arr.map((x, i) => (i === wi ? `[${x}]` : x)).join(" ");
        details.dataset.daysKo = mark([..."월화수목금토일"]); details.dataset.daysEn = mark(["M", "T", "W", "T", "F", "S", "S"]);
      }
      card.dataset.dnum = String(d);
      {
        card.dataset.season = mo >= 3 && mo <= 5 ? "spring" : mo >= 6 && mo <= 8 ? "summer" : mo >= 9 && mo <= 11 ? "autumn" : "winter";
        const age = (((Date.UTC(y, mo - 1, d, hour, mm) - Date.UTC(2000, 0, 6, 18, 14)) / 864e5) % 29.530588 + 29.530588) % 29.530588;
        { const f = age / 29.530588, lit = (1 - Math.cos(2 * Math.PI * f)) / 2; card.style.setProperty("--moonx", `${(f < 0.5 ? -1 : 1) * (17 * lit).toFixed(1)}px`); }
      }
      {
        card.dataset.line = String(mo);
        const TERMS = [[1,6,"소한","Minor Cold"],[1,20,"대한","Major Cold"],[2,4,"입춘","Start of Spring"],[2,19,"우수","Rain Water"],[3,6,"경칩","Awakening of Insects"],[3,21,"춘분","Spring Equinox"],[4,5,"청명","Clear and Bright"],[4,20,"곡우","Grain Rain"],[5,6,"입하","Start of Summer"],[5,21,"소만","Grain Buds"],[6,6,"망종","Grain in Ear"],[6,21,"하지","Summer Solstice"],[7,7,"소서","Minor Heat"],[7,23,"대서","Major Heat"],[8,8,"입추","Start of Autumn"],[8,23,"처서","End of Heat"],[9,8,"백로","White Dew"],[9,23,"추분","Autumn Equinox"],[10,8,"한로","Cold Dew"],[10,23,"상강","Frost's Descent"],[11,7,"입동","Start of Winter"],[11,22,"소설","Minor Snow"],[12,7,"대설","Major Snow"],[12,22,"동지","Winter Solstice"]];
        let term = TERMS[TERMS.length - 1]; for (const t of TERMS) if (mo > t[0] || (mo === t[0] && d >= t[1])) term = t;
        card.dataset.termKo = `절기 · ${term[2]}`; card.dataset.termEn = `solar term · ${term[3]}`;
        details.dataset.seatEn = `BOX ${(d % 9) + 1} · SEAT ${mo + (d % 20)}`; details.dataset.seatKo = `${(d % 9) + 1}번 박스 · ${mo + (d % 20)}석`;
      }
      details.dataset.monKo = `${mo}월`; details.dataset.monEn = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"][mo - 1] || "";
    }
    card.append(date, details);
    applyCardClasses(card);
    return card;
  }
  // 태그 바로 아래 '이름: 의상 | 자세 | 심리' 줄들 (이름은 무엇이든 가능, 칸은 2~3개)
  const MAX_CAST = 12;
  const CAST_LINE = /^[ \t]*(?:\r?\n[ \t]*)+(?:[-*•·][ \t]+)?([^\r\n:：|｜§]{1,40}?)[ \t]*[:：][ \t]*([^\r\n§]*?[|｜][^\r\n§]*?)[ \t]*(?=\r?\n|$)/u;
  const CAST_LABELS = ["의상", "자세", "심리"];
  function splitCastFields(text) {
    const m = /^(.*?)\s*[|｜]\s*(.*?)(?:\s*[|｜]\s*(.*))?$/su.exec(text) || [];
    return [m[1], m[2], m[3]].map(clean).filter((v, i) => i < 2 || v);
  }
  // '짜증 (￣^￣)' → ["짜증", "(￣^￣)"], '(；´Д`)' → ["", "(；´Д`)"]
  function splitMood(value) {
    const text = clean(value);
    if (!text) return ["", ""];
    const m = /^(.*?[가-힣A-Za-z].*?)\s+([^가-힣]*[^\sA-Za-z0-9가-힣.,!?~][^가-힣]*)$/u.exec(text);
    if (m) return [clean(m[1]), clean(m[2])];
    if (!/[가-힣A-Za-z]{2}/.test(text) && /[^\sA-Za-z0-9가-힣]/.test(text)) return ["", text];
    return [text, ""];
  }
  function createCast(list) {
    const box = document.createElement("span");
    box.className = "mrpc-cast";
    box.setAttribute("aria-label", "인물 상태");
    box.setAttribute("translate", "no");
    box.__list = list;
    return box;
  }
  function fillStdCast(box, list) {
    const chips = document.createElement("span");
    chips.className = "mrpc-cast-chips";
    const tickets = document.createElement("span");
    tickets.className = "mrpc-cast-tickets";
    list.forEach((person, n) => {
      const [moodText, kao] = splitMood(person.fields[2]);
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "mrpc-cast-chip";
      chip.dataset.index = String(n);
      chip.setAttribute("aria-expanded", "false");
      const name = document.createElement("span");
      name.className = "mrpc-cast-name";
      name.textContent = person.name;
      chip.append(name);
      if (kao) {
        const k = document.createElement("span");
        k.className = "mrpc-cast-kao";
        k.textContent = kao;
        chip.append(k);
      }
      chips.append(chip);
      const ticket = document.createElement("span");
      ticket.className = "mrpc-cast-ticket";
      ticket.dataset.index = String(n);
      ticket.hidden = true;
      ticket.innerHTML = '<span class="mrpc-cast-notch mrpc-cast-notch-l"></span><span class="mrpc-cast-notch mrpc-cast-notch-r"></span><span class="mrpc-cast-stub"><span class="mrpc-cast-admit"></span><span class="mrpc-cast-who"></span></span><span class="mrpc-cast-body"></span>';
      ticket.querySelector(".mrpc-cast-admit").textContent = `ADMIT · ${String(n + 1).padStart(2, "0")}`;
      ticket.querySelector(".mrpc-cast-who").textContent = person.name;
      const body = ticket.querySelector(".mrpc-cast-body");
      const rows = [[CAST_LABELS[0], person.fields[0]], [CAST_LABELS[1], person.fields[1]]];
      if (person.fields[2]) rows.push([CAST_LABELS[2], moodText, kao]);
      for (const [label, value, k] of rows) {
        if (!value && !k) continue;
        const row = document.createElement("span");
        row.className = "mrpc-cast-row";
        const lb = document.createElement("span");
        lb.className = "mrpc-cast-label";
        lb.textContent = label;
        const val = document.createElement("span");
        val.className = "mrpc-cast-value";
        val.textContent = value ? value + (k ? " " : "") : "";
        if (k) {
          const kk = document.createElement("span");
          kk.className = "mrpc-cast-kao";
          kk.textContent = k;
          val.append(kk);
        }
        row.append(lb, val);
        body.append(row);
      }
      tickets.append(ticket);
    });
    box.append(chips, tickets);
  }
  function toggleCast(chip) {
    const box = chip.closest(".mrpc-cast");
    if (!box) return;
    const index = chip.dataset.index;
    const opening = chip.getAttribute("aria-expanded") !== "true";
    for (const c of box.querySelectorAll(".mrpc-cast-chip")) { c.setAttribute("aria-expanded", String(opening && c === chip)); c.classList.toggle("on", opening && c === chip); }
    for (const t of box.querySelectorAll(".mrpc-cast-ticket")) t.hidden = !(opening && t.dataset.index === index);
    box.toggleAttribute("data-open", opening);
  }
  // ── 빈티지 소품 모양 12가지: 카드 자리에 따로 그린 종이 소품을 놓고, 인물 상태도 같은 모양으로 ──
  const VINTAGE = {
    "v-stamp": "소인 우표", "v-lp": "LP 슬리브", "v-scrap": "스크랩북", "v-chart": "별자리 차트",
    "v-board": "탑승권", "v-post": "엽서", "v-film": "필름", "v-match": "성냥갑",
    "v-tarot": "타로", "v-log": "관측 일지", "v-spec": "나비 표본", "v-exlib": "장서표",
    "v-receipt": "영수증", "v-tag": "수하물 태그", "v-key": "호텔 열쇠", "v-slide": "슬라이드 필름", "v-bookmark": "책갈피",
  };
  const isVintage = (ornament) => Object.prototype.hasOwnProperty.call(VINTAGE, ornament);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const WX_EN = { snow: "SNOW", rain: "RAIN", sun: "CLEAR", cloud: "CLOUDY", fog: "FOG", storm: "STORM", wind: "WIND", none: "SKY" };
  const WX_SVG = {
    snow: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9.5 3.5 12 6l2.5-2.5M9.5 20.5 12 18l2.5 2.5"/>',
    rain: '<path d="M7 14a4 4 0 0 1 .5-8 5 5 0 0 1 9.4 1.5A3.3 3.3 0 0 1 17 14Z"/><path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    cloud: '<path d="M6.5 18a4.5 4.5 0 0 1 .6-9 5.5 5.5 0 0 1 10.5 1.6A3.7 3.7 0 0 1 17.5 18Z"/>',
    fog: '<path d="M3 8h18M5 12h14M3 16h18M7 20h10"/>',
    storm: '<path d="M7 13a4 4 0 0 1 .5-8 5 5 0 0 1 9.4 1.5A3.3 3.3 0 0 1 17 13Z"/><path d="M12.5 13 10 17.5h3.5L11 22"/>',
    wind: '<path d="M3 9h11a3 3 0 1 0-3-3M3 13h15a3 3 0 1 1-3 3M3 17h7"/>',
  };
  const wxIcon = (key) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${WX_SVG[key] || WX_SVG.cloud}</svg>`;
  const V_CONS = '<svg class="c" viewBox="0 0 92 56" fill="none" stroke="currentColor" stroke-width=".8"><path d="M6 44 26 30 44 36 60 14 84 8M44 36 58 50" opacity=".6"/><g fill="currentColor" stroke="none"><circle cx="6" cy="44" r="1.6"/><circle cx="26" cy="30" r="2.2"/><circle cx="44" cy="36" r="1.6"/><circle cx="60" cy="14" r="2.6"/><circle cx="84" cy="8" r="1.6"/><circle cx="58" cy="50" r="1.3"/></g></svg>';
  const V_SKY = '<svg class="bg" viewBox="0 0 360 150" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width=".6"><path d="M18 132 40 112 62 124 74 100M282 34 304 20 326 36 342 22 M304 20 312 52" opacity=".7"/><g fill="currentColor" stroke="none"><circle cx="18" cy="132" r="1.6"/><circle cx="40" cy="112" r="2.2"/><circle cx="62" cy="124" r="1.4"/><circle cx="74" cy="100" r="2.2"/><circle cx="282" cy="34" r="1.6"/><circle cx="304" cy="20" r="2.6"/><circle cx="326" cy="36" r="1.5"/><circle cx="342" cy="22" r="1.8"/><circle cx="312" cy="52" r="1.3"/><circle cx="180" cy="18" r=".9"/><circle cx="210" cy="132" r=".9"/><circle cx="150" cy="40" r=".7"/><circle cx="330" cy="120" r="1"/></g></svg>';
  const V_STAR = '<svg class="st" viewBox="0 0 110 90" fill="none" stroke="currentColor" stroke-width="1"><path d="M55 10 61 39 90 45 61 51 55 80 49 51 20 45 49 39Z" fill="currentColor" fill-opacity=".14"/><path d="M55 22 58 42 75 45 58 48 55 68 52 48 35 45 52 42Z" fill="currentColor"/><g fill="currentColor" stroke="none"><circle cx="18" cy="16" r="1.6"/><circle cx="92" cy="14" r="2"/><circle cx="96" cy="72" r="1.4"/><circle cx="14" cy="74" r="1.8"/><circle cx="30" cy="28" r=".9"/><circle cx="82" cy="30" r=".9"/></g><path d="M8 86h94" opacity=".5"/></svg>';
  const V_BF = '<span class="bfi"></span>';
  function vintageData(card) {
    const m = card.__mrpcMeta;
    if (!m) return null;
    const wd = card.__mrpcDate?.match(/\((.)\)/)?.[1] || "";
    const yy = m.year.slice(2);
    const [hh, mi] = m.time.split(":");
    const wx = card.dataset.weather || "none";
    const period = { night: "NIGHT", dawn: "DAWN", day: "DAY", dusk: "DUSK" }[card.dataset.period] || "NIGHT";
    return {
      y: m.year, yy, mo: m.month, d: m.day, day: Number(m.day), wd: esc(wd), hh, mi, time: esc(m.time),
      w: esc(m.weather || ""), place: esc(m.location), wx, wxEn: WX_EN[wx] || "SKY", period,
      full: `${m.year}.${m.month}.${m.day}`, short: `${yy}.${m.month}.${m.day}`,
      cast: card.__mrpcCast?.__list?.length || 0,
    };
  }
  const tw = (a, sep, b) => (b ? `${a}${sep}${b}` : a);
  function vintageCardHTML(kind, t) {
    switch (kind) {
      case "v-stamp":
        return `<div class="c1w"><div class="c1"><div class="in"><div class="art">${V_BF}<span>${t.wxEn}</span></div><div><div class="dt">${t.full}<small>(${t.wd})</small></div><div class="tm">${tw(t.time, " · ", t.w)}</div><div class="pl">${t.place}</div></div><span class="val">no. ${t.day}</span></div></div></div>`;
      case "v-lp":
        return `<div class="c2"><span class="disc b"><i>${t.time}</i></span><div class="sl"><div class="t"><span class="mk">NOW PLAYING</span><span class="mk">SIDE A</span></div><div class="pl">${t.place}</div><div class="meta"><span>DATE <b>${t.short} (${t.wd})</b></span><span>TIME <b>${t.time}</b></span>${t.w ? `<span>WEATHER <b>${t.w}</b></span>` : ""}</div></div></div>`;
      case "v-scrap":
        return `<div class="c3w"><span class="tp l"></span><span class="tp r"></span><div class="c3${t.w ? "" : " nostk"}"><span class="ds">${t.yy} · ${t.mo} · ${t.d} (${t.wd})</span><div class="pl">${t.place}</div><div class="ln">— ${t.time}</div>${t.w ? `<div class="stk">${wxIcon(t.wx)}<span>${t.w}</span></div>` : ""}</div></div>`;
      case "v-chart":
        return `<div class="c4">${V_SKY}<div class="r"><span class="mk">✦ &nbsp;CELESTIAL CHART&nbsp; ✦</span><div class="dt">${t.full} <small>(${t.wd})</small></div><div class="tm">${tw(`${t.hh}h ${t.mi}m`, " · ", t.w)}</div><div class="pl">${t.place}</div></div></div>`;
      case "v-board":
        return `<div class="c5"><span class="n1"></span><span class="n2"></span><div><div class="band"><span class="mk">BOARDING PASS</span><span class="mk">✦ ${t.period} LINE</span></div><div class="pl"><span class="mk">GATE</span><b>${t.place}</b></div><div class="grid"><div><span class="mk">DATE</span><b>${t.short} (${t.wd})</b></div><div><span class="mk">TIME</span><b>${t.time}</b></div>${t.w ? `<div><span class="mk">WEATHER</span><b>${t.w}</b></div>` : ""}</div></div><div class="stub"><div class="bc"></div><span>${t.short} ${t.time}</span></div></div>`;
      case "v-post":
        return `<div class="pc"><div class="l"><div class="ttl">Post Card</div><div class="msg">${t.place}에서,<br>${tw(t.w, " · ", t.time) || t.time}</div></div><div class="r"><div class="smp"><div>${V_BF}</div></div><div class="pmk">SCENE POST<b>${t.short}</b>(${t.wd})</div><div class="adr"><div>${t.y}. ${t.mo}. ${t.d} (${t.wd})</div><div>${t.hh} : ${t.mi}</div><div>날씨 · ${t.w || "—"}</div></div></div></div>`;
      case "v-film":
        return `<div class="fm"><div class="fr"><span class="no">▸ ${t.day}A</span><div class="dt">${t.full} <small>(${t.wd})</small></div><div class="tm">${tw(t.time, " · ", t.w)}</div><div class="pl">${t.place}</div></div></div>`;
      case "v-match":
        return `<div class="mb"><div class="lab"><div class="in"><div class="sm">SAFETY MATCHES</div><div class="arc">${t.place}</div><div class="bar"><span>${t.short} (${t.wd})</span><span>${t.time}</span>${t.w ? `<span>${t.w}</span>` : ""}</div><div class="sm">— EST. ${t.y} —</div></div></div></div>`;
      case "v-tarot":
        return `<div class="tr"><div class="in"><div class="num">XVII</div>${V_STAR}<div class="nm">${t.place}</div><div class="ft">${t.short} (${t.wd}) · ${tw(t.time, " · ", t.w)}</div></div></div>`;
      case "v-log":
        return `<div class="ob"><div class="hd"><b>OBSERVATION LOG</b><span class="mk">No. ${t.day}</span></div><table><tr><th>DATE</th><td class="hand">${t.full} (${t.wd})</td></tr><tr><th>TIME</th><td class="hand">${t.time}</td></tr>${t.w ? `<tr><th>SKY</th><td class="hand">${t.w}</td></tr>` : ""}<tr><th>SITE</th><td class="hand site">${t.place}</td></tr></table>${V_CONS}</div>`;
      case "v-spec":
        return `<div class="sp"><div class="in"><div class="bug">${V_BF}<span class="pin"></span></div><div class="lab"><div class="sn">No. ${t.day} · Papilio noctis</div>채집일 ${t.short} (${t.wd})<br>채집시 ${tw(t.time, " · ", t.w)}<br>채집지 <span class="pl">${t.place}</span></div></div></div>`;
      case "v-exlib":
        return `<div class="ex"><div class="in"><span class="co c1">✦</span><span class="co c2">✦</span><span class="co c3">✦</span><span class="co c4">✦</span>${V_BF}<div class="el">EX LIBRIS</div><div class="pl">${t.place}</div><div class="ft"><span>${t.short} (${t.wd})</span><span>${t.time}</span>${t.w ? `<span>${t.w}</span>` : ""}</div></div></div>`;
      case "v-receipt":
        return `<div class="rcw"><div class="rc"><div class="t">SCENE RECEIPT</div><div class="s">No. ${t.mo}${t.d} · ${t.short} (${t.wd})</div><div class="pl">${t.place}</div><div class="hr"></div><div class="ln"><span>DATE</span><b>${t.full} (${t.wd})</b></div><div class="ln"><span>TIME</span><b>${t.time}</b></div>${t.w ? `<div class="ln"><span>WEATHER</span><b>${t.w}</b></div>` : ""}${t.cast ? `<div class="hr"></div><div class="tot"><span>CAST</span><span>${t.cast}</span></div>` : ""}<div class="bc"></div><div class="ty">THANK YOU · COME AGAIN</div></div></div>`;
      case "v-tag":
        return `<div class="ltw"><div class="lt"><span class="hole"></span><div class="side"><span>BAGGAGE</span></div><div class="main"><span class="mk">DESTINATION</span><div class="to">${t.place}</div><div class="g"><div><span class="mk">DATE</span><b>${t.short} (${t.wd})</b></div><div><span class="mk">TIME</span><b>${t.time}</b></div>${t.w ? `<div><span class="mk">SKY</span><b>${t.w}</b></div>` : ""}</div></div></div></div>`;
      case "v-key":
        return `<div class="kt"><div class="fobw"><span class="ring"></span><div class="fob"><span class="mk">ROOM</span><span class="rn">${t.day}</span>${V_BF}</div></div><div class="info"><div class="ttl">HOTEL · 장면 호텔</div><div class="pl">${t.place}</div><div class="ln"><span>CHECK-IN</span><span>${t.full} (${t.wd})</span></div><div class="ln"><span>TIME</span><span>${t.time}</span></div>${t.w ? `<div class="ln"><span>WEATHER</span><span>${t.w}</span></div>` : ""}</div></div>`;
      case "v-slide":
        return `<div class="sl"><div class="mount"><span class="t">SCENE SLIDE</span><span class="l">${t.short}</span><span class="r">No. ${t.day}</span><div class="win">${V_BF}</div><span class="b">${t.place}</span></div><div class="info"><div class="ttl">SLIDE · ${t.day}</div><div class="pl">${t.place}</div><div class="d">${t.full} <small>(${t.wd})</small></div><div class="tm">${tw(t.time, " · ", t.w)}</div></div></div>`;
      case "v-bookmark":
        return `<div class="bm"><div class="bmw"><span class="tas"></span><div class="bmk"><span class="hole"></span>${V_BF}<span class="v">PAGE · ${t.day}</span></div></div><div class="pg"><div class="q">— where we left off,</div><div class="pl">${t.place}</div><div class="ln"><span>DATE</span><span>${t.full} (${t.wd})</span></div><div class="ln"><span>TIME</span><span>${t.time}</span></div>${t.w ? `<div class="ln"><span>WEATHER</span><span>${t.w}</span></div>` : ""}<div class="pgn">P. ${t.day}</div></div></div>`;
    }
    return "";
  }
  // 인물 상태 (빈티지): 버튼 겉모양 + 펼친 칸 모양
  function vintagePerson(person) {
    const [moodText, kao] = splitMood(person.fields[2]);
    const k = kao ? `<span class="k">${esc(kao)}</span>` : "";
    const mood = person.fields[2] ? `${esc(moodText)}${moodText && kao ? " " : ""}${k}` : "";
    return { name: esc(person.name), outfit: esc(person.fields[0] || ""), pose: esc(person.fields[1] || ""), mood, k };
  }
  function vRows(p) {
    return '<div class="fields">' + [[CAST_LABELS[0], p.outfit], [CAST_LABELS[1], p.pose], [CAST_LABELS[2], p.mood]].map(([l, v]) => (v ? `<div class="row"><span class="lb">${l}</span><span>${v}</span></div>` : "")).join("") + "</div>";
  }
  function vintageChipHTML(kind, p, n, t) {
    const nm = `<b>${p.name}</b>${p.k}`;
    switch (kind) {
      case "v-stamp": return { cls: "stw", html: `<span class="st"><span class="i">${nm}</span></span>` };
      case "v-lp": return { cls: "lp", html: `<span class="disc s"></span>${nm}` };
      case "v-scrap": return { cls: "sc", html: nm };
      case "v-chart": return { cls: "sr", html: `<span class="str">✦</span>${nm}` };
      case "v-board": return { cls: "bd", html: `<i>${String(n + 1).padStart(2, "0")}</i>${nm}` };
      case "v-post": return { cls: "ch", html: nm };
      case "v-film": return { cls: "fch", html: `<i>${(t?.day || 0) + n}A</i>${nm}` };
      case "v-match": return { cls: "mch", html: nm };
      case "v-tarot": return { cls: "tch", html: `<i>${ROMAN[n] || n + 1}</i>${nm}` };
      case "v-log": return { cls: "och", html: `<i></i>${nm}` };
      case "v-spec": return { cls: "tagc", html: nm };
      case "v-exlib": return { cls: "ov", html: nm };
      case "v-receipt": return { cls: "rcc", html: nm };
      case "v-tag": return { cls: "ltc", html: nm };
      case "v-key": return { cls: "kc", html: `<i>${201 + n}</i>${nm}` };
      case "v-slide": return { cls: "slc", html: `<i></i>${nm}` };
      case "v-bookmark": return { cls: "bmc", html: `<i></i>${nm}` };
    }
    return { cls: "ch", html: nm };
  }
  function vintagePanelHTML(kind, p, n, t) {
    const no = String(n + 1).padStart(2, "0");
    const dot = t ? `${t.yy}·${t.mo}·${t.d}` : "";
    switch (kind) {
      case "v-stamp":
        return `<div class="stpw"><div class="stp"><div class="in"><div class="pm"><b>${p.name}</b><span>${dot}</span></div><div>${vRows(p)}</div><span class="bf bfi"></span></div></div></div>`;
      case "v-lp":
        return `<div class="lpw"><span class="disc b"></span><div class="sleeve"><div class="hd"><b>${p.name}</b><span>SIDE A</span></div>${[["A1", p.outfit], ["A2", p.pose], ["A3", p.mood]].filter(([, v]) => v).map(([a, v]) => `<div class="trk"><i>${a}</i><span>${v}</span></div>`).join("")}</div></div>`;
      case "v-scrap":
        return `<div class="notew"><span class="tp"></span><div class="note"><b>${p.name} —</b>${[[CAST_LABELS[0], p.outfit], [CAST_LABELS[1], p.pose], [CAST_LABELS[2], p.mood]].filter(([, v]) => v).map(([l, v]) => `<br>${l}: ${v}`).join("")}</div></div>`;
      case "v-chart":
        return `<div class="chart">${V_CONS}<div class="hd"><b>${p.name}</b><span>star · ${no}</span></div>${vRows(p)}</div>`;
      case "v-board":
        return `<div class="bp"><span class="n1"></span><span class="n2"></span><div class="main"><div class="band"><span>BOARDING PASS</span><span>SEAT ${no}</span></div><div class="ps"><span>PASSENGER</span><b>${p.name}</b></div>${vRows(p)}</div><div class="stub"><div class="bc"></div><span>${t ? `${t.short} ${t.time}` : ""}</span></div></div>`;
      case "v-post":
        return `<div class="pcb"><div class="dear">Dear ${p.name},</div>${vRows(p)}</div>`;
      case "v-film":
        return `<div class="fm"><div class="fr"><span class="no">▸ ${(t?.day || 0) + n}A · ${p.name}</span>${vRows(p)}</div></div>`;
      case "v-match":
        return `<div class="mbp"><div class="in"><div class="t">${p.name}</div>${vRows(p)}</div></div>`;
      case "v-tarot":
        return `<div class="trp"><div class="mini"><b>${ROMAN[n] || n + 1}</b>${V_STAR}<span>${p.name}</span></div>${vRows(p)}</div>`;
      case "v-log":
        return `<div class="ob"><div class="hd"><b class="who">${p.name}</b><span class="mk">OBJECT ${no}</span></div><table>${[[CAST_LABELS[0], p.outfit], [CAST_LABELS[1], p.pose], [CAST_LABELS[2], p.mood]].filter(([, v]) => v).map(([l, v]) => `<tr><th>${l}</th><td>${v}</td></tr>`).join("")}</table></div>`;
      case "v-spec":
        return `<div class="lab big"><div class="sn">${p.name} <span class="mk">SPECIMEN ${no}</span></div>${vRows(p)}</div>`;
      case "v-receipt":
        return `<div class="rcw"><div class="rcp"><div class="hd2"><span>${p.name}</span><span>#${no}</span></div>${[[CAST_LABELS[0], p.outfit], [CAST_LABELS[1], p.pose], [CAST_LABELS[2], p.mood]].filter(([, v]) => v).map(([l, v]) => `<div class="it"><span>${l}</span><span>${v}</span></div>`).join("")}</div></div>`;
      case "v-tag":
        return `<div class="ltp"><span class="hole"></span><div class="who"><b>${p.name}</b><span class="mk">TAG ${no}</span></div>${vRows(p)}</div>`;
      case "v-key":
        return `<div class="ktp"><div class="mini"><b>${201 + n}</b><span>${p.name}</span></div>${vRows(p)}</div>`;
      case "v-slide":
        return `<div class="slp"><div class="w"><span class="bfi"></span><span>${p.name}</span></div>${vRows(p)}</div>`;
      case "v-bookmark":
        return `<div class="bmp"><div class="rib"></div><div><div class="h">${p.name}</div>${vRows(p)}</div></div>`;
      case "v-exlib":
        return `<div class="ex"><div class="in left"><span class="co c1">✦</span><span class="co c2">✦</span><span class="co c3">✦</span><span class="co c4">✦</span><div class="el">EX LIBRIS · ${p.name}</div>${vRows(p)}</div></div>`;
    }
    return "";
  }
  function renderCast(box, ornament, card) {
    const list = box.__list || [];
    const kind = isVintage(ornament) ? ornament : "std";
    if (box.dataset.kind === kind && box.dataset.sig === (card?.__mrpcDate || "")) return;
    box.dataset.kind = kind;
    box.dataset.sig = card?.__mrpcDate || "";
    for (const cls of [...box.classList]) if (cls.startsWith("mrpc-v") || cls === "mrpc-cast-std") box.classList.remove(cls);
    box.removeAttribute("data-open");
    box.textContent = "";
    if (kind === "std") {
      box.classList.add("mrpc-cast-std");
      fillStdCast(box, list);
      return;
    }
    box.classList.add("mrpc-vx", `mrpc-${kind}`);
    const t = card ? vintageData(card) : null;
    const chips = document.createElement("span");
    chips.className = "chips";
    const panels = document.createElement("span");
    panels.className = "panels";
    list.forEach((person, n) => {
      const p = vintagePerson(person);
      const chip = document.createElement("button");
      chip.type = "button";
      const c = vintageChipHTML(kind, p, n, t);
      chip.className = `mrpc-cast-chip ${c.cls}`;
      chip.dataset.index = String(n);
      chip.setAttribute("aria-expanded", "false");
      chip.innerHTML = c.html;
      chips.append(chip);
      const panel = document.createElement("span");
      panel.className = "mrpc-cast-ticket vpanel";
      panel.dataset.index = String(n);
      panel.hidden = true;
      panel.innerHTML = vintagePanelHTML(kind, p, n, t);
      panels.append(panel);
    });
    box.append(chips, panels);
  }
  function syncVintage(card, ornament) {
    const wanted = isVintage(ornament);
    card.classList.toggle("mrpc-vhide", wanted);
    let vx = card.__mrpcVx;
    if (!wanted) {
      vx?.remove();
      card.__mrpcVx = null;
      return;
    }
    const t = vintageData(card);
    if (!t) return;
    if (!vx) {
      vx = document.createElement("div");
      vx.setAttribute("translate", "no");
      vx.setAttribute("role", "group");
      card.__mrpcVx = vx;
    }
    vx.setAttribute("aria-label", card.getAttribute("aria-label") || "작중 정보");
    vx.title = "누르면 모양·색감을 바꿀 수 있어요";
    vx.className = `mrpc-vx mrpc-vv mrpc-${ornament} mrpc-palette-${currentPalette()}`;
    const sig = `${ornament}|${t.cast}`;
    if (vx.dataset.sig !== sig) {
      vx.dataset.sig = sig;
      vx.innerHTML = vintageCardHTML(ornament, t);
    }
    if (card.parentNode && vx.previousSibling !== card) card.after(vx);
  }
  const CONTENT_SELECTOR = ".mari-message-content, .translation-text";
  const SKIP_SELECTOR =
    "script, style, textarea, input, select, option, button, code, pre, [contenteditable='true'], .mrpc-card, .mrpc-split, .mrpc-cast, .mrpc-vx";
  const records = new Map();
  const nodeRecords = new WeakMap();
  function hasMarker(text) {
    return /§\s*RP\s*[|｜]/i.test(text);
  }
  const LINE_BREAK = { lineBreak: true };
  const BLOCK_TAGS = /^(P|DIV|LI|UL|OL|H[1-6]|BLOCKQUOTE|TR|TABLE|SECTION|ARTICLE|HR|DD|DT)$/;
  function contentTextNodes(content) {
    const nodes = [];
    const walk = (parent) => {
      for (let node = parent.firstChild; node; node = node.nextSibling) {
        if (node.nodeType === 3) nodes.push(node);
        else if (node.nodeType === 1) {
          if (node.matches(SKIP_SELECTOR)) continue;
          if (node.tagName === "BR" || BLOCK_TAGS.test(node.tagName)) nodes.push(LINE_BREAK);
          walk(node);
        }
      }
    };
    walk(content);
    return nodes;
  }
  function recordIsIntact(record) {
    if (record.dirty) return false;
    for (const part of record.parts) {
      if (!part.card.isConnected) return false;
      for (const entry of part.nodes) {
        if (!entry.node.isConnected || entry.node.nodeValue !== entry.stripped) return false;
      }
    }
    return true;
  }
  function undoRecord(record) {
    for (const part of [...record.parts].reverse()) {
      for (const entry of part.nodes) {
        if (record.written.has(entry.node)) continue;
        if (entry.node.isConnected && entry.node.nodeValue === entry.stripped) entry.node.nodeValue = entry.original;
      }
      part.prefix?.remove();
      part.split?.remove();
      part.cast?.remove();
      if (part.card.__mrpcCast === part.cast) part.card.__mrpcCast = null;
      part.card.__mrpcVx?.remove();
      release(part.card);
      part.card.remove();
    }
  }
  function decorateOne(content, record, reusable) {
    const nodes = contentTextNodes(content);
    let combined = "";
    const offsets = [];
    for (const node of nodes) {
      if (node === LINE_BREAK) { combined += "\n"; continue; }
      const value = node.nodeValue || "";
      offsets.push({ node, value, start: combined.length, end: combined.length + value.length });
      combined += value;
    }
    const meta = parseStatus(combined);
    if (!meta) return null;
    let start = meta.index;
    let end = meta.index + meta.length;
    if (/^[ \t\r\n]*$/.test(combined.slice(0, start))) start = 0;
    const cast = [];
    for (let n = 0; n < MAX_CAST; n += 1) {
      const line = CAST_LINE.exec(combined.slice(end));
      if (!line) break;
      const name = clean(line[1]).replace(/^[*_~]+|[*_~]+$/g, "");
      if (!name) break;
      cast.push({ name, fields: splitCastFields(line[2]) });
      end += line[0].length;
    }
    const trailing = combined.slice(end).match(/^(?:(?:[ \t]*\r?\n)+|[ \t]*)/);
    if (trailing?.[0]) end += trailing[0].length;
    const touched = offsets.filter((entry) => entry.end > start && entry.start < end);
    if (!touched.length) return null;
    const first = touched[0];
    const parent = first.node.parentNode;
    if (!parent) return null;
    const key = meta.raw;
    const reuse = reusable.get(key);
    if (reuse) reusable.delete(key);
    const card = reuse || createCard(meta, combined.slice(start, end));
    card.__mrpcCast = cast.length ? createCast(cast) : null;
    applyCardClasses(card);
    const part = { card, cast: card.__mrpcCast, prefix: null, split: null, key, nodes: [] };
    for (const entry of touched) {
      const from = Math.max(0, start - entry.start);
      const to = Math.min(entry.value.length, end - entry.start);
      if (entry === first && from > 0) part.prefix = document.createTextNode(entry.value.slice(0, from));
      const stripped = entry.value.slice(to);
      part.nodes.push({ node: entry.node, original: entry.value, stripped });
      nodeRecords.set(entry.node, record);
      entry.node.nodeValue = stripped;
    }
    if (part.prefix) parent.insertBefore(part.prefix, first.node);
    parent.insertBefore(card, first.node);
    if (card.__mrpcVx) parent.insertBefore(card.__mrpcVx, first.node);
    if (part.cast) parent.insertBefore(part.cast, first.node);
    part.split = document.createElement("span");
    part.split.className = "mrpc-split";
    part.split.setAttribute("aria-hidden", "true");
    part.split.textContent = "\n\n";
    parent.insertBefore(part.split, first.node);
    return part;
  }
  const MAX_CARDS_PER_MESSAGE = 20;
  function decorate(content) {
    const previous = records.get(content);
    const reusable = new Map();
    if (previous) {
      if (content.isConnected && recordIsIntact(previous)) return false;
      records.delete(content);
      undoRecord(previous);
      for (const part of previous.parts) if (!reusable.has(part.key)) reusable.set(part.key, part.card);
    }
    if (!content.isConnected) return Boolean(previous);
    if (!hasMarker(content.textContent || "")) return Boolean(previous);
    const record = { parts: [], dirty: false, written: new Set() };
    for (let i = 0; i < MAX_CARDS_PER_MESSAGE; i += 1) {
      const part = decorateOne(content, record, reusable);
      if (!part) break;
      record.parts.push(part);
    }
    if (record.parts.length) records.set(content, record);
    for (const part of record.parts) markHangul(part.card);
    return true;
  }
  function collectContents(node, into, includeInside) {
    const element = node.nodeType === 1 ? node : node.parentElement;
    if (!element) return;
    const own = element.closest(CONTENT_SELECTOR);
    if (own) into.add(own);
    if (includeInside && !own && node.nodeType === 1 && node.querySelectorAll) {
      for (const content of node.querySelectorAll(CONTENT_SELECTOR)) into.add(content);
    }
  }
  const NO_FIT = ["t-forecast", "w-score", "k-daily", "k-station", "x-opera"];
  function fitCards(cards) {
    for (const card of cards) {
      if (!fitted.has(card)) {
        fitted.add(card);
        sizeWatch?.observe(card);
        liveWatch?.observe(card);
        ensureWx(card, wantsWx(card.dataset.ornament || ""));
        markHangul(card);
      }
      for (const value of card.querySelectorAll(".mrpc-item-value, .mrpc-date-value")) {
        value.style.fontSize = "";
        value.closest(".mrpc-item, .mrpc-date").style.maxWidth = "";
      }
    }
    markWrapped(cards);
    balanceLines(cards);
  }
  function balanceLines(cards) {
    const values = [];
    for (const card of cards) {
      const value = card.querySelector(".mrpc-location .mrpc-item-value");
      if (!value) continue;
      if (value.hasAttribute("data-mrpc-br")) {
        for (const node of textNodes(value)) if (node.data.includes("\n")) node.data = node.data.replace(/\n/g, " ");
        value.removeAttribute("data-mrpc-br");
        value.style.removeProperty("white-space");
      }
      if (value.textContent.includes(" ")) values.push(value);
    }
    const jobs = values.map((value) => ({ value, lines: lineCount(value) })).filter((job) => job.lines >= 2 && job.lines <= 6);
    for (const job of jobs) {
      const range = document.createRange();
      range.selectNodeContents(job.value);
      const rects = [...range.getClientRects()].filter((r) => r.width > 0);
      const low = Math.min(...rects.map((r) => r.height));
      const rows = [];
      for (const r of rects.filter((x) => x.height <= low * 1.25)) {
        const row = rows.find((x) => Math.abs(x.top - r.top) < low * 0.5);
        if (row) { row.left = Math.min(row.left, r.left); row.right = Math.max(row.right, r.right); } else rows.push({ top: r.top, left: r.left, right: r.right });
      }
      job.cap = Math.max(...rows.map((x) => x.right - x.left)) * 1.08 + 2;
    }
    jobs.forEach((job) => job.value.style.setProperty("white-space", "nowrap", "important"));
    for (const job of jobs) {
      const node = textNodes(job.value).pop();
      if (!node) continue;
      const range = document.createRange();
      const width = (end) => { range.setStart(node, 0); range.setEnd(node, end); return range.getBoundingClientRect().width; };
      const spots = [];
      for (let i = 1; i < node.data.length - 1; i += 1) {
        if (node.data[i] === " " && !/[-–—]/.test(node.data[i + 1])) spots.push({ at: i, end: width(i), next: width(i + 1) });
      }
      const total = width(node.data.length);
      if (spots.length > 40) continue;
      job.pick = bestBreaks(spots, total, job.lines, job.cap);
      job.node = node;
    }
    jobs.forEach((job) => {
      job.value.style.removeProperty("white-space");
      if (!job.pick) return;
      let data = job.node.data;
      for (const at of job.pick) data = data.slice(0, at) + "\n" + data.slice(at + 1);
      job.node.data = data;
      job.value.setAttribute("data-mrpc-br", "");
      job.value.style.setProperty("white-space", "pre-line", "important");
    });
    const after = jobs.map((job) => (job.pick ? lineCount(job.value) : job.lines));
    jobs.forEach((job, i) => {
      if (!job.pick || after[i] === job.lines) return;
      for (const node of textNodes(job.value)) if (node.data.includes("\n")) node.data = node.data.replace(/\n/g, " ");
      job.value.removeAttribute("data-mrpc-br");
      job.value.style.removeProperty("white-space");
    });
    dropcapOneLine(cards);
  }
  function bestBreaks(spots, total, lines, cap) {
    if (spots.length < lines - 1) return null;
    let best = null;
    const walk = (from, start, left, picked, cost, firstWidth) => {
      if (best && cost >= best.cost) return;
      if (left === 0) {
        const last = total - start;
        if (last > cap) return;
        const sum = cost + last * last + Math.max(0, last - (firstWidth ?? last)) * cap * 0.5;
        if (!best || sum < best.cost) best = { cost: sum, picked: [...picked] };
        return;
      }
      for (let k = from; k <= spots.length - left; k += 1) {
        const w = spots[k].end - start;
        if (w > cap) break;
        picked.push(spots[k].at);
        walk(k + 1, spots[k].next, left - 1, picked, cost + w * w, firstWidth ?? w);
        picked.pop();
      }
    };
    walk(0, 0, lines - 1, [], 0, null);
    return best ? best.picked.sort((a, b) => b - a) : null;
  }
  function lineCount(value) {
    const range = document.createRange();
    range.selectNodeContents(value);
    let rects = [...range.getClientRects()].filter((r) => r.width > 0);
    const low = Math.min(...rects.map((r) => r.height));
    rects = rects.filter((r) => r.height <= low * 1.6).sort((a, b) => a.top - b.top);
    let count = rects.length ? 1 : 0;
    let top = (rects.find((r) => r.height <= low * 1.25) || rects[0])?.top ?? 0;
    for (const r of rects) {
      if (r.height > low * 1.25) continue;
      if (r.top - top > low * 0.5) { count += 1; top = r.top; }
    }
    return count;
  }
  function dropcapOneLine(cards) {
    const targets = [...cards].filter((card) => card.dataset.ornament === "n-dropcap" && card.dataset.initial === "letter");
    targets.forEach((card) => card.removeAttribute("data-mrpc-oneline"));
    const one = targets.filter((card) => {
      const value = card.querySelector(".mrpc-location .mrpc-item-value");
      return value && lineCount(value) < 2;
    });
    one.forEach((card) => card.setAttribute("data-mrpc-oneline", ""));
  }
  function textNodes(root) {
    const out = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) out.push(walker.currentNode);
    return out;
  }
  function lineStarters(card) {
    const details = card.querySelector(".mrpc-details");
    const flat = details && getComputedStyle(details).display === "contents";
    const box = (flat ? card : details).getBoundingClientRect();
    const kids = [...(flat ? [card.querySelector(".mrpc-date")] : []), ...card.querySelectorAll(".mrpc-item")]
      .filter(Boolean)
      .map((el, i) => ({ el, i, order: Number(getComputedStyle(el).order) || 0, basis: getComputedStyle(el).flexBasis, rect: el.getBoundingClientRect() }))
      .filter((kid) => kid.rect.width > 0)
      .sort((a, b) => a.order - b.order || a.i - b.i);
    const out = [];
    kids.forEach((kid, n) => {
      const prev = kids[n - 1];
      if (!prev || kid.el.classList.contains("mrpc-location") || prev.el.classList.contains("mrpc-location")) return;
      if (prev.basis === "100%" || prev.rect.width >= box.width - 2) return;
      if (kid.rect.top >= prev.rect.bottom - 2) out.push(kid.el);
    });
    return out;
  }
  function markWrapped(cards) {
    const targets = [...cards].filter((card) => !rootsOf(card.dataset.ornament || "").some((o) => NO_FIT.includes(o)));
    for (const card of cards) for (const el of card.querySelectorAll("[data-mrpc-wrap]")) el.removeAttribute("data-mrpc-wrap");
    targets.flatMap(lineStarters).forEach((el) => el.setAttribute("data-mrpc-wrap", "own"));
  }
  function fitAll(root = document) {
    fitCards(root.querySelectorAll(".mrpc-card"));
  }
  const cardWidths = new WeakMap();
  let resizedCards = new Set();
  let resizeFrame = 0;
  const liveWatch = typeof IntersectionObserver === "function"
    ? new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.target.isConnected) { release(entry.target); continue; }
          entry.target.toggleAttribute("data-mrpc-live", entry.isIntersecting);
        }
      }, { rootMargin: "120px 0px" })
    : null;
  const sizeWatch = typeof ResizeObserver === "function"
    ? new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (!entry.target.isConnected) { release(entry.target); continue; }
          const width = Math.round(entry.contentRect.width);
          const seen = cardWidths.has(entry.target);
          if (seen && cardWidths.get(entry.target) === width) continue;
          cardWidths.set(entry.target, width);
          if (seen) resizedCards.add(entry.target);
        }
        if (!resizedCards.size) return;
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
          const cards = [...resizedCards].filter((card) => card.isConnected);
          resizedCards = new Set();
          fitCards(cards);
        });
      })
    : null;
  let restyleTimer = 0;
  function restyleAll() {
    clearTimeout(restyleTimer);
    if (!mrpcIsMe()) return;
    const height = window.innerHeight;
    const near = [];
    const far = [];
    for (const card of document.querySelectorAll(".mrpc-card")) {
      const rect = card.getBoundingClientRect();
      (rect.bottom > -height && rect.top < height * 2 ? near : far).push(card);
    }
    near.forEach(applyCardClasses);
    fitCards(near);
    const step = () => {
      const part = far.splice(0, 12);
      part.forEach(applyCardClasses);
      fitCards(part);
      if (far.length) restyleTimer = setTimeout(step, 16);
    };
    if (far.length) restyleTimer = setTimeout(step, 16);
  }
  const fitted = new WeakSet();
  function hideGap(card, root) {
    let node = card;
    for (let guard = 0; guard < 40; guard += 1) {
      const next = node.nextSibling;
      if (!next) {
        node = node.parentElement;
        if (!node || node === root || !root.contains(node)) return;
        continue;
      }
      if (next.nodeType === 3) {
        if (next.data.trim()) return;
      } else if (next.nodeType === 1) {
        const empty = next.tagName === "BR" || (/^(P|DIV)$/.test(next.tagName) && !next.textContent.trim() && !next.querySelector(":not(br)"));
        if (empty) next.setAttribute("data-mrpc-gap", "");
        else if (!next.classList.contains("mrpc-split") && !next.classList.contains("mrpc-cast") && !next.classList.contains("mrpc-vx")) return;
      }
      node = next;
    }
  }
  function decorateAll(contents) {
    const changed = [...contents].filter((content) => decorate(content));
    for (const content of changed) for (const card of content.querySelectorAll(".mrpc-card")) hideGap(card, content);
    const cards = new Set();
    for (const content of contents) {
      if (!content.isConnected) continue;
      const all = changed.includes(content);
      for (const card of content.querySelectorAll(".mrpc-card")) if (all || !fitted.has(card)) cards.add(card);
    }
    if (cards.size) fitCards([...cards]);
    for (const [content, record] of records) {
      if (content.isConnected) continue;
      records.delete(content);
      for (const part of record.parts) release(part.card);
    }
  }
  function release(card) {
    sizeWatch?.unobserve(card);
    liveWatch?.unobserve(card);
  }
  function isOwnNode(node) {
    const element = node.nodeType === 1 ? node : node.parentElement;
    return Boolean(element?.closest?.(".mrpc-card, .mrpc-picker, .mrpc-split, .mrpc-cast, .mrpc-vx"));
  }
  const observeTarget = document.body || document.documentElement;
  const handleMutations = (mutations) => {
    if (!mrpcIsMe()) { watcher.disconnect(); return; }
    const contents = new Set();
    const retitle = new Set();
    const rebreak = new Set();
    const fixDates = new Set(), relang = new Set();
    for (const mutation of mutations) {
      const element = mutation.target.nodeType === 1 ? mutation.target : mutation.target.parentElement;
      const hostCard = element?.closest?.(".mrpc-card");
      if (hostCard && INITIAL_ORNAMENTS.includes(hostCard.dataset.ornament) && element.closest(".mrpc-location")) retitle.add(hostCard);
      if (hostCard && element.closest(".mrpc-location, .mrpc-weather")) rebreak.add(hostCard);
      if (hostCard && element.closest(".mrpc-date-value") && hostCard.__mrpcDate) fixDates.add(hostCard);
      const hostContent = element?.closest?.(CONTENT_SELECTOR); if (hostContent) relang.add(hostContent);
      if (isOwnNode(mutation.target)) continue;
      if (mutation.type === "characterData") {
        const record = nodeRecords.get(mutation.target);
        if (record) {
          record.dirty = true;
          record.written.add(mutation.target);
        }
      }
      collectContents(mutation.target, contents, false);
      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) for (const c of node.matches?.(".mrpc-card") ? [node] : node.querySelectorAll?.(".mrpc-card") || []) rebreak.add(c);
          if (node.nodeType === 1 && !isOwnNode(node)) collectContents(node, contents, true);
        }
      }
    }
    for (const hostCard of retitle) {
      const value = hostCard.querySelector(".mrpc-location .mrpc-item-value");
      const text = value?.textContent;
      if (text && text !== hostCard.__mrpcInitText) setInitial(hostCard, true, text);
    }
    if (rebreak.size) {
      const live = [...rebreak].filter((card) => card.isConnected);
      live.forEach(markHangul);
      balanceLines(live);
    }
    for (const hostCard of fixDates) {
      const value = hostCard.querySelector(".mrpc-date-value");
      if (value && value.textContent !== hostCard.__mrpcDate) {
        const dateText = hostCard.__mrpcDate;
        const weekdayMatch = /^(.*\s)(\([월화수목금토일]\))$/.exec(dateText);
        value.replaceChildren();
        if (weekdayMatch) {
          value.append(document.createTextNode(weekdayMatch[1]));
          const weekdayNode = document.createElement("span");
          weekdayNode.className = "mrpc-weekday";
          weekdayNode.textContent = weekdayMatch[2];
          value.append(weekdayNode);
        } else value.textContent = dateText;
      }
    }
    for (const host of relang) for (const card of host.querySelectorAll(".mrpc-card")) markHangul(card);
    if ((retitle.size || rebreak.size || fixDates.size || relang.size) && !contents.size) watcher.takeRecords();
    if (!contents.size) return;
    decorateAll(contents);
    watcher.takeRecords();
  };
  const watcher = new MutationObserver(handleMutations);
  watcher.observe(observeTarget, { subtree: true, childList: true, characterData: true });
  let picker = null;
  function closePicker() {
    picker?.remove();
    picker = null;
  }
  function pickerRow(title, key, options, current, swatch) {
    const buttons = options
      .map(([value, label, group], i) => {
        const mark = swatch ? `<span class="mrpc-swatch mrpc-palette-${value}"></span>` : "";
        const head = group ? `</div><div class="mrpc-picker-group">${group}</div><div class="mrpc-picker-row">` : "";
        return `${head}<button type="button" data-key="${key}" data-value="${value}" aria-pressed="${value === current}">${mark}${label}</button>`;
      })
      .join("");
    return `<div class="mrpc-picker-title">${title}</div><div class="mrpc-picker-row">${buttons}</div>`.replace('<div class="mrpc-picker-row"></div>', "");
  }
  function openPicker(anchor) {
    closePicker();
    picker = document.createElement("div");
    picker.className = "mrpc-picker";
    picker.setAttribute("role", "dialog");
    picker.setAttribute("aria-label", "시공간 카드 상태창 모양·색감");
    const esc = (s) => s.replace(/[&"<>]/g, (c) => ({ "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" })[c]);
    picker.innerHTML =
      pickerRow("모양", STORAGE_KEY_ORNAMENT, ORNAMENT_OPTIONS, currentOrnament(), false) +
      pickerRow("색감", STORAGE_KEY_PALETTE, PALETTE_OPTIONS, currentPalette(), true);
    document.body.append(picker);
    const rect = anchor.getBoundingClientRect();
    const width = picker.offsetWidth;
    const height = picker.offsetHeight;
    let top = rect.bottom + 8;
    if (top + height > window.innerHeight - 8) top = Math.max(8, rect.top - height - 8);
    const left = Math.min(Math.max(8, rect.left + rect.width / 2 - width / 2), window.innerWidth - width - 8);
    picker.style.top = `${Math.round(top)}px`;
    picker.style.left = `${Math.round(Math.max(8, left))}px`;
  }
  let pickDown = null;
  const onPointerDown = (event) => { const b = event.target?.closest?.(".mrpc-picker button"); pickDown = b ? { b, x: event.clientX, y: event.clientY } : null; };
  const onDocumentClick = (event) => {
    const target = event.target;
    const castChip = target?.closest?.(".mrpc-cast-chip");
    if (castChip) {
      event.stopPropagation();
      event.preventDefault();
      toggleCast(castChip);
      return;
    }
    if (target?.closest?.(".mrpc-cast")) { event.stopPropagation(); return; }
    const button = target?.closest?.(".mrpc-picker button");
    if (button && pickDown && (pickDown.b !== button || Math.hypot(event.clientX - pickDown.x, event.clientY - pickDown.y) > 10)) { pickDown = null; return; }
    if (button) {
      saveChoice(button.dataset.key, button.dataset.value);
      if (button.dataset.key === STORAGE_KEY_ORNAMENT) closePicker();
      else {
        for (const other of picker.querySelectorAll(`button[data-key="${button.dataset.key}"]`)) {
          other.setAttribute("aria-pressed", String(other === button));
        }
      }
      restyleAll();
      return;
    }
    if (target?.closest?.(".mrpc-picker")) return;
    const date = target?.closest?.(".mrpc-card .mrpc-date-copy, .mrpc-vv");
    if (date) {
      event.stopPropagation();
      event.preventDefault();
      if (picker) closePicker();
      else openPicker(date.closest(".mrpc-card, .mrpc-vv"));
      return;
    }
    closePicker();
  };
  const onViewportChange = (event) => {
    if (picker && picker.contains(document.activeElement)) return;
    if (picker && !picker.contains(event.target)) closePicker();
  };
  let fitTimer = 0;
  const refitSoon = () => {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(() => fitAll(), 150);
  };
  window.addEventListener("resize", refitSoon);
  document.fonts?.addEventListener?.("loadingdone", refitSoon);
  window.addEventListener("click", onDocumentClick, true);
  window.addEventListener("pointerdown", onPointerDown, true);
  document.addEventListener("scroll", onViewportChange, { capture: true, passive: true });
  window.addEventListener("resize", onViewportChange);
  cleanupCallbacks.push(() => {
    window.removeEventListener("click", onDocumentClick, true);
    window.removeEventListener("pointerdown", onPointerDown, true);
    document.removeEventListener("scroll", onViewportChange, { capture: true });
    window.removeEventListener("resize", onViewportChange);
    window.removeEventListener("resize", refitSoon);
    sizeWatch?.disconnect();
    liveWatch?.disconnect();
    cancelAnimationFrame(resizeFrame);
    document.fonts?.removeEventListener?.("loadingdone", refitSoon);
    clearTimeout(fitTimer);
    clearTimeout(restyleTimer);
    closePicker();
  });
  marinara.onCleanup(() => {
    watcher.disconnect();
    cleanupCallbacks.forEach((callback) => callback());
    for (const record of records.values()) undoRecord(record);
    document.querySelectorAll("[data-mrpc-gap]").forEach((el) => el.removeAttribute("data-mrpc-gap"));
    records.clear();
  });
  decorateAll(document.querySelectorAll(CONTENT_SELECTOR));
  watcher.takeRecords();
})();

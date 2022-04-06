# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

目標：

臺北捷運路線查詢、地圖呈現

使用的 API：
1. 取得捷運路線 geojson
2. 取得捷運營運路線車站基本資料
3. 取得捷運站出入口資訊

Feature：
1. 使用原生 Google, Facebook Login 顯示大頭貼在 User Location Pin
2. 地圖呈現 leaflet.js
3. 查詢臺北捷運路線 geojson 並呈現在地圖上
4. 切換路線時 highlight 不同路線，並顯示該線各站
5. 選擇特定站別後取得該站出口資訊，顯示於地圖上
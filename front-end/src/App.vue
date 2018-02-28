<template>
  <div id="app" class="night-mode">
    <div class="navbar">
      <router-link class="btn" to="/">Home</router-link>
      <router-link class="btn" to="balance">Balance</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import service from "./service";
export default {
  name: "App",
  mounted() {
    service.wsPrices();
  }
};
</script>

<style lang="less">
@import "./less/common.less";

* {
  margin: 0;
  padding: 0;
}

:root {
  --background-color: #fff;
  --card-background-color: #f6f6f6;
  --text-color: #333;
  --header-color: #ddd;
  --green: #70a800;
  --red: #ea0070;
  --hover-background-color: #ddd;
  --secondary-text-color: #555;
  --border-color: #f4f4f4;
  --btn-background-color: #aaa;
}

.night-mode {
  --background-color: #191919;
  --card-background-color: #2f2f31;
  --text-color: #fff;
  --header-color: #444;
  --green: #81d468;
  --red: #f05458;
  --hover-background-color: #666;
  --secondary-text-color: #aaa;
  --border-color: #444;
  --highlight-background-color: #222;
  --btn-background-color: #222;
}

html,
body,
#app {
  height: 100%;
}

#app {
  font-family: "Microsoft Yahei", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--text-color);
  background-color: var(--background-color);
  overflow: auto;
}

ul {
  list-style: none;
}

table {
  width: 100%;
  border-collapse: collapse;
  th {
    background-color: var(--header-color);
  }
  td,
  th {
    padding: 0.5em;
  }
  tr + tr {
    td {
      border-bottom: 1px solid var(--border-color);
    }
  }
  th {
    color: var(--secondary-text-color);
    font-weight: normal;
    font-size: 0.8em;
  }
}

label {
  display: inline-flex;
  align-items: center;
  padding: @default-space-div-2;
  transition: background-color 0.15s ease-in-out;
  &:hover {
    background-color: var(--border-color);
  }
  cursor: pointer;
  .text {
    padding-left: 0.5em;
    font-size: 0.8em;
  }
}

.navbar {
  padding: 0 @default-space-div-2;
  background-color: var(--card-background-color);
  text-align: left;
}
</style>

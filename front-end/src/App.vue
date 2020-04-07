<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">
        <img src="logo.png">
      </router-link>
    </div>
    <div class="content">
      <router-view/>
    </div>
    <div class='footer'>
      <a href="https://github.com/kbrady1/creative-project-4" target="_blank">GitHub Repository</a>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Optima", "Arial", sans-serif;
}

html {
  position: relative;
  color: #0B615E;
  height: 100%;
}

body {
  background-color: #E0D9D2;
  height: 100%;
}

img {
  height: 60px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  height: 100%;
}

#nav {
  padding-top: 48px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.footer a {
  color: #fafafa;
}

.footer {
  justify-content: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  background-color: #5C3D19;
}
</style>

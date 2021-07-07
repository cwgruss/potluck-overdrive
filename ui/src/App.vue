<template>
  <div class="space-y-20 sm:space-y-32 md:space-y-40 lg:space-y-44 overflow-hidden">
    <div id="app">
      <div class="relative z-10 max-w-screen-lg xl:max-w-screen-xl mx-auto">
        <div class="px-4 sm:px-6 md:px-8 mb-14 sm:mb-20 xl:mb-8">

          <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/ingredients">Ingredients</router-link>
          </div>
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // background-color: $blue-gray;
  color: $white;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: $white;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

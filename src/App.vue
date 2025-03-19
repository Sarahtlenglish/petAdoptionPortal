<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/pets">View Pets</router-link> |
    <router-link to="/add">Add Pet</router-link>
  </nav>
  <router-view/>
</template>

<style lang="scss">
nav {
  padding: 20px;
  
  a {
    margin: 0 10px;
  }
}
</style>

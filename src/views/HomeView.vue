<template>
  <div>
    <h1>Pet Adoption Portal</h1>
    <p>Welcome to our Pet Adoption Portal! Find your new best friend.</p>
    
    <div>
      <router-link to="/pets">Browse Pets</router-link> | 
      <router-link to="/add">Add a Pet</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style lang="scss">
@use '@/assets/styles/variables' as vars;

div {
  h1 {
    color: vars.$primary-color;
  }
  
  p {
    margin-bottom: vars.$spacing-large;
  }
}
</style> 
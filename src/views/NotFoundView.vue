<template>
  <div class="not-found">
    <div class="not-found-content">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 15s1.5 2 4 2 4-2 4-2"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
      <h1>Siden blev ikke fundet</h1>
      <p>Beklager, men siden du leder efter findes ikke.</p>
      <router-link to="/" class="btn-primary">
        <span>Gå til forsiden</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as vars;

.not-found {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  
  .not-found-content {
    text-align: center;
    max-width: 400px;
    
    svg {
      width: 120px;
      height: 120px;
      color: vars.$primary-color;
      margin-bottom: 2rem;
    }
    
    h1 {
      font-size: 2rem;
      font-weight: vars.$font-weight-black;
      margin-bottom: 1rem;
      color: vars.$text-color-dark;
    }
    
    p {
      color: #666;
      margin-bottom: 2rem;
    }
    
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: vars.$primary-color;
      color: white;
      border-radius: vars.$border-radius-medium;
      text-decoration: none;
      font-weight: vars.$font-weight-bold;
      transition: all 0.3s ease;
      
      svg {
        width: 20px;
        height: 20px;
        margin: 0;
      }
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(vars.$primary-color, 0.2);
      }
    }
  }
}
</style> 
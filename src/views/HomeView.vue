<template>
  <div class="home-view">
    <div class="hero-section">
      <div class="hero-content">
        <h1>Find din nye bedste ven</h1>
        <p class="hero-text">
          Udforsk vores udvalg af kærlige kæledyr der søger et nyt hjem. 
          Hver af dem har deres egen unikke personlighed og historie.
        </p>
        <div class="hero-actions">
          <router-link to="/pets" class="btn btn-primary">
            <span>Start din søgning</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
          <router-link to="/add" class="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Har du et kæledyr?</span>
          </router-link>
        </div>
      </div>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"> <!-- Changed stroke-width from 2 to 1.5 -->
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h3>Find det perfekte match</h3>
          
          <div class="expanded-content">
            <p>Vi hjælper dig med at finde det kæledyr, der passer perfekt til dit hjem og livsstil.</p>
          </div>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"> <!-- Changed stroke-width from 2 to 1.5 -->
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <h3>Giv et nyt hjem</h3>
          
          <div class="expanded-content">
            <p>Alle vores dyr fortjener en chance for at finde deres forever home.</p>
          </div>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"> <!-- Changed stroke-width from 2 to 1.5 -->
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3>Støt lokale shelters</h3>
          
          <div class="expanded-content">
            <p>Ved at adoptere hjælper du ikke kun ét dyr, men støtter også lokale dyreinternat.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as vars;
@use "sass:color";

.home-view {
  width: 100%;
  
  .hero-section {
    text-align: center;
    padding: 2rem 0 4rem;
    width: 100%;
    
    .hero-content {
      margin: 0 auto 4rem;
      padding: 0 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      h1 {
        font-size: clamp(2.5rem, 5vw, 3.5rem);
        font-weight: vars.$font-weight-black;
        margin-bottom: 1.5rem;
        background: linear-gradient(45deg, vars.$primary-color, vars.$secondary-color);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        line-height: 1.2;
      }
      
      .hero-text {
        font-size: clamp(1rem, 2vw, 1.25rem);
        color: #666;
        margin-bottom: 2.5rem;
        line-height: 1.6;
        text-align: center;
        max-width: 800px;
      }
    }
    
    .hero-actions {
      display: flex;
      gap: 1.25rem;
      justify-content: center;
      flex-wrap: wrap;
      padding: 0 1rem;
      
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.625rem;
        padding: 1rem 2rem;
        border-radius: vars.$border-radius-large;
        font-weight: vars.$font-weight-bold;
        text-decoration: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        
        svg {
          width: 1.25rem;
          height: 1.25rem;
          transition: transform 0.3s ease;
        }
        
        &.btn-primary {
          background: vars.$primary-color;
          color: white;
          
          &:hover {
            background: color.adjust(vars.$primary-color, $lightness: -5%);
            transform: translateY(-2px);
            
            svg {
              transform: translateX(4px);
            }
          }
        }
        
        &.btn-secondary {
          background: white;
          color: vars.$primary-color;
          border: 2px solid vars.$primary-color;
          
          &:hover {
            background: rgba(vars.$primary-color, 0.1);
            transform: translateY(-2px);
            
            svg {
              transform: rotate(90deg);
            }
          }
        }
      }
    }
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    width: 100%;
    align-items: start;
    
    .feature-card {
      background: white;
      padding: 2rem;
      border-radius:vars.$border-radius-medium;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      height: 12rem;
      position: relative;
      transition: all 0.3s ease;
      overflow: visible;
      
      .feature-icon {
        width: 4rem;
        height: 4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        
        svg {
          width: 100%;
          height: 100%;
          color: #666;
          transition: color 0.3s ease;
          stroke-width: 1.2;
        }
      }
      
      h3 {
        color: #2d3436;
        font-size: clamp(1rem, 2vw, 1.5rem);
        font-weight: 400;
        margin: 0;
      }
      
      .expanded-content {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        opacity: 0;
        max-height: 0;
        overflow: hidden;
        transition: all 0.3s ease-in-out;
        margin-top: -10%;
        z-index: 9;
        border-radius: 0 0 vars.$border-radius-medium vars.$border-radius-medium;
        
        p {
          color: #666;
          line-height: 1.6;
          margin: 0;
          padding: 0 1rem;
          transform: translateY(-20px);
          transition: transform 0.3s ease-in-out;
          font-weight: 300;
        }
      }
      
      &:hover {
        z-index: 11;
        
        .feature-icon svg {
          color: vars.$primary-color;
        }
        
        .expanded-content {
          opacity: 1;
          padding: 1rem;
          max-height: 200px;
          
          p {
            transform: translateY(0);
          }
        }
      }
    }
  }
}
</style> 
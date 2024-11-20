<template>
  <div class="magazine-wrapper">
    <div class="content-container">
      <div class="left-section">
        <div class="title-block fade-up">
          <h1 class="main-title">Jordan Poole</h1>
          <div class="caption">Styled by Modern Sports</div>
          <el-button class="start-btn fade-up" @click="goToGameView">
            <span class="btn-text">开启</span>
          </el-button>
        </div>
      </div>

      <div class="image-grid">
        <div class="grid-item item1 fade-up delay-1">
          <el-image
            :src="require('@/assets/jp13-3.jpg')"
            :preview-src-list="[require('@/assets/jp13-3.jpg')]"
            fit="cover"
            hide-on-click-modal
          />
        </div>
        <div class="grid-item item2 fade-up delay-2">
          <el-image
            :src="require('@/assets/curry1.jpg')"
            :preview-src-list="[require('@/assets/curry1.jpg')]"
            fit="cover"
            hide-on-click-modal
          />
        </div>
        <div class="grid-item item3 fade-up delay-3">
          <el-image
            :src="require('@/assets/jp13-1.jpg')"
            :preview-src-list="[require('@/assets/jp13-1.jpg')]"
            fit="cover"
            hide-on-click-modal
          />
        </div>
        <div class="grid-item item4 fade-up delay-4">
          <el-image
            :src="require('@/assets/jp13-2.jpg')"
            :preview-src-list="[require('@/assets/jp13-2.jpg')]"
            fit="cover"
            hide-on-click-modal
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      backgroundImage: require('@/assets/p.png'),
      dialogVisible: false,
    };
  },
  methods: {
    goToGameView() {
      if (this.$route.path !== '/game') {
        this.$router.push('/game');
      }
    },
  },
};
</script>

<style lang="less" scoped>
@white: #fff;
@gray: #f0f2f5;
@text-color: #2c3e50;

.magazine-wrapper {
  min-height: 100vh;
  background-color: @gray;
  padding: 2rem;
  position: relative;
}

.start-btn {
  margin-top: 2rem;
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  border: none !important;
  border-radius: 30px !important;
  padding: 12px 40px !important;
  font-size: 16px !important;
  color: #333 !important;
  letter-spacing: 2px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .btn-text {
    position: relative;
    z-index: 1;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
    border-radius: 30px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    color: #fff !important;

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
  max-width: 1440px;
  margin: 0 auto;
  padding-top: 4rem;
}

.left-section {
  display: flex;
  align-items: center;

  .title-block {
    .subtitle {
      font-size: 1.2rem;
      color: @text-color;
      margin-bottom: 1rem;
      text-transform: uppercase;
    }

    .main-title {
      font-size: 3.5rem;
      font-weight: 700;
      color: @text-color;
      line-height: 1.2;
      margin-bottom: 1rem;
    }

    .caption {
      font-size: 1rem;
      color: @text-color;
      opacity: 0.8;
    }
  }
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
  height: 80vh;

  .grid-item {
    overflow: hidden;
    position: relative;

    :deep(.el-image) {
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
        cursor: pointer;

        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }
}

// 动画效果
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-up {
  opacity: 0;
  animation: fadeUp 0.8s ease forwards;
}

.delay-1 {
  animation-delay: 0.2s;
}
.delay-2 {
  animation-delay: 0.4s;
}
.delay-3 {
  animation-delay: 0.6s;
}
.delay-4 {
  animation-delay: 0.8s;
}

// 响应式设计
@media (max-width: 1024px) {
  .content-container {
    grid-template-columns: 1fr;
  }

  .image-grid {
    height: 60vh;
  }

  .left-section {
    text-align: center;

    .main-title {
      font-size: 2.5rem;
    }
  }
}
</style>

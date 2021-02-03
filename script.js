const images = ["http://image13.photobiz.com/9919/35_20180517134511_4565348_xlarge.jpg","http://image13.photobiz.com/9923/35_20180517134519_4565350_xlarge.jpg","http://image14.photobiz.com/10132/35_20180425182450_4534632_xlarge.jpg","http://image14.photobiz.com/10132/35_20180425182452_4534633_xlarge.jpg","http://image13.photobiz.com/9905/35_20180517134502_4565346_xlarge.jpg","http://image11.photobiz.com/3601/35_20170504165252_3906920_xlarge.jpg","http://image8.photobiz.com/5897/35_20180112140440_4392010_xlarge.jpg","http://image13.photobiz.com/10133/35_20180425182742_4534638_xlarge.jpg","http://image14.photobiz.com/9253/35_20180517134507_4565347_xlarge.jpg","http://image8.photobiz.com/2937/35_20180112140433_4392009_xlarge.jpg","http://image14.photobiz.com/9328/35_20180517134515_4565349_xlarge.jpg","http://image11.photobiz.com/3669/35_20170504165254_3906921_xlarge.jpg","http://image13.photobiz.com/9244/35_20180517135034_4565351_xlarge.jpg","http://image9.photobiz.com/3179/35_20180112140427_4392008_xlarge.jpg","http://image13.photobiz.com/10133/35_20180425182736_4534636_xlarge.jpg","http://image7.photobiz.com/2803/35_20170404163547_3854292_xlarge.jpg"];

function createPost() {
  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper';
  wrapper.innerHTML = `
    <div class="scroll"></div>
    <div class="dottes"></div>
    <div class="arrow-left"><</div>
    <div class="arrow-right">></div>
  `.trim();
  const scroll = wrapper.querySelector('.scroll');
  const $dottes = wrapper.querySelector('.dottes');
  const $arrowLeft = wrapper.querySelector('.arrow-left');
  const $arrowRight = wrapper.querySelector('.arrow-right');

  $arrowLeft.addEventListener('click', () => {
    stopMove();
    setSlideWithAnimate(currentSlideIndex - 1);
  });
  $arrowRight.addEventListener('click', () => {
    stopMove();
    setSlideWithAnimate(currentSlideIndex + 1);
  });

  document.body.appendChild(wrapper);

  let currentSlideIndex = 0;
  let photosCount = images.length;
  let currentMoveShift = 0;

  let photoWidth = wrapper.offsetWidth;
  let watchMove = false;

  let touchStartPosition = 0;
  const TOUCHES_COORDS_START = {
    x: 0,
    y: 0,
  };

  window.addEventListener('resize', () => {
    requestAnimationFrame(() => {
      if (photoWidth !== wrapper.offsetWidth) {
        photoWidth = wrapper.offsetWidth;
        stopAndFix();
      }
    });
  });

  let startSlideIndex = 0;

  function setSlideWithAnimate(number, { fast } = {}) {
    currentSlideIndex = number;
    const prevMoveShift = currentMoveShift;
    currentMoveShift = currentSlideIndex * photoWidth;

    if (prevMoveShift === currentMoveShift) {
      return;
    }

    const newTransform = `-${currentMoveShift}px`;

    scroll.animate(
      [
        {
          left: `-${prevMoveShift}px`,
        },
        {
          left: newTransform,
        },
      ],
      {
        duration: fast ? 150 : Math.min(
          (Math.max(prevMoveShift, currentMoveShift) - Math.min(prevMoveShift, currentMoveShift)) * 3,
          300,
        ),
        easing: fast ? 'linear' : 'ease-in',
      }
    );
    requestAnimationFrame(() => {
      scroll.style.left = newTransform;
    });
    setArraws();
    setActiveDot();
  }

  function setArraws() {
    $arrowLeft.classList.toggle('arrow-active', currentSlideIndex > 0);
    $arrowRight.classList.toggle('arrow-active', currentSlideIndex < photosCount - 1);
  }

  function stopAndFix() {
    resizeImages();
    setActiveDot();
    stopMove();
    currentMoveShift = currentSlideIndex * photoWidth;
    const newTransform = `-${currentMoveShift}px`;
    scroll.style.left = newTransform;
    setArraws();
  }

  function stopMove() {
    watchMove = false;
    document.removeEventListener('touchend', onTouchEnd);
    document.removeEventListener('touchmove', onFirstTouchMove);
    document.removeEventListener('touchmove', onTouchMove);
  }

  function setActiveDot() {
    $dottes.querySelectorAll('span').forEach((item, i) => {
      item.className = i === currentSlideIndex ? 'active' : '';
    });
  }

  function resizeImages() {
    wrapper.querySelectorAll('.item').forEach((item) => {
      item.style.width = `${photoWidth}px`;
      item.style.height = `${photoWidth * 1.4 | 0}px`;
    });
  }

  scroll.addEventListener('animationend', () => {
    watchMove = true;
  });

  wrapper.addEventListener('touchstart', (e) => {
    if (watchMove) {
      return;
    }

    watchMove = true;
    startSlideIndex = currentSlideIndex;
    lastTouchX = e.touches[0].clientX;
    touchStartPosition = currentMoveShift + e.touches[0].clientX;
    TOUCHES_COORDS_START.x = e.touches[0].clientX;
    TOUCHES_COORDS_START.y = e.touches[0].clientY;
    TOUCHES_COORDS_START.ts = e.timeStamp;
    document.addEventListener('touchend', onTouchEnd);
    document.addEventListener('touchmove', onFirstTouchMove);
  });

  const onTouchEnd = (e) => {
    if (e.touches.length || !watchMove) {
      return;
    }

    if (e.timeStamp - TOUCHES_COORDS_START.ts < 300) {
      if (TOUCHES_COORDS_START.x > lastTouchX) {
        const diff = TOUCHES_COORDS_START.x - lastTouchX;

        if (diff > photoWidth / 4) {
          stopMove();
          setSlideWithAnimate(
            currentSlideIndex < photosCount - 1 ? Math.min(currentSlideIndex + 1, startSlideIndex + 1) : currentSlideIndex, { fast: true }
          );
          return;
        }
      } else if (TOUCHES_COORDS_START.x < lastTouchX) {
        const diff = lastTouchX - TOUCHES_COORDS_START.x;

        if (diff > photoWidth / 4) {
          stopMove();
          setSlideWithAnimate(
            currentSlideIndex > 0 ? Math.max(currentSlideIndex - 1, startSlideIndex - 1) : 0, { fast: true }
          );
          return;
        }
      }
    }

    stopMove();
    setSlideWithAnimate(currentSlideIndex);
  };

  const onFirstTouchMove = (e) => {
    if (
      (
        Math.max(TOUCHES_COORDS_START.x, e.targetTouches[0].clientX) - Math.min(TOUCHES_COORDS_START.x, e.targetTouches[0].clientX)
      ) < (
        Math.max(TOUCHES_COORDS_START.y, e.targetTouches[0].clientY) - Math.min(TOUCHES_COORDS_START.y, e.targetTouches[0].clientY)
      )
    ) {
      watchMove = false;
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchmove', onFirstTouchMove);
      setSlideWithAnimate(currentSlideIndex);
      return;
    }

    watchMove = true;
    onTouchMove(e);
    document.addEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchmove', onFirstTouchMove);
  };

  const onTouchMove = (e) => {
    if (!watchMove) {
      return;
    }

    currentMoveShift = touchStartPosition - e.targetTouches[0].clientX;
    lastTouchX = e.targetTouches[0].clientX;
    currentMoveShift = Math.max(0, currentMoveShift);
    currentMoveShift = Math.min((photosCount - 1) * photoWidth, currentMoveShift);
    currentSlideIndex = Math.round(currentMoveShift / photoWidth);

    setActiveDot();
    scroll.style.left = `-${currentMoveShift}px`;

    if (e.defaultPrevented) {
      e.preventDefault();
    }
  };

  scroll.innerHTML = Array.from({ length: photosCount }).map((_, i) => {
    const url = `url('${images[i]}')`;

    return `<div class="item" style="background-image:${url}"><span>${i + 1}</span></div>`;
  }).join('');
  resizeImages();

  $dottes.innerHTML = Array.from({ length: photosCount }).map((_, i) => {
    return `<span></span>`;
  }).join('');
  setActiveDot();

  setArraws();
};

images.forEach((url) => {
  const img = document.createElement('img');
  img.src = url;
});

requestAnimationFrame(() => {
  createPost();
  createPost();
  createPost();
});

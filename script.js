function createPost() {
  const images = ["http://image13.photobiz.com/9919/35_20180517134511_4565348_xlarge.jpg","http://image13.photobiz.com/9923/35_20180517134519_4565350_xlarge.jpg","http://image14.photobiz.com/10132/35_20180425182450_4534632_xlarge.jpg","http://image14.photobiz.com/10132/35_20180425182452_4534633_xlarge.jpg","http://image13.photobiz.com/9905/35_20180517134502_4565346_xlarge.jpg","http://image11.photobiz.com/3601/35_20170504165252_3906920_xlarge.jpg","http://image8.photobiz.com/5897/35_20180112140440_4392010_xlarge.jpg","http://image13.photobiz.com/10133/35_20180425182742_4534638_xlarge.jpg","http://image14.photobiz.com/9253/35_20180517134507_4565347_xlarge.jpg","http://image8.photobiz.com/2937/35_20180112140433_4392009_xlarge.jpg","http://image14.photobiz.com/9328/35_20180517134515_4565349_xlarge.jpg","http://image11.photobiz.com/3669/35_20170504165254_3906921_xlarge.jpg","http://image13.photobiz.com/9244/35_20180517135034_4565351_xlarge.jpg","http://image9.photobiz.com/3179/35_20180112140427_4392008_xlarge.jpg","http://image13.photobiz.com/10133/35_20180425182736_4534636_xlarge.jpg","http://image7.photobiz.com/2803/35_20170404163547_3854292_xlarge.jpg"];
  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper';
  wrapper.innerHTML = `
    <div class="scroll"></div><div class="dottes"></div>
  `.trim();
  const scroll = wrapper.querySelector('.scroll');
  const $dottes = wrapper.querySelector('.dottes');

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
    photoWidth = wrapper.offsetWidth;
    stopAndFix();
  });

  function stopAndFix() {
    resizeImages();
    setActiveDot();
    watchMove = false;
    wrapper.removeEventListener('touchmove', onFirstTouchMove);
    wrapper.removeEventListener('touchmove', onTouchMove);
    currentMoveShift = currentSlideIndex * photoWidth;
    const newTransform = `translateX(-${currentMoveShift}px)`;
    scroll.style.transform = newTransform;
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
    touchStartPosition = currentMoveShift + e.touches[0].clientX;
    TOUCHES_COORDS_START.x = e.touches[0].clientX;
    TOUCHES_COORDS_START.y = e.touches[0].clientY;
    wrapper.addEventListener('touchmove', onFirstTouchMove);
  });

  wrapper.addEventListener('touchend', (e) => {
    if (e.touches.length || !watchMove) {
      return;
    }

    watchMove = false;
    wrapper.removeEventListener('touchmove', onTouchMove);
    const prevMoveShift = currentMoveShift;
    currentMoveShift = currentSlideIndex * photoWidth;
    const newTransform = `translateX(-${currentMoveShift}px)`;

    scroll.animate(
      [
        {
          transform: `translateX(-${prevMoveShift}px)`,
        },
        {
          transform: newTransform,
        },
      ],
      {
        duration: Math.min(
          (Math.max(prevMoveShift, currentMoveShift) - Math.min(prevMoveShift, currentMoveShift)) * 3,
          300,
        ),
        easing: 'ease-in',
      }
    );
    requestAnimationFrame(() => {
      scroll.style.transform = newTransform;
    });
  });

  const onFirstTouchMove = (e) => {
    if (
      (
        Math.max(TOUCHES_COORDS_START.x, e.targetTouches[0].clientX) - Math.min(TOUCHES_COORDS_START.x, e.targetTouches[0].clientX)
      ) < (
        Math.max(TOUCHES_COORDS_START.y, e.targetTouches[0].clientY) - Math.min(TOUCHES_COORDS_START.y, e.targetTouches[0].clientY)
      )
    ) {
      watchMove = false;
      wrapper.removeEventListener('touchmove', onTouchMove);
      wrapper.removeEventListener('touchmove', onFirstTouchMove);
      return;
    }

    watchMove = true;
    onTouchMove(e);
    wrapper.addEventListener('touchmove', onTouchMove);
  };

  const onTouchMove = (e) => {
    if (!watchMove) {
      return;
    }

    currentMoveShift = touchStartPosition - e.targetTouches[0].clientX;
    currentMoveShift = Math.max(0, currentMoveShift);
    currentMoveShift = Math.min((photosCount - 1) * photoWidth, currentMoveShift);
    currentSlideIndex = Math.round(currentMoveShift / photoWidth);
    setActiveDot();
    scroll.style.transform = `translateX(-${currentMoveShift}px)`;
    e.preventDefault();
  };

  scroll.innerHTML = Array.from({ length: photosCount }).map((_, i) => {
    const color = `#${(Math.random() * (16 ** 6) | 0).toString(16).padStart(6, '0')}`;
    const url = `url('${images[i]}')`;

    return `<div class="item" style="background-color:${color};background-image:${url}"><span>${i + 1}</span></div>`;
  }).join('');
  resizeImages();

  $dottes.innerHTML = Array.from({ length: photosCount }).map((_, i) => {
    return `<span></span>`;
  }).join('');
  setActiveDot();

  // wrapper.addEventListener('wheel', (event) =>{
  //   console.log(event);
  //   if (watchMove) {
  //     event.preventDefault();
  //   }
  // });
};

createPost();
createPost();
createPost();

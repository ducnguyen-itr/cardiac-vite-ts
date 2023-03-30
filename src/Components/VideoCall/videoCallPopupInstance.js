let newWindow = null;

export const showVideoCallPopupCenter = ({
  url, title, w, h, isFull,
}) => {
  if (!newWindow || newWindow.closed) {
    if (isFull) {
      newWindow = window.open(url, title,
        `
          resizable,scrollbars,status,
          top=0, 
          left=0
        `);
    } else {
      // Fixes dual-screen position                             Most browsers      Firefox
      const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
      const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

      const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen?.width;
      const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen?.height;

      const systemZoom = width / window.screen.availWidth;
      const left = (width - w) / 2 / systemZoom + dualScreenLeft;
      const top = (height - h) / 2 / systemZoom + dualScreenTop;
      newWindow = window.open(url, title,
        `
          resizable,scrollbars,status,
          width=${w / systemZoom}, 
          height=${h / systemZoom}, 
          top=${top}, 
          left=${left}
        `);
    }
    if (window.focus) newWindow.focus();
  } else {
    newWindow.focus();
  }
};

export const closeVideoCallPopup = () => {
  if (newWindow) {
    newWindow.close();
    newWindow = null;
  }
};

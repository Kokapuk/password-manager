const isDesktopApp = (): boolean => {
  return navigator.userAgent.toLowerCase().includes('electron');
};

export default isDesktopApp;

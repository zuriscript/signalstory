export const setRafInterval = (callback, timeout = 0) => {
  const interval = timeout < 0 ? 0 : timeout;
  const handle = {
    id: 0,
  };

  let startTime = Date.now();

  const loop = () => {
    const nowTime = Date.now();
    if (nowTime - startTime >= interval) {
      startTime = nowTime;
      callback();
    }

    handle.id = requestAnimationFrame(loop);
  };

  handle.id = requestAnimationFrame(loop);

  return handle;
};

export const clearRafInterval = handle => {
  if (handle) {
    cancelAnimationFrame(handle.id);
  }
};

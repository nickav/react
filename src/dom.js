export const isEventListener = (key) => key.startsWith('on');

export const getListenerName = (key) => key.slice(2).toLowerCase();

export const setElementProp = (el, key, value) => {
  if (isEventListener(key)) {
    el.addEventListener(getListenerName(key), value);

    if (process.env.NODE_ENV === 'development') {
      el._eventListeners = el._eventListeners || [];
      el._eventListeners.push({
        key,
        value,
      });
    }
  } else {
    el.setAttribute(key, value);
  }
};

export const removeElementProp = (el, key, value) => {
  if (isEventListener(key)) {
    el.removeEventListener(getListenerName(key), value);

    if (process.env.NODE_ENV === 'development') {
      el._eventListeners = el._eventListeners.filter(
        (e) => !(e.key === key && e.value === value)
      );
    }
  } else {
    el.removeAttribute(key);
  }
};

export const updateElementProps = (el, nextProps, prevProps) => {
  // remove old props
  prevProps = prevProps || {};
  Object.keys(prevProps).forEach((key) => {
    if (!nextProps.hasOwnProperty(key)) {
      removeElementProp(el, key, prevProps[key]);
    }
  });

  // update new props
  nextProps = nextProps || {};
  Object.keys(nextProps).forEach((key) => {
    if (
      (!prevProps.hasOwnProperty(key) || prevProps[key] !== nextProps[key]) &&
      key !== 'key' &&
      key !== 'ref'
    ) {
      if (isEventListener(key) && prevProps.hasOwnProperty(key)) {
        removeElementProp(el, key, prevProps[key]);
      }
      setElementProp(el, key, nextProps[key]);
    }
  });
};

// TODO: maybe implement handy api thing?
const createListeners = (el, listeners = {}) => {
  // unbind listeners
  return () => {};
};

// const unlisten = createListeners(el, { onKeyDown: console.log });

/* eslint-disable consistent-return */
import _ from 'lodash';
import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import emitter from '../Utils/eventEmitter';


export const useMergeState = (initialState) => {
  const [state, setState] = useState(initialState);
  const setMergedState = newState => setState((prevState) => {
    const expectedState = _.assign(prevState, newState);
    return { ...expectedState };
  });
  return [state, setMergedState];
};

export const useUpdateEffect = (effect, dependencies = [], cleanup, timeOutConfig = {}) => {
  const isInitialMount = useRef(true);
  const handleTimeOut = useRef(undefined);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else if (!_.isEmpty(timeOutConfig)) {
      const { timeout } = timeOutConfig;
      if (handleTimeOut.current) {
        clearTimeout(handleTimeOut.current);
      }
      handleTimeOut.current = setTimeout(() => {
        effect();
      }, timeout);
    } else {
      effect();
    }
    return cleanup;
  }, dependencies);
};

/*
 *  const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * The hook will only return the latest value if it's been more than 500ms since searchTerm changed.
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export const useEmitter = (key, callback, deps) => {
  useEffect(() => {
    if (!(key && callback)) {
      return;
    }
    const listener = emitter.addListener(key, callback);
    return () => {
      listener.remove();
    };
  }, [key, ...deps]);
  return emitter;
};


export function useIntersectionObserver(element, appear, dissolve, deps) {
  const observer = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting) {
      appear();
    } else {
      dissolve();
    }
  });
  useEffect(() => {
    if (!element) return;
    observer.observe(element);
    return () => {
      if (element) { observer.unobserve(element); }
    };
  }, [element, ...deps]);
  return observer;
}

export function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
  return update;
}

export function useActions(actions, deps) {
  const dispatch = useDispatch();
  return useMemo(
    () => {
      if (Array.isArray(actions)) {
        return actions.map(a => bindActionCreators(a, dispatch));
      }
      return bindActionCreators(actions, dispatch);
    },
    deps ? [dispatch, ...deps] : [dispatch],
  );
}

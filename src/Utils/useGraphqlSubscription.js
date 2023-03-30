/* eslint-disable consistent-return */
import { useEffect } from 'react';

export default function useGraphqlSubscription(observable, onNext, onError, deps) {
  useEffect(() => {
    if (!(observable)) return;
    const subscribed = observable.subscribe({
      next: ({ provider, value }) => onNext(value),
      error: error => onError(error),
    });
    return () => {
      if (subscribed) subscribed.unsubscribe();
    };
  }, [observable, ...deps]);

  return observable;
}

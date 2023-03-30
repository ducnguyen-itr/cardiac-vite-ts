export const popHistory = data => ({ type: 'POP', data });

export const pushHistory = data => ({ type: 'PUSH', data });

export const goBackHistory = () => ({ type: 'GO_BACK' });

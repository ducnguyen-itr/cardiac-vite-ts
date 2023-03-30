

const formatTime = x => `${x ? x < 10 ? `0${x}` : x : '00'}`;

export const getTimeString = (value) => {
  const x = parseFloat(value);
  return formatTime(x);
};
export const getInitValue = (value) => {
  if (!value) {
    return {
      hourVal: '00',
      minVal: '00',
      secVal: '00',
    };
  }
  const hours = Math.floor((value / (60 * 60)));
  const minutes = Math.floor((value / 60) % 60);
  const seconds = Math.floor((value) % 60);
  return { hourVal: formatTime(hours), minVal: formatTime(minutes), secVal: formatTime(seconds) };
};

export const getSecondsValue = (state = {}) => {
  const { hourVal, minVal, secVal } = state || {};
  return parseFloat(hourVal || 0) * 3600 + parseFloat(minVal || 0) * 60 + parseFloat(secVal || 0);
};

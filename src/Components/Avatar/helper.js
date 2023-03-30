import _ from 'lodash';

const arr1 = 'abc';
const arr2 = 'de';
const arr3 = 'fgh';
const arr4 = 'ij';
const arr5 = 'klm';
const arr6 = 'no';
const arr7 = 'pqr';
const arr8 = 'stu';
const arr9 = 'vw';
const arr10 = 'xyz';

export const getSizeText = (size = 32) => {
  let res = 'size-32';
  switch (size) {
    case 22:
      res = 'size-22';
      break;
    case 24:
      res = 'size-24';
      break;
    case 28:
      res = 'size-28';
      break;
    case 40:
      res = 'size-40';
      break;
    case 52:
      res = 'size-52';
      break;
    case 80:
      res = 'size-80';
      break;
    case 100:
      res = 'size-100';
      break;
    case 128:
      res = 'size-128';
      break;
    default:
      break;
  }
  return res;
};

export const getBackgroundAvatar = (firstName = '') => {
  if (firstName) {
    const myChar = _.lowerCase(firstName[0]);
    const arr = [arr1, arr2, arr3, arr4, arr5, arr6, arr7, arr8, arr9, arr10];
    let res = 'bg-avatar-1';
    _.forEach(arr, (x, i) => {
      if (_.includes(x, myChar)) {
        res = `bg-avatar-${i + 1}`;
      }
    });
    return res;
  }
  return undefined;
};

export const getFirstLetterName = (firstName, lastName) => {
  try {
    if (firstName && lastName) {
      return `${_.upperCase(firstName[0])}${_.upperCase(lastName[0])}`;
    }
    return '';
  } catch (error) {
    return '';
  }
};

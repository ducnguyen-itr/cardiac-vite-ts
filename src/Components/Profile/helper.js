import Resizer from 'react-image-file-resizer';
import fetchRequestFileUpload from '../../Apollo/Functions/Fetch/fetchRequestFileUpload';
import handleUpdateAvatar from '../../Apollo/Functions/Handle/handleUpdateAvatar';
import consoleLog from '../../Helpers/consoleLog';
import { showFailedMsg, showSuccessMsg } from '../../Utils/showNotification';

const SUCCESS_UPDATED_IMAGE = 'Your profile image has been updated successfully!';
export const FAILED_UPDATED_IMAGE = 'Failed to upload the image!';


export const getUserData = (
  role, email, fullName,
  // phone, address,
) => [
  {
    title: 'Role',
    data: role || '',
  },
  {
    title: 'Email',
    data: email || '',
  },
  {
    title: 'Full name',
    data: fullName || '',
  },
];

export const getUserInfo = (
  phone, country, address,
) => [
  {
    title: 'Phone number',
    data: phone || '',
  },
  {
    title: 'Country',
    data: country || '',
  },
  {
    title: 'Address',
    data: address || '',
  },
];

const resizeFile = file => new Promise((resolve) => {
  Resizer.imageFileResizer(file, 200, 200, 'JPEG', 100, 0, (uri) => { resolve(uri || undefined); }, 'file');
});

const getImageBlob = async url => new Promise(async (resolve) => {
  const resposne = await fetch(url);
  const blob = resposne.blob();
  resolve(blob);
});

// convert a blob to base64
const blobToBase64 = async blob => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = function () {
    const dataUrl = reader.result;
    resolve(dataUrl);
  };
  reader.readAsDataURL(blob);
});

// combine the previous two functions to return a base64 encode image from url
export const getBase64Image = async (url) => {
  const blob = await getImageBlob(url);
  const base64 = await blobToBase64(blob);
  return base64;
};

const handleImg = async (photo) => {
  try {
    const resizedImg = await resizeFile(photo);

    const urls = await fetchRequestFileUpload({
      input: {
        amount: 1,
        type: 'jpeg',
      },
    });

    await fetch(urls[0], {
      method: 'PUT',
      body: resizedImg,
      redirect: 'follow',
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });

    const avatarLink = await handleUpdateAvatar({ avatarPath: urls[0] });

    const base64 = await getBase64Image(avatarLink);

    return base64;
  } catch (error) {
    throw error;
  }
};


export const mutationUpdateAvatar = async (photo) => {
  try {
    const avatarLink = await handleImg(photo);
    showSuccessMsg(SUCCESS_UPDATED_IMAGE);
    return avatarLink;
  } catch (error) {
    consoleLog('Failed to change photo: ', error);
    showFailedMsg(FAILED_UPDATED_IMAGE);
  }
  return '';
};

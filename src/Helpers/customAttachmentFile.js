/* eslint-disable import/no-cycle */
import Auth from '@aws-amplify/auth';
import axios from 'axios';
import _ from 'lodash';
import { uploadFileToUrl } from '../Utils';

export const getAttachmentFileName = (url, index, isPdfReport) => {
  const splitFileName = url.split('?')?.[0];
  const lastIndexOfDot = _.lastIndexOf(splitFileName, '.');
  return lastIndexOfDot > -1
    ? `${isPdfReport ? 'Report' : 'Attachment'} ${index + 1}${splitFileName.slice(lastIndexOfDot, splitFileName.length)}`
    : '';
};

export const getEcgImageFileName = (url, index) => {
  const splitFileName = url.split('?')?.[0];
  const lastIndexOfDot = _.lastIndexOf(splitFileName, '.');
  return lastIndexOfDot > -1
    ? `ECG Image ${index + 1}${splitFileName.slice(lastIndexOfDot, splitFileName.length)}`
    : '';
};

export const downloadImages = async (imageUrls, isEcgImages = false, isPdfReport = false) => {
  const currentSession = await Auth.currentSession();
  const token = currentSession.accessToken.jwtToken;
  const downloadImagesPromises = [];
  _.forEach(imageUrls, (url) => {
    downloadImagesPromises.push(
      axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
          'access-token': token,
        },
      }),
    );
  });
  const downloadedImages = await Promise.all(downloadImagesPromises);
  return _.map(downloadedImages, (image, index) => {
    if (isEcgImages) {
      const blob = new Blob([image.data], { type: 'image/*' });
      const objectUrl = window.URL.createObjectURL(blob);
      return {
        name: getEcgImageFileName(imageUrls[index], index),
        objectUrl,
        arrayBuffer: image.data,
        isArrayBuffer: true,
      };
    }
    return {
      name: getAttachmentFileName(imageUrls[index], index, isPdfReport),
      arrayBuffer: image.data,
      isArrayBuffer: true,
    };
  });
};

export const uploadAttachment = async (baseline) => {
  // *: Step 2
  // *: Blood
  if (baseline?.bloodMedicalTest) {
    const addedTypeFilesBlood = baseline?.bloodMedicalTest?.attachments
      ? [...baseline.bloodMedicalTest.attachments]
      : [];
    const uploadedFilesBlood = [];
    for (let i = 0; i < addedTypeFilesBlood.length; i += 1) {
      const file = addedTypeFilesBlood[i];
      if (file.isArrayBuffer) {
        uploadedFilesBlood.push({
          data: file.arrayBuffer,
          customFileType: file?.name?.split('.').pop(),
        });
      } else {
        uploadedFilesBlood.push({
          data: file,
          customFileType: file?.name?.split('.').pop(),
        });
      }
    }
    const attachmentsBlood = await uploadFileToUrl(uploadedFilesBlood);
    _.assign(baseline?.bloodMedicalTest, { attachments: attachmentsBlood });
  }
  // *: Liver
  if (baseline?.liverMedicalTest) {
    const addedTypeFilesLiver = baseline?.liverMedicalTest?.attachments
      ? [...baseline.liverMedicalTest.attachments]
      : [];
    const uploadedFilesLiver = [];
    for (let i = 0; i < addedTypeFilesLiver.length; i += 1) {
      const file = addedTypeFilesLiver[i];
      if (file.isArrayBuffer) {
        uploadedFilesLiver.push({
          data: file.arrayBuffer,
          customFileType: file?.name?.split('.').pop(),
        });
      } else {
        uploadedFilesLiver.push({
          data: file,
          customFileType: file?.name?.split('.').pop(),
        });
      }
    }

    const attachmentsLiver = await uploadFileToUrl(uploadedFilesLiver);
    _.assign(baseline?.liverMedicalTest, { attachments: attachmentsLiver });
  }
  // *: Lead ECG
  if (baseline?.leadEcgMedicalTest) {
    const addedTypeFilesLeadEcg = baseline?.leadEcgMedicalTest?.attachments
      ? [...baseline.leadEcgMedicalTest.attachments]
      : [];
    const uploadedFilesLeadEcg = [];
    for (let i = 0; i < addedTypeFilesLeadEcg.length; i += 1) {
      const file = addedTypeFilesLeadEcg[i];
      if (file.isArrayBuffer) {
        uploadedFilesLeadEcg.push({
          data: file.arrayBuffer,
          customFileType: file?.name?.split('.').pop(),
        });
      } else {
        uploadedFilesLeadEcg.push({
          data: file,
          customFileType: file?.name?.split('.').pop(),
        });
      }
    }
    const attachmentsLeadEcg = await uploadFileToUrl(uploadedFilesLeadEcg);
    _.assign(baseline?.leadEcgMedicalTest, { attachments: attachmentsLeadEcg });
  }
  // *: Step 3
  // *: Stress
  if (baseline?.stressMedicalTest) {
    const addedTypeFilesStress = baseline?.stressMedicalTest?.attachments
      ? [...baseline.stressMedicalTest.attachments]
      : [];
    const uploadedFilesStress = [];
    for (let i = 0; i < addedTypeFilesStress.length; i += 1) {
      const file = addedTypeFilesStress[i];
      if (file.isArrayBuffer) {
        uploadedFilesStress.push({
          data: file.arrayBuffer,
          customFileType: file?.name?.split('.').pop(),
        });
      } else {
        uploadedFilesStress.push({
          data: file,
          customFileType: file?.name?.split('.').pop(),
        });
      }
    }
    const attachmentsStress = await uploadFileToUrl(uploadedFilesStress);
    _.assign(baseline?.stressMedicalTest, { attachments: attachmentsStress });
  }
  // *: Step 4
  // *: Bioflux
  // TODO: Update Bioflux attachments still has error, please check to backend
  if (baseline?.bioflux) {
    const addedTypeFilesBioflux = baseline?.bioflux?.attachments
      ? [...baseline.bioflux.attachments]
      : [];
    const uploadedFilesBioflux = [];
    for (let i = 0; i < addedTypeFilesBioflux.length; i += 1) {
      const file = addedTypeFilesBioflux[i];
      if (file.isArrayBuffer) {
        uploadedFilesBioflux.push({
          data: file.arrayBuffer,
          customFileType: file?.name?.split('.')?.pop(),
        });
      } else {
        uploadedFilesBioflux.push({
          data: file,
          customFileType: file?.name?.split('.')?.pop(),
        });
      }
    }
    const attachmentsBioflux = await uploadFileToUrl(uploadedFilesBioflux);
    _.assign(baseline?.bioflux, { attachments: attachmentsBioflux });
  }
  return baseline;
};

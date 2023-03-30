import { FileExcelOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import XLSX from 'xlsx';
import { CONFIRMATION_LAYOUT_TYPES, UP_LOAD_FILE_DESCRIPTION } from '../../../Constants';
import { useMergeState } from '../../../Helpers/customHooks';
import ConfirmationLayout from '../../../Pages/Reports/ReportDetails/Layout/confirmationLayout';
import { showFailedMsg, showSuccessMsg } from '../../../Utils/showNotification';
import CustomButton from '../../Button/customButton';
import SelectCTV2 from '../../Input/selectCTV2';
import UploadFileCT from '../../Input/uploadFileCT';
import { isEmptyFile, processData } from './helper';
import './style.scss';
import { isEmptyObj } from '../../../Utils';

const { UPLOAD_FILE_TITLE, UPLOAD_FILE_DESC } = UP_LOAD_FILE_DESCRIPTION;

const ImportPatientListModal = forwardRef((props, ref) => {
  const { onClickImport, visible, onClickCancel } = props;
  const [state, setState] = useMergeState({
    attachments: [],
    data: [],
    error: '',
    selectedTemplate: _.find(props.templates, x => x.label === 'No template'),
    isShowDiscardPatientListModal: false,
    isLoading: false,
  });

  useImperativeHandle(ref, () => ({
    clearData() {
      setState({ attachments: [], data: [] });
    },
  }));

  useEffect(() => {
    if (state.attachments.length === 0) {
      setState({ data: [] });
    }
  }, [state.attachments]);

  useEffect(() => {
    if (props.templates.length > 0) {
      setState({ selectedTemplate: _.find(props.templates, x => x.label === 'No template') });
    }
  }, [props.templates]);

  const csvFileToArray = (string) => {
    try {
      const csvHeader = string.slice(0, string.indexOf('\n')).split(',');
      const csvRows = string.slice(string.indexOf('\n') + 1).split('\n');

      const array = csvRows.map((i) => {
        const values = i.split(',');
        const obj = csvHeader.reduce((object, header, index) => {
          const trimValue = values[index]?.replace(/(?:\r\n|\r|\n)/g, '');
          object[header?.trim()] = trimValue;
          return object;
        }, {});
        return obj;
      });
      const filterArr = _.filter(array, x => !isEmptyObj(x));
      if (filterArr.length > 0) {
        const { data, error } = processData(filterArr, state.selectedTemplate);
        setState({ data, error });
      } else {
        setState({ error: 'The selected file is empty or contains the wrong template. Please refer to the sample file.' });
      }
    } catch (error) {
      showFailedMsg('There was an error processing your file. Please try again!');
      setState({ error: 'Error' });
    } finally {
      setState({ isLoading: false });
    }
  };

  const handleProcessFile = (e) => {
    try {
      const text = e.target.result;

      const workbook = XLSX.read(text, {
        type: 'binary',
      });
      // const templateSheet = _.find(workbook.SheetNames, x => x === 'Template');
      let dataFromFile = [];
      _.forEach(workbook.SheetNames, (sheetName) => {
        const data = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        if (data.length > 0 && !isEmptyFile(data[0])) {
          dataFromFile = data;
          return false;
        }
      });
      if (dataFromFile.length > 0) {
        const { data, error } = processData(dataFromFile, state.selectedTemplate);
        setState({ data, error });
      } else {
        setState({ error: 'The selected file is empty or contains the wrong template. Please refer to the sample file.' });
      }
    } catch (error) {
      showFailedMsg('There was an error processing your file. Please try again!');
      setState({ error: 'Error' });
    } finally {
      setState({ isLoading: false });
    }
  };

  const onChangeFile = (name, files) => {
    if (files.length < 1) {
      setState({ error: 'This file type is not supported.' });
      return;
    }
    setState({ [name]: [files[0]], isLoading: true });
    const reader = new FileReader();
    if (files[0]?.type === 'text/csv') {
      reader.onload = function (e) {
        csvFileToArray(e.target.result);
      };
      reader.readAsText(files[0]);
    } else {
      reader.onload = function (e) {
        handleProcessFile(e);
      };
      reader.readAsArrayBuffer(files[0]);
    }
  };

  const onClickDelete = (name, file) => {
    const arr = state.attachments ? [...state.attachments] : [];
    _.remove(arr, x => _.isEqual(x, file));
    setState({ attachments: arr, error: '' });
  };

  const onImportClick = () => {
    setState({ isShowDiscardPatientListModal: false });
    setTimeout(() => {
      const newData = _.map(state.data, x => ({
        ...x,
        template: state.selectedTemplate,
      }));
      onClickImport(newData);
      showSuccessMsg('The file is successfully uploaded!');
    }, 500);
  };

  const onCheckImportClick = () => {
    if (!props.imported) {
      onImportClick();
    } else {
      setState({ isShowDiscardPatientListModal: true });
    }
  };

  const toggleDiscardPatientListModal = () => {
    setState({ isShowDiscardPatientListModal: !state.isShowDiscardPatientListModal });
  };

  const onChangeTemplate = (name, value) => {
    setState({ selectedTemplate: value });
  };

  return (
    <Modal
      className="import-patients-modal"
      visible={visible}
      title="Import patient list"
      onCancel={onClickCancel}
      footer={[
        <CustomButton key="back" onClick={onClickCancel} label="Cancel" />,
        <CustomButton
          key="submit"
          type="primary"
          disabled={(!_.isEmpty(state.error) || state.data.length < 1 || _.isEmpty(state.selectedTemplate))}
          onClick={onCheckImportClick}
          loading={state.isLoading}
          label=" Import patient list"
        />,

      ]}
    >
      <div className="import-csv-modal">
        <SelectCTV2
          name="selectedTemplate"
          title="Template"
          data={props.templates}
          isObject
          value={state.selectedTemplate}
          onChange={onChangeTemplate}
        />
        <div className="upload-file">
          <div className="upload-file-title">Patient list</div>
          <UploadFileCT
            name="attachments"
            className="mt16"
            onChange={onChangeFile}
            onClickDelete={onClickDelete}
            fileList={state.attachments}
            accept=".csv,.xlsx"
            icon={<FileExcelOutlined className="paper-clip-ct" />}
            customZoneContent={(
              <div className="upload-file-zone">
                <div className="upload-file-zone-icon"><FileExcelOutlined /></div>
                <div className="upload-file-zone-title">{UPLOAD_FILE_TITLE}</div>
                <div className="upload-file-zone-desc">{UPLOAD_FILE_DESC}</div>
              </div>
            )}
          />
        </div>
        {!_.isEmpty(state.error) && (
          <div className="csv-limit-error mt8">
            {state.error}
          </div>
        )}
      </div>
      <ConfirmationLayout
        type={CONFIRMATION_LAYOUT_TYPES.DISCARD_PATIENT_LIST}
        visible={state.isShowDiscardPatientListModal}
        toggleClick={toggleDiscardPatientListModal}
        onClick={onImportClick}
      />
    </Modal>
  );
});

ImportPatientListModal.defaultProps = {
  visible: false,
  imported: false,
};

ImportPatientListModal.propTypes = {
  onClickImport: PropTypes.func.isRequired,
  visible: PropTypes.bool,
  imported: PropTypes.bool,
  onClickCancel: PropTypes.func.isRequired,
  templates: PropTypes.shape().isRequired,
};

export default ImportPatientListModal;

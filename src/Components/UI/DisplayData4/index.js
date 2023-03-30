import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import {
  CopyFilled, EditFilled, ExclamationCircleFilled,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { DISPLAY_DATA_2 } from '../../../Constants';
import CustomButton from '../../Button/customButton';
import UploadFileCT from '../../Input/uploadFileCT';

const {
  FREQUENCY, ARRAY, DATE, PERCENT, ATTACHMENT, REPORT,
} = DISPLAY_DATA_2;


const DisplayData4 = (props) => {
  const {
    title, data, type, index,
  } = props;

  let leftCT = 'w-l-2';
  let rightCT = 'w-r-2';
  switch (props.leftWidth) {
    case 1: {
      leftCT = 'w-l-1';
      rightCT = 'w-r-1';
      break;
    }
    case 3: {
      leftCT = 'w-l-3';
      rightCT = 'w-r-3';
      break;
    }
    case 4: {
      leftCT = 'w-l-4';
      rightCT = 'w-r-4';
      break;
    }
    case 5: {
      leftCT = 'w-l-5';
      rightCT = 'w-r-5';
      break;
    }
    case 6: {
      leftCT = 'w-l-6';
      rightCT = 'w-r-6';
      break;
    }
    case 7: {
      leftCT = 'w-l-7';
      break;
    }
    default: {
      break;
    }
  }

  const showLineData = (content = '', itemClassName = '', icon = undefined, isMissingData = false) => (
    <div className={classnames('data-item', 'right-item', rightCT, itemClassName, isMissingData ? 'padl26i' : '')}>
      <span>{content}</span>

      {
        icon || null
      }
    </div>
  );

  const showColumnData = (data = [], itemClassName = '') => (
    <div className={classnames('data-item', 'right-item', 'type-data', rightCT, itemClassName)}>
      {
        _.map(data, (y, i) => (
          <div key={i}>
            <span>{y}</span>
          </div>
        ))
      }
    </div>
  );

  const showUploadFiles = (attachment = [], icon = undefined) => (
    <UploadFileCT
      name="attachment"
      fileList={attachment || []}
      className="upload-file-class"
      isShowUpload={false}
      resClassName="upload-res-row"
      isAbleToDownload
      icon={icon}
    />
  );

  const showUploadReportFiles = (attachment = []) => (
    <>
      {attachment === 'N/A'
        ? (
          <div
            className={classnames('data-item', 'right-item', 'type-data', rightCT)}
          >
            N/A
          </div>
        ) : (
          <UploadFileCT
            name="attachment"
            fileList={attachment || []}
            className="upload-file-class"
            isShowUpload={false}
            resClassName="upload-res-row"
            isAbleToDownload
            icon={<CopyFilled className="paper-clip-ct" />}
          />
        )
      }
    </>
  );

  const showData = (x = {}, itemClassName = '') => {
    if (_.isEmpty(x)) {
      return '';
    }
    const {
      type, icon, data, unit, isMissingData,
    } = x;

    let content = data;
    if (type === ATTACHMENT) {
      return showUploadFiles(data, icon);
    }
    if (type === REPORT) {
      return showUploadReportFiles(data);
    }
    if (type === ARRAY) {
      return showColumnData(data, itemClassName);
    }
    if (type === DATE) {
      content = moment(data).isValid() ? moment(data).format('MM/DD/YYYY') : '';
    }
    if (type === FREQUENCY) {
      const fre = parseInt(data, 10);
      switch (fre) {
        case 1:
          content = `Once ${unit}`;
          break;
        case 2:
          content = `Twice ${unit}`;
          break;
        default:
          content = `${data} time${fre > 1 ? 's' : ''} ${unit}`;
          break;
      }
      // content = `${data} time${parseInt(data, 10) > 1 ? 's' : ''} ${unit}`;
    }
    if (type === PERCENT && content) {
      content += ' %';
    }

    return showLineData(content, itemClassName, icon, isMissingData);
  };

  const showRightColumn = (x) => {
    switch (type) {
      case 'NONE': {
        return null;
      }
      case 'RANGE': {
        return showColumnData(x?.data);
      }
      default: {
        return showData(x);
      }
    }
  };

  return (
    <div className={classnames('display-data-2-wrapper display-data-4', props.className)}>
      {
        title && (
          <div className={classnames('size-16-n-g9', props.titleClassName)}>
            <span>{title}</span>
          </div>
        )
      }

      {
        !_.isNil(index) && index !== undefined && (
          <div className={classnames('display-data-4-index', props.indexClassName)}>
            <span>{`#${index}`}</span>
          </div>
        )
      }

      {
        _.map(data, (x, i) => (
          <div
            key={i}
            className={classnames(
              'display-data-2-item',
              props.rowClassName, i % 2 !== 0 && props.isStrip ? 'strip' : '',
              x.isMissingData ? 'padr0' : '',
            )}
          >
            <div className={classnames('data-item', 'left-item', leftCT)}>
              <span>{x?.title}</span>
            </div>

            {showRightColumn(x)}
            {x.isMissingData && (
              <div>
                <Tooltip className="arler-tooltip-missing-data" placement="bottomRight" title={x.missingText}>
                  <ExclamationCircleFilled />
                </Tooltip>
              </div>
            )}
          </div>
        ))
      }

      {
        props.isEditable && (
          <div className="display-data-2-edit-button">
            <CustomButton onClick={props.onClickEdit} icon={<EditFilled />} label="Edit" />
          </div>
        )
      }
    </div>
  );
};

DisplayData4.defaultProps = {
  className: undefined,
  rowClassName: undefined,
  title: '',
  data: [],
  isStrip: false,
  type: '',
  leftWidth: 2,
  titleClassName: undefined,
  isEditable: false,
  onClickEdit: () => { },
  index: undefined,
  indexClassName: '',
};

DisplayData4.propTypes = {
  className: PropTypes.string,
  rowClassName: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ])),
  isStrip: PropTypes.bool,
  type: PropTypes.string,
  leftWidth: PropTypes.number,
  titleClassName: PropTypes.string,
  isEditable: PropTypes.bool,
  onClickEdit: PropTypes.func,
  index: PropTypes.number,
  indexClassName: PropTypes.string,
};

export default DisplayData4;

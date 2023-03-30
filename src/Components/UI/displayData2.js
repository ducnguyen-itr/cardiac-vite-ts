import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import {
  CopyFilled, EditFilled, ExclamationCircleFilled,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { DISPLAY_DATA_2 } from '../../Constants';
import CustomButton from '../Button/customButton';
import UploadFileCT from '../Input/uploadFileCT';

const {
  FREQUENCY, ARRAY, DATE, PERCENT, ATTACHMENT, REPORT, APT_STATUS, LINK,
} = DISPLAY_DATA_2;


const DisplayData2 = (props) => {
  const {
    title, data, type,
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
    case 8: {
      leftCT = 'w-l-8';
      rightCT = 'w-r-8';
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

  const showLinkData = (content = '', itemClassName) => (
    <div className={classnames('data-item', 'right-item', 'type-data', rightCT, itemClassName)}>
      <CustomButton onClick={props.onLinkClick} className="display-data-link" type="link" label={content} />
    </div>
  );

  const showStatuskData = content => (
    <div className={classnames('data-item', 'right-item', 'type-data', rightCT)}>
      <div className={classnames('apt-status', content === 'Virtual' ? 'virtual-color' : 'in-person-color')}>{content}</div>
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
      icon={icon || <CopyFilled className="paper-clip-ct" />}
    />
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
      return showUploadFiles(data, icon);
    }
    if (type === ARRAY) {
      return showColumnData(data, itemClassName);
    }
    if (type === LINK) {
      return showLinkData(data);
    }
    if (type === APT_STATUS) {
      return showStatuskData(data);
    }
    if (type === DATE) {
      content = data && moment(data).isValid() ? moment(data).format('MM/DD/YYYY') : '';
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
    <div className={classnames('display-data-2-wrapper', props.className)}>
      {
        title && (
          <div className={classnames('size-16-b-g9', 'mb8', props.titleClassName)}>
            <span>{title}</span>
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
            )} // i === data.length - 1 ? 'last-item-ct' : ''
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

DisplayData2.defaultProps = {
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
  onLinkClick: () => { },
};

DisplayData2.propTypes = {
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
  onLinkClick: PropTypes.func,
};

export default DisplayData2;

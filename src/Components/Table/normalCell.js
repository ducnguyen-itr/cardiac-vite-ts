import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Checkbox, Input, Tooltip,
} from 'antd';
import {
  CopyFilled, CalendarFilled, VideoCameraFilled, CloseCircleFilled,
  ThunderboltFilled,
  FileTextFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
  DeleteOutlined,
  InfoCircleOutlined,
  EditOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
  ExclamationCircleOutlined,
  ReloadOutlined,
  FileSyncOutlined,
} from '@ant-design/icons';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';

import {
  TABLE_CELL_TYPE, SYM_ARR, SYM_WORD_ARR, APPOINTMENT_TYPES,
  TOOLTIP_MESSAGES,
  HM_NOTIFICATION_REPORT_PRIORITY,
} from '../../Constants';

import {
  dateFormated, timeFormated, dateFormatedToUTC0, dateUTC0Before30Date,
} from '../../Utils';
import { useMergeState } from '../../Helpers/customHooks';
import { HOLTER_AND_FOLLOW, STUDY_TYPES_ENUMS } from '../../Constants/carePlan';
import moveToDetailIc from '../../Image/Pages/PatientDetails/move-to-detail-ic.svg';
import InputCT from '../Input/inputCT';
import CustomButton from '../Button/customButton';
import PatientTypeTag from '../PatientTypeTag';

const NormalCell = (props) => {
  const [state, setState] = useMergeState({
    overflowActive: false,
    value: props.cell,
  });

  const divRef = useRef(undefined);

  const isEllipsisActive = (e = {}) => e.offsetWidth < e.scrollWidth;

  const {
    className, cell, type, onChange,
  } = props;

  useEffect(() => {
    if (type === 'EMAIL') {
      setState({ overflowActive: isEllipsisActive(divRef.current) });
    }
  }, []);

  const { overflowActive } = state;

  let cellCT = cell || '';

  const classNameCT = classnames(
    'normal-cell-wrapper',
    className,
  );

  const onChangeNumberInput = (e) => {
    const { value } = e?.target;
    if (props.isInterger) {
      const reg = /^([0-9]+)$/;
      if ((reg.test(value)) || value === '') {
        if (parseFloat(value) > 99) {
          setState({ value: 99 });
          return;
        }
        setState({ value });
      }
      return;
    }

    const reg = /^\d*\.?\d*$/;
    if (reg.test(value)) {
      if (value?.includes('.')) {
        const arr = value.split('.');
        if (arr?.[1]?.length > 1) {
          const newValue = [arr[0], arr?.[1]?.slice(0, 2)].join('.');
          setState({ value: newValue });
          // setState({ [key]: newValue });
          return;
        }
      }
      if (parseFloat(value) < 1000000000 || value === '') {
        let customValue = value.toString();
        if (customValue) {
          if (customValue < 0) {
            customValue = 0;
          }
        }
        setState({ value: customValue });
        // setState({ [key]: customValue, ...resetErr });
      }
    }
  };
  const priorityClass = (priority) => {
    switch (priority) {
      case HM_NOTIFICATION_REPORT_PRIORITY.URGENT:
        return '--urgent';
      case HM_NOTIFICATION_REPORT_PRIORITY.EMERGENT:
        return '--emergent';
      default:
        return '';
    }
  };
  switch (type) {
    case TABLE_CELL_TYPE.DATE: {
      cellCT = dateFormated(cell);
      break;
    }
    case TABLE_CELL_TYPE.STUDY_TYPE: {
      if (cell === HOLTER_AND_FOLLOW) {
        cellCT = STUDY_TYPES_ENUMS.HOLTER;
      }
      break;
    }
    case TABLE_CELL_TYPE.REASON: {
      if (cell?.length === 0) {
        return '';
      }
      const tempArr = [];
      _.forEach(cell, (x) => {
        switch (x) {
          case SYM_ARR[0]: {
            tempArr.push(SYM_WORD_ARR[0]);
            break;
          }
          case SYM_ARR[1]: {
            tempArr.push(SYM_WORD_ARR[1]);
            break;
          }
          case SYM_ARR[2]: {
            tempArr.push(SYM_WORD_ARR[2]);
            break;
          }
          case SYM_ARR[3]: {
            tempArr.push(SYM_WORD_ARR[3]);
            break;
          }
          case SYM_ARR[4]: {
            tempArr.push(SYM_WORD_ARR[4]);
            break;
          }
          case SYM_ARR[5]: {
            tempArr.push(SYM_WORD_ARR[5]);
            break;
          }
          case SYM_ARR[6]: { // medi
            tempArr.push(SYM_WORD_ARR[6]);
            break;
          }
          case SYM_ARR[7]: {
            tempArr.push(SYM_WORD_ARR[7]);
            break;
          }
          case SYM_ARR[8]: {
            tempArr.push(SYM_WORD_ARR[8]);
            break;
          }
          case SYM_ARR[9]: {
            tempArr.push(SYM_WORD_ARR[9]);
            break;
          }
          case SYM_ARR[10]: {
            tempArr.push(SYM_WORD_ARR[10]);
            break;
          }
          case SYM_ARR[11]: {
            tempArr.push(SYM_WORD_ARR[11]);
            break;
          }
          case SYM_ARR[12]: {
            tempArr.push(SYM_WORD_ARR[12]);
            break;
          }
          default: {
            break;
          }
        }
      });
      cellCT = _.join(tempArr, ', ');
      return (
        <Tooltip placement="bottom" title={cellCT} overlayClassName="max-width-500">
          <div className={classnames(classNameCT, 'normal-cell-reason')} ref={divRef}>
            <span>{cellCT}</span>
          </div>
        </Tooltip>
      );
      // break;
    }
    case TABLE_CELL_TYPE.DATE_RANGE: {
      cellCT = `${dateUTC0Before30Date(cell)} - ${dateFormatedToUTC0(cell)}`;
      break;
    }
    case TABLE_CELL_TYPE.DATE_RANGE_TIME: {
      const rangeTime = cell.toString().split(',');
      const startTime = moment(rangeTime[0]).format('MM/DD/YYYY');
      const endTime = moment(rangeTime[1]).format('MM/DD/YYYY');
      cellCT = `${startTime} - ${endTime}`;
      break;
    }
    case TABLE_CELL_TYPE.DATE_TIME: {
      cellCT = timeFormated(cell);
      break;
    }
    case TABLE_CELL_TYPE.TIME: {
      cellCT = timeFormated(cell);
      break;
    }
    case TABLE_CELL_TYPE.CHECKBOX: {
      return (
        <Checkbox
          className={classnames(
            'normal-cell-wrapper', 'is-done-ct', className,
          )}
          onChange={(e) => {
            onChange(cell, props._id, e.checked);
          }}
          checked={cellCT}
        />
      );
    }
    case TABLE_CELL_TYPE.BUTTON: {
      return (
        <div className={classNameCT}>
          {cellCT?.trim() ? (
            <CustomButton
              className="bas-btn text-color-blue-7"
              onClick={(e) => {
                e.stopPropagation();
                props.onClick(props._id);
              }}
              label={cellCT}
            />
          ) : (
            <span className="black-color">--</span>
          )}
        </div>
      );
    }
    case TABLE_CELL_TYPE.TOOLTIP_OVERFLOW_BUTTON: {
      return (
        <div className={classNameCT}>
          {cellCT?.trim() ? (
            <Button
              className="bas-btn text-color-blue-7 overflow-text-btn fcen"
              onClick={(e) => {
                e.stopPropagation();
                props.onClick(props._id);
              }}
            >
              {props.isShowTooltip
                ? <Tooltip title={props.tooltipText}>{props.shortReason}</Tooltip>
                : <>{cellCT}</>}
            </Button>
          ) : (
            <span className="black-color">--</span>
          )}
          {props.isDeleted && (
            <Tooltip title={TOOLTIP_MESSAGES.DELETED_ACCOUNT} placement="bottom">
              <ExclamationCircleOutlined className="ml10 is-deleted-icon" />
            </Tooltip>
          )}
          {props.isImported
            && (
              <FileSyncOutlined className="ml10 is-imported-icon" />
            )}
        </div>
      );
    }
    case TABLE_CELL_TYPE.COPY: {
      return (
        <div className={classNameCT}>
          <CustomButton
            className="copy-btn bas-btn"
            onClick={(e) => {
              e.stopPropagation();
              props.onClick(props._id);
            }}
            icon={<CopyFilled />}
          />
        </div>
      );
    }
    case TABLE_CELL_TYPE.FILE: {
      return (
        <div className={classNameCT}>
          <CustomButton
            className="copy-btn bas-btn"
            onClick={(e) => {
              e.stopPropagation();
              props.onClick(props._id);
            }}
            icon={<FileTextFilled />}
            tooltipPlacement="bottom"
            tooltipTitle={TOOLTIP_MESSAGES.END_OF_USE}
          />
        </div>
      );
    }
    case TABLE_CELL_TYPE.APPOINTMENT_REASON: {
      return (
        <>
          {props.isShowTooltip
            ? (
              <div className={classNameCT}>
                <Tooltip
                  overlayStyle={props.isMaxLengthToolTip ? {}
                    : { maxWidth: '500px' }}
                  placement="bottomRight"
                  title={cellCT}
                >
                  <span>{props.shortReason}</span>
                </Tooltip>
              </div>
            )
            : (
              <div className={classNameCT}>
                <span>{cellCT}</span>
              </div>
            )}
        </>

      );
    }
    case TABLE_CELL_TYPE.INPUT: {
      return (
        <div className={classNameCT}>
          <Input
            prefix={props.isMoney ? <div>$</div> : null}
            className="normal-cell-input"
            onChange={onChangeNumberInput}
            defaultValue={cell}
            onBlur={props.onBlur}
            value={state.value}
            placeholder={props.isInterger ? '0' : '0.00'}
          />
        </div>
      );
    }
    case TABLE_CELL_TYPE.CREATE_APPOINTMENT: {
      return (
        <div className={classNameCT}>
          <CustomButton
            className="copy-btn bas-btn"
            onClick={(e) => {
              e.stopPropagation();
              props.onClick();
            }}
            icon={<CalendarFilled />}
          />
        </div>
      );
    }
    case TABLE_CELL_TYPE.RESTORE_CARE_PLAN: {
      return (
        <div className={classNameCT}>
          <CustomButton
            className="copy-btn bas-btn reverser-rotate"
            onClick={(e) => {
              e.stopPropagation();
              props.onClick();
            }}
            icon={<ReloadOutlined />}
          />
        </div>
      );
    }
    case TABLE_CELL_TYPE.ADD_NEW_PATIENTS: {
      return (
        <div className={classNameCT}>
          <CustomButton
            className="delete-btn bas-btn"
            onClick={(e) => {
              e.stopPropagation();
              props.onClick();
            }}
            icon={<DeleteOutlined color="#F5222D" />}
            tooltipPlacement="bottom"
            tooltipTitle="Delete"
          />

          <CustomButton
            className="copy-btn bas-btn"
            onClick={(e) => {
              e.stopPropagation();
              props.onExtraClick();
            }}
            icon={<EditOutlined />}
            tooltipPlacement="bottom"
            tooltipTitle="Edit"
          />
        </div>
      );
    }
    case TABLE_CELL_TYPE.MEDICATION_FREQUENCY: {
      return (
        <>
          {props.isShowToolTip ? (
            <Tooltip placement="bottom" title={props.tooltipText}>
              <div className={classNameCT}>
                <span>{cellCT}</span>
              </div>
            </Tooltip>
          )
            : (
              <div className={classNameCT}>
                <span>
                  {cellCT}
                </span>
              </div>
            )}
        </>

      );
    }
    case TABLE_CELL_TYPE.MEDICATION_NOTE: {
      return (
        <>
          {props.isShowToolTip ? (
            <Tooltip placement="bottom" title={cellCT}>
              <div className={classNameCT}>
                <span>{cellCT}</span>
              </div>
            </Tooltip>
          )
            : (
              <div className={classNameCT}>
                <span>
                  {cellCT}
                </span>
              </div>
            )}
        </>
      );
    }
    case TABLE_CELL_TYPE.JOIN_APPOINTMENT: {
      return (
        <div className={classNameCT}>
          <CustomButton
            className="copy-btn bas-btn"
            onClick={(e) => {
              e.stopPropagation();
              props.onClick(props._id);
            }}
            icon={<VideoCameraFilled />}
          />
        </div>
      );
    }

    case TABLE_CELL_TYPE.EMAIL:
      if (overflowActive) {
        return (
          <Tooltip placement="top" title={cellCT}>
            <div className={classNameCT} ref={divRef}>
              <span>{cellCT}</span>
            </div>
          </Tooltip>
        );
      }
      break;
    case TABLE_CELL_TYPE.BIOHEART_STATUS:
      if (cellCT === 'Failed') {
        return (
          <div className={classNameCT} ref={divRef}>
            <div className="mr8">{props.bioheartReason === 'Error' ? 'An error happened when generating report' : 'No heart data to generate report'}</div>
            {props.isShowRetryButton && (
              <CustomButton
                className="bas-btn text-color-blue-7"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onClick(props._id);
                }}
                label="Retry"
              />
            )}
          </div>
        );
      }
      return (
        <div className={classNameCT} ref={divRef}>
          <span>{cellCT?.trim() || '--'}</span>
        </div>
      );

    case TABLE_CELL_TYPE.APPOINTMENT_TYPE: {
      if (cellCT === APPOINTMENT_TYPES[0]) {
        return (
          <div
            className={classnames(
              'normal-cell-wrapper', 'virtual-color', className,
            )}
          >
            <span>{cellCT}</span>
          </div>
        );
      }
      return (
        <div
          className={classnames(
            'normal-cell-wrapper', 'in-person-color', className,
          )}
        >
          <span>{cellCT}</span>
        </div>
      );
    }
    case TABLE_CELL_TYPE.APPOINTMENT_STATUS: {
      return (
        <div className={classnames(
          'normal-cell-wrapper', className,
        )}
        >
          <span>{cellCT}</span>
          {props.status === 'Overdue' ? (
            <Tooltip placement="bottom" title="Overdue">
              <div className="appointment-status overdue"><ClockCircleFilled /></div>
            </Tooltip>
          )
            : props.status === 'Canceled' ? (
              <Tooltip placement="bottom" title="Canceled">
                <div className="appointment-status canceled"><CloseCircleFilled /></div>
              </Tooltip>
            )
              : props.status === 'Finished' ? (
                <Tooltip placement="bottom" title="Done ">
                  <div className="appointment-status finished"><CheckCircleFilled /></div>
                </Tooltip>
              ) : null}

        </div>
      );
    }
    case TABLE_CELL_TYPE.PRIORITY: {
      return (
        <div
          className={classnames(
            'priority-cell',
            priorityClass(cellCT),
            className,
          )}
        >
          {cellCT}
        </div>
      );
    }
    case TABLE_CELL_TYPE.DETAIL_TYPE: {
      return (
        <div className={classNameCT}>
          <CustomButton
            className="copy-btn bas-btn"
            onClick={(e) => {
              e.stopPropagation();
              props.onClick(props._id);
            }}
            icon={<img src={moveToDetailIc} alt="" />}
          />
        </div>
      );
    }
    case TABLE_CELL_TYPE.DELETE: {
      return (
        <div className={classNameCT}>
          <CustomButton
            className="copy-btn bas-btn"
            onClick={(e) => {
              e.stopPropagation();
              props.onClick(props._id);
            }}
            icon={<DeleteOutlined />}
          />
        </div>
      );
    }
    case TABLE_CELL_TYPE.WITH_ARTIFACT_REPORT: {
      return (
        <div className={classNameCT}>
          <CustomButton
            className="bas-btn text-color-blue-7"
            onClick={(e) => {
              e.stopPropagation();
              props.onClick(props._id);
            }}
            label={cellCT}
          />
          {props.isArtifactReport
            ? (
              <span>
                <div className={classnames('nornal-cell-wrapper', 'artifact-report-color', className)}>
                  <Tooltip placement="bottom" title={TOOLTIP_MESSAGES.WITH_ARTIFACT_REPORT} overlayStyle={{ maxWidth: '500px' }}>
                    <ExclamationCircleFilled />
                  </Tooltip>
                </div>

              </span>
            ) : null}

        </div>
      );
    }
    case TABLE_CELL_TYPE.ON_DEMAND_REPORT_ID: {
      return (
        <div className={classNameCT}>
          <span>{cellCT}</span>
          {props.onDemandStatus === 'None' && (
            <span>
              <div className={classnames('nornal-cell-wrapper', 'artifact-report-color', className)}>
                <ExclamationCircleFilled />
              </div>
            </span>
          )}
        </div>
      );
    }
    case TABLE_CELL_TYPE.TEMPLATE:
      return (
        <Tooltip placement="bottom" title={cellCT}>
          <div className={classNameCT} ref={divRef}>
            <span>{cellCT}</span>
          </div>
        </Tooltip>
      );
    case TABLE_CELL_TYPE.REMOVE_ROW:
      return (
        <div className={classNameCT}>
          <CustomButton
            className="remove-btn bas-btn"
            onClick={(e) => {
              e.stopPropagation();
              props.onClick();
            }}
            icon={<DeleteOutlined />}
          />
        </div>
      );
    default:
      break;
  }

  return (
    <div className={classNameCT} ref={divRef}>
      <span>{cellCT?.toString()?.trim() || '--'}</span>

      {
        props.isCancel
        && (
          <Tooltip placement="bottom" title={TOOLTIP_MESSAGES.CANCELED_APPOINTMENT}>
            <CloseCircleFilled className="cancel-appointment-icon" />
          </Tooltip>
        )
      }

      {
        !props.isManual && (
          <Tooltip placement="bottom" title={TOOLTIP_MESSAGES.AUTO_APPOINTMENT}>
            <ThunderboltFilled className="auto-appointment-icon" />
          </Tooltip>
        )
      }

    </div>
  );
};

NormalCell.defaultProps = {
  className: undefined,
  cell: '' || undefined,
  type: 'text',
  onChange: () => { },
  onClick: () => { },
  onExtraClick: () => { },
  _id: '',
  isCancel: false,
  isManual: true,
  isArtifactReport: false,
  isShowToolTip: false,
  onDemandStatus: '',
  isShowRetryButton: true,
  bioheartReason: '',
  status: '',
  tooltipText: '',
  isShowTooltip: false,
  shortReason: '',
  isMaxLengthToolTip: false,
  isMoney: false,
  onBlur: () => { },
  isInterger: false,
  isDeleted: false,
  isImported: false,
};

NormalCell.propTypes = {
  className: PropTypes.string,
  _id: PropTypes.string,
  cell: PropTypes.oneOfType([
    PropTypes.string, PropTypes.bool, PropTypes.number, PropTypes.arrayOf(PropTypes.string), PropTypes.shape(),
  ]),
  type: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onExtraClick: PropTypes.func,
  isCancel: PropTypes.bool,
  isManual: PropTypes.bool,
  isArtifactReport: PropTypes.bool,
  onDemandStatus: PropTypes.string,
  isShowRetryButton: PropTypes.bool,
  isShowToolTip: PropTypes.bool,
  bioheartReason: PropTypes.string,
  status: PropTypes.string,
  tooltipText: PropTypes.oneOfType([
    PropTypes.string, PropTypes.node,
  ]),
  isShowTooltip: PropTypes.bool,
  shortReason: PropTypes.string,
  isMaxLengthToolTip: PropTypes.bool,
  isMoney: PropTypes.bool,
  onBlur: PropTypes.func,
  isInterger: PropTypes.bool,
  isDeleted: PropTypes.bool,
  isImported: PropTypes.bool,
};

export default NormalCell;

import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef } from 'react';
import { useActions, useMergeState } from '../../Helpers/customHooks';
import { setLeavePopRequest } from '../../Redux/Actions/leavePopUp';
import { showFailedMsg, showSuccessMsg } from '../../Utils/showNotification';
import CustomButton from '../Button/customButton';
import WheelPickerRangeTimeInput from '../Input/WheelPickerRangeTimeButton';
import { generateTimeOptions, generateWorkingTime, isConflictTime } from './helper';
import './style.scss';

const EditWorkingTime = (props) => {
  const actions = useActions({ setLeavePopRequest }, []);
  const historyData = useRef(undefined);
  const fromTimeOptions = useRef(generateTimeOptions('12:00 AM', '11:45 PM'));
  const [state, setState] = useMergeState({
    newWorkingTimeInfo: {
      workingTime: {},
      ...props.defaultData,
    },
    generatedWorkingTime: generateWorkingTime(props.defaultData?.workingTime || []),
    isLoading: false,
  });

  const updateWorkingTimeInfo = () => {
    const workingTimeFilter = _.cloneDeep(state.generatedWorkingTime);
    _.forEach(_.cloneDeep(state.generatedWorkingTime), (value, index) => {
      const day = _.map(value, (x) => {
        const from = moment(`${x.from.hour}:${x.from.minute} ${x.from.meridiem}`, 'hh:mm A');
        const to = moment(`${x.to.hour}:${x.to.minute} ${x.to.meridiem}`, 'hh:mm A');
        return {
          from: {
            h: from.get('h'),
            m: from.get('m'),
          },
          to: {
            h: to.get('h'),
            m: to.get('m'),
          },
          excludeHoliday: x.excludeHoliday || null,
        };
      });

      _.remove(day, x => x?.from === '' && x?.to === '');
      const daySorted = _.orderBy(day, ['from.h', 'from.m'], ['asc', 'asc']);
      workingTimeFilter[index] = daySorted;
    });
    const updatedNewWorkingTimeInfo = { ...state.newWorkingTimeInfo };
    _.assign(updatedNewWorkingTimeInfo, {
      workingTime: {
        mon: workingTimeFilter.monday,
        tues: workingTimeFilter.tuesday,
        wed: workingTimeFilter.wednesday,
        thurs: workingTimeFilter.thursday,
        fri: workingTimeFilter.friday,
        sat: workingTimeFilter.saturday,
        sun: workingTimeFilter.sunday,
      },
    });
    setState({ newWorkingTimeInfo: updatedNewWorkingTimeInfo });
  };

  useEffect(() => {
    const updatedNewWorkingTimeInfo = { ...state.newWorkingTimeInfo };
    _.merge(updatedNewWorkingTimeInfo, props.defaultData);
    historyData.current = props.defaultData;
    setState({
      newWorkingTimeInfo: updatedNewWorkingTimeInfo,
      generatedWorkingTime: generateWorkingTime(props.defaultData?.workingTime || []),
    });
    setTimeout(() => {
      updateWorkingTimeInfo();
    }, 500);
  }, []);

  const isConflict = () => {
    let isConflict = false;
    _.forEach(state.generatedWorkingTime, (x) => {
      const conflict = _.find(x, d => d.isConflict);
      if (conflict) {
        isConflict = !!conflict;
        return false;
      }
    });
    return isConflict;
  };

  useEffect(() => {
    props.onChangeData({ workingTimeInfo: state.newWorkingTimeInfo, isConflict: isConflict() });
  }, [state.newWorkingTimeInfo, state.generatedWorkingTime]);

  const onChange = (name, value, allItems, item) => {
    _.assign(item, {
      ...item,
      ...value,
    });
    if (item?.from && item?.to) {
      const dayInWeek = _.cloneDeep(allItems);
      _.remove(dayInWeek, d => d.index === item.index);
      const isConflict = isConflictTime(dayInWeek, item);
      const conflictItem = _.find(allItems, d => d?.isConflict);
      if (conflictItem && !isConflict) {
        _.assign(conflictItem, { isConflict: false });
      }
      _.assign(item, { isConflict });
    }
    updateWorkingTimeInfo();
  };

  const onClickAddSchedule = (items) => {
    const len = items.length;
    const findConflictItem = _.find(items, d => d?.isConflict);
    if (!findConflictItem || len === 0) {
      const obj = {
        from: {
          hour: '09',
          minute: '00',
          meridiem: 'AM',
        },
        to: {
          hour: '05',
          minute: '00',
          meridiem: 'PM',
        },
        index: items[len - 1]?.index + 1 || 0,
        isConflict: false,
      };
      const isConflict = isConflictTime(items, obj);
      const conflictItem = _.find(items, d => d?.isConflict);
      if (conflictItem && !isConflict) {
        _.assign(conflictItem, { isConflict: false });
      }
      _.assign(obj, { isConflict });
      items.push(obj);
      updateWorkingTimeInfo();
    }
  };

  const onRemoveClick = (allItems, item) => {
    _.remove(allItems, d => d.index === item.index);
    const conflictItem = _.find(allItems, d => d?.isConflict);
    if (conflictItem) {
      const dayInWeek = _.cloneDeep(allItems);
      _.remove(dayInWeek, d => d.index === conflictItem.index);
      const isConflict = isConflictTime(dayInWeek, conflictItem);
      _.assign(conflictItem, { isConflict });
    }
    _.forEach(allItems, (x, index) => {
      x.index = index;
    });
    updateWorkingTimeInfo();
  };

  const onSaveClick = useCallback(async () => {
    setState({ isLoading: true });
    const input = {
      workingTime: state.newWorkingTimeInfo.workingTime,
    };
    const result = await props.updateProfileFunc(input);
    if (result) {
      showSuccessMsg('Your profile information was updated');
      props.onUpdateSuccess({ workingTime: state.newWorkingTimeInfo });
    } else {
      showFailedMsg('Could not update your profile', 'Error');
    }
    actions.setLeavePopRequest({ isUnsaved: false });
    setState({ isLoading: false });
  }, [state.newWorkingTimeInfo]);

  const onCloseClick = () => {
    props.onCloseClick();
  };
  const isDisabledSaveButton = () => {
    if (!_.isEqualWith(historyData.current, state.newWorkingTimeInfo,
      (value1, value2, key) => (key === 'excludeHoliday' ? true : undefined))) {
      return isConflict();
    }
    return true;
  };

  useEffect(() => {
    if (!_.isEqualWith(historyData.current, state.newWorkingTimeInfo,
      (value1, value2, key) => (key === 'excludeHoliday' ? true : undefined))) {
      actions.setLeavePopRequest({ isUnsaved: true });
    } else {
      actions.setLeavePopRequest({ isUnsaved: false });
    }
  }, [state.newWorkingTimeInfo]);

  return (
    <div className={classnames('edit-working-time', props.className)}>
      <div className="edit-working-time__header">
        <CustomButton
          onClick={onCloseClick}
          icon={<CloseOutlined />}
        />
      </div>
      <div className="flex-1">
        {_.map(state.generatedWorkingTime || [], (x, i) => {
          const dayInWeekTitle = i.charAt(0).toUpperCase() + i.slice(1);
          return (
            <div
              key={`edit-working-time-item-${i}`}
              className={classnames(
                'edit-working-time-item',
              )}
            >
              <div className={classnames('edit-working-time-item__title', i !== 'monday' && 'mt24')}>
                {dayInWeekTitle}
              </div>
              <div className="edit-working-time-item__range-time mt8">
                {_.map(x, (x2, i2) => (
                  <WheelPickerRangeTimeInput
                    key={i2}
                    className={classnames(
                      'edit-working-time-item__range-time__item',
                      i2 > 1 && 'mt-16',
                      i2 % 2 === 0 && 'mr-16',
                      x2.isConflict && 'mb24',
                    )}
                    id={`edit-working-time-item-${i}-${i2}`}
                    name={`edit-working-time-item-${i}-${i2}`}
                    from={x2.from}
                    to={x2.to}
                    onChange={(name, value) => onChange(name, value, x, x2)}
                    onRemoveClick={() => onRemoveClick(x, x2)}
                    isError={x2?.isConflict}
                    errorMessage="Conflict"
                  />
                ))}
                <CustomButton
                  className="add-btn"
                  type="primary"
                  ghost
                  onClick={() => onClickAddSchedule(x)}
                  icon={<PlusOutlined />}
                  label="Add"
                />
              </div>
              <Divider />
            </div>
          );
        })}
      </div>
      {props.showSaveButton && (
        <div className="footer-button mt48 pb24">
          <CustomButton
            type="primary"
            onClick={onSaveClick}
            disabled={isDisabledSaveButton()}
            loading={state.isLoading}
            label="Save"
          />
        </div>
      )}
    </div>
  );
};

EditWorkingTime.defaultProps = {
  className: '',
  showSaveButton: true,
  onUpdateSuccess: () => { },
  updateProfileFunc: () => { },
  onChangeData: () => { },
  onCloseClick: () => { },
};

EditWorkingTime.propTypes = {
  className: PropTypes.string,
  showSaveButton: PropTypes.string,
  defaultData: PropTypes.shape({
    workingTime: PropTypes.shape(),
  }).isRequired,
  onUpdateSuccess: PropTypes.func,
  onChangeData: PropTypes.func,
  updateProfileFunc: PropTypes.func,
  onCloseClick: PropTypes.func,
};

export default EditWorkingTime;

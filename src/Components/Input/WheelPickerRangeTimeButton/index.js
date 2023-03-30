/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import clearIcon from '../../../Assets/Images/Icons/close.svg';
import { useMergeState } from '../../../Helpers/customHooks';
import WheelPickerItem from '../wheelPickerTimeInput/wheelPickerItem';
import './style.scss';

const WheelPickerRangeTimeInput = (props) => {
  const timeOptions = useRef({
    hours: ['12', ..._.map(_.range(1, 12), x => `${x < 10 ? `0${x}` : x}`)],
    minutes: ['00', '15', '30', '45'],
    meridiems: ['AM', 'PM'],
  });
  const [state, setState] = useMergeState({
    hour: undefined,
    minute: undefined,
    meridiem: undefined,
    hourEnd: undefined,
    minuteEnd: undefined,
    meridiemEnd: undefined,
  });

  const {
    hour, minute, meridiem, hourEnd, minuteEnd, meridiemEnd,
  } = state;

  useEffect(() => {
    const { hour, minute, meridiem } = props.from;
    const { hour: hourTo, minute: minuteTo, meridiem: meridiemTo } = props.to;
    setState({
      hour: hour ? _.findIndex(timeOptions.current?.hours, x => x === hour) : undefined,
      minute: minute ? _.findIndex(timeOptions.current?.minutes, x => x === minute) : minute,
      meridiem: meridiem ? _.findIndex(timeOptions.current?.meridiems, x => x === meridiem) : meridiem,
      hourEnd: hourTo ? _.findIndex(timeOptions.current?.hours, x => x === hourTo) : hourTo,
      minuteEnd: minuteTo ? _.findIndex(timeOptions.current?.minutes, x => x === minuteTo) : minuteTo,
      meridiemEnd: meridiemTo ? _.findIndex(timeOptions.current?.meridiems, x => x === meridiemTo) : meridiemTo,
    });
  }, [props.from, props.to]);

  const updateSelection = (name, index) => {
    if (state[name] === index) {
      return;
    }
    const stateObject = _.cloneDeep(state);
    _.assign(stateObject, { [name]: index });
    const hour = timeOptions.current?.hours[stateObject.hour];
    const minute = timeOptions.current?.minutes[stateObject.minute];
    const meridiem = timeOptions.current?.meridiems[stateObject.meridiem];
    const hourEnd = timeOptions.current?.hours[stateObject.hourEnd];
    const minuteEnd = timeOptions.current?.minutes[stateObject.minuteEnd];
    const meridiemEnd = timeOptions.current?.meridiems[stateObject.meridiemEnd];
    const to = moment(`${hourEnd}:${minuteEnd} ${meridiemEnd}`, 'hh:mm A');
    const from = moment(`${hour}:${minute} ${meridiem}`, 'hh:mm A');
    if (['hour', 'minute', 'meridiem'].includes(name)) {
      if ((to.format('hh:mm A') !== '12:00 AM' && from.isSameOrAfter(to))
      || (to.format('hh:mm A') === '12:00 AM' && from.format('hh:mm A') === '12:00 AM')) {
        // from >= to
        const fromSub = from.add(15, 'm');
        _.assign(stateObject, {
          hourEnd: _.findIndex(timeOptions.current?.hours, x => x === fromSub.format('hh')),
          minuteEnd: _.findIndex(timeOptions.current?.minutes, x => x === fromSub.format('mm')),
          meridiemEnd: _.findIndex(timeOptions.current?.meridiems, x => x === fromSub.format('A')),
        });
      }
    }
    if (['hourEnd', 'minuteEnd', 'meridiemEnd'].includes(name)) {
      if (to.isSameOrBefore(from)) {
        // to <= from
        const toSub = to.subtract(15, 'm');
        _.assign(stateObject, {
          hour: _.findIndex(timeOptions.current?.hours, x => x === toSub.format('hh')),
          minute: _.findIndex(timeOptions.current?.minutes, x => x === toSub.format('mm')),
          meridiem: _.findIndex(timeOptions.current?.meridiems, x => x === toSub.format('A')),
        });
      }
    }
    const hourFrom = timeOptions.current?.hours[stateObject.hour];
    const minuteFrom = timeOptions.current?.minutes[stateObject.minute];
    const meridiemFrom = timeOptions.current?.meridiems[stateObject.meridiem];
    const hourTo = timeOptions.current?.hours[stateObject.hourEnd];
    const minuteTo = timeOptions.current?.minutes[stateObject.minuteEnd];
    const meridiemTo = timeOptions.current?.meridiems[stateObject.meridiemEnd];
    props.onChange(props.name, {
      from: {
        hour: hourFrom,
        minute: minuteFrom,
        meridiem: meridiemFrom,
      },
      to: {
        hour: hourTo,
        minute: minuteTo,
        meridiem: meridiemTo,
      },
    });
    setState(stateObject);
  };

  const renderDropdownRange = (array = []) => (
    <div className="wheel-picker-time-input-range-wrapper">
      <div className="mr24">
        <div className="wheel-picker-time-input-range-title">
          Start time
        </div>

        <div className="wheel-picker-time-input-range-item">
          <WheelPickerItem
            parentName={`${props.name}-left-hour`}
            name={array[0].key}
            data={timeOptions.current?.hours || []}
            updateSelection={updateSelection}
            defaultSelection={array[0].value}
          />
          <div className="b padl8 padr8">:</div>
          <WheelPickerItem
            parentName={`${props.name}-left-minute`}
            name={array[1].key}
            data={timeOptions.current?.minutes || []}
            updateSelection={updateSelection}
            defaultSelection={array[1].value}
          />
          <WheelPickerItem
            className="padl8"
            parentName={`${props.name}-left-meridiem`}
            name={array[2].key}
            data={timeOptions.current?.meridiems || []}
            updateSelection={updateSelection}
            defaultSelection={array[2].value}
          />
        </div>
      </div>
      <div>
        <div className="wheel-picker-time-input-range-title">
          End time
        </div>
        <div className="wheel-picker-time-input-range-item">
          <WheelPickerItem
            parentName={`${props.name}-right-hour`}
            name={array[3].key}
            data={timeOptions.current?.hours || []}
            updateSelection={updateSelection}
            defaultSelection={array[3].value}
          />
          <div className="b padl8 padr8">:</div>
          <WheelPickerItem
            parentName={`${props.name}-right-minute`}
            name={array[4].key}
            data={timeOptions.current?.minutes || []}
            updateSelection={updateSelection}
            defaultSelection={array[4].value}
          />
          <WheelPickerItem
            className="padl8"
            parentName={`${props.name}-right-meridiem`}
            name={array[5].key}
            data={timeOptions.current?.meridiems || []}
            updateSelection={updateSelection}
            defaultSelection={array[5].value}
          />
        </div>
      </div>

    </div>
  );
  const renderRange = () => {
    const startTime = hour === undefined && minute === undefined && meridiem === undefined
      ? '' : `${timeOptions.current?.hours[hour] || ''}:${timeOptions.current?.minutes[minute] || ''} ${timeOptions.current?.meridiems[meridiem] || ''}`;
    const endTime = hourEnd === undefined && minuteEnd === undefined && meridiemEnd === undefined
      ? '' : `${timeOptions.current?.hours[hourEnd] || ''}:${timeOptions.current?.minutes[minuteEnd] || ''} ${timeOptions.current?.meridiems[meridiemEnd] || ''}`;
    return (
      <UncontrolledDropdown>
        <DropdownToggle className={classnames('wheel-picker-time-input-toggle',
          props.isError ? '--error' : '')}
        >
          <div className={classnames('wheel-picker-time-input-main', props.isError && '--error')}>
            <div className="flex-row">
              {startTime ? (
                <div className="wheel-picker-time-input-title flex-1">
                  {startTime}
                </div>
              ) : (
                <div className="wheel-picker-time-input-placeholder flex-1">
                  From
                </div>
              )}
              <div className="wheel-picker-time-input-seperator">-</div>
              {endTime ? (
                <div className="wheel-picker-time-input-title flex-1">
                  {endTime}
                </div>
              ) : (
                <div className="wheel-picker-time-input-placeholder flex-1">
                  To
                </div>
              )}
            </div>

            {(startTime || endTime) && (
            <button className="wheel-picker-time-input-clear-btn" onClick={props.onRemoveClick}>
              <img src={clearIcon} alt="Clear icon" />
            </button>
            )}
          </div>
        </DropdownToggle>

        <DropdownMenu>
          {renderDropdownRange([
            {
              key: 'hour',
              value: hour,
            },
            {
              key: 'minute',
              value: minute,
            },
            {
              key: 'meridiem',
              value: meridiem,
            },
            {
              key: 'hourEnd',
              value: hourEnd,
            },
            {
              key: 'minuteEnd',
              value: minuteEnd,
            },
            {
              key: 'meridiemEnd',
              value: meridiemEnd,
            },
          ])}
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  };
  return (
    <div
      className={classnames('wheel-picker-time-input custom-text-input',
        props.disabled && '--disabled',
        props.className)}
      id={props.id}
    >
      {
        !!props.label && (
          <div className="custom-text-input__label">{props.label}</div>
        )
      }
      {renderRange()}
      {
        props.isError && !!props.errorMessage && (
          <div className="custom-text-input__error-message">{props.errorMessage}</div>
        )
      }
    </div>
  );
};

WheelPickerRangeTimeInput.defaultProps = {
  label: '',
  className: '',
  disabled: false,
  isError: false,
  errorMessage: '',
  id: '',
  from: {
    hour: undefined,
    minute: undefined,
    meridiem: undefined,
  },
  to: {
    hour: undefined,
    minute: undefined,
    meridiem: undefined,
  },
  onChange: (name, value) => {},
  onRemoveClick: (event) => {},
};

WheelPickerRangeTimeInput.propTypes = {
  /** Name of input */
  name: PropTypes.string.isRequired,
  /** Label of input */
  label: PropTypes.string,
  /** Classname of input */
  className: PropTypes.string,
  /** Whether disabled input */
  disabled: PropTypes.bool,
  /** Whether show error */
  isError: PropTypes.bool,
  /** Error message */
  errorMessage: PropTypes.string,
  /** Id of input */
  id: PropTypes.string,
  /** From data */
  from: PropTypes.shape({
    hour: PropTypes.string,
    minute: PropTypes.string,
    meridiem: PropTypes.string,
  }),
  /** To data */
  to: PropTypes.shape({
    hour: PropTypes.string,
    minute: PropTypes.string,
    meridiem: PropTypes.string,
  }),
  /** Change data event */
  onChange: PropTypes.func,
  /** Remove inputted data event */
  onRemoveClick: PropTypes.func,
};

export default WheelPickerRangeTimeInput;

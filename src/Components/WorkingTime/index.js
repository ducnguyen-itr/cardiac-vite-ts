import { EditOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { FullMessageData } from '../../Constants';
import noSettingIc from '../../Image/Pages/PatientDetails/no-setting-ic.svg';
import CustomButton from '../Button/customButton';
import EmptyCT from '../UI/emptyCT';
import { generateWorkingTime, isEmptyWorkingTime } from './helper';
import './style.scss';

// import editIcon from '../../../../assets/images/icon/edit.svg';
// import { generateWorkingTime } from '../../../../helpers/time';
// import NormalButton from '../../../buttons/normalButton';

const WorkingTime = (props) => {
  const workDuration = (from, to) => {
    const start = `${from.hour}:${from.minute} ${from.meridiem}`;
    const end = `${to.hour}:${to.minute} ${to.meridiem}`;
    return `${start} - ${end}`;
  };

  const onEditClick = () => {
    props.onEditClick();
  };

  return (
    <div className={classnames('working-time', props.className)}>
      <div className={classnames('working-time__info', !props.showHeader)}>
        {isEmptyWorkingTime(props.defaultData.workingTime)
          ? (
            <div className="working-time__info-empty">
              {/* <img src={noSettingIc} alt="noSettingIc" />
              <p>Your working hours are not available!</p> */}
              <EmptyCT
                btnTitle="Add working hour"
                onClick={onEditClick}
                description={FullMessageData.PatientDetails.NoWorkingHour}
                emptyIcon={noSettingIc}
              />
            </div>
          )
          : (
            <>
              <div className="working-time__info__header">
                <CustomButton
                  type="primary"
                  ghost
                  icon={<EditOutlined />}
                  onClick={onEditClick}
                  label=" Edit schedule"
                />
              </div>
              {_.map(generateWorkingTime(props.defaultData?.workingTime || []), (x, i) => {
                const dayInWeekTitle = i.charAt(0).toUpperCase() + i.slice(1);
                if (_.isEmpty(x)) {
                  return (
                    null
                  );
                }
                return (
                  <div
                    key={`working-time-item-${i}`}
                    className={classnames(
                      'working-time-item', 'mt24',
                      i === 'sunday' && 'pb24',
                    )}
                  >
                    <div className={classnames('working-time-item__title')}>
                      {dayInWeekTitle}
                    </div>
                    <div className="working-time-item__range-time mt8">
                      {props.isLoading ? (
                        <div className="w100">
                          <Skeleton height={50} width="100%" />
                        </div>
                      ) : (
                        <>
                          {_.map(x, (x2, i2) => (
                            <>
                              <div className={classnames(
                                'working-time-item__range-time__item',
                                i2 > 1 && 'mt16',
                                i2 % 2 === 0 && 'mr16',
                              )}
                              >
                                {workDuration(x2.from, x2.to)}
                              </div>
                            </>
                          ))}
                        </>
                      )}
                    </div>
                    <Divider />
                  </div>
                );
              })}
            </>
          )
        }
      </div>
    </div>
  );
};

WorkingTime.defaultProps = {
  className: '',
  showHeader: false,
  isLoading: false,
  onEditClick: () => {},
};

WorkingTime.propTypes = {
  /* Classname of component */
  className: PropTypes.string,
  /* Whether show header */
  showHeader: PropTypes.bool,
  /* Whether show loading */
  isLoading: PropTypes.bool,
  /* Default data */
  defaultData: PropTypes.shape().isRequired,
  /* Edit click event */
  onEditClick: PropTypes.func,
};

export default WorkingTime;

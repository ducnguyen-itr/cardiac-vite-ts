import { Divider, Typography } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import DisplayAptData from '../../../../../Pages/Appointments/ApointmentDetails/Layout/DisplayAptData';
import CustomAvatar from '../../../../Avatar';
import './style.scss';

function AppointmentInfo(props) {
  const basicInfo = () => {
    const {
      reasons, note, condition, allergies, medicalHistory,
    } = props.data;
    return [
      {
        title: 'Reason for visit',
        data: reasons?.length > 0 ? _.map(reasons, (x, i) => (
          <>
            <span key={i}>{`${reasons?.length > 1 ? '• ' : ''}${x}`}</span>
          </>
        )) : '--',
      },
      {
        title: 'Note',
        data: note || '--',
      },
      {
        title: 'Condition',
        data: medicalHistory?.length > 0 ? _.map(medicalHistory, (x, i) => (
          <>
            <span key={i}>{`${medicalHistory?.length > 1 ? '• ' : ''}${x}`}</span>
          </>
        )) : '--',
      },
      {
        title: 'Allergies',
        data: allergies || '--',
        isWrapLine: true,
      },
    ];
  };

  const medicationInfo = () => {
    const { medication } = props.data;
    return _.map(medication, (x) => {
      const isShowNoteTooltip = x?.note?.length > 23;
      const shortText = `${x?.note?.slice(0, 20)}...`;
      return {
        medicationName: x.name,
        quantity: x.dosages,
        frequency: x.frequency,
        note: x.note || '--',
        isShowNoteTooltip,
        isShowToolTipFrequency: !_.isEmpty(x.timeToTake),
        shortText,
        timeToTake: (
          <>
            {_.map(x.timeToTake, (x, i) => (
              <div key={i}>{moment(x, 'HH:mm').format('hh:mm A')}</div>
            ))}
          </>
        ),
      };
    });
  };

  const renderCondition = () => (
    <>
      {(!_.isEmpty(props.data?.condition))
     && _.map(props.data?.condition, (x, i) => (
       <div key={i} className="mb16">
         <div className="condition-infor-title">{x?.reason || ''}</div>
         <DisplayAptData data={x.meta} isFormat />
       </div>
     ))}
    </>
  );

  // const conditionInfo = () => {
  //   const { condition } = props.data;
  //   return _.map(condition, (x, i) => {
  //     const data = _.map(x.meta, y => ({
  //       question: y.question,
  //       answer: y.answer,
  //     }));
  //     return (
  //       <>
  //         <div className="condition-infor-title mb16" key={`title-${i}`}>{x.reason}</div>
  //         <DisplayAptData isFormat data={data} key={`data-${i}`} />
  //       </>
  //     );
  //   });
  // };

  const showAppointmentInfo = () => (
    <div className="render-infor">
      <div className="render-infor-avatar">
        <CustomAvatar
          avatarLink={props.data?.patient?.photo?.includes('https') ? props.data.patient.photo : undefined}
          size={52}
          firstName={props.data?.patient?.firstName}
          lastName={props.data?.patient?.lastName}
        />
        <div>
          <Typography.Title level={4}>
            {`${props.data?.patient?.firstName || ''} ${props.data?.patient?.lastName || ''}`}
          </Typography.Title>
          <div className="">
            <span>
              {props.data?.patient?.gender && props.data?.patient?.dateOfBirth ? `${props.data?.patient?.gender} - ${moment().diff(moment(_.isNaN(+props.data?.patient?.dateOfBirth) ? props.data?.patient?.dateOfBirth : +props.data?.patient?.dateOfBirth).format('YYYY-MM-DD'), 'years')}` : ''}
            </span>
          </div>
        </div>
      </div>
      <DisplayAptData isCalling isReverse data={basicInfo()} />
      <div className="normal-title mb4 ml8">Medication</div>
      {medicationInfo()?.length > 0 ? (
        <DisplayAptData isCalling isTable data={medicationInfo()} />
      ) : (
        <div className="padl16">--</div>
      )}
      {props.data?.condition?.length > 0 && (
        <Divider className="mt16 mb16" />
      )}
      {renderCondition()}
    </div>
  );
  return (
    <div className="appointment-info">
      {showAppointmentInfo()}
    </div>
  );
}
AppointmentInfo.defaultProps = {
  data: {},
};

AppointmentInfo.propTypes = {
  data: PropTypes.shape(),
};


export default AppointmentInfo;

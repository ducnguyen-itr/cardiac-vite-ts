import { Divider, Typography } from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useLocation } from 'react-router';
import { TableNames } from '../../Constants';
import { zeroPad } from '../../Helpers';
import auth from '../../Helpers/auth';
import { getTabName } from '../../Utils';
import CustomAvatar from '../Avatar';
import { generateCaregiverInfo, getBasicAndContact } from '../PatientInfoDrawer/helper';
import DisplayCaregiver from '../UI/displayCaregiver';
import DisplayData2 from '../UI/displayData2';

const { NewRegistered } = TableNames;
function PatientBasicInfo(props) {
  const location = useLocation();
  const hyperName = getTabName(location?.pathname);
  const { isDetails } = props;
  const {
    lastName, firstName,
    gender, age,
    carePlanId, photo,
    facilityName,
    invitationFullName,
  } = props.patientData || {};

  const {
    contactInfo, insuranceInfo, info,
  } = getBasicAndContact(props.patientData, false);
  const showInfoTitle = () => (
    <div className="patient-info-title">
      <Typography.Title level={4}>
        {firstName || lastName ? `${firstName} ${lastName}` : invitationFullName || ''}
      </Typography.Title>

      <div className={classnames('patient-info-subtitle', isDetails ? '' : 'f-row')}>
        <div className={isDetails ? undefined : 'patient-id'}>
          <span>
            {carePlanId ? `Care plan ID: ${zeroPad(carePlanId)}` : ''}
          </span>
        </div>
        <div className={isDetails ? 'mt4' : 'padl16'}>
          <span>
            {props.patientData.dateOfBirth ? `${gender ? `${gender} -` : ''} ${age} year${age > 1 ? 's' : ''} old` : gender || ''}
          </span>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <div className={classnames('patient-info-drawer', props.className)}>

        <div className="patient-info-body">
          <div>
            <CustomAvatar
              avatarLink={photo}
              size={80}
              firstName={firstName}
              lastName={lastName}
            />
            {showInfoTitle()}
            {
              isDetails && (
                <div className="details-devider" />
              )
            }

            <DisplayData2
              title="Information"
              className="mt16"
              data={info}
              isStrip={!isDetails}
              leftWidth={12}
              titleClassName={isDetails ? 'mb4' : ''}
              rowClassName={isDetails ? 'detail-left-ct' : ''}
            />
            {
              isDetails && (
                <div className="details-devider" />
              )
            }
            <DisplayData2
              title="Contact information"
              className="mt16"
              data={contactInfo}
              isStrip={!isDetails}
              leftWidth={12}
              titleClassName={isDetails ? 'mb4' : ''}
              rowClassName={isDetails ? 'detail-left-ct' : ''}
            />
            {
              isDetails && (
                <div className="details-devider" />
              )
            }
            <DisplayData2
              title="Insurance information"
              data={insuranceInfo}
              isStrip={!isDetails}
              leftWidth={12}
              titleClassName={isDetails ? 'mb4' : ''}
              rowClassName={isDetails ? 'detail-left-ct' : ''}
            />

            {isDetails && <Divider className="div24" />}
            <div className="registered-clinic">
              <span>Registered clinic</span>
            </div>

            <div className="mt8">
              <span>{facilityName}</span>
            </div>

            {isDetails && <Divider className="div24" />}
            {!(auth.isMD() && hyperName === NewRegistered) && (
              <>
                <DisplayCaregiver
                  caregiverInfo={generateCaregiverInfo(props.patientData)}
                  name={hyperName}
                />
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
PatientBasicInfo.defaultProps = {
  patientData: {},
  className: '',
  isDetails: '',
};

PatientBasicInfo.propTypes = {
  /** patientData */
  patientData: PropTypes.shape(),
  /** className */
  className: PropTypes.string,
  /** isDetails */
  isDetails: PropTypes.bool,
};

export default PatientBasicInfo;

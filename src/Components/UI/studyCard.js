import {
  ExclamationCircleOutlined, LeftOutlined, RightOutlined, SyncOutlined,
} from '@ant-design/icons';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import ImageGallery from 'react-image-gallery';
import Skeleton from 'react-loading-skeleton';
import { Progress } from 'reactstrap';
import { Tooltip } from 'antd';
import {
  BIODIRECT_STATUS, CAN_STOP_STATUSES, STUDY_STATUS, SUPPORT_STOP_PAUSE, TOOLTIP_MESSAGES,
} from '../../Constants';
import {
  dateToDuration, dateToString, dateToTimeSince, generateIssueFound, zeroPad,
} from '../../Helpers';
import auth from '../../Helpers/auth';
import { useMergeState } from '../../Helpers/customHooks';

// import arrowNext from '../../../StaticV2/Images/Components/white-arrow-next-icon.svg';
// import arrowBack from '../../../StaticV2/Images/Components/white-arrow-back-icon.svg';

import StudyCardSkeleton from './studyCardSkeleton';
// import CheckboxInput from '../../../ComponentsV2/Inputs/checkboxInput';
import { SERVICE_TYPES } from '../../Constants/carePlan';
import hospitalIc from '../../Image/Pages/PatientDetails/hospital-ic.svg';
import { formatUpdateTime } from '../../Pages/HeartMonitor/helper';
import { getDeviceStatus } from '../../Pages/PatientDetails/CarePlan/helper';
import CustomButton from '../Button/customButton';

const {
  STANDARD, BIODIRECT, STANDARD_VALUE, BIODIRECT_VALUE,
} = SERVICE_TYPES;

const StudyCard = (props) => {
  // const isClinicTechnician = useRef(auth.isNurse());
  const isClinicTechnician = false;
  const isMD = auth.isMD();

  useEffect(() => { }, [props.study]);
  const [state, setState] = useMergeState({
    isLoading: true,
    isLoadedImageError: false,
    isOpenSolutionsModal: false,
    displayedPatientData: undefined,
  });

  const onImageLoad = () => {
    if (state.isLoading) {
      setState({ isLoading: false });
    }
  };

  const onImageError = () => {
    if (state.isLoading) {
      setState({ isLoading: false, isLoadedImageError: true });
    }
  };

  const generateProgressComponent = (study, isBiodirect) => {
    const diff = moment().diff(study.start, 'minutes', true);
    const minutesDiff = study.stop && diff > 0 ? diff : 0;
    const remainingMinutes = study.duration - minutesDiff;
    const startedTime = isBiodirect || study.status === 'Starting' || study.status === 'Draft' ? '0d'
      : `${moment().diff(moment(study.start), 'days')}d ${moment().diff(moment(study.start), 'hours') % 24}h ${moment().diff(moment(study.start), 'minutes') % 60}m`;
    const isUploadProgress = study.lastStudyHistory
      ? _.includes([STUDY_STATUS.UPLOADING, STUDY_STATUS.UPLOADED], study.lastStudyHistory.status)
      : false;
    const progressValue = isUploadProgress ? study.ecgUploadProgress || 0 : study.status === 'Completed' ? 100 : study.progress;
    return (
      <>
        <div className="remaining-time">
          {
            isUploadProgress
              ? (
                <div className="progress-day d-flex">
                  <span>Uploading</span>
                  {' '}
                  <span>{`${progressValue}%`}</span>
                </div>
              )
              : !_.isNaN(remainingMinutes) && (
                remainingMinutes > 0
                  ? (
                    <div className="progress-day d-flex">
                      <div>{`${startedTime} / ${study.studyDurationNum}d`}</div>
                      {
                        !_.isNil(progressValue) && (
                          <span>
                            {`${progressValue}%`}
                          </span>
                        )
                      }
                    </div>
                  )
                  : (
                    <span>Study duration ended</span>
                  )
              )
          }
        </div>

        <Progress
          className={classnames('duration-progress-bar', isUploadProgress ? 'progress-blue' : '')}
          value={progressValue}
        />
      </>
    );
  };

  const isDisabledGetECGButton = (study) => {
    const stateGetECG = ['Started', 'Resumed'];
    const isEnableGetEcg = stateGetECG.includes(study.lastStudyHistory?.status) && study.deviceStatus !== 'Offline';
    return !isEnableGetEcg;
  };

  const checkStopStudy = (arraySupportStopPause, fwVersion) => {
    const element = _.find(arraySupportStopPause, x => fwVersion?.indexOf(x) >= 0);
    return !!element;
  };

  const isCheckCanStopStudy = (study) => {
    const { device, lastStudyHistory, status } = study || {};
    if (status !== STUDY_STATUS.ONGOING) {
      return true;
    }
    // if (isMD) {
    //   return true;
    // }
    const canStop = device.status !== 'Offline'
      && (CAN_STOP_STATUSES.includes(lastStudyHistory?.status)
        || (lastStudyHistory?.status === STUDY_STATUS.PAUSED
          && checkStopStudy(SUPPORT_STOP_PAUSE, device?.lastSync?.fwVersion?.trim()))
      );
    return !canStop;
  };

  const createItems = (stripImgs) => {
    const notIncludedAllStripImgs = _.filter(stripImgs, x => !_.includes(x, 'all.svg'));
    return _.map(notIncludedAllStripImgs, (stripImg, index) => (
      {
        original: stripImg,
        thumbnail: stripImg,
        description: `${index + 1}/${notIncludedAllStripImgs.length}`,
      }
    ));
  };

  const renderLeftNav = (onClick, disabled) => (
    <button
      className="image-gallery-custom-nav left"
      disabled={disabled}
      onClick={onClick}
    >
      <LeftOutlined color="white" />
    </button>
  );

  const renderRightNav = (onClick, disabled) => (
    <button
      className="image-gallery-custom-nav right"
      disabled={disabled}
      onClick={onClick}
    >
      <RightOutlined color="white" />
    </button>
  );

  const getBiofluxDirectProgress = (status) => {
    switch (status) {
      case BIODIRECT_STATUS.DRAFT: {
        return 'Biodirect request is processing';
      }
      case BIODIRECT_STATUS.DELIVERING: {
        return 'Device is shipping';
      }
      case BIODIRECT_STATUS.DELIVERED: {
        return 'Device is delivered';
      }
      default: {
        return undefined;
      }
    }
  };

  // const isBiofluxDirect = useMemo(() => !_.isEmpty(props.study.biofluxDirect), [props.study.biofluxDirect]);
  const isBiofluxDirect = true;

  const studyInfoRenderer = () => {
    if (props.isFlaggedStudiesTab) {
      const isPotentiallyLost = props.study.artifact?.percentage >= 70;
      const isNeedAttention = props.study.artifact?.percentage >= 50;
      return (
        <div className="artifact-info">
          <div className="info-row">
            <div className="title">
              {`${'Issue found last 6 hours'}:`}
            </div>
            <div className="flex justify-between items-start">
              <span className="flex-1">{generateIssueFound(props.study.artifact?.lastIssueFound)?.issueFound}</span>
              <button
                className="ml3"
                isText
                buttonName="View solutions"
                onClick={() => {
                  props.toggleDispaySolutionsModal(props.study);
                }}
              />
            </div>
          </div>
          <div className="info-row">
            <div className="title">
              {`${'Common issue found in study'}:`}
            </div>
            <span>{generateIssueFound(props.study.artifact?.commonIssueFound)?.issueFound}</span>
          </div>
          <div className="info-row">
            <div className="title">
              {`${'Total artifact percentage'}:`}
            </div>
            {
              !_.isNil(props.study.artifact?.percentage) && (
                <div
                  className={classnames(
                    'total-artifact-percentage',
                    isPotentiallyLost ? '--potentially-lost' : isNeedAttention ? '--need-attention' : '',
                  )}
                >
                  <strong>{`${props.study.artifact?.percentage}%`}</strong>
                  {
                    (isPotentiallyLost || isNeedAttention) && (
                      <div className="label">
                        {isPotentiallyLost ? 'Potentially lost' : 'Need attention'}
                      </div>
                    )
                  }
                </div>
              )
            }
          </div>
          {
            !!props.study.artifact?.resolvedAt && (
              <div className="action-taken-label">
                {`Action taken ${_.lowerCase(dateToTimeSince(dateToDuration(props.study.artifact?.resolvedAt), null))}`}
              </div>
            )
          }
        </div>
      );
    }
    return (
      <div className="study-info">
        <div className="info-col title">
          <div>
            Patient ID:
          </div>
          <div>
            Service type:
          </div>
          <div>
            Study type:
          </div>
          <div>
            Start time:
          </div>
          <div>
            Study duration:
          </div>
          <div>
            Patient return visit:
          </div>
          <div>
            Last strip update:
          </div>

          {/* {
            props.study.rma && (
              <div className="rma-label">RMA</div>
            )
          } */}

          {/* {
            isBiofluxDirect && (
              <div className="biodirect-label">Biodirect</div>
            )
          } */}
        </div>
        <div className="info-col value">
          <div>{props.study.patient?.patientId}</div>
          <div>
            {props.study.isBiofluxDirect ? BIODIRECT : STANDARD}
          </div>
          <div>
            {props.study.studyType || '--'}
            {
              (props.study.isFollowOn) && (
                <span className="follow-on-study-label">FO</span>
              )
            }
          </div>
          <div>
            {dateToString(props.study.start, props.study.timezone, 'MM/DD/YYYY, hh:mm:ss A') || '--'}
          </div>
          <div>
            {props.study.studyDuration || '--'}
          </div>
          <div>
            {dateToString(props.study.reportDueDate, 'UTC+0', 'MM/DD/YYYY') || '--'}
          </div>
          <div className="last-strip-update">
            {formatUpdateTime(props.study.lastEvaluationEvent?.createdAt) || '--'}
            {!isCheckCanStopStudy(props.study)
              && (
                <button
                  className="reload-btn"
                  onClick={props.onReloadTimeClick}
                >
                  <SyncOutlined width={14} spin={props.loading} />
                </button>
              )}

          </div>
        </div>
      </div>
    );
  };

  return props.isLoadedData
    ? (
      <div className="study-card">
        <div className="header-container">
          <div className="header-container__left">
            {/* <div
              className={
                classnames(
                  'device-status',
                  props.study.device?.status
                    ? props.study.device.status === 'Offline'
                      ? '--gray'
                      : '--green'
                    : '',
                )
              }
            /> */}


            <div className="title-block study-first">
              <span className="title">Study ID</span>

              {
                !_.isNil(props.study.studyFid)
                  ? (
                    <button
                      onClick={props.handleClickStudyId}
                      className="study-card-content-btn"
                    >
                      {zeroPad(props.study.studyFid)}
                    </button>
                  )
                  : (
                    <span>--</span>
                  )
              }
            </div>

            <div className="title-block has-border-left">
              <span className="title">Care plan ID</span>

              {
                !_.isNil(props.study.carePlanFId)
                  ? (
                    <span className="study-card-content-text">
                      {zeroPad(props.study.carePlanFId)}
                    </span>
                  )
                  : (
                    <span>--</span>
                  )
              }
            </div>

            <div className="title-block has-border-left">
              <span className="title">Patient name</span>
              <div className="fr">
                <button
                  onClick={props.handleClickPatientName}
                  className="study-card-content-btn"
                >
                  {`${props.study.patientName}`}
                </button>

                {props.study?.carePlan?.patient?.willDeletedAt && (
                <Tooltip title={TOOLTIP_MESSAGES.DELETED_ACCOUNT} placement="bottom">
                  <ExclamationCircleOutlined className="is-deleted-icon" />
                </Tooltip>
                )}
              </div>
            </div>

            <div className="title-block has-border-left">
              <span className="title">Device</span>
              {
                props.study.device?.deviceId === '0000000000'
                  ? (
                    <span>--</span>
                  )
                  : (
                    <div className="device-button-container">
                      <div className={getDeviceStatus(props.study.device) === 'Online' ? 'devive-status online' : 'devive-status'} />
                      <button
                        onClick={props.handleClickDeviceId}
                        className="study-card-content-btn"
                      >
                        {props.study.device?.deviceId}
                      </button>
                    </div>
                  )
              }
            </div>


          </div>

          <div className="header-container__right">
            <div className={classnames('study-card-status',
              props.study.status === 'Draft' || props.study.status === 'Starting' ? 'not-stated' : '',
              props.study.status === 'Completed' ? 'completed' : '')}
            >
              {props.study.status === 'Draft' || props.study.status === 'Starting' ? 'Not started' : props.study.status}
            </div>
            {/* {
              isClinicTechnician.current && !props.isFlaggedStudiesTab && (
                <button className="mr3" buttonName={gettext('Copy')} onClick={props.handleClickCopy} />
              )
            }
            {
              props.isFlaggedStudiesTab && (
                <div
                  className={classnames(
                    'resolved',
                    props.study.isResolved ? '--checked' : '',
                    'mr-3',
                  )}
                >
                  <CheckboxCT
                    id={props.study.id}
                    name="isResolved"
                    data={{
                      label: 'Resolved',
                      value: !(props.study.isResolved),
                    }}
                    checked={props.study.isResolved}
                    onChange={props.handleCheckResolved}
                  />
                </div>
              )
            }
            <button
              disabled={isDisabledGetECGButton(props.study)}
              buttonName={gettext('Get ECG')}
              onClick={props.handleClickGetECG}
            />
            {
              !props.isFlaggedStudiesTab && (
                <button
                  className="ml3"
                  buttonName={gettext('View study')}
                  onClick={props.handleGoToStudyManagement}
                />
              )
            } */}
          </div>
        </div>

        {
          props.isShowFacilityName && (
            <div className="facility-shower">
              <img src={hospitalIc} alt="" />
              <div className="facility-name">{props.study.facility.name}</div>
            </div>
          )
        }

        <div className="body-container">
          <div className="body-container__left">

            {studyInfoRenderer()}

            <div
              className={
                classnames(
                  'study-duration',
                  getBiofluxDirectProgress(props.study.isBiofluxDirect ? props.study.status : '') ? '' : '',
                )
              }
            >
              {
                getBiofluxDirectProgress(props.study.isBiofluxDirect ? props.study.status : '')
                  ? (
                    <>
                      <div className="progress-container">
                        {/* {getBiofluxDirectProgress(props.study.isBiofluxDirect ? props.study.status : '')} */}
                        {generateProgressComponent(props.study, true)}
                      </div>
                      <CustomButton
                        disabled={isCheckCanStopStudy(props.study)}
                        danger
                        className="stop-study-button"
                        onClick={props.handleClickStop}
                        label="Stop"
                      />
                    </>
                  )
                  : (
                    <>
                      <div className="progress-container">
                        {generateProgressComponent(props.study)}
                      </div>
                      <CustomButton
                        disabled={isCheckCanStopStudy(props.study)}
                        danger
                        className="stop-study-button"
                        onClick={props.handleClickStop}
                        label="Stop"
                      />
                    </>
                  )
              }
            </div>
          </div>

          <div className="body-container__right">
            {
              props.study.lastEvaluationEvent?.stripImgs?.length
                ? (
                  <>
                    <ImageGallery
                      items={createItems(props.study.lastEvaluationEvent.stripImgs)}
                      infinite={false}
                      showPlayButton={false}
                      showFullscreenButton={false}
                      showBullets
                      lazyLoad
                      disableArrowKeys
                      slideDuration={250}
                      startIndex={0}
                      thumbnailPosition="bottom"
                      renderLeftNav={renderLeftNav}
                      renderRightNav={renderRightNav}
                      onImageLoad={onImageLoad}
                      onImageError={onImageError}
                    />

                    {
                      state.isLoading
                        ? (
                          <div className="loading-thumbnail">
                            <Skeleton height="100%" />
                          </div>
                        )
                        : state.isLoadedImageError && (
                          <div className="loading-thumbnail --error">
                            There is an error while loading ECG strips
                          </div>
                        )
                    }
                  </>
                )
                : (
                  <div className="no-ecg-strip-container">
                    <span className="no-ecg-strip-text">There is no strip to display</span>
                  </div>
                )
            }
          </div>
        </div>
      </div>
    )
    : (
      <StudyCardSkeleton />
    );
};

StudyCard.defaultProps = {
  isFlaggedStudiesTab: false,
};

StudyCard.propTypes = {
  isFlaggedStudiesTab: PropTypes.bool,
  study: PropTypes.shape().isRequired,
  isLoadedData: PropTypes.bool.isRequired,
  handleClickDeviceId: PropTypes.func.isRequired,
  handleClickStudyId: PropTypes.func.isRequired,
  handleClickPatientName: PropTypes.func.isRequired,
  handleClickStop: PropTypes.func.isRequired,
  isShowFacilityName: PropTypes.bool.isRequired,
  toggleDispaySolutionsModal: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  onReloadTimeClick: PropTypes.func.isRequired,
};

export default StudyCard;

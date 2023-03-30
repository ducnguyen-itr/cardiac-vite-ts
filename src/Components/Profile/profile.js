import { CloseOutlined } from '@ant-design/icons';
import { Space, Spin, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import Title from 'antd/lib/typography/Title';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import auth from '../../Helpers/auth';
import { useMergeState } from '../../Helpers/customHooks';
import SuccessPage from '../../Pages/ForgotPassword/Layout/successPage';
import { updateAvatarRequest } from '../../Redux/Actions/login';
import CustomAvatar from '../Avatar';
import CustomButton from '../Button/customButton';
import DisplayData2 from '../UI/displayData2';
import ChangePassword from './changePassword';
import { getUserData, getUserInfo, mutationUpdateAvatar } from './helper';
import './style.scss';

const Profile = (props) => {
  const imgRef = useRef(undefined);
  const [state, setState] = useMergeState({
    isChangePassword: false,
    isSuccess: false,
    loading: false,
  });

  const {
    fullName, firstName, lastName, email, phone, address,
    country, facilities,
  } = auth.getLoginData() || {};

  const {
    isSuccess, isChangePassword, loading,
  } = state;

  const handleChangeAvatar = async (selectedAvatar) => {
    setState({ loading: true });
    const photo = await mutationUpdateAvatar(selectedAvatar);
    setState({ loading: false });
    if (photo) {
      props.updateAvatarRequest({ photo });
    }
  };

  const handleChangePassword = () => {
    setState({ isSuccess: true });
  };

  const onClickChangePassword = () => {
    setState({ isChangePassword: true });
  };

  const onClickGoBack = () => {
    setState({ isSuccess: false, isChangePassword: false });
  };

  const onChange = ({ fileList }) => {
    if (fileList && fileList[0]?.originFileObj) {
      if (imgRef.current) {
        clearTimeout(imgRef.current);
      }
      imgRef.current = setTimeout(() => {
        handleChangeAvatar(fileList[0].originFileObj);
      }, 500);
    }
  };

  const showProfile = () => (
    <>
      <div className="profile-avatar">
        <CustomAvatar
          avatarLink={props.login?.photo || auth.getAvatar()}
          size={80}
          firstName={firstName}
          lastName={lastName}
        />

        <ImgCrop shape="round">
          <Upload
            onChange={onChange}
            itemRender={() => null}
            accept="image/png, .jpeg, .jpg"
          >
            <CustomButton className="ml24 blue-btn" label="Change image" />
          </Upload>
        </ImgCrop>
      </div>
      <DisplayData2
        className="mt16 no-padding-left"
        title="Account information"
        data={getUserData(auth.role(), email, fullName)}
        isStrip
        leftWidth={2}
      />
      <DisplayData2
        className="mt16 no-padding-left"
        title="Your clinic"
        data={_.map(facilities || [], x => ({ title: x.name }))}
        type="NONE"
        isStrip
        leftWidth={3}
      />
      <DisplayData2
        className="mt16 no-padding-left"
        title="Your information"
        data={getUserInfo(phone, country, address)}
        isStrip
        leftWidth={2}
      />
    </>
  );

  return (
    <div className="profile-wrapper">
      {
        isSuccess
          ? <SuccessPage onClick={onClickGoBack} content="Go back" />
          : (
            <>
              <div className="profile-header">
                <Title className="m-0" level={4}>
                  {isChangePassword ? 'Change password' : 'Your Profile'}
                </Title>
                <CustomButton size="small" className="profile-close-btn p-0" onClick={props.onClose} icon={<CloseOutlined />} />
              </div>

              <div className="profile-content">
                {
                  isChangePassword
                    ? <ChangePassword handleChangePassword={handleChangePassword} />
                    : showProfile()
                }
              </div>
            </>
          )
      }
      {
        loading && (
          <Space className="loading-space" size="middle">
            <Spin size="large" />
          </Space>
        )
      }

    </div>
  );
};

Profile.propTypes = {
  login: PropTypes.shape().isRequired,
  onClose: PropTypes.func.isRequired,
  updateAvatarRequest: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  updateAvatarRequest,
};

const mapStateToProps = state => ({
  login: state.login,
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

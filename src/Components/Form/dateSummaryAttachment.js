import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'antd';
import classnames from 'classnames';
import { CalendarOutlined } from '@ant-design/icons';

import InputCT from '../Input/inputCT';
import DatePickerCT from '../Input/datepickerCT';
import UploadFileCT from '../Input/uploadFileCT';

const { Title, Text } = Typography;

const DateSummaryAttachment = props => (
  <div className={classnames('date-summary-attachment-wrapper', props.className)}>

    {
      props.title
        ? <Title level={5}>{props.title}</Title>
        : null
    }

    {
      props.subTitle ? (
        <div className="mt24">
          <Text strong>{props.subTitle}</Text>
        </div>
      ) : null
    }

    <DatePickerCT
      name="Date"
      title="Date"
      className="mt16"
      value={props.date}
      onChange={props.onChange}
      disabledDate="PAST"
      suffixIcon={<CalendarOutlined />}
      disabled={props.isDisabledDatePicker}
    />

    <InputCT
      name="Summary"
      className="mt16"
      title="Summary"
      type="TEXTAREA"
      onChange={props.onChange}
      value={props.summary}
      placeholder="Enter your summary"
    />

    <UploadFileCT
      name="Attachment"
      title="Attachment"
      className="mt16"
      onChange={props.onChange}
      fileList={props.attachment}
      onClickDelete={props.onClickDelete}
    />
  </div>
);

DateSummaryAttachment.defaultProps = {
  onChange: () => { },
  className: undefined,
  title: '',
  subTitle: '',
  date: undefined,
  summary: '',
  attachment: undefined,
  onClickDelete: () => { },
  isDisabledDatePicker: false,
};

DateSummaryAttachment.propTypes = {
  onChange: PropTypes.func,
  className: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  date: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.string,
  ]),
  summary: PropTypes.string,
  attachment: PropTypes.arrayOf(PropTypes.shape()),
  onClickDelete: PropTypes.func,
  isDisabledDatePicker: PropTypes.bool,
};

export default DateSummaryAttachment;

import { Table, Typography } from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { EditFilled } from '@ant-design/icons';
import { calcStep6, calcStep7, calcStep9 } from '../../Utils/baselineInfo';

import CustomButton from '../Button/customButton';

const { Title } = Typography;

const ScoringTable = (props) => {
  const {
    onClickEdit, className, dataSource, indexNames, isEditable,
  } = props;
  const {
    // step 6
    cha2ds2VascScore,
    // step 7
    hasbledClinical,
    // step 8
    ehraScore,
    // step 9
    step9Obj,
    frs,
  } = dataSource;

  const temp = ehraScore?.title?.split(' ');
  const { cha2ds2VascFinalScore, step6TotalScore } = calcStep6(cha2ds2VascScore);

  const { hasbledClinicalFinalScore, step7TotalScore } = calcStep7(hasbledClinical);

  const {
    step9TotalScore, cvgRisk, heartRate, risk,
  } = calcStep9(step9Obj);

  const {
    smoker, totalCholesterol, HDLCholesterol, systolicBP, bloodPressure,
  } = step9Obj;

  let frsCustom = `10 years CVD risk: ${cvgRisk}%\nHeart age: ${heartRate} years\nRisk: ${risk}`;
  if (smoker === 'No' && !totalCholesterol && !HDLCholesterol && !systolicBP && bloodPressure === 'No') {
    frsCustom = '--';
  }

  const tableData = [
    {
      key: '1',
      index: indexNames[0],
      score: _.isNil(step6TotalScore) ? 'N/A' : step6TotalScore,
      riskFactors: _.isNil(cha2ds2VascFinalScore) ? 'N/A' : cha2ds2VascFinalScore,
    },
    {
      key: '2',
      index: indexNames[1],
      score: _.isNil(step7TotalScore) ? 'N/A' : step7TotalScore,
      riskFactors: _.isNil(hasbledClinicalFinalScore) ? 'N/A' : hasbledClinicalFinalScore,
    },
    {
      key: '3',
      index: indexNames[2],
      score: _.isNil(temp) && _.isNil(temp?.[2]) ? 'N/A' : temp ? temp[2] : '',
      riskFactors: _.isNil(temp) && _.isNil(temp?.[0]) ? 'N/A' : temp ? temp[0] : '',
    },
    {
      key: '4',
      index: indexNames[3],
      score: frs ? frsCustom === '--' ? '--' : step9TotalScore : 'N/A',
      riskFactors: _.isNil(frsCustom) ? 'N/A' : frsCustom,
    },
  ];

  const columns = [
    {
      dataIndex: 'index',
      key: 'index',
      width: '25%',
      render: (text, record, index) => (
        <div className="b">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      width: '15%',
    },
    {
      title: 'Risk factors',
      dataIndex: 'riskFactors',
      key: 'riskFactors',
      // width: '33.33%',
      render: (text, record, index) => (
        <div className="scoring-table-row">
          <span>{text}</span>

          {isEditable ? (
            <div className="scoring-table-row-edit-button">
              <CustomButton icon={<EditFilled />} label="Edit" onClick={() => onClickEdit(record?.index)} />
            </div>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className={classnames('scoring-table', className)}>
      <Title level={5} className="font-weight-bold">Scoring</Title>

      <Table
        dataSource={tableData}
        columns={columns}
        pagination={false}
      />
    </div>
  );
};

ScoringTable.defaultProps = {
  onClickEdit: () => { },
  className: undefined,
  dataSource: {},
  indexNames: [],
  isEditable: false,
};

ScoringTable.propTypes = {
  className: PropTypes.string,
  dataSource: PropTypes.shape(),
  onClickEdit: PropTypes.func,
  indexNames: PropTypes.arrayOf(PropTypes.string),
  isEditable: PropTypes.bool,
};

export default ScoringTable;

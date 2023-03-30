import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Table, Tooltip } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import _ from 'lodash';

import { MessageData } from '../../Constants';
import { useUpdateEffect } from '../../Helpers/customHooks';

import BoxItem from '../UI/boxItem';
import { BIOHHEART_REPORT_TYPE, ON_DEMAND_REPORT_TYPE } from '../../Constants/reports';

const { EmptyTableMes } = MessageData;

const TableBasic = (props) => {
  const tmpCurrentPage = useRef(1);
  const shouldIncreasePage = useRef(false);
  const customRow = (rowProps) => {
    if (props.isOnDemandReport) {
      const targetRow = _.find(props.totalData, datum => datum._id === rowProps.children[0]?.props.record._id);
      if (targetRow && targetRow.status !== ON_DEMAND_REPORT_TYPE.GENERATED) {
        return (
          <Tooltip title={targetRow.message} placement="bottom" overlayStyle={{ maxWidth: '550px' }}>
            <tr {...rowProps} />
          </Tooltip>
        );
      }
    }
    return (<tr {...rowProps} />);
  };
  const onClickNext = () => {
    if (!props.shouldShowAllData) {
      tmpCurrentPage.current = props.page + 1;
      if (tmpCurrentPage.current > Math.ceil(props.totalData.length / props.pageSize)) {
        shouldIncreasePage.current = true;
        if (!_.isEmpty(props.cursor)) {
          props.fetchData(props.cursor, true);
        } else {
          props.fetchData(
            { cursor: props.totalData[props.totalData.length - 1]._id },
            true,
          );
        }
      } else {
        props.handleChangePage(tmpCurrentPage.current);
      }
    }
  };

  useUpdateEffect(() => {
    if (shouldIncreasePage.current && props.page < Math.ceil(props.totalData.length / props.pageSize)) {
      shouldIncreasePage.current = false;
      props.handleChangePage(tmpCurrentPage.current);
    } else {
      tmpCurrentPage.current = props.page;
    }
  }, [props.totalData]);

  const onChangePage = (page) => {
    props.handleChangePage(page);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const shorthandOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
    if (!_.isEmpty(sorter) && !_.isEmpty(props.sorter)
      && (sorter.field !== props.sorter.field || shorthandOrder !== props.sorter.order)) {
      props.fetchData({ sortField: sorter.field, sortOrder: shorthandOrder });
    }
  };

  const itemRender = (current, type, originalElement) => {
    if (type === 'prev') {
      if (props.page === 1) {
        return null;
      }
      return originalElement;
    }
    if (type === 'next') {
      if (props.shouldShowAllData && props.page === Math.ceil(props.totalData.length / props.pageSize)) {
        return null;
      }
      return !props.shouldHideNextButton && (
        <BoxItem icon={(<RightOutlined className="color-gray-8" />)} onClick={onClickNext} />
      );
    }
    return originalElement;
  };

  return (
    <Table
      rowKey={props.rowKey}
      className={classnames(props.className, `${props.name}-table-wrapper`)}
      rowClassName={(record) => {
        if (record.status === ON_DEMAND_REPORT_TYPE.GENERATED) {
          return 'normal-row';
        }
        if (record.status === ON_DEMAND_REPORT_TYPE.GENERATING) {
          return 'disable-row';
        }
        if (record.externalStatus === BIOHHEART_REPORT_TYPE.FAILED) {
          return 'disable-row';
        }
        if (record.status === BIOHHEART_REPORT_TYPE.INACTIVE) {
          return 'disable-row';
        }
        if (record.status === ON_DEMAND_REPORT_TYPE.NONE) {
          return 'error-row';
        }
        if (record.isError) {
          return 'error-template-row';
        }
        return '';
      }}
      dataSource={props.totalData}
      components={{
        body: {
          row: customRow,
        },
      }}
      onRow={(record, rowIndex) => ({
        onClick: (e) => {
          // record.status is used for on-demand reports tab
          if (record.status === 'Generating' || record.status === 'None') {
            return;
          }
          const cellText = document.getSelection();
          if (cellText.type === 'Range') {
            e.stopPropagation();
          } else {
            props.onRowClick(rowIndex, record);
          }
        },
      })}
      pagination={props.isNoPagination ? false : {
        itemRender,
        onChange: onChangePage,
        current: props.page,
        showSizeChanger: false,
        pageSize: props.pageSize,
      }}
      locale={{ emptyText: props.emptyText }}
      columns={props.columns}
      loading={props.loading}
      onChange={props.shouldShowAllData ? undefined : handleTableChange}
      sticky={props.sticky}
      rowSelection={props.rowSelection}
    />
  );
};

TableBasic.defaultProps = {
  name: '',
  className: undefined,
  onRowClick: () => { },
  shouldHideNextButton: false,
  fetchData: () => { },
  loading: false,
  sorter: {},
  emptyText: EmptyTableMes,
  shouldShowAllData: false,
  handleChangePage: () => { },
  isNoPagination: false,
  page: 1,
  sticky: false,
  isOnDemandReport: false,
  pageSize: 10,
  rowClassName: '',
  cursor: {},
  rowSelection: undefined,
};

TableBasic.propTypes = {
  rowKey: PropTypes.string.isRequired,
  name: PropTypes.string,
  className: PropTypes.string,
  totalData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onRowClick: PropTypes.func,
  shouldHideNextButton: PropTypes.bool,
  fetchData: PropTypes.func,
  loading: PropTypes.bool,
  sorter: PropTypes.shape({
    field: PropTypes.string,
    order: PropTypes.string,
  }),
  emptyText: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.string,
  ]),
  shouldShowAllData: PropTypes.bool,
  page: PropTypes.number,
  handleChangePage: PropTypes.func,
  isNoPagination: PropTypes.bool,
  sticky: PropTypes.bool,
  isOnDemandReport: PropTypes.bool,
  pageSize: PropTypes.number,
  rowClassName: PropTypes.string,
  cursor: PropTypes.shape(),
  rowSelection: PropTypes.shape(),
};

export default TableBasic;

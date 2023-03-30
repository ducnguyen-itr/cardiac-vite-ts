import { PlusOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router';
import { useMergeState } from '../../Helpers/customHooks';
import { getSearchData } from '../../Utils';
import BillingFilter from '../BillingFilter';
import CustomButton from '../Button/customButton';
import CheckboxFilter from '../CheckboxFilter';
import SelectCT from '../Input/selectCT';
import OnDemandReportModal from '../Modal/OnDemanReportModal';
import ReportFilter from '../ReportFilter';
import SearchBar from '../Search/searchBar';
import TableBasic from './index';

const TableComponent = (props) => {
  const [state, setState] = useMergeState({
    selectedOption: [],
    searchOption: {},
    visible: false,
    loading: false,
    searchValue: '',
    searchByKey: '',
  });
  const onChange = (name, value, index) => {
    const newSelectedOption = _.cloneDeep(state.selectedOption);
    newSelectedOption[index].value = value;
    setState({
      selectedOption: newSelectedOption,
    });
    const selectObj = {};
    _.forEach(newSelectedOption, (x) => {
      _.assign(selectObj, { [x.name]: x.value?.includes('All') ? undefined : x.value });
    });
    const updatedFilter = {
      ...state.searchOption,
      ...selectObj,
      [name]: value?.includes('All') ? undefined : value,
    };
    props.fetchData(
      updatedFilter, false, false, false, name,
    );
  };
  const location = useLocation();
  useEffect(() => {
    const selectedOption = _.map(props.filterDropdownList, x => ({
      name: x.name,
      value: x.options[0],
    }));

    setState({
      selectedOption,
    });
  }, [props.filterDropdownList]);

  useEffect(() => {
    if (!_.isEmpty(props.tableFilter)) {
      const selectedOption = _.map(props.filterDropdownList, x => ({
        name: x.name,
        value: props.tableFilter?.[x.name] === undefined ? x.options[0] : props.tableFilter?.[x.name],
      }));
      setState({
        selectedOption,
      });
    }
    if (!_.isEmpty(props.tableFilter) && props.isFirstTime) {
      const { searchValue, searchByKey } = getSearchData(props.tableFilter, props.searchByList);
      setState({
        searchValue,
        searchByKey,
      });
    }
  }, [props.tableFilter, props.searchByList, props.isFirstTime]);

  const fetchData = async (updatedFilter = {}, isNextPage = false, isReload = false, isSearch = false) => {
    setState({ searchOption: updatedFilter });
    _.forEach(state.selectedOption, (x) => {
      _.assign(updatedFilter, {
        [x.name]: x.value?.includes('All') ? undefined : x.value,
      });
    });
    props.fetchData(
      updatedFilter, isNextPage, isReload, isSearch,
    );
  };

  const isEmptyFilterd = useMemo(() => {
    if (props.totalData.length === 0 && state.selectedOption?.length !== 0) {
      const hasValue = _.find(state.selectedOption || [], x => !x?.value?.includes('All '));
      if (!_.isEmpty(hasValue)) {
        return true;
      }
    }
    return false;
  }, [props.filterDropdownList, props.totalData, state.selectedOption]);


  const onClickCancel = () => {
    setState({ visible: false, loading: false });
  };
  const onClickCreate = () => {
    setState({ loading: true });
  };
  const onOpenModal = () => {
    setState({ visible: true });
  };
  const onCloseModal = () => {
    setState({ visible: false, loading: false });
  };
  const onClickCreateBill = () => {
    props.onClickCreateBill();
  };

  const onApplyFilter = (newFilter) => {
    fetchData(newFilter);
    props.onApplyFilter(newFilter);
  };

  const onCancelCreateBill = () => {
    props.onCancelCreateBill();
  };

  return (
    <div className={props.className}>
      <div className="patients-body-main">
        <Row className={classnames('m0', props.isFilterLeft ? '' : 'fr-sb')} gutter={24}>
          {props.searchByList?.length > 0 && (
            <Col className="pad0 padr16" span={props.searchBarLength}>
              <SearchBar
                searchByList={props.searchByList}
                fetchData={fetchData}
                isVisible={props.isVisible}
                searchValue={state.searchValue}
                searchByKey={state.searchByKey}
              />
            </Col>
          )}
          <Col className={classnames('f-row pad0', props.isFilterLeft ? '' : 'f-just-end')} span={24 - props.searchBarLength - 4}>
            {props.isTimeTrackingTable && (
              <div>
                {props.isCreating ? (
                  <div className="create-bill-btn-container">
                    <CustomButton onClick={onCancelCreateBill} label="Cancel" />
                    <CustomButton
                      disabled={!props.numberSelected}
                      onClick={props.onGenerateBill}
                      type="primary"
                      label={`${props.numberSelected ? `Generate (${props.numberSelected})` : 'Generate'}`}
                    />
                  </div>
                ) : <CustomButton onClick={onClickCreateBill} type="primary" className="create-bill-btn" icon={<PlusOutlined />} label="Create master bill" />}
              </div>
            )}
            {props.checkBoxFilterList?.length > 0 && props.isBillingTab
              && (
                <BillingFilter
                  name={props.name}
                  options={props.checkBoxFilterList}
                  className="mr16"
                  onApply={onApplyFilter}
                  saveFilter={props.saveFilter}
                />
              )
            }
            {props.checkBoxFilterList?.length > 0 && !props.isBillingTab
              && (
                <CheckboxFilter
                  name={props.name}
                  options={props.checkBoxFilterList}
                  className="mr16"
                  onApply={onApplyFilter}
                  saveFilter={props.saveFilter}
                />
              )
            }
            {props.filterCheckboxList?.length > 0
              && (
                <>
                  <ReportFilter
                    name={props.name}
                    options={props.filterCheckboxList}
                    className="mr16"
                    onApply={onApplyFilter}
                    saveFilter={props.saveFilter}
                  />
                </>
              )
            }
            {props.filterDropdownList?.length > 0 && (
              <>
                {_.map(props.filterDropdownList, (x, i) => (
                  <SelectCT
                    showSearch={false}
                    key={i}
                    name={x.name}
                    className={classnames(i !== 0 ? 'ml16' : '')}
                    placeholder={x.placeholder}
                    data={x.options}
                    onChange={(name, value) => onChange(name, value, i)}
                    value={state.selectedOption?.length > 0 ? state.selectedOption?.[i]?.value : undefined}
                    toolTipText={x.toolTipText}
                    disabled={props.isCreating && i === 1}
                  />
                ))}
              </>
            )}
          </Col>
          {props.isOnDemandReport && (
            <Col className="on-demand-report-col pad0 padr12i" span={4}>
              <Row justify="end" style={{ height: '100%' }} gutter={24}>
                {
                  location.pathname.split('/')[2] === 'active'
                  && <CustomButton type="primary" span={24} style={{ height: '100%' }} onClick={onOpenModal} label="Create report" />
                }
              </Row>
            </Col>
          )}
          {props.isILRReport && (
            <Col className="on-demand-report-col pad0 padr12i" span={4}>
              <Row justify="end" style={{ height: '100%' }} gutter={24}>
                {
                  location.pathname.split('/')[2] === 'active'
                  && <CustomButton type="primary" span={24} style={{ height: '100%' }} size="large" onClick={props.onClickILRButton} label="Add new report" />
                }
              </Row>
            </Col>
          )}
        </Row>

        <TableBasic
          rowKey={props.rowKey}
          name={props.name}
          className="mt24"
          totalData={props.totalData}
          columns={props.columns}
          onRowClick={props.onRowClick}
          shouldHideNextButton={props.shouldHideNextButton}
          fetchData={props.fetchData}
          loading={props.loading}
          sorter={props.sorter}
          emptyText={props.isEmptySearching || isEmptyFilterd ? 'There is no data to display' : undefined}
          page={props.page}
          handleChangePage={props.handleChangePage}
          isOnDemandReport={props.isOnDemandReport}
          pageSize={props.pageSize}
          cursor={props.cursor}
          rowSelection={props.rowSelection}
        />
      </div>
      {state.visible
        && (
          <OnDemandReportModal
            visible={state.visible}
            loading={state.loading}
            onClickCancel={onClickCancel}
            onClickCreate={onClickCreate}
            fetchData={fetchData}
            onOpenModal={onOpenModal}
            onCloseModal={onCloseModal}
            carePlan_id={props.carePlan_id}
            startDate={props.startDate}
            onReloadOnDemandReportTable={props.onReloadOnDemandReportTable}
          />
        )}
    </div>
  );
};

TableComponent.defaultProps = {
  carePlan_id: '',
  className: undefined,
  searchByList: [],
  filterDropdownList: [],
  filterCheckboxList: [],
  checkBoxFilterList: [],
  sorter: {},
  rowKey: 'carePlanId',
  isVisible: true,
  searchBarLength: 8,
  isEmptySearching: false,
  page: 1,
  isOnDemandReport: false,
  startDate: '',
  onReloadOnDemandReportTable: () => { },
  isFilterLeft: false,
  pageSize: 10,
  isTimeTrackingTable: false,
  isCreating: false,
  isILRReport: false,
  onCancelCreateBill: () => { },
  onClickCreateBill: () => { },
  onGenerateBill: () => { },
  onApplyFilter: () => { },
  onClickILRButton: () => { },
  numberSelected: 0,
  cursor: {},
  tableFilter: {},
  saveFilter: {},
  rowSelection: undefined,
  isFirstTime: false,
  isBillingTab: false,
};

TableComponent.propTypes = {
  carePlan_id: PropTypes.string,
  rowKey: PropTypes.string,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  searchByList: PropTypes.arrayOf(PropTypes.shape()),
  filterDropdownList: PropTypes.arrayOf(PropTypes.shape()),
  filterCheckboxList: PropTypes.arrayOf(PropTypes.shape()),
  checkBoxFilterList: PropTypes.arrayOf(PropTypes.shape()),
  columns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  totalData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onRowClick: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  shouldHideNextButton: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  sorter: PropTypes.shape(),
  isVisible: PropTypes.bool,
  searchBarLength: PropTypes.number,
  isEmptySearching: PropTypes.bool,
  page: PropTypes.number,
  handleChangePage: PropTypes.func.isRequired,
  isOnDemandReport: PropTypes.bool,
  startDate: PropTypes.string,
  onReloadOnDemandReportTable: PropTypes.func,
  isFilterLeft: PropTypes.bool,
  pageSize: PropTypes.number,
  isTimeTrackingTable: PropTypes.bool,
  isCreating: PropTypes.bool,
  isILRReport: PropTypes.bool,
  onCancelCreateBill: PropTypes.func,
  onClickCreateBill: PropTypes.func,
  onClickILRButton: PropTypes.func,
  onGenerateBill: PropTypes.func,
  onApplyFilter: PropTypes.func,
  numberSelected: PropTypes.number,
  cursor: PropTypes.shape({}),
  rowSelection: PropTypes.shape(),
  tableFilter: PropTypes.shape(),
  saveFilter: PropTypes.shape(),
  isFirstTime: PropTypes.bool,
  isBillingTab: PropTypes.bool,
};

export default TableComponent;

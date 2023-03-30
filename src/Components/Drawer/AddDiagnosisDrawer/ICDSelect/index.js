/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import classnames from 'classnames';
import _, { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import { Select, Spin, Tooltip } from 'antd';

import NormalInput from '../../../Input/NormalInput';
import { getICDCodes } from '../helper';
import './style.scss';

const ICDSelect = (props) => {
  const [fetching, setFetching] = useState(false);
  const [loadmore, setLoadmore] = useState(false);
  const [options, setOptions] = useState([]);
  const [cursor, setCursor] = useState();
  const fetchRef = useRef(0);

  const keywordRef = useRef('');

  const fetchOptions = value => getICDCodes({ filter: { search: value } });

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((result) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        const tmpOptions = [
          {
            label: `Use "${value}" as a custom diagnosis`,
            value,
            isCustom: true,
          },
          ...result.data,
        ];
        setCursor(result.cursor);
        setOptions(tmpOptions);
        setFetching(false);
      });
    };
    return debounce(loadOptions, props.debounceTimeout);
  }, [fetchOptions, props.debounceTimeout]);

  const onChange = (value, option) => {
    if (!option) {
      props.toggleUseCustomIcd(false);
      props.onChangeIcdInfo({});
      return;
    }
    props.toggleUseCustomIcd(option.isCustom);
    const newValue = option?.isCustom
      ? { ...option.moreInfo, value: option.value, label: option.value }
      : { ...option.moreInfo, label: option.label, value: option.value };
    props.onChangeIcdInfo(newValue);
  };

  const onChangeCustomIcd = (name, value) => {
    if (name === 'value' && !value) {
      setOptions([]);
      setCursor('');
      props.toggleUseCustomIcd(false);
      props.onChangeIcdInfo({});
      return;
    }
    setOptions([]);
    setCursor('');
    props.onChangeCustomIcd(name, value);
  };

  const onSearch = (keyword) => {
    keywordRef.current = keyword;
    if (!keyword || keyword.length < 1) {
      setCursor('');
      return;
    }
    debounceFetcher(keyword);
  };

  const loadmoreOptions = async () => {
    if (!cursor || fetching) return;
    setLoadmore(true);
    const result = await getICDCodes({
      filter: { search: keywordRef.current },
      pagination: { cursor, limit: 10 },
    });
    setOptions([...options, ...result.data]);
    setCursor(result.cursor);
    setLoadmore(true);
  };

  const onScroll = (event) => {
    const { target } = event;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      loadmoreOptions();
    }
  };

  useEffect(() => {
    if (!props.open) {
      setOptions([]);
      setCursor('');
    }
  }, [props.open]);

  const searchInput = () => (
    <div className={classnames('icd-select', props.className)}>
      <div className="title">
        Condition
        <span className="required-field"> *</span>
      </div>
      <Select
        popupClassName="icd-select-popup"
        optionLabelProp="label"
        filterOption={false}
        onSearch={onSearch}
        notFoundContent={
          fetching ? (
            <Spin size="small" />
          ) : options.length === 0 && keywordRef.current.length < 1 ? (
            'Enter a code or description to start your search.'
          ) : null
        }
        showSearch
        value={_.isEmpty(props.icdInfo) ? undefined : props.icdInfo}
        placeholder="Search by ICD-10 code or description"
        allowClear
        onChange={onChange}
        onPopupScroll={onScroll}
      >
        {options.map(icdCode => (
          <Select.Option
            className={classnames(
              'icd-select-item',
              icdCode._id,
              icdCode.isCustom ? 'icd-select-item__custom' : '',
            )}
            key={icdCode._id}
            isCustom={icdCode.isCustom}
            value={icdCode.value}
            label={icdCode.label}
            moreInfo={icdCode}
          >
            <div
              className={classnames(
                'icd-select-selection',
                icdCode.isCustom ? 'icd-select-selection__custom' : '',
              )}
            >
              {icdCode.isCustom ? (
                <>{icdCode.label}</>
              ) : (
                <>
                  <div className="code">{icdCode.codeNameDisplay}</div>
                  <Tooltip
                    overlayClassName="icd-content-tooltip"
                    open
                    title={icdCode.longDescription}
                  >
                    <div className="description">
                      {icdCode.longDescription}
                    </div>
                  </Tooltip>
                </>
              )}
            </div>
          </Select.Option>
        ))}
      </Select>
    </div>
  );

  return (
    <>
      {props.isUseCustomIcd ? (
        <>
          <div className={classnames('icd-select', props.className)}>
            {searchInput()}
            <NormalInput
              className="mt16"
              name="code"
              title="Code"
              placeholder="Input custom code"
              onChange={onChangeCustomIcd}
              value={props.icdInfo.code}
            />
          </div>
        </>
      ) : (
        searchInput()
      )}
    </>
  );
};

ICDSelect.defaultProps = {
  className: undefined,
  icdInfo: {},
  debounceTimeout: 500,
  isUseCustomIcd: false,
  open: false,
  onChangeIcdInfo: () => { },
  onChangeCustomIcd: () => { },
  toggleUseCustomIcd: () => { },
};

ICDSelect.propTypes = {
  /** override className */
  className: PropTypes.string,
  /** icd info */
  icdInfo: PropTypes.shape(),
  /** debounce timeout */
  debounceTimeout: PropTypes.number,
  /** is use custom icd */
  isUseCustomIcd: PropTypes.bool,
  /** drawer state */
  open: PropTypes.bool,
  /** on change icd info */
  onChangeIcdInfo: PropTypes.func,
  /** on chang custom icd info */
  onChangeCustomIcd: PropTypes.func,
  /** toggle use custom icd */
  toggleUseCustomIcd: PropTypes.func,
};

export default ICDSelect;

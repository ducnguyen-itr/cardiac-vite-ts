import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import InputCT from './inputCT';


const PairInput = (props) => {
  const {
    className,
    titleLeft, titleRight, onChangeLeft, onChangeRight,
    placeholderLeft, placeholderRight, disabledLeft, disabledRight,
    pad, valueLeft, valueRight, typeLeft, typeRight,
    isUnitLeft, isUnitRight, unitPlaceholderLeft, unitPlaceholderRight,
    unitValueLeft, unitValueRight, onChangeUnitLeft, onChangeUnitRight,
    unitTypeLeft, unitTypeRight,
    dataLeft, dataRight,
    nameLeft, nameRight, unitNameLeft, unitNameRight,
    errMes, errMesClassName,
    absSuffixLeft, absSuffixRight,
    rightErrMes,
    isNoLeftErr, isNoRightErr,
  } = props;
  return (
    <>
      <div className={classnames('pair-input-wrapper', className)}>

        <div className={classnames('pair-input-left', `left-${pad}`)}>
          <InputCT
            inputClassName={isNoLeftErr ? '' : errMes ? 'err-border' : ''}
            name={nameLeft}
            value={valueLeft}
            title={titleLeft}
            placeholder={placeholderLeft}
            onChange={onChangeLeft}
            disabled={disabledLeft}
            data={dataLeft}
            type={typeLeft}
            absSuffix={absSuffixLeft}
            maxLengthInput={props.maxLength}
            isInteger={props.isInteger}
            isError={!!errMes}
          />

          {
            isUnitLeft && (
            <div className="pair-input-unit-sep">
              <span>/</span>
            </div>
            )
          }

          {
            isUnitLeft && (
            <div className="pair-input-unit">
              <InputCT
                name={unitNameLeft}
                value={unitValueLeft}
                placeholder={unitPlaceholderLeft}
                onChange={onChangeUnitLeft}
                type={unitTypeLeft}
                maxLengthInput={props.maxLength}
                isInteger={props.isInteger}
                isError={!!errMes}

              />
            </div>
            )
          }
        </div>

        <div className={classnames('pair-input-right', `right-${pad}`)}>
          <InputCT
            className={titleRight ? '' : 'padt23'}
            inputClassName={isNoRightErr ? '' : errMes ? 'err-border' : ''}
            name={nameRight}
            value={valueRight}
            title={titleRight}
            placeholder={placeholderRight}
            onChange={onChangeRight}
            disabled={disabledRight}
            data={dataRight}
            type={typeRight}
            absSuffix={absSuffixRight}
            errMes={rightErrMes}
            errMesClassName="div-small-incorrect-mes"
            maxLengthInput={props.maxLength}
            isInteger={props.isInteger}
            isError={!!errMes}

          />
          {
            isUnitRight && (
            <div className="pair-input-unit-sep">
              <span>/</span>
            </div>
            )
          }

          {
            isUnitRight && (
            <div className="pair-input-unit">
              <InputCT
                name={unitNameRight}
                value={unitValueRight}
                placeholder={unitPlaceholderRight}
                onChange={onChangeUnitRight}
                type={unitTypeRight}
                maxLengthInput={props.maxLength}
                isInteger={props.isInteger}
                isError={!!errMes}

              />
            </div>
            )
          }
        </div>

      </div>

      {
        errMes && (
        <div className={classnames('div-incorrect-mes', errMesClassName)}>
          <span>{errMes}</span>
        </div>
        )
      }
    </>
  );
};
PairInput.defaultProps = {
  className: '',

  titleLeft: '',
  titleRight: '',
  onChangeLeft: () => {},
  onChangeRight: () => { },
  pad: 8,
  placeholderLeft: '',
  placeholderRight: '',

  disabledLeft: false,
  disabledRight: false,
  valueLeft: undefined,
  valueRight: undefined,
  typeLeft: 'text',
  typeRight: 'text',

  isUnitLeft: false,
  isUnitRight: false,
  unitPlaceholderLeft: '',
  unitPlaceholderRight: '',
  unitValueLeft: '',
  unitValueRight: '',
  onChangeUnitLeft: () => {},
  onChangeUnitRight: () => { },
  unitTypeLeft: '',
  unitTypeRight: '',
  dataLeft: [],
  dataRight: [],
  nameLeft: '',
  nameRight: '',
  unitNameLeft: '',
  unitNameRight: '',

  errMes: '',
  errMesClassName: '',
  absSuffixLeft: '',
  absSuffixRight: '',

  rightErrMes: '',
  isNoLeftErr: false,
  isNoRightErr: false,
  maxLength: 50,
  isInteger: false,
};
PairInput.propTypes = {
  className: PropTypes.string,

  titleLeft: PropTypes.string,
  titleRight: PropTypes.string,
  onChangeLeft: PropTypes.func,
  onChangeRight: PropTypes.func,
  pad: PropTypes.number,
  placeholderLeft: PropTypes.string,
  placeholderRight: PropTypes.string,

  disabledLeft: PropTypes.bool,
  disabledRight: PropTypes.bool,
  valueLeft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueRight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  typeLeft: PropTypes.string,
  typeRight: PropTypes.string,

  isUnitLeft: PropTypes.bool,
  isUnitRight: PropTypes.bool,
  unitPlaceholderLeft: PropTypes.string,
  unitPlaceholderRight: PropTypes.string,
  unitValueLeft: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  unitValueRight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChangeUnitLeft: PropTypes.func,
  onChangeUnitRight: PropTypes.func,
  unitTypeLeft: PropTypes.string,
  unitTypeRight: PropTypes.string,
  dataLeft: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape(), PropTypes.string])),
  dataRight: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape(), PropTypes.string])),
  nameLeft: PropTypes.string,
  nameRight: PropTypes.string,
  unitNameLeft: PropTypes.string,
  unitNameRight: PropTypes.string,

  errMes: PropTypes.string,
  errMesClassName: PropTypes.string,
  absSuffixLeft: PropTypes.string,
  absSuffixRight: PropTypes.string,

  rightErrMes: PropTypes.string,
  isNoLeftErr: PropTypes.bool,
  isNoRightErr: PropTypes.bool,
  maxLength: PropTypes.number,
  isInteger: PropTypes.bool,
};

export default PairInput;

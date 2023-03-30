import { UndoOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

import CustomButton from '../Button/customButton';
import CheckboxCT from '../Input/checkboxCT';

const SignatureInput = (props) => {
  const signatureCanvasRef = useRef(null);

  const onEnd = () => {
    props.onEndSignature(signatureCanvasRef.current.toDataURL());
  };

  const onClickEraser = () => {
    signatureCanvasRef.current.clear();
    props.onEndSignature('');
  };

  useEffect(() => {
    signatureCanvasRef.current.fromDataURL(props.signature);
  }, [props.signature]);

  return (
    <div className={classnames('custom-signature-input', props.className)}>
      {
        !!props.title && (
          <div className="custom-signature-input__title">
            {props.title}
          </div>
        )
      }

      <div className="signature-canvas-container">
        <SignatureCanvas
          ref={signatureCanvasRef}
          canvasProps={{ className: classnames('signature-canvas', props.disabled ? '--disabled' : '') }}
          backgroundColor="rgb(255, 255, 255)"
          onEnd={onEnd}
        />

        <CustomButton className={classnames('undo-button')} type="text" onClick={onClickEraser} icon={<UndoOutlined />} />

        <div className={classnames('remember-signature', props.isCheckedRememberSignature ? '--checked' : '')}>
          <CheckboxCT
            name="isRemember"
            id="signature"
            disabled={props.disabled}
            data="Remember signature"
            isCheck={props.isCheckedRememberSignature}
            onChange={props.toggleRemember}
          />
        </div>
      </div>
    </div>
  );
};

SignatureInput.defaultProps = {
  className: undefined,
  title: '',
  signature: '',
  disabled: false,
};

SignatureInput.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  signature: PropTypes.string,
  disabled: PropTypes.bool,
  isCheckedRememberSignature: PropTypes.bool.isRequired,
  onEndSignature: PropTypes.func.isRequired,
  toggleRemember: PropTypes.func.isRequired,
};

export default SignatureInput;

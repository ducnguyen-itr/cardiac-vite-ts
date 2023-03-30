import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import CustomButton from '../../../../Components/Button/customButton'
import biofluxBg from '../../../../Image/Components/Form/biofluxBg.jpg'
import clinician from '../../../../Image/Components/Form/clinician.jpg'

const BiofluxSignIn = (props) => {
  const { className, onClickSignInBioflux, loading } = props

  return (
    <div className={classnames('bioflux-sign-in', className)}>
      <div className='bioflux-sign-in-bg-wrapper'>
        <div className='bioflux-sign-in-bg' style={{ backgroundImage: `url(${biofluxBg})` }} />
      </div>

      <div className='bioflux-sign-in-body'>
        <img src={clinician} alt='Clinician' className='bioflux-sign-in-clinician' />

        <div className='bioflux-sign-in-title'>Are you a Clinic user?</div>

        <CustomButton
          className='bioflux-sign-in-button'
          loading={loading}
          disabled={loading}
          block
          type='primary'
          ghost
          onClick={onClickSignInBioflux}
          label='Sign in with Biotricity Account'
        />
      </div>
    </div>
  )
}
BiofluxSignIn.defaultProps = {
  className: '',
  loading: false,
  onClickSignInBioflux: () => {}
}
BiofluxSignIn.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
  onClickSignInBioflux: PropTypes.func
}

export default BiofluxSignIn

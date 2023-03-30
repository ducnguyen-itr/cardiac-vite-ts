import { ROLES } from '../Constants'

const { CLINIC_TECHNICIAN, CLINIC_PHYSICIAN } = ROLES

const { localStorage } = global.window

const auth = {
  setLoginBioflux(bool) {
    localStorage.isLoginBioflux = bool
  },

  isLoginBioflux() {
    return localStorage?.isLoginBioflux === 'true'
  },

  login(data) {
    const { user, isSuccess, photo } = data
    const { _id, roles } = user

    localStorage.userId = _id
    localStorage.isSuccess = isSuccess
    localStorage.roles = roles
    localStorage.photo = photo
    localStorage.isLoginBioflux = false
  },

  setLoginData(data) {
    localStorage.timeSheetCode = JSON.stringify(data.timeSheetCode)
    localStorage.facilities = JSON.stringify(data.facilities)
    localStorage.login = JSON.stringify(data)
  },

  setTimeSheet(timeSheetCode) {
    localStorage.timeSheetCode = JSON.stringify(timeSheetCode)
  },

  setAutoMessageCondition(autoMsgCondition) {
    localStorage.autoMessageCondition = JSON.stringify(autoMsgCondition)
  },

  updateAvatar(photo) {
    localStorage.photo = photo
  },

  setSelectedFacility(facility) {
    localStorage.selectedFacility = facility ? JSON.stringify(facility) : ''
  },

  setFacilities(facilities) {
    localStorage.facilities = JSON.stringify(facilities)
  },

  getSelectedFacility() {
    return localStorage.selectedFacility ? JSON.parse(localStorage.selectedFacility) : {}
  },

  setAvatar(photo) {
    localStorage.photo = photo
  },
  getAvatar() {
    return localStorage.photo || ''
  },

  getLoginData() {
    return localStorage.login ? JSON.parse(localStorage.login) : undefined
  },

  getTimeSheetKey() {
    return localStorage.timeSheetCode ? JSON.parse(localStorage.timeSheetCode) : undefined
  },

  getAutoMessageCondition() {
    return localStorage.autoMessageCondition ? JSON.parse(localStorage.autoMessageCondition) : undefined
  },

  getFacilities() {
    return localStorage.facilities ? JSON.parse(localStorage.facilities) : undefined
  },

  isFacilities() {
    const facilities = localStorage.facilities ? JSON.parse(localStorage.facilities) : undefined
    return facilities?.length > 1
  },

  isSuccess() {
    return localStorage.isSuccess === 'true'
  },

  userId() {
    return localStorage.userId
  },

  role() {
    if (localStorage.roles?.includes(CLINIC_PHYSICIAN)) {
      return 'Physician'
    }
    if (localStorage.roles?.includes(CLINIC_TECHNICIAN)) {
      return 'Nurse'
    }
    return undefined
  },

  isMD() {
    return localStorage.roles?.includes(CLINIC_PHYSICIAN)
  },

  isNurse() {
    return localStorage.roles?.includes(CLINIC_TECHNICIAN)
  },

  getCountry() {
    return localStorage.countryData ? JSON.parse(localStorage.countryData) : undefined
  },

  setCountry(country) {
    localStorage.countryData = JSON.stringify(country)
  },

  logout() {
    localStorage.clear()
  }
}

export default auth

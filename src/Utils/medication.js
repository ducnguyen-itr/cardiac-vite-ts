import _ from 'lodash';
import moment from 'moment';

export const formatMedicationUnit = (dosageForm = '') => {
  const dosageForms = (dosageForm || '').split(',');
  switch (dosageForms[0].trim()) {
    case 'Cream':
    case 'Gel':
      return 'application';
    case 'Patch':
      return 'patch';
    case 'Spray':
      return 'spray';
    case 'Aerosol':
      return 'puff';
    case 'Suppository':
      return 'suppository';
    case 'Tablet':
    case 'Capsule':
      return 'pill';
    case 'Injection':
      return 'injection';
    default:
      return 'unit';
  }
};

export const formatMedication = medicationData => _.map(medicationData, data => ({
  label: data.label,
  value: data.label,
  unit: formatMedicationUnit(data.dosageForm),
}));


export const formatPrescription = (medications = {}, statusInput = 'Active') => {
  if (!medications || _.isEmpty(medications)) {
    return [];
  }
  const formatedMedi = [];
  const mediNames = _.uniq(medications, x => x.name);
  _.forEach(mediNames, (x) => {
    const {
      name, quantity, frequency, time, notes, unit, createdAt, prescribeAt, updatedAt, status, type,
    } = x;
    if (status === statusInput && type === 'Prescription') {
      formatedMedi.push({
        ...x,
        name,
        quantity,
        frequency,
        time,
        notes,
        unit: unit || 'pill',
        createdAt,
        prescribeAt,
        updatedAt,
      });
    }
  });

  const sortMedication = formatedMedi.sort((a, b) => moment(b.updatedAt).valueOf() - moment(a.updatedAt).valueOf());
  return sortMedication;
};

export const formatArchivedMedication = (archivedMedication = {}) => {
  if (!archivedMedication || _.isEmpty(archivedMedication)) {
    return [];
  }
  const formatedMedi = [];
  const mediNames = _.uniq(archivedMedication, x => x.name);
  _.forEach(mediNames, (x) => {
    const {
      name, quantity, frequency, time, notes, unit, createdAt, prescribeAt, updatedAt, status, type,
    } = x;
    if (status === 'Inactive' && type === 'Prescription') {
      formatedMedi.push({
        ...x,
        name,
        quantity,
        frequency,
        time,
        notes,
        unit: unit || 'pill',
        createdAt,
        prescribeAt,
        updatedAt,
      });
    }
  });

  return formatedMedi;
};

export const formatOtherMedication = (archivedMedication = {}, statusInput) => {
  if (!archivedMedication || _.isEmpty(archivedMedication)) {
    return [];
  }
  const formatedMedi = [];
  const mediNames = _.uniq(archivedMedication, x => x.name);
  _.forEach(mediNames, (x) => {
    const {
      name, quantity, frequency, time, notes, unit, createdAt, prescribeAt, updatedAt, status, type,
    } = x;
    const isActive = status?.toLowerCase() === 'active' && statusInput === 'active';
    const isInactive = statusInput === 'inactive';
    if ((isActive || isInactive) && type === 'Other') {
      formatedMedi.push({
        ...x,
        name,
        quantity,
        frequency,
        time,
        notes,
        unit: unit || 'pill',
        createdAt,
        prescribeAt,
        updatedAt,
      });
    }
  });

  return formatedMedi;
};

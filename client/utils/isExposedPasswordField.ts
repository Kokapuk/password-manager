import { FieldDTO } from './types';

const isExposedPasswordField = (field: FieldDTO) => field.title.toLowerCase().includes('password') && !field.isPassword;

export default isExposedPasswordField;

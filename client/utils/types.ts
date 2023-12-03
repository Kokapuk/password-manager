export interface FieldDTO {
  title: string;
  value: string;
  isPassword: boolean;
}

export interface Field extends FieldDTO {
  _id: string;
}

export interface PasswordDTO {
  name: string;
  credentials: {
    fields?: Field[];
    integration?: Password;
  };
  website: string;
}

export interface Password extends PasswordDTO {
  _id: string;
}

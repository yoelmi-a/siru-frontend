export interface Account {
  name:        string;
  lastName:    string;
  password:    string;
  email:       string;
  role:        string;
  phoneNumber: string;
}

export interface EditAccount extends Omit<Account, 'password'> {
  id: number;
}

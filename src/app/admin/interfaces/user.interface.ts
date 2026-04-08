export interface User {
  createdAt:   Date;
  isDeleted:   boolean;
  id:          string;
  name:        string;
  lastName:    string;
  phoneNumber: null;
  email:       string;
  roles: string[];
}

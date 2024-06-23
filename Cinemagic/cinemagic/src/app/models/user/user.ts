export class User {
  customerID: number;
  email: string;
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;

  constructor
  (
    customerID: number,
    email: string,
    phoneNumber: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    this.customerID = customerID;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
  }

}

export default class ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  otp: string;

  constructor(
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) {
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
    this.confirmNewPassword = confirmNewPassword;
  }
}

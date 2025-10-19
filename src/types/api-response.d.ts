interface BaseResponse {
  message: string;
  success: boolean;
}

namespace Auth {
  export interface Login extends BaseResponse {
    token: string | null;
  }

  export interface Register extends BaseResponse {
    userId: undefined | number;
  }

  export interface ResetPassword extends BaseResponse {}
}

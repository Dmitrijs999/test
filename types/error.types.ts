export interface IError {
  code: number;
  message: string;
}

export interface IFullError extends IError {
  data?: IError & {
    data?: IError & {
      reason: string;
    };
  };
}

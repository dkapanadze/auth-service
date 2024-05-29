export interface IUser extends BaseUser {
  password: string;
  createdAt: Date;
  isDeleted: boolean;
  deletedAt: Date;
  hashedRefreshTokens?: any[];
}

export interface BaseUser {
  id: number;
  email: string;
  name: string;
}

export interface SignUpUser {
  email: string;
  name: string;
  repeatPassword?: string;
  password: string;
}

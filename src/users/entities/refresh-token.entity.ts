import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { IToken } from '../interfaces';

@Entity({ name: 'refresh_token' })
export class TokenEntity implements IToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hashedToken: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.hashedRefreshTokens)
  user: UserEntity;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  createdAt: Date;
}

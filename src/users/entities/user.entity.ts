import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  DeleteDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { IUser } from '../interfaces';
import { Exclude } from 'class-transformer';
import { TokenEntity } from './refresh-token.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
class UserEntity implements IUser {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  @Index({ unique: true })
  @ApiProperty()
  public email: string;

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty()
  public name: string;

  @Column({ type: 'varchar' })
  @Exclude()
  public password: string;

  @Column({ default: false, type: 'boolean' })
  @Exclude()
  public isDeleted: boolean;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  @Exclude()
  public deletedAt: Date;

  @OneToMany(() => TokenEntity, (token) => token.user)
  hashedRefreshTokens: TokenEntity[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  @ApiProperty()
  public createdAt: Date;
}

export { UserEntity };

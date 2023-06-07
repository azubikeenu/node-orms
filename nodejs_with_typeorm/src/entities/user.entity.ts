import * as bcrypt from 'bcryptjs';
import { IsNotEmpty, Length } from 'class-validator';
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

export const privateFields = ['password', 'initialPassword'];

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  @Length(4, 100)
  public username!: string;

  @Column()
  @Length(4, 100)
  public email!: string;

  @Column()
  @Length(4, 100)
  public password!: string;

  @Column()
  @IsNotEmpty()
  public role!: string;

  @Column()
  @CreateDateColumn()
  public createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt!: Date;

  private initialPassword: string = '';

  @AfterLoad()
  getInitialPassword() {
    this.initialPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashpassword(): Promise<void> {
    try {
      if (this.password !== this.initialPassword) {
        this.password = await bcrypt.hash(this.password, 12);
      }
    } catch (ex) {
      throw new Error(`Couldn't perform hashing operation`);
    }
  }

  public isPasswordValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}

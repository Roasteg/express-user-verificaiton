import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import User from "../../auth/model/user";

@Entity({ name: "otps" })
export default class OTP {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  forUser: User;

  @Column({ type: "varchar" })
  otp: string;

  @Column({ type: "datetime", default: new Date(Date.now() + 5 * 60 * 1000) })
  expiresAt?: Date;
}

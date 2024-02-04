import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export default class User {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar" })
  email: string;

  @Column({ type: "varchar" })
  hash: string;
  @Column({
    nullable: true,
    type: "varchar",
  })
  latestAccessToken: string;
  @Column({
    nullable: true,
    type: "varchar",
  })
  latestLogin: Date;

  @Column({ type: "boolean" })
  isGoogleLogin: boolean;

  @Column({ type: "boolean", default: false })
  isActive?: boolean;

  @Column({ type: "boolean", default: false })
  isBanned?: boolean;
}

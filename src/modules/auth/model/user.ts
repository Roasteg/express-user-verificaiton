import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export default class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    hash: string;
    @Column({
        nullable: true,
    })
    latestAccessToken: string;
    @Column({
        nullable: true,
    })
    latestLogin: Date;

    @Column()
    isGoogleLogin: boolean;
}

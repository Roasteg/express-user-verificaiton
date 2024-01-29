import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Client from "./client";

@Entity({name: "codes"})
export default class Code {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    authorizationCode: string

    @Column()
    expiresAt: Date

    @Column()
    redirectUri: string

    @Column()
    scope: string

    @OneToOne(() => Client, client => client.id)
    clientId: Client

    @Column()
    userId: string
}